import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { usePaidAccess } from '@/hooks/usePaidAccess';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Crown,
  Check,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  Lock,
  Calendar,
  Sparkles,
  Gem,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  PLANS,
  PLAN_ID_ORDER,
  TRIAL_DAYS,
  formatCurrency,
  getPlanDisplayPrice,
  getPriceSuffix,
  type BillingCycle,
  type PlanId,
} from '@/config/plans';

export default function Assinatura() {
  const navigate = useNavigate();
  const { usuario, refreshProfile, session } = useSupabaseAuth();
  const { isPaid, isLoading: isPaidLoading, refetch } = usePaidAccess();
  const [loading, setLoading] = useState(false);
  const [cycle, setCycle] = useState<BillingCycle>('monthly');
  const [hoveredPlan, setHoveredPlan] = useState<PlanId | null>(null);

  const trialInfo = useMemo(() => {
    const trialStart =
      typeof usuario?.trial_start_date === 'string' ? new Date(usuario.trial_start_date) : null;
    const trialStartMs = trialStart ? trialStart.getTime() : null;
    const nowMs = Date.now();
    const trialEligible =
      usuario?.subscription_status === 'trial' ||
      usuario?.subscription_status === 'inactive' ||
      usuario?.subscription_status === null;
    const trialValid =
      trialEligible &&
      typeof trialStartMs === 'number' &&
      Number.isFinite(trialStartMs) &&
      nowMs < trialStartMs + TRIAL_DAYS * 24 * 60 * 60 * 1000;
    const trialEndMs =
      typeof trialStartMs === 'number' && Number.isFinite(trialStartMs)
        ? trialStartMs + TRIAL_DAYS * 24 * 60 * 60 * 1000
        : null;
    const trialRemainingDays =
      typeof trialEndMs === 'number' && Number.isFinite(trialEndMs)
        ? Math.max(0, Math.ceil((trialEndMs - nowMs) / (1000 * 60 * 60 * 24)))
        : 0;
    const trialProgress =
      typeof trialEndMs === 'number' && typeof trialStartMs === 'number' && Number.isFinite(trialEndMs)
        ? Math.max(0, Math.min(100, ((TRIAL_DAYS - trialRemainingDays) / TRIAL_DAYS) * 100))
        : 0;

    return {
      trialStart,
      trialStartMs,
      trialEligible,
      trialValid,
      trialEndMs,
      trialRemainingDays,
      trialProgress,
    };
  }, [usuario?.subscription_status, usuario?.trial_start_date]);

  const formatDate = (value: string | Date | null | undefined) => {
    if (!value) return '—';
    const d = value instanceof Date ? value : new Date(value);
    if (!Number.isFinite(d.getTime())) return '—';
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(d);
  };

  const formatDateTime = (value: string | Date | null | undefined) => {
    if (!value) return '—';
    const d = value instanceof Date ? value : new Date(value);
    if (!Number.isFinite(d.getTime())) return '—';
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  };

  const statusInfo = useMemo(() => {
    if (isPaidLoading) {
      return {
        label: 'Verificando...',
        variant: 'outline' as const,
        className: 'bg-slate-100 text-slate-600 border-slate-200',
      };
    }
    if (isPaid) {
      return {
        label: 'Assinatura ativa',
        variant: 'default' as const,
        className: 'bg-emerald-500 hover:bg-emerald-600 text-white',
      };
    }
    if (trialInfo.trialValid) {
      return {
        label: `Teste grátis ativo`,
        variant: 'default' as const,
        className: 'bg-sky-500 hover:bg-sky-600 text-white',
      };
    }
    if (usuario?.subscription_status === 'trial') {
      return {
        label: 'Teste expirado',
        variant: 'destructive' as const,
        className: 'bg-rose-500 hover:bg-rose-600 text-white',
      };
    }
    return {
      label: 'Acesso pendente',
      variant: 'destructive' as const,
      className: 'bg-rose-500 hover:bg-rose-600 text-white',
    };
  }, [isPaid, isPaidLoading, trialInfo.trialValid, usuario?.subscription_status]);

  const currentPlanLabel = useMemo(() => {
    if (isPaid) {
      if (usuario?.plan_type === 'vitalicio') return 'Anual (Vitalício)';
      return 'Profissional';
    }
    if (trialInfo.trialValid) return `Trial ${TRIAL_DAYS} dias`;
    return 'Plano gratuito';
  }, [isPaid, usuario?.plan_type, trialInfo.trialValid]);

  const startDateLabel = useMemo(() => {
    if (isPaid && usuario?.paid_at) return formatDateTime(usuario.paid_at);
    if (trialInfo.trialValid && usuario?.trial_start_date)
      return formatDateTime(usuario.trial_start_date);
    return '—';
  }, [isPaid, usuario?.paid_at, usuario?.trial_start_date, trialInfo.trialValid]);

  const nextBillingLabel = useMemo(() => {
    if (isPaid) {
      if (usuario?.plan_type === 'vitalicio') return 'Pagamento único';
      return 'Mensalmente';
    }
    if (trialInfo.trialValid) {
      return `Expira em ${trialInfo.trialRemainingDays} dia(s)`;
    }
    return '—';
  }, [isPaid, usuario?.plan_type, trialInfo.trialValid, trialInfo.trialRemainingDays]);

  const currentPlanId: PlanId = useMemo(() => {
    if (isPaid) {
      if (usuario?.plan_type === 'vitalicio') return 'semestral';
      return 'profissional';
    }
    return 'essencial';
  }, [isPaid, usuario?.plan_type]);

  const refresh = async () => {
    setLoading(true);
    try {
      await refreshProfile();
      await refetch?.();
      toast.success('Status atualizado com sucesso!');
    } catch {
      toast.error('Erro ao verificar status');
    } finally {
      setLoading(false);
    }
  };

  const getSavings = (planId: PlanId): string | null => {
    if (planId === 'semestral') {
      const monthlyPrice = PLANS.profissional.pricing.monthly;
      const semestralPrice = PLANS.semestral.pricing.monthly;
      const savings = (monthlyPrice * 6) - (semestralPrice * 6);
      if (savings <= 0) return null;
      return `Economize ~${formatCurrency(savings)} vs mensal`;
    }
    if (cycle !== 'annual') return null;
    const plan = PLANS[planId];
    const monthlyTotal = plan.pricing.monthly * 12;
    const annualTotal = plan.pricing.annual;
    const savings = monthlyTotal - annualTotal;
    if (savings <= 0) return null;
    return `Economize ~${formatCurrency(savings)} vs mensal`;
  };

  const accentBgClass: Record<PlanId, string> = {
    essencial: 'from-sky-50 to-white dark:from-sky-950/30 dark:to-background',
    profissional: 'from-primary/10 to-white dark:from-primary/15 dark:to-background',
    semestral: 'from-orange-50 to-white dark:from-orange-950/30 dark:to-background',
  };

  const accentButtonClass: Record<PlanId, string> = {
    essencial: 'bg-sky-600 hover:bg-sky-700 text-white shadow-sky-500/25',
    profissional: 'bg-primary hover:bg-primary/90 text-white shadow-primary/30',
    semestral: 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-500/25',
  };

  const planCardBorder: Record<PlanId, string> = {
    essencial: 'border-sky-200 dark:border-sky-800/40',
    profissional: 'border-primary/50 dark:border-primary/40',
    semestral: 'border-orange-200 dark:border-orange-800/40',
  };

  const visiblePlans = useMemo(() => {
    if (cycle === 'annual') {
      return ['essencial', 'profissional'] as PlanId[];
    }
    return PLAN_ID_ORDER;
  }, [cycle]);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <Card className="overflow-hidden border-border/60 shadow-xl shadow-primary/5">
          <CardHeader className="pb-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 ring-1 ring-primary/20">
                  <Crown className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl sm:text-3xl">Minha Assinatura</CardTitle>
                  <CardDescription className="mt-1 text-sm sm:text-base">
                    Gerencie seu plano, acompanhe benefícios e potencialize seu salão
                  </CardDescription>
                </div>
              </div>
              <Badge
                variant={statusInfo.variant}
                className={`self-start sm:self-auto px-3 py-1 text-sm ${statusInfo.className}`}
              >
                {statusInfo.label}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-border/50 bg-muted/30 p-4 transition-colors hover:bg-muted/50">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5" />
                  Plano atual
                </div>
                <div className="mt-2 text-lg font-semibold tracking-tight">
                  {currentPlanLabel}
                </div>
              </div>
              <div className="rounded-xl border border-border/50 bg-muted/30 p-4 transition-colors hover:bg-muted/50">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  Liberação
                </div>
                <div className="mt-2 text-lg font-semibold tracking-tight">
                  {startDateLabel}
                </div>
              </div>
              <div className="rounded-xl border border-border/50 bg-muted/30 p-4 transition-colors hover:bg-muted/50">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <RefreshCw className="h-3.5 w-3.5" />
                  Próxima etapa
                </div>
                <div className="mt-2 text-lg font-semibold tracking-tight">
                  {nextBillingLabel}
                </div>
              </div>
              <div className="rounded-xl border border-border/50 bg-muted/30 p-4 transition-colors hover:bg-muted/50">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Pagamento
                </div>
                <div className="mt-2 text-lg font-semibold tracking-tight">Via Cakto</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {trialInfo.trialValid && (
          <Card className="mt-6 overflow-hidden border-sky-300/40 bg-gradient-to-br from-sky-50 via-white to-sky-50/50 shadow-lg shadow-sky-200/40 dark:from-sky-950/30 dark:via-transparent dark:to-sky-950/20 dark:border-sky-800/40">
            <CardContent className="p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-sky-500 text-white hover:bg-sky-600 border-none">
                      Teste grátis ativo
                    </Badge>
                    <span className="text-sm font-medium text-sky-700 dark:text-sky-300">
                      Faltam {trialInfo.trialRemainingDays} dia(s) para aproveitar todos os recursos sem restrições
                    </span>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs font-medium text-muted-foreground mb-2">
                      <span>Dia {TRIAL_DAYS - trialInfo.trialRemainingDays} de {TRIAL_DAYS}</span>
                      <span>{Math.round(trialInfo.trialProgress)}%</span>
                    </div>
                    <Progress
                      value={trialInfo.trialProgress}
                      className="h-2.5 bg-sky-100 dark:bg-sky-900/50 [&>div]:bg-gradient-to-r [&>div]:from-sky-500 [&>div]:to-primary"
                    />
                  </div>
                </div>
                <Button
                  size="lg"
                  onClick={() => navigate(`/checkout?plan=profissional`)}
                  className="w-full lg:w-auto bg-gradient-to-r from-sky-500 to-primary hover:from-sky-600 hover:to-primary/90 text-white shadow-lg shadow-primary/20 gap-2"
                >
                  Assinar agora
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {!isPaid && !trialInfo.trialValid && (
          <Card className="mt-6 overflow-hidden border-primary/20 shadow-xl shadow-primary/10">
            <div className="bg-gradient-to-br from-primary via-primary/90 to-purple-600 p-8 sm:p-10">
              <div className="flex flex-col gap-6 text-white">
                <div>
                  <Badge className="bg-white/20 text-white backdrop-blur-sm border-white/20">
                    <Lock className="h-3 w-3 mr-1" />
                    Acesso bloqueado
                  </Badge>
                  <h2 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight">
                    Desbloqueie todo o potencial do seu salão
                  </h2>
                  <p className="mt-2 text-white/80 text-base sm:text-lg">
                    Assine agora e tenha acesso completo a agenda, financeiro, marketing e muito mais.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { icon: Calendar, text: 'Agenda e agendamentos ilimitados' },
                    { icon: ShieldCheck, text: 'Dados seguros na nuvem' },
                    { icon: Sparkles, text: 'Relatórios financeiros avançados' },
                    { icon: Gem, text: 'Novas funcionalidades toda semana' },
                  ].map((item) => (
                    <div
                      key={item.text}
                      className="flex items-center gap-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 p-3"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/20">
                        <item.icon className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium">{item.text}</span>
                    </div>
                  ))}
                </div>
                <Button
                  size="lg"
                  onClick={() => navigate(`/checkout?plan=profissional`)}
                  className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 gap-2 text-base font-semibold px-8 shadow-xl"
                >
                  Assinar agora
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* HERO SECTION - Simplificada */}
        <section className="mt-8 relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background pt-12 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-4">
              Escolha o plano ideal para{' '}
              <span className="bg-gradient-to-r from-primary to-lilac-primary bg-clip-text text-transparent">
                seu salão
              </span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {TRIAL_DAYS} dias grátis sem cartão. Cancele quando quiser.
            </p>

            {/* BILLING CYCLE TOGGLE */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <div className="inline-flex items-center p-1 rounded-xl bg-muted border border-border">
                <button
                  onClick={() => setCycle('monthly')}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    cycle === 'monthly'
                      ? 'bg-background shadow-sm text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Mensal
                </button>
                <button
                  onClick={() => setCycle('annual')}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    cycle === 'annual'
                      ? 'bg-background shadow-sm text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Anual
                </button>
              </div>
              {cycle === 'annual' && (
                <Badge className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white border-none shadow-sm text-xs">
                  -17% de desconto
                </Badge>
              )}
            </div>
          </div>
        </section>

        {/* PRICING CARDS */}
        <section className="py-12 md:py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-2">
                Planos disponíveis
              </h2>
              <p className="text-sm text-muted-foreground">
                Passe o mouse para ver os detalhes
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {visiblePlans.map((planId) => {
                const plan = PLANS[planId];
                const Icon = plan.icon;
                const savings = getSavings(planId);
                const isPopular = plan.isPopular;
                const isCurrent = planId === currentPlanId;
                const isHovered = hoveredPlan === planId;

                return (
                  <div
                    key={planId}
                    className="relative group"
                    onMouseEnter={() => setHoveredPlan(planId)}
                    onMouseLeave={() => setHoveredPlan(null)}
                  >
                    <Card
                      className={`relative overflow-hidden transition-all duration-500 ease-out cursor-pointer backdrop-blur-sm ${
                        isHovered || isCurrent
                          ? `min-h-[400px] shadow-2xl scale-105 ${accentBgClass[planId]} ${planCardBorder[planId]}`
                          : 'min-h-[130px] shadow-lg bg-gradient-to-br from-card to-muted/30 border-border/70 hover:border-primary/40'
                      } ${isCurrent ? 'border-2 border-primary ring-2 ring-primary/20' : ''}`}
                    >
                      {/* Decorative background glow */}
                      <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 transition-opacity duration-500 ${
                        isHovered || isCurrent ? 'opacity-40' : 'opacity-0'
                      } ${plan.accentColor.replace('text-', 'bg-')}`} />

                      {/* Always visible - Compact state */}
                      <div className="p-5 relative z-10">
                        <div className="flex items-center justify-between mb-3">
                          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${plan.bgGradient} flex items-center justify-center ${plan.ringColor} ring-2 shadow-lg`}>
                            <Icon className={`w-5.5 h-5.5 ${plan.accentColor}`} />
                          </div>
                          <div className="flex items-center gap-2">
                            {isCurrent && (
                              <Badge className="bg-primary text-white border-none shadow-md text-[10px] px-2 py-0.5">Atual</Badge>
                            )}
                            {plan.badgeText && !isPaid && !isCurrent && (
                              <Badge className={`text-[10px] px-2 py-0.5 ${plan.badgeClass ?? ''}`}>{plan.badgeText}</Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-baseline gap-1 mb-1">
                          <span className={`text-2xl font-extrabold ${plan.accentColor}`}>
                            {getPlanDisplayPrice(planId, cycle)}
                          </span>
                          <span className="text-xs text-muted-foreground font-medium">
                            {getPriceSuffix(cycle, planId)}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-foreground tracking-tight">{plan.name}</h3>
                        {savings && isHovered && (
                          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1.5 flex items-center gap-1">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            {savings}
                          </p>
                        )}
                      </div>

                      {/* Expandable content - Only visible on hover */}
                      <div
                        className={`overflow-hidden transition-all duration-500 ease-out ${
                          isHovered || isCurrent ? 'max-h-[380px] opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <div className="px-5 pb-5 pt-3 border-t border-border/40 relative z-10">
                          <p className="text-sm text-muted-foreground mb-4 font-medium">{plan.tagline}</p>
                          
                          <ul className="space-y-2 mb-5">
                            {plan.features.slice(0, 6).map((feature) => (
                              <li key={feature} className="flex items-start gap-2.5">
                                <div className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shadow-sm">
                                  <Check className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" strokeWidth={3} />
                                </div>
                                <span className="text-xs font-medium text-foreground/90 leading-relaxed">
                                  {feature}
                                </span>
                              </li>
                            ))}
                            {plan.features.length > 6 && (
                              <li className="text-xs text-muted-foreground pl-6.5 font-medium">
                                +{plan.features.length - 6} recursos exclusivos
                              </li>
                            )}
                          </ul>

                          <Button
                            onClick={() => navigate(`/checkout?plan=${planId}`)}
                            disabled={isCurrent}
                            className={`w-full text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl ${
                              isCurrent
                                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                                : accentButtonClass[planId]
                            }`}
                            size="sm"
                          >
                            {isCurrent ? 'Plano atual' : 'Começar agora'}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mt-12 mb-6">
          <Card className="border-border/60 bg-gradient-to-br from-muted/50 to-background">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-bold tracking-tight">Ações rápidas</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Atualize suas informações ou entre em contato conosco
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 w-full sm:w-auto">
                  <Button
                    variant="secondary"
                    onClick={() => void refresh()}
                    disabled={loading || isPaidLoading}
                    className="gap-2"
                  >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    {loading ? 'Atualizando...' : 'Atualizar status'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const mailto = 'mailto:suporte@bellagest.app?subject=Suporte%20Assinatura';
                      window.location.href = mailto;
                    }}
                    className="gap-2"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Falar com o suporte
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
