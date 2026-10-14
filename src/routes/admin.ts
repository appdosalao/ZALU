import { Router, Response } from 'express';
import { authenticate, AuthenticatedRequest } from '../middlewares/authenticate.js';
import { supabaseAdmin, supabaseAffiliateAdmin } from '../lib/supabaseServer.js';
import { ADMIN_PLAN_CATALOG, getAdminPlan } from '../config/adminPlans.js';
import { isAdminEmail } from '../config/adminAccess.js';
import type { Database } from '../integrations/supabase/types.js';

const router = Router();
const PAGE_SIZE = 1000;
const TRIAL_DAYS = 7;
const INACTIVE_DAYS = 30;

type UsuarioRow = Pick<
  Database['public']['Tables']['usuarios']['Row'],
  | 'id'
  | 'email'
  | 'nome_completo'
  | 'nome_personalizado_app'
  | 'created_at'
  | 'plan_type'
  | 'subscription_status'
  | 'trial_start_date'
  | 'paid_access'
  | 'paid_at'
  | 'cakto_product_id'
>;

type AffiliateInfo = {
  user_id: string;
  referral_code: string;
  commission_rate: number;
  active: boolean;
};

router.get('/overview', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  if (!isAdminEmail(req.user?.email)) {
    return res.status(403).json({
      error: 'forbidden',
      message: 'Esta área é exclusiva para a conta administrativa autorizada.',
    });
  }

  try {
    const usuarios: UsuarioRow[] = [];
    for (let from = 0; ; from += PAGE_SIZE) {
      const { data, error } = await supabaseAdmin
        .from('usuarios')
        .select('id,email,nome_completo,nome_personalizado_app,created_at,plan_type,subscription_status,trial_start_date,paid_access,paid_at,cakto_product_id')
        .order('created_at', { ascending: false })
        .range(from, from + PAGE_SIZE - 1);

      if (error) throw error;
      usuarios.push(...(data ?? []));
      if (!data || data.length < PAGE_SIZE) break;
    }

    const affiliateProfiles: AffiliateInfo[] = [];
    for (let from = 0; ; from += PAGE_SIZE) {
      const { data, error } = await supabaseAffiliateAdmin
        .from('affiliate_profiles')
        .select('user_id,referral_code,commission_rate,active')
        .range(from, from + PAGE_SIZE - 1);

      if (error) throw error;
      affiliateProfiles.push(...(data ?? []));
      if (!data || data.length < PAGE_SIZE) break;
    }

    const affiliateById = new Map(affiliateProfiles.map((profile) => [profile.user_id, profile]));

    const authUsers = [];
    for (let page = 1; ; page += 1) {
      const { data, error } = await supabaseAdmin.auth.admin.listUsers({
        page,
        perPage: PAGE_SIZE,
      });

      if (error) throw error;
      authUsers.push(...data.users);
      if (data.users.length < PAGE_SIZE) break;
    }

    const lastSignInById = new Map(
      authUsers.map((user) => [user.id, user.last_sign_in_at ?? null])
    );
    const now = Date.now();
    const inactiveCutoff = now - INACTIVE_DAYS * 24 * 60 * 60 * 1000;
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const customers = usuarios
      .filter((usuario) => !isAdminEmail(usuario.email))
      .map((usuario) => {
        const lastSignInAt = lastSignInById.get(usuario.id) ?? null;
        const parsedSignIn = lastSignInAt ? Date.parse(lastSignInAt) : Number.NaN;
        const activeByUsage = Number.isFinite(parsedSignIn) && parsedSignIn >= inactiveCutoff;
        const trialStart = usuario.trial_start_date
          ? Date.parse(usuario.trial_start_date)
          : Number.NaN;
        const trialActive =
          usuario.subscription_status === 'trial' &&
          Number.isFinite(trialStart) &&
          now < trialStart + TRIAL_DAYS * 24 * 60 * 60 * 1000;
        const paidActive =
          usuario.paid_access === true && usuario.subscription_status === 'active';
        const plan = getAdminPlan(usuario.cakto_product_id);

        return {
          id: usuario.id,
          name: usuario.nome_personalizado_app || usuario.nome_completo,
          email: usuario.email,
          createdAt: usuario.created_at,
          lastSignInAt,
          activity: activeByUsage ? 'active' as const : 'inactive' as const,
          isTrial: trialActive,
          isPaidActive: paidActive,
          subscriptionStatus: usuario.subscription_status,
          planType: usuario.plan_type,
          planName: plan?.name ?? null,
          productId: usuario.cakto_product_id,
          monthlyRevenue: paidActive ? plan?.monthlyRevenue ?? null : null,
          isAffiliate: affiliateById.has(usuario.id),
          affiliateActive: affiliateById.get(usuario.id)?.active ?? false,
          referralCode: affiliateById.get(usuario.id)?.referral_code ?? null,
          commissionRate: affiliateById.get(usuario.id)?.commission_rate ?? null,
        };
      });

    const planSummary = ADMIN_PLAN_CATALOG.map((plan) => {
      const subscribers = customers.filter(
        (customer) => customer.isPaidActive && customer.planName === plan.name
      );
      return {
        name: plan.name,
        activeCustomers: subscribers.length,
        monthlyRevenue: subscribers.length * plan.monthlyRevenue,
      };
    });

    const currentMonthStart = monthStart.getTime();
    const paidCustomers = customers.filter((customer) => customer.isPaidActive);
    const overview = {
      generatedAt: new Date().toISOString(),
      summary: {
        totalCustomers: customers.length,
        activeCustomers: customers.filter((customer) => customer.activity === 'active').length,
        inactiveCustomers: customers.filter((customer) => customer.activity === 'inactive').length,
        trialCustomers: customers.filter((customer) => customer.isTrial).length,
        paidCustomers: paidCustomers.length,
        newCustomersThisMonth: customers.filter((customer) => {
          const createdAt = Date.parse(customer.createdAt);
          return Number.isFinite(createdAt) && createdAt >= currentMonthStart;
        }).length,
        paidCustomersWithoutPlan: paidCustomers.filter((customer) => !customer.planName).length,
        estimatedMonthlyRevenue: paidCustomers.reduce(
          (total, customer) => total + (customer.monthlyRevenue ?? 0),
          0
        ),
      },
      plans: planSummary,
      customers,
    };

    return res.json(overview);
  } catch (error) {
    console.error('[Admin] Erro ao carregar visão geral:', error);
    return res.status(500).json({
      error: 'admin_overview_error',
      message: 'Não foi possível carregar os dados administrativos.',
    });
  }
});

export default router;
