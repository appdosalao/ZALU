import { randomBytes } from 'node:crypto';
import { Router, type Response } from 'express';
import { z } from 'zod';
import { isAdminEmail } from '../config/adminAccess.js';
import { authenticate, type AuthenticatedRequest } from '../middlewares/authenticate.js';
import { supabaseAffiliateAdmin } from '../lib/supabaseServer.js';

const router = Router();
const PAGE_SIZE = 1000;
const REFERRAL_CODE = /^[A-Z0-9]{6,8}$/;

const settingsSchema = z.object({
  defaultCommissionRate: z.number().min(0).max(100),
  commissionMode: z.enum(['recurring', 'first_payment']),
});

const affiliateSchema = z.object({
  active: z.boolean(),
  referralCode: z.string().trim().toUpperCase().regex(REFERRAL_CODE).optional(),
  commissionRate: z.number().min(0).max(100).optional(),
});

const isAdmin = (req: AuthenticatedRequest, res: Response) => {
  if (isAdminEmail(req.user?.email)) return true;
  res.status(403).json({
    error: 'forbidden',
    message: 'Esta ação é exclusiva para a conta administrativa autorizada.',
  });
  return false;
};

const fetchAll = async <T,>(
  fetchPage: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: { message: string } | null }>
) => {
  const rows: T[] = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await fetchPage(from, from + PAGE_SIZE - 1);
    if (error) throw new Error(error.message);
    rows.push(...(data ?? []));
    if (!data || data.length < PAGE_SIZE) return rows;
  }
};

router.get('/referrals/validate', async (req, res) => {
  const parsed = z.string().trim().toUpperCase().regex(REFERRAL_CODE).safeParse(req.query.code);
  if (!parsed.success) return res.json({ valid: false });

  try {
    const { data, error } = await supabaseAffiliateAdmin
      .from('affiliate_profiles')
      .select('user_id')
      .eq('referral_code', parsed.data)
      .eq('active', true)
      .maybeSingle();

    if (error) throw error;
    return res.json({ valid: !!data });
  } catch (error) {
    console.error('[Referral] Falha ao validar código:', error);
    return res.status(500).json({
      error: 'referral_validation_error',
      message: 'Não foi possível validar o código agora.',
    });
  }
});

router.get('/referrals/me', authenticate, async (req: AuthenticatedRequest, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'unauthorized', message: 'Usuário não identificado.' });

  try {
    const { data: profile, error: profileError } = await supabaseAffiliateAdmin
      .from('affiliate_profiles')
      .select('user_id,referral_code,commission_rate,active')
      .eq('user_id', userId)
      .maybeSingle();

    if (profileError) throw profileError;
    if (!profile?.active) {
      return res.status(403).json({ error: 'affiliate_inactive', message: 'A área de divulgação não está ativa para esta conta.' });
    }

    const [referredUsers, commissions] = await Promise.all([
      fetchAll((from, to) =>
        supabaseAffiliateAdmin
          .from('usuarios')
          .select('id,email,nome_completo,nome_personalizado_app,created_at,subscription_status,paid_access,paid_at')
          .eq('indicado_por', userId)
          .order('created_at', { ascending: false })
          .range(from, to)
      ),
      fetchAll((from, to) =>
        supabaseAffiliateAdmin
          .from('referral_commissions')
          .select('id,referred_user_id,payment_reference,payment_amount,commission_rate,commission_amount,status,payment_received_at,paid_at,cancelled_at')
          .eq('affiliate_id', userId)
          .order('payment_received_at', { ascending: false })
          .range(from, to)
      ),
    ]);

    return res.json({
      profile,
      summary: {
        referrals: referredUsers.length,
        pendingCommissions: commissions.filter((item) => item.status === 'pending').reduce((sum, item) => sum + item.commission_amount, 0),
        paidCommissions: commissions.filter((item) => item.status === 'paid').reduce((sum, item) => sum + item.commission_amount, 0),
      },
      referrals: referredUsers,
      commissions,
    });
  } catch (error) {
    console.error('[Referral] Falha ao carregar o painel do divulgador:', error);
    return res.status(500).json({
      error: 'affiliate_overview_error',
      message: 'Não foi possível carregar os dados de divulgação.',
    });
  }
});

router.get('/admin/affiliates', authenticate, async (req: AuthenticatedRequest, res) => {
  if (!isAdmin(req, res)) return;

  try {
    const [profiles, commissions, settingsResult] = await Promise.all([
      fetchAll((from, to) =>
        supabaseAffiliateAdmin
          .from('affiliate_profiles')
          .select('user_id,referral_code,commission_rate,active,created_at')
          .order('created_at', { ascending: false })
          .range(from, to)
      ),
      fetchAll((from, to) =>
        supabaseAffiliateAdmin
          .from('referral_commissions')
          .select('affiliate_id,commission_amount,status')
          .range(from, to)
      ),
      supabaseAffiliateAdmin
        .from('affiliate_settings')
        .select('default_commission_rate,commission_mode')
        .eq('id', true)
        .single(),
    ]);

    if (settingsResult.error) throw settingsResult.error;
    const affiliateIds = profiles.map((profile) => profile.user_id);
    const users = affiliateIds.length
      ? await fetchAll((from, to) =>
          supabaseAffiliateAdmin
            .from('usuarios')
            .select('id,email,nome_completo,nome_personalizado_app')
            .in('id', affiliateIds)
            .range(from, to)
        )
      : [];
    const userById = new Map(users.map((user) => [user.id, user]));

    const referralCounts = new Map<string, number>();
    if (affiliateIds.length) {
      const referred = await fetchAll((from, to) =>
        supabaseAffiliateAdmin
          .from('usuarios')
          .select('indicado_por')
          .in('indicado_por', affiliateIds)
          .range(from, to)
      );
      for (const user of referred) {
        if (user.indicado_por) {
          referralCounts.set(user.indicado_por, (referralCounts.get(user.indicado_por) ?? 0) + 1);
        }
      }
    }

    const rows = profiles.map((profile) => {
      const ownCommissions = commissions.filter((item) => item.affiliate_id === profile.user_id);
      const user = userById.get(profile.user_id);
      return {
        userId: profile.user_id,
        name: user?.nome_personalizado_app || user?.nome_completo || '',
        email: user?.email || '',
        referralCode: profile.referral_code,
        commissionRate: profile.commission_rate,
        active: profile.active,
        createdAt: profile.created_at,
        totalReferrals: referralCounts.get(profile.user_id) ?? 0,
        totalCommission: ownCommissions
          .filter((item) => item.status !== 'cancelled')
          .reduce((sum, item) => sum + item.commission_amount, 0),
        pendingCommission: ownCommissions.filter((item) => item.status === 'pending').reduce((sum, item) => sum + item.commission_amount, 0),
        paidCommission: ownCommissions.filter((item) => item.status === 'paid').reduce((sum, item) => sum + item.commission_amount, 0),
      };
    });

    return res.json({
      settings: {
        defaultCommissionRate: settingsResult.data.default_commission_rate,
        commissionMode: settingsResult.data.commission_mode,
      },
      affiliates: rows,
    });
  } catch (error) {
    console.error('[Admin] Falha ao carregar divulgadores:', error);
    return res.status(500).json({
      error: 'admin_affiliates_error',
      message: 'Não foi possível carregar os divulgadores.',
    });
  }
});

router.get('/admin/affiliates/:affiliateId', authenticate, async (req: AuthenticatedRequest, res) => {
  if (!isAdmin(req, res)) return;
  const affiliateId = z.string().uuid().safeParse(req.params.affiliateId);
  if (!affiliateId.success) return res.status(400).json({ error: 'invalid_affiliate_id', message: 'Divulgador inválido.' });

  try {
    const [{ data: profile, error: profileError }, referredUsers, commissions] = await Promise.all([
      supabaseAffiliateAdmin
        .from('affiliate_profiles')
        .select('user_id,referral_code,commission_rate,active,created_at')
        .eq('user_id', affiliateId.data)
        .maybeSingle(),
      fetchAll((from, to) =>
        supabaseAffiliateAdmin
          .from('usuarios')
          .select('id,email,nome_completo,nome_personalizado_app,created_at,subscription_status,paid_access,paid_at')
          .eq('indicado_por', affiliateId.data)
          .order('created_at', { ascending: false })
          .range(from, to)
      ),
      fetchAll((from, to) =>
        supabaseAffiliateAdmin
          .from('referral_commissions')
          .select('id,referred_user_id,payment_reference,payment_amount,commission_rate,commission_amount,status,payment_received_at,paid_at,cancelled_at')
          .eq('affiliate_id', affiliateId.data)
          .order('payment_received_at', { ascending: false })
          .range(from, to)
      ),
    ]);

    if (profileError) throw profileError;
    if (!profile) return res.status(404).json({ error: 'affiliate_not_found', message: 'Divulgador não encontrado.' });

    const commissionsByReferred = new Map<string, typeof commissions>();
    for (const commission of commissions) {
      const current = commissionsByReferred.get(commission.referred_user_id) ?? [];
      current.push(commission);
      commissionsByReferred.set(commission.referred_user_id, current);
    }

    return res.json({
      profile,
      referrals: referredUsers.map((user) => ({
        id: user.id,
        name: user.nome_personalizado_app || user.nome_completo,
        email: user.email,
        createdAt: user.created_at,
        subscriptionStatus: user.subscription_status,
        paidAccess: user.paid_access,
        paidAt: user.paid_at,
        commissions: commissionsByReferred.get(user.id) ?? [],
      })),
    });
  } catch (error) {
    console.error('[Admin] Falha ao carregar detalhes do divulgador:', error);
    return res.status(500).json({
      error: 'admin_affiliate_detail_error',
      message: 'Não foi possível carregar os detalhes do divulgador.',
    });
  }
});

router.patch('/admin/affiliates/settings', authenticate, async (req: AuthenticatedRequest, res) => {
  if (!isAdmin(req, res)) return;
  const parsed = settingsSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'invalid_settings', message: 'Revise a comissão padrão e o modelo de pagamento.' });

  const { defaultCommissionRate, commissionMode } = parsed.data;
  try {
    const { data, error } = await supabaseAffiliateAdmin
      .from('affiliate_settings')
      .update({
        default_commission_rate: defaultCommissionRate,
        commission_mode: commissionMode,
        updated_at: new Date().toISOString(),
      })
      .eq('id', true)
      .select('default_commission_rate,commission_mode')
      .single();

    if (error) throw error;
    return res.json({
      settings: {
        defaultCommissionRate: data.default_commission_rate,
        commissionMode: data.commission_mode,
      },
    });
  } catch (error) {
    console.error('[Admin] Falha ao atualizar configuração de comissão:', error);
    return res.status(500).json({
      error: 'admin_affiliate_settings_error',
      message: 'Não foi possível salvar as configurações de comissão.',
    });
  }
});

router.post('/admin/affiliates/:affiliateId', authenticate, async (req: AuthenticatedRequest, res) => {
  if (!isAdmin(req, res)) return;
  const userId = z.string().uuid().safeParse(req.params.affiliateId);
  const parsed = affiliateSchema.safeParse(req.body);
  if (!userId.success || !parsed.success) {
    return res.status(400).json({ error: 'invalid_affiliate', message: 'Revise os dados do divulgador.' });
  }

  const { active, commissionRate } = parsed.data;
  let referralCode = parsed.data.referralCode;

  try {
    if (active && !referralCode) {
      const { data: existingProfile, error } = await supabaseAffiliateAdmin
        .from('affiliate_profiles')
        .select('referral_code')
        .eq('user_id', userId.data)
        .maybeSingle();

      if (error) throw error;
      referralCode = existingProfile?.referral_code;
    }

    for (let attempt = 0; attempt < 5; attempt += 1) {
      if (active && !referralCode) {
        referralCode = randomBytes(5).toString('hex').slice(0, 8).toUpperCase();
      }

      const { data, error } = await supabaseAffiliateAdmin.rpc('set_affiliate_profile', {
        p_user_id: userId.data,
        p_active: active,
        p_referral_code: active ? referralCode : null,
        p_commission_rate: commissionRate ?? null,
      });

      if (!error) return res.json({ profile: data });
      if (error.code === '23505' && active && !parsed.data.referralCode) {
        referralCode = undefined;
        continue;
      }
      if (error.code === '23505') {
        return res.status(409).json({ error: 'referral_code_taken', message: 'Esse código já está sendo usado.' });
      }
      if (error.message.includes('Perfil de divulgador não encontrado')) {
        return res.status(404).json({ error: 'affiliate_not_found', message: 'Esse usuário ainda não é divulgador.' });
      }
      if (error.message.includes('Usuário não encontrado')) {
        return res.status(404).json({ error: 'user_not_found', message: 'Usuário não encontrado.' });
      }
      throw error;
    }

    return res.status(503).json({ error: 'referral_code_generation_failed', message: 'Não foi possível gerar um código único. Tente novamente.' });
  } catch (error) {
    console.error('[Admin] Falha ao atualizar divulgador:', error);
    return res.status(500).json({
      error: 'admin_affiliate_update_error',
      message: 'Não foi possível atualizar o divulgador.',
    });
  }
});

router.post('/admin/affiliates/commissions/:commissionId/pay', authenticate, async (req: AuthenticatedRequest, res) => {
  if (!isAdmin(req, res)) return;
  const commissionId = z.string().uuid().safeParse(req.params.commissionId);
  if (!commissionId.success) return res.status(400).json({ error: 'invalid_commission', message: 'Comissão inválida.' });

  try {
    const { data, error } = await supabaseAffiliateAdmin
      .from('referral_commissions')
      .update({ status: 'paid', paid_at: new Date().toISOString() })
      .eq('id', commissionId.data)
      .eq('status', 'pending')
      .select('id,status,paid_at')
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return res.status(409).json({
        error: 'commission_not_pending',
        message: 'Esta comissão não está pendente ou já foi processada.',
      });
    }
    return res.json({ commission: data });
  } catch (error) {
    console.error('[Admin] Falha ao marcar comissão como paga:', error);
    return res.status(500).json({
      error: 'admin_commission_payment_error',
      message: 'Não foi possível registrar o pagamento da comissão.',
    });
  }
});

export default router;
