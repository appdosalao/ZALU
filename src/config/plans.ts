import { Zap, Crown, Sparkles, Gem, Scissors, Users, Calendar, DollarSign, Megaphone, Package, Shield, Clock, Headphones, RefreshCw, Lock, CheckCircle2, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type BillingCycle = 'monthly' | 'annual';
export type PlanId = 'essencial' | 'profissional' | 'semestral';

export interface PlanFeature {
  key: string;
  label: string;
  category: 'core' | 'agenda' | 'clientes' | 'financeiro' | 'marketing' | 'suporte';
  essencial: boolean | string;
  profissional: boolean | string;
  semestral: boolean | string;
}

export interface PlanConfig {
  id: PlanId;
  name: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  accentColor: string;
  ringColor: string;
  bgGradient: string;
  badgeText?: string;
  badgeClass?: string;
  isPopular?: boolean;
  pricing: {
    monthly: number;
    annual: number;
  };
  caktoEnvKey: 'VITE_CAKTO_CHECKOUT_ESSENCIAL_URL' | 'VITE_CAKTO_CHECKOUT_PROFISSIONAL_URL' | 'VITE_CAKTO_CHECKOUT_SEMESTRAL_URL';
  planTypeInDb: 'mensal' | 'vitalicio';
  features: string[];
  consentText: string;
}

export const TRIAL_DAYS = 7;
export const TRIAL_CACHE_KEY = 'trial_status_v1';

export const FEATURE_CATEGORIES: { key: PlanFeature['category']; label: string; icon: LucideIcon }[] = [
  { key: 'core', label: 'Essenciais', icon: Sparkles },
  { key: 'agenda', label: 'Agenda & Agendamentos', icon: Calendar },
  { key: 'clientes', label: 'Clientes & Serviços', icon: Users },
  { key: 'financeiro', label: 'Financeiro', icon: DollarSign },
  { key: 'marketing', label: 'Crescimento', icon: Megaphone },
  { key: 'suporte', label: 'Suporte & Atualizações', icon: Headphones },
];

export const COMPARISON_FEATURES: PlanFeature[] = [
  { key: 'unlimited-bookings', label: 'Agendamentos ilimitados', category: 'agenda', essencial: true, profissional: true, semestral: true },
  { key: 'unlimited-clients', label: 'Cadastro de clientes ilimitado', category: 'clientes', essencial: true, profissional: true, semestral: true },
  { key: 'daily-weekly-view', label: 'Visão diária e semanal da agenda', category: 'agenda', essencial: true, profissional: true, semestral: true },
  { key: 'monthly-view', label: 'Visão mensal da agenda', category: 'agenda', essencial: false, profissional: true, semestral: true },
  { key: 'online-scheduling', label: 'Agendamento online público', category: 'agenda', essencial: true, profissional: true, semestral: true },
  { key: 'services-catalog', label: 'Catálogo de serviços e preços', category: 'clientes', essencial: true, profissional: true, semestral: true },
  { key: 'return-schedule', label: 'Cronogramas de retorno', category: 'clientes', essencial: true, profissional: true, semestral: true },
  { key: 'financial-releases', label: 'Lançamentos financeiros', category: 'financeiro', essencial: true, profissional: true, semestral: true },
  { key: 'financial-reports', label: 'Relatórios e gráficos financeiros', category: 'financeiro', essencial: 'Básico', profissional: 'Avançado', semestral: 'Avançado' },
  { key: 'accounts-receivable', label: 'Contas a receber e avisos', category: 'financeiro', essencial: false, profissional: true, semestral: true },
  { key: 'products-module', label: 'Módulo de Produtos (estoque/vendas)', category: 'financeiro', essencial: false, profissional: true, semestral: true },
  { key: 'loyalty-program', label: 'Programa de fidelidade', category: 'marketing', essencial: false, profissional: true, semestral: true },
  { key: 'marketing-module', label: 'Módulo de Marketing', category: 'marketing', essencial: false, profissional: true, semestral: true },
  { key: 'audit-module', label: 'Módulo de Auditoria', category: 'core', essencial: false, profissional: true, semestral: true },
  { key: 'email-support', label: 'Suporte por e-mail', category: 'suporte', essencial: true, profissional: true, semestral: true },
  { key: 'priority-support', label: 'Suporte prioritário (WhatsApp)', category: 'suporte', essencial: false, profissional: true, semestral: true },
  { key: 'updates', label: 'Atualizações e melhorias contínuas', category: 'suporte', essencial: true, profissional: true, semestral: true },
  { key: 'annual-discount', label: 'Desconto especial anual', category: 'suporte', essencial: false, profissional: false, semestral: false },
];

export const PLANS: Record<PlanId, PlanConfig> = {
  essencial: {
    id: 'essencial',
    name: 'Essencial',
    tagline: 'Para começar com o pé direito',
    description: 'Tudo o que você precisa para organizar seu salão no dia a dia.',
    icon: Zap,
    accentColor: 'text-sky-600 dark:text-sky-400',
    ringColor: 'ring-sky-500/30',
    bgGradient: 'from-sky-500/10 via-sky-500/5 to-transparent',
    caktoEnvKey: 'VITE_CAKTO_CHECKOUT_ESSENCIAL_URL',
    planTypeInDb: 'mensal',
    pricing: {
      monthly: 14.90,
      annual: 149.00,
    },
    features: [
      'Agenda com visão diária e semanal',
      'Agendamentos e clientes ilimitados',
      'Agendamento online público',
      'Catálogo de serviços organizado',
      'Cronogramas de retorno',
      'Lançamentos financeiros básicos',
      'Relatórios financeiros essenciais',
      'Acesso mobile e desktop (PWA)',
      'Suporte por e-mail',
    ],
    consentText: 'Li e concordo que estou assinando o Plano Essencial e confirmo estar ciente das políticas de pagamento e cancelamento.',
  },
  profissional: {
    id: 'profissional',
    name: 'Profissional',
    tagline: 'Mais escolhido pelos salões',
    description: 'Recursos avançados para crescer e escalar seu negócio.',
    icon: Crown,
    accentColor: 'text-primary',
    ringColor: 'ring-primary/40',
    bgGradient: 'from-primary/15 via-primary/5 to-transparent',
    badgeText: 'Mais Popular',
    badgeClass: 'bg-gradient-to-r from-primary to-lilac-primary text-white border-none shadow-md',
    isPopular: true,
    caktoEnvKey: 'VITE_CAKTO_CHECKOUT_PROFISSIONAL_URL',
    planTypeInDb: 'mensal',
    pricing: {
      monthly: 27.90,
      annual: 279.00,
    },
    features: [
      'Tudo do Plano Essencial',
      'Visão mensal da agenda',
      'Contas a receber + avisos de vencimento',
      'Módulo de Produtos (estoque e vendas)',
      'Programa de fidelidade completo',
      'Módulo de Marketing',
      'Módulo de Auditoria',
      'Relatórios financeiros avançados',
      'Suporte prioritário por WhatsApp',
    ],
    consentText: 'Li e concordo que estou assinando o Plano Profissional e confirmo estar ciente das políticas de pagamento e cancelamento.',
  },
  semestral: {
    id: 'semestral',
    name: 'Semestral',
    tagline: 'Economia inteligente para seu negócio',
    description: 'Plano Profissional com desconto para pagamento semestral.',
    icon: Shield,
    accentColor: 'text-orange-600 dark:text-orange-400',
    ringColor: 'ring-orange-500/30',
    bgGradient: 'from-orange-500/10 via-orange-500/5 to-transparent',
    badgeText: '-10% OFF',
    badgeClass: 'bg-orange-500 hover:bg-orange-600 text-white border-none shadow-md',
    caktoEnvKey: 'VITE_CAKTO_CHECKOUT_SEMESTRAL_URL',
    planTypeInDb: 'mensal',
    pricing: {
      monthly: 25.11,
      annual: 0,
    },
    features: [
      'Tudo do Plano Profissional',
      'Pagamento semestral',
      'Desconto de 10% garantido',
      'Preço congelado por 6 meses',
      'Suporte prioritário no período',
      'Acesso a todas as funcionalidades',
    ],
    consentText: 'Li e concordo que estou assinando o Plano Semestral e confirmo estar ciente das políticas de pagamento e cancelamento.',
  },
};

export const PLAN_ID_ORDER: PlanId[] = ['essencial', 'profissional', 'semestral'];

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(value);
};

export const getPlanPrice = (planId: PlanId, cycle: BillingCycle): number => {
  const plan = PLANS[planId];
  return cycle === 'monthly' ? plan.pricing.monthly : plan.pricing.annual;
};

export const getPlanDisplayPrice = (planId: PlanId, cycle: BillingCycle): string => {
  const price = getPlanPrice(planId, cycle);
  return formatCurrency(price);
};

export const getPriceSuffix = (cycle: BillingCycle, planId: PlanId): string => {
  if (planId === 'semestral') return '/semestre';
  return cycle === 'monthly' ? '/mês' : '/ano';
};

export const getCaktoEnvUrl = (planId: PlanId): string | undefined => {
  const plan = PLANS[planId];
  return import.meta.env[plan.caktoEnvKey] as string | undefined;
};

export const HIGHLIGHTS = [
  { icon: Scissors, title: 'Gestão Completa', desc: 'Agenda, clientes, serviços e financeiro em um só lugar' },
  { icon: Clock, title: 'Economia de Tempo', desc: 'Automatize tarefas repetitivas e foque no que importa' },
  { icon: Lock, title: '100% Seguro', desc: 'Dados criptografados com backup automático na nuvem' },
  { icon: RefreshCw, title: 'Atualizações', desc: 'Novas funcionalidades lançadas regularmente' },
];

export const FAQ = [
  {
    q: 'Posso mudar de plano depois?',
    a: 'Sim! Você pode fazer upgrade ou downgrade a qualquer momento. O valor é ajustado proporcionalmente de acordo com o período já utilizado.',
  },
  {
    q: 'Como funciona o teste grátis de 7 dias?',
    a: 'Ao criar sua conta, você tem 7 dias de acesso completo ao Plano Profissional sem precisar cadastrar cartão. Após esse período, basta assinar para continuar usando.',
  },
  {
    q: 'Quais formas de pagamento são aceitas?',
    a: 'Aceitamos Pix e cartão de crédito (recorrente). O checkout é processado de forma segura pela Cakto.',
  },
  {
    q: 'Como é feito o cancelamento?',
    a: 'Você pode cancelar a assinatura a qualquer momento entrando em contato com nosso suporte. O acesso permanece ativo até o final do período já pago.',
  },
  {
    q: 'Tenho direito a reembolso?',
    a: 'Sim. De acordo com o CDC, você tem 7 dias de garantia após a compra para solicitar reembolso integral caso não esteja satisfeito.',
  },
  {
    q: 'Meus dados ficam seguros?',
    a: 'Absolutamente. Todos os dados são criptografados em trânsito (TLS 1.3) e em repouso, armazenados na infraestrutura segura da Supabase com backups automáticos.',
  },
];

export const PROOF_DATA = {
  saloes: '+1.200',
  agendamentos: '+500 mil',
  rating: '4,9',
  uptime: '99,9%',
};
