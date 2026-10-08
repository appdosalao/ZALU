import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { toast } from 'sonner';

interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export const usePushSubscription = () => {
  const { usuario } = useSupabaseAuth();
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isLoading, setIsLoading] = useState(false);

  // Chave pública VAPID
  const VAPID_PUBLIC_KEY = 'BEl62iUYgUivxIkv69yViEuiBIa40HI0DLLfgA7X3EgMGvpADQJ1wpQOVWvwG4yA-7XVvPDn5TPBY-A3VoGcEng';

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
      checkSubscription();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario]);

  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const checkSubscription = useCallback(async () => {
    if (!usuario) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        // Verificar se a subscription existe no banco
        const { data, error } = await supabase
          .from('push_subscriptions')
          .select('*')
          .eq('user_id', usuario.id)
          .eq('endpoint', subscription.endpoint)
          .eq('ativo', true)
          .single();

        if (!error && data) {
          setIsSubscribed(true);
        } else {
          setIsSubscribed(false);
        }
      } else {
        setIsSubscribed(false);
      }
    } catch (error) {
      console.error('Erro ao verificar subscription:', error);
    }
  }, [usuario]);

  const requestPermission = async (): Promise<boolean> => {
    if (!isSupported) {
      toast.error('Push notifications não são suportadas neste navegador');
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        toast.success('Permissão concedida para notificações');
        return true;
      } else if (result === 'denied') {
        toast.error('Permissão negada. Ative nas configurações do navegador.');
        return false;
      }
      return false;
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error);
      toast.error('Erro ao solicitar permissão para notificações');
      return false;
    }
  };

  const subscribe = useCallback(async () => {
    if (!isSupported || !usuario) {
      toast.error('Sistema não está pronto para notificações push');
      return false;
    }

    setIsLoading(true);
    try {
      // Solicitar permissão se necessário
      if (permission !== 'granted') {
        const granted = await requestPermission();
        if (!granted) {
          setIsLoading(false);
          return false;
        }
      }

      // Obter service worker registration
      const registration = await navigator.serviceWorker.ready;

      // Subscrever para push notifications
      const pushSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: VAPID_PUBLIC_KEY
      });

      const subscriptionData: PushSubscriptionData = {
        endpoint: pushSubscription.endpoint,
        keys: {
          p256dh: arrayBufferToBase64(pushSubscription.getKey('p256dh')!),
          auth: arrayBufferToBase64(pushSubscription.getKey('auth')!)
        }
      };

      // Salvar subscription no Supabase
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

      setIsSubscribed(true);
      toast.success('Notificações push ativadas com sucesso!');
      return true;

    } catch (error) {
      console.error('Erro ao subscrever:', error);
      toast.error(`Erro ao ativar notificações: ${error.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSupported, usuario, permission]);

  const unsubscribe = useCallback(async () => {
    if (!usuario) return false;

    setIsLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        await subscription.unsubscribe();
        
        // Desativar no banco
        await supabase
          .from('push_subscriptions')
          .update({ ativo: false })
          .eq('user_id', usuario.id)
          .eq('endpoint', subscription.endpoint);
      }

      setIsSubscribed(false);
      toast.info('Notificações push desativadas');
      return true;

    } catch (error) {
      console.error('Erro ao cancelar subscription:', error);
      toast.error(`Erro ao desativar notificações: ${error.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [usuario]);

  const sendTestNotification = useCallback(async () => {
    if (!isSubscribed) {
      toast.error('Você precisa ativar as notificações primeiro');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification('Notificação de Teste', {
        body: 'Se você está vendo isso, as notificações estão funcionando! 🎉',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-96x96.png',
        tag: 'test-notification',
        data: {
          url: '/',
          timestamp: Date.now()
        }
      });

      toast.success('Notificação de teste enviada!');
    } catch (error) {
      console.error('Erro ao enviar notificação de teste:', error);
      toast.error('Erro ao enviar notificação de teste');
    }
  }, [isSubscribed]);

  return {
    isSupported,
    isSubscribed,
    permission,
    isLoading,
    subscribe,
    unsubscribe,
    sendTestNotification,
    checkSubscription
  };
};