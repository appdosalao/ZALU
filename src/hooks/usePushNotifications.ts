import { useState, useCallback, useEffect } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export const usePushNotifications = () => {
  const { usuario } = useSupabaseAuth();
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscriptionData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // VAPID Public Key
  const VAPID_PUBLIC_KEY = 'BEl62iUYgUivxIkv69yViEuiBIa40HI0DLLfgA7X3EgMGvpADQJ1wpQOVWvwG4yA-7XVvPDn5TPBY-A3VoGcEng';

  // Convert ArrayBuffer to Base64
  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  // Check support and existing subscription
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window) {
      setIsSupported(true);
      checkSubscription();
    }
  }, [usuario]);

  // Check existing subscription
  const checkSubscription = useCallback(async () => {
    if (!usuario) return;
    try {
      const registration = await navigator.serviceWorker.ready;
      const pushSub = await registration.pushManager.getSubscription();
      
      if (pushSub) {
        // Check if subscription exists in Supabase
        const subscriptionData = {
          endpoint: pushSub.endpoint,
          keys: {
            p256dh: arrayBufferToBase64(pushSub.getKey('p256dh')!),
            auth: arrayBufferToBase64(pushSub.getKey('auth')!)
          }
        };

        const { data, error } = await supabase
          .from('push_subscriptions')
          .select('*')
          .eq('user_id', usuario.id)
          .eq('endpoint', pushSub.endpoint)
          .eq('ativo', true)
          .single();

        if (!error && data) {
          setSubscription(subscriptionData);
          setIsSubscribed(true);
        } else {
          // Subscription not in Supabase, unsubscribe
          await pushSub.unsubscribe();
          setIsSubscribed(false);
        }
      } else {
        setIsSubscribed(false);
      }
    } catch (error) {
      console.error('Erro ao verificar subscription:', error);
    }
  }, [usuario]);

  // Subscribe to push notifications
  const subscribe = useCallback(async () => {
    if (!isSupported || !usuario) return false;

    setIsLoading(true);
    try {
      // Request permission
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        toast.error("Permissão negada - As notificações push foram bloqueadas. Ative nas configurações do navegador.");
        return false;
      }

      // Get service worker registration
      const registration = await navigator.serviceWorker.ready;

      // Subscribe to push notifications
      const pushSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: VAPID_PUBLIC_KEY
      });

      const subscriptionData = {
        endpoint: pushSubscription.endpoint,
        keys: {
          p256dh: arrayBufferToBase64(pushSubscription.getKey('p256dh')!),
          auth: arrayBufferToBase64(pushSubscription.getKey('auth')!)
        }
      };

      // Save subscription to Supabase
      const { error } = await supabase
        .from('push_subscriptions')
        .upsert({
          user_id: usuario.id,
          endpoint: subscriptionData.endpoint,
          p256dh: subscriptionData.keys.p256dh,
          auth: subscriptionData.keys.auth,
          ativo: true
        });

      if (error) throw error;

      setSubscription(subscriptionData);
      setIsSubscribed(true);

      toast.success("Notificações ativadas! Você receberá notificações push sobre agendamentos e lembretes.");

      return true;
    } catch (error) {
      console.error('Erro ao subscrever push notifications:', error);
      toast.error("Erro ao ativar notificações - Não foi possível ativar as notificações push. Tente novamente.");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported, usuario]);

  // Unsubscribe from push notifications
  const unsubscribe = useCallback(async () => {
    if (!isSubscribed || !usuario) return;

    setIsLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const pushSub = await registration.pushManager.getSubscription();
      
      if (pushSub) {
        await pushSub.unsubscribe();
        
        // Mark subscription as inactive in Supabase
        await supabase
          .from('push_subscriptions')
          .update({ ativo: false })
          .eq('user_id', usuario.id)
          .eq('endpoint', pushSub.endpoint);
      }

      setSubscription(null);
      setIsSubscribed(false);

      toast.warning("Notificações desativadas - Você não receberá mais notificações push.");
    } catch (error) {
      console.error('Erro ao cancelar subscription:', error);
      toast.error("Erro ao desativar notificações - Não foi possível desativar as notificações.");
    } finally {
      setIsLoading(false);
    }
  }, [isSubscribed, usuario]);

  // Send test notification
  const sendTestNotification = useCallback(async () => {
    if (!isSubscribed) return;

    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        registration.showNotification('Teste de Notificação', {
          body: 'Esta é uma notificação de teste do seu salão!',
          icon: '/icons/icon-192x192.png',
          badge: '/icons/icon-96x96.png',
          tag: 'test-notification',
          data: {
            url: '/',
            timestamp: Date.now()
          },
        });

        toast.success("Notificação de teste enviada! Verifique se a notificação apareceu.");
      }
    } catch (error) {
      console.error('Erro ao enviar notificação de teste:', error);
      toast.error("Erro no teste - Não foi possível enviar a notificação de teste.");
    }
  }, [isSubscribed]);

  return {
    isSupported,
    isSubscribed,
    subscription,
    isLoading,
    subscribe,
    unsubscribe,
    sendTestNotification,
    checkSubscription
  };
};
