import { Router, Response } from 'express';
import { authenticate, type AuthenticatedRequest } from '@/middlewares/authenticate';
import { requireAdmin } from '@/middlewares/requireAdmin';
import { supabaseAdmin } from '@/lib/supabaseServer';

const router = Router();

type UsuarioProfileRow = {
  id: string;
  nome_completo: string | null;
  nome_personalizado_app: string | null;
  telefone: string | null;
  plan_type: string | null;
  subscription_status: string | null;
  trial_start_date: string | null;
  paid_access: boolean | null;
  paid_at: string | null;
  subscription_updated_at: string | null;
  cakto_last_status: string | null;
};

const getClientIp = (req: AuthenticatedRequest) => {
  const xff = (req.headers['x-forwarded-for'] as string | undefined) || '';
  const ip = xff.split(',')[0]?.trim();
  return ip || req.ip || '';
};

const audit = async (req: AuthenticatedRequest, action: string, metadata?: unknown) => {
  try {
    await supabaseAdmin.from('admin_audit_logs').insert({
      actor_user_id: req.user?.id ?? null,
      actor_email: req.user?.email ?? null,
      action,
      metadata: metadata ?? null,
      ip: getClientIp(req),
      user_agent: req.headers['user-agent'] ?? null,
    });
  } catch (err) {
    console.warn('Falha ao registrar auditoria admin:', err);
  }
};

router.use(authenticate, requireAdmin);

router.get('/overview', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const now = Date.now();
    const cutoff30 = new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString();
    const cutoffTrial = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();
    const planPrice = Number(process.env.ADMIN_PLAN_PRICE || '7.9');

    const [{ data: usersPage, error: listError }] = await Promise.all([
      supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
    ]);

    if (listError) {
      return res.status(500).json({ error: 'internal_error' });
    }

    const allUsers: typeof usersPage.users = [...usersPage.users];
    let page = 1;

    while (usersPage.users.length === 1000) {
      page += 1;
      const { data: nextPage, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 1000 });
      if (error) break;
      allUsers.push(...nextPage.users);
      if (nextPage.users.length < 1000) break;
    }

    const totalAccounts = allUsers.length;
    const activeAccounts30d = allUsers.filter((u) => (u.last_sign_in_at || u.created_at) >= cutoff30).length;
    const inactiveAccounts30d = totalAccounts - activeAccounts30d;

    const [{ count: paidUsersCount }, { count: trialStartedCount }, { count: churnAfterTrialCount }] = await Promise.all([
      supabaseAdmin.from('usuarios').select('id', { count: 'exact', head: true }).eq('paid_access', true),
      supabaseAdmin.from('usuarios').select('id', { count: 'exact', head: true }).not('trial_start_date', 'is', null),
      supabaseAdmin
        .from('usuarios')
        .select('id', { count: 'exact', head: true })
        .lte('trial_start_date', cutoffTrial)
        .or('paid_access.is.false,paid_access.is.null')
        .in('subscription_status', ['trial', 'expired', 'inactive']),
    ]);

    const payingUsers = paidUsersCount || 0;
    const trialStarted = trialStartedCount || 0;
    const churnAfterTrial = churnAfterTrialCount || 0;

    const estimatedMrr = Number.isFinite(planPrice) ? payingUsers * planPrice : null;
    let estimatedCumulativeRevenue: number | null = null;

    if (Number.isFinite(planPrice) && payingUsers > 0) {
      const limit = 1000;
      let from = 0;
      let keep = true;
      let sum = 0;

      while (keep && from < 10_000) {
        const to = from + limit - 1;
        const { data: paidRows, error } = await supabaseAdmin
          .from('usuarios')
          .select('paid_at')
          .not('paid_at', 'is', null)
          .range(from, to);
        if (error) break;
        const rows = (paidRows || []) as Array<{ paid_at: string | null }>;
        for (const row of rows) {
          if (!row.paid_at) continue;
          const paidAt = new Date(row.paid_at).getTime();
          if (!Number.isFinite(paidAt)) continue;
          const months = Math.max(1, Math.floor((now - paidAt) / (30 * 24 * 60 * 60 * 1000)) + 1);
          sum += months * planPrice;
        }
        if (rows.length < limit) keep = false;
        from += limit;
      }

      estimatedCumulativeRevenue = Math.round(sum * 100) / 100;
    }

    void audit(req, 'admin_overview');

    return res.json({
      totalAccounts,
      activeAccounts30d,
      inactiveAccounts30d,
      payingUsers,
      trialStarted,
      churnAfterTrial,
      planPrice: Number.isFinite(planPrice) ? planPrice : null,
      estimatedMrr,
      estimatedCumulativeRevenue,
      cutoff30d: cutoff30,
    });
  } catch (err) {
    return res.status(500).json({ error: 'internal_error' });
  }
});

router.get('/users', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const page = Number(req.query.page || '1');
    const perPage = Math.min(200, Math.max(1, Number(req.query.perPage || '50')));
    const cutoff30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage });
    if (error) return res.status(500).json({ error: 'internal_error' });

    const ids = data.users.map((u) => u.id);
    const { data: profiles } = ids.length
      ? await supabaseAdmin
          .from('usuarios')
          .select('id,nome_completo,nome_personalizado_app,telefone,plan_type,subscription_status,trial_start_date,paid_access,paid_at,subscription_updated_at,cakto_last_status')
          .in('id', ids)
      : { data: [] as UsuarioProfileRow[] };

    const profileById = new Map((profiles || []).map((p: UsuarioProfileRow) => [String(p.id), p]));

    const users = data.users.map((u) => {
      const profile = profileById.get(u.id) || null;
      const last = u.last_sign_in_at || u.created_at;
      const inactive30d = last < cutoff30;
      return {
        id: u.id,
        email: u.email,
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at,
        inactive30d,
        profile,
      };
    });

    void audit(req, 'admin_users_list', { page, perPage });

    return res.json({
      page,
      perPage,
      users,
    });
  } catch {
    return res.status(500).json({ error: 'internal_error' });
  }
});

router.get('/users/:id/usage', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = String(req.params.id || '');
    if (!userId) return res.status(400).json({ error: 'bad_request' });

    const tables = ['agendamentos', 'clientes', 'servicos', 'lancamentos', 'vendas_produtos'] as const;
    const results = await Promise.all(
      tables.map(async (table) => {
        const { count } = await supabaseAdmin.from(table).select('id', { count: 'exact', head: true }).eq('user_id', userId);
        return [table, count || 0] as const;
      })
    );

    void audit(req, 'admin_user_usage', { userId });

    return res.json(Object.fromEntries(results));
  } catch {
    return res.status(500).json({ error: 'internal_error' });
  }
});

router.get('/audit-logs', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const page = Math.max(1, Number(req.query.page || '1'));
    const perPage = Math.min(200, Math.max(1, Number(req.query.perPage || '50')));
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    const { data, error } = await supabaseAdmin
      .from('admin_audit_logs')
      .select('id,created_at,actor_user_id,actor_email,action,metadata,ip,user_agent')
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) return res.status(500).json({ error: 'internal_error' });

    void audit(req, 'admin_audit_logs_list', { page, perPage });

    return res.json({ page, perPage, logs: data || [] });
  } catch {
    return res.status(500).json({ error: 'internal_error' });
  }
});

router.post('/users/:id/send-password-reset', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = String(req.params.id || '');
    const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);
    if (error || !data?.user?.email) return res.status(404).json({ error: 'not_found' });

    const redirectTo = `${process.env.FRONTEND_URL || 'http://localhost:8080'}/auth/callback?next=${encodeURIComponent('/redefinir-senha')}`;
    const { error: resetError } = await supabaseAdmin.auth.resetPasswordForEmail(data.user.email, { redirectTo });
    if (resetError) return res.status(500).json({ error: 'internal_error' });

    void audit(req, 'admin_send_password_reset', { userId });

    return res.json({ sent: true });
  } catch {
    return res.status(500).json({ error: 'internal_error' });
  }
});

export default router;

