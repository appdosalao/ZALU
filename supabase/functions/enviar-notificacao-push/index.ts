import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: Record<string, any>;
  tag?: string;
  requireInteraction?: boolean;
}

interface PushRequest {
  userId?: string;
  tipo: 'novo_agendamento' | 'cancelamento_agendamento' | 'lembrete_agendamento' | 
        'alerta_financeiro' | 'retorno_cronograma' | 'confirmacao_cliente' | 
        'lembrete_cliente' | 'ofertas_fidelidade';
  notification: NotificationPayload;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Create Supabase client with service role for admin operations
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Validate token and get authenticated user
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    const { userId, tipo, notification }: PushRequest = await req.json();

    // Ensure user can only send notifications to themselves, unless it's a service role
    const isServiceRole = user.role === 'service_role';
    
    if (userId && userId !== user.id && !isServiceRole) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: cannot send notifications to other users' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      );
    }

    // Use authenticated user ID if not provided
    const targetUserId = userId || user.id;

    // Buscar preferências do usuário
    const { data: preferencias } = await supabase
      .from('notificacoes_preferencias')
      .select('*')
      .eq('user_id', targetUserId)
      .single();

    // Verificar se o tipo de notificação está habilitado
    const tipoMap: Record<string, keyof typeof preferencias> = {
      'novo_agendamento': 'novo_agendamento',
      'cancelamento_agendamento': 'cancelamento_agendamento',
      'lembrete_agendamento': 'lembrete_agendamento',
      'alerta_financeiro': 'alerta_financeiro',
      'retorno_cronograma': 'retorno_cronograma',
      'confirmacao_cliente': 'confirmacao_cliente',
      'lembrete_cliente': 'lembrete_cliente',
      'ofertas_fidelidade': 'ofertas_fidelidade'
    };

    if (preferencias && !preferencias[tipoMap[tipo]]) {
      console.log(`Notificação ${tipo} desabilitada para usuário ${targetUserId}`);
      return new Response(
        JSON.stringify({ message: 'Notification type disabled by user' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Buscar subscriptions ativas do usuário
    const { data: subscriptions, error: subError } = await supabase
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', targetUserId)
      .eq('ativo', true);

    if (subError) throw subError;

    if (!subscriptions || subscriptions.length === 0) {
      console.log(`Nenhuma subscription ativa encontrada para usuário ${targetUserId}`);
      return new Response(
        JSON.stringify({ message: 'No active subscriptions found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Dynamically import web-push only when needed
    const webpush = await import('https://esm.sh/web-push@3.6.7');
    
    // Configure VAPID
    const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY');
    const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY');
    if (vapidPublicKey && vapidPrivateKey) {
      webpush.setVapidDetails(
        'mailto:contato@salaoapp.com',
        vapidPublicKey,
        vapidPrivateKey
      );
    }

    // Preparar payload da notificação
    const pushPayload = {
      title: notification.title,
      body: notification.body,
      icon: notification.icon || '/icons/icon-192x192.png',
      badge: notification.badge || '/icons/icon-96x96.png',
      data: {
        ...notification.data,
        timestamp: Date.now(),
        tipo
      },
      tag: notification.tag || tipo,
      requireInteraction: notification.requireInteraction || false,
      vibrate: preferencias?.vibracao ? [200, 100, 200] : undefined
    };

    // Enviar notificações push para todas as subscriptions
    const results = await Promise.allSettled(
      subscriptions.map(async (sub) => {
        try {
          const subscription = {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth
            }
          };

          await webpush.sendNotification(
            subscription,
            JSON.stringify(pushPayload)
          );

          return { success: true, endpoint: sub.endpoint };
        } catch (error: any) {
          console.error(`Erro ao enviar para ${sub.endpoint}:`, error);
          
          // Se a subscription expirou, marcar como inativa
          if (error.statusCode === 410) {
            await supabase
              .from('push_subscriptions')
              .update({ ativo: false })
              .eq('id', sub.id);
          }
          
          return { success: false, endpoint: sub.endpoint, error: error.message };
        }
      })
    );

    const successCount = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    const failureCount = results.length - successCount;

    console.log(`Notificações enviadas: ${successCount} sucesso, ${failureCount} falhas`);

    return new Response(
      JSON.stringify({
        message: 'Push notifications sent',
        sent: successCount,
        failed: failureCount,
        results
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error: any) {
    console.error('Erro ao processar notificação push:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
