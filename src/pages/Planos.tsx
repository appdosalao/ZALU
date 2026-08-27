import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Check, X, Shield, CreditCard, ArrowUp, Lock, Scissors, Calendar, Star, Zap, Activity } from 'lucide-react';
import { usePaidAccess } from '@/hooks/usePaidAccess';
import { PageMeta } from '@/components/seo/PageMeta';
import {
  PLANS,
  PLAN_ID_ORDER,
  FEATURE_CATEGORIES,
  COMPARISON_FEATURES,
  HIGHLIGHTS,
  FAQ,
  PROOF_DATA,
  TRIAL_DAYS,
  formatCurrency,
  getPlanDisplayPrice,
  getPriceSuffix,
  type BillingCycle,
  type PlanId,
} from '@/config/plans';

export default function Planos() {
  const navigate = useNavigate();
  const { isPaid } = usePaidAccess();
  const [cycle, setCycle] = useState<BillingCycle>('monthly');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getSavings = (planId: PlanId): string | null => {
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
    anual: 'from-emerald-50 to-white dark:from-emerald-950/30 dark:to-background',
    trimestral: 'from-blue-50 to-white dark:from-blue-950/30 dark:to-background',
  };

  const accentButtonClass: Record<PlanId, string> = {
    essencial: 'bg-sky-600 hover:bg-sky-700 text-white shadow-sky-500/25',
    profissional: 'bg-primary hover:bg-primary/90 text-white shadow-primary/30',
    anual: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/25',
    trimestral: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25',
  };

  const planCardBorder: Record<PlanId, string> = {
    essencial: 'border-sky-200 dark:border-sky-800/40',
    profissional: 'border-primary/50 dark:border-primary/40',
    anual: 'border-emerald-200 dark:border-emerald-800/40',
    trimestral: 'border-blue-200 dark:border-blue-800/40',
  };

  return (
    <div className="min-h-screen bg-background">
      <PageMeta
        title="Planos e Preços"
        description="Escolha o plano ideal para seu salão de beleza. Teste grátis por 7 dias sem cartão. Planos Essencial, Profissional e Anual com economia garantida."
        path="/planos"
        keywords="planos sistema salão beleza, preço gestão salão, assinatura software salão, sistema barbearia preço, zalu planos"
      />

      {/* 1) HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/15 via-lilac-primary/10 to-background pt-16 pb-24 md:pt-20 md:pb-32">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary/20 blur-3xl opacity-60" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-lilac-primary/20 blur-3xl opacity-50" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge
            variant="secondary"
            className="mb-6 px-4 py-2 text-sm font-medium bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-border shadow-sm flex items-center gap-2 w-fit mx-auto"
          >
            <Lock className="w-4 h-4 text-foreground/70" />
            <span>{TRIAL_DAYS} dias grátis · Sem cartão</span>
          </Badge>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-6">
            Escolha o plano ideal para{' '}
            <span className="bg-gradient-to-r from-primary to-lilac-primary bg-clip-text text-transparent">
              seu salão
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground mb-10 leading-relaxed">
            Organize sua agenda, gerencie clientes, controle o financeiro e escale seu negócio com a plataforma escolhida por mais de 1.200 salões em todo o Brasil.
          </p>

          {/* PROOF ROW */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-10">
            <Badge variant="outline" className="px-4 py-2 text-sm font-medium bg-white/60 dark:bg-white/5 backdrop-blur-sm flex items-center gap-1.5">
              <Scissors className="w-4 h-4 text-primary" />
              <span>{PROOF_DATA.saloes} salões</span>
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-sm font-medium bg-white/60 dark:bg-white/5 backdrop-blur-sm flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-primary" />
              <span>{PROOF_DATA.agendamentos} agendamentos</span>
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-sm font-medium bg-white/60 dark:bg-white/5 backdrop-blur-sm flex items-center gap-1.5">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span>{PROOF_DATA.rating}</span>
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-sm font-medium bg-white/60 dark:bg-white/5 backdrop-blur-sm flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-500" />
              <span>{PROOF_DATA.uptime} uptime</span>
            </Badge>
          </div>

          {/* BILLING CYCLE TOGGLE */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <div className="inline-flex items-center p-1.5 rounded-2xl bg-muted border border-border shadow-inner">
              <button
                onClick={() => setCycle('monthly')}
                className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  cycle === 'monthly'
                    ? 'bg-background shadow-md text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Mensal
              </button>
              <button
                onClick={() => setCycle('annual')}
                className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  cycle === 'annual'
                    ? 'bg-background shadow-md text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Anual
              </button>
            </div>
            {cycle === 'annual' && (
              <Badge className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white border-none shadow-md animate-pulse">
                -17% no anual
              </Badge>
            )}
          </div>
        </div>
      </section>

      {/* 2) HIGHLIGHTS SECTION */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HIGHLIGHTS.map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.title}
                  className="group border border-border/60 bg-card hover:shadow-xl hover:-translate-y-[2px] transition-all duration-200"
                >
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3) PRICING CARDS */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {PLAN_ID_ORDER.map((planId) => {
              const plan = PLANS[planId];
              const Icon = plan.icon;
              const savings = getSavings(planId);
              const isPopular = plan.isPopular;

              return (
                <Card
                  key={planId}
                  className={`relative flex flex-col h-full transition-all duration-200 hover:-translate-y-[2px] hover:shadow-2xl bg-gradient-to-b ${
                    accentBgClass[planId]
                  } ${planCardBorder[planId]} ${
                    isPopular
                      ? 'lg:scale-105 shadow-2xl border-2 z-10'
                      : 'shadow-lg border'
                  }`}
                >
                  {isPaid && (
                    <div className="absolute top-4 right-4 z-20">
                      <Badge className="bg-green-600 hover:bg-green-700 text-white border-none shadow-md">
                        Plano ativo
                      </Badge>
                    </div>
                  )}

                  {plan.badgeText && !isPaid && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                      <Badge className={`px-4 py-1 ${plan.badgeClass ?? ''}`}>
                        {plan.badgeText}
                      </Badge>
                    </div>
                  )}

                  <CardContent className="p-6 sm:p-8 flex flex-col flex-1">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.bgGradient} flex items-center justify-center mb-5 ${plan.ringColor} ring-4`}>
                      <Icon className={`w-7 h-7 ${plan.accentColor}`} />
                    </div>

                    <div className="mb-4">
                      <h3 className="text-2xl font-extrabold text-foreground mb-1">{plan.name}</h3>
                      <p className="text-sm text-muted-foreground">{plan.tagline}</p>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-baseline gap-1">
                        <span className={`text-5xl font-extrabold ${plan.accentColor}`}>
                          {getPlanDisplayPrice(planId, cycle)}
                        </span>
                        <span className="text-lg font-medium text-muted-foreground">
                          {getPriceSuffix(cycle, planId)}
                        </span>
                      </div>
                      {savings && (
                        <p className="mt-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                          {savings}
                        </p>
                      )}
                    </div>

                    <ul className="space-y-3 mb-8 flex-1">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" strokeWidth={3} />
                          </div>
                          <span className="text-sm font-medium text-foreground/90 leading-relaxed">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      onClick={() => navigate(`/checkout?plan=${planId}`)}
                      disabled={isPaid}
                      className={`w-full h-13 text-base font-bold shadow-lg hover:scale-[1.02] transition-all duration-200 ${
                        isPaid
                          ? 'bg-muted text-muted-foreground cursor-not-allowed hover:scale-100'
                          : accentButtonClass[planId]
                      }`}
                      size="lg"
                    >
                      {isPaid ? 'Plano ativo' : 'Começar agora'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4) COMPARISON TABLE */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4">
              Compare todos os recursos
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Veja detalhadamente o que está incluído em cada plano e escolha a melhor opção para o seu negócio.
            </p>
          </div>

          <div className="rounded-2xl border border-border shadow-xl overflow-hidden bg-card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="text-left p-5 font-semibold text-foreground w-[40%]">
                      Recurso
                    </th>
                    {PLAN_ID_ORDER.map((planId) => {
                      const plan = PLANS[planId];
                      const isProfissional = planId === 'profissional';
                      return (
                        <th
                          key={planId}
                          className={`text-center p-5 font-bold ${
                            isProfissional
                              ? 'bg-primary/10 text-primary'
                              : plan.accentColor
                          }`}
                        >
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-base sm:text-lg">{plan.name}</span>
                            <span className="text-xs font-normal text-muted-foreground">
                              {getPlanDisplayPrice(planId, cycle)}{getPriceSuffix(cycle, planId)}
                            </span>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {FEATURE_CATEGORIES.map((category) => {
                    const CatIcon = category.icon;
                    const categoryFeatures = COMPARISON_FEATURES.filter(
                      (f) => f.category === category.key
                    );

                    return (
                      <React.Fragment key={`cat-wrap-${category.key}`}>
                        <tr
                          className="bg-muted/30 border-b border-border"
                        >
                          <td colSpan={4} className="p-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <CatIcon className="w-4 h-4 text-primary" />
                              </div>
                              <span className="font-bold text-foreground text-sm sm:text-base uppercase tracking-wide">
                                {category.label}
                              </span>
                            </div>
                          </td>
                        </tr>
                        {categoryFeatures.map((feature) => (
                          <tr
                            key={feature.key}
                            className="border-b border-border/50 last:border-none hover:bg-muted/20 transition-colors"
                          >
                            <td className="p-4 sm:p-5 text-sm sm:text-base font-medium text-foreground/90">
                              {feature.label}
                            </td>
                            {PLAN_ID_ORDER.map((planId) => {
                              const value = feature[planId];
                              const isProfissional = planId === 'profissional';
                              return (
                                <td
                                  key={`${feature.key}-${planId}`}
                                  className={`text-center p-4 sm:p-5 ${
                                    isProfissional ? 'bg-primary/5' : ''
                                  }`}
                                >
                                  {typeof value === 'boolean' ? (
                                    value ? (
                                      <div className="flex justify-center">
                                        <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" strokeWidth={3} />
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="flex justify-center">
                                        <div className="w-7 h-7 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                          <X className="w-4 h-4 text-red-500 dark:text-red-400" strokeWidth={3} />
                                        </div>
                                      </div>
                                    )
                                  ) : (
                                    <span
                                      className={`text-sm font-semibold ${
                                        isProfissional ? 'text-primary' : 'text-foreground/80'
                                      }`}
                                    >
                                      {value}
                                    </span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 5) FAQ */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4">
              Perguntas frequentes
            </h2>
            <p className="text-lg text-muted-foreground">
              Tire suas dúvidas antes de assinar. Estamos aqui para ajudar!
            </p>
          </div>

          <div className="rounded-2xl border border-border shadow-xl bg-card overflow-hidden">
            <Accordion type="single" collapsible className="px-2 sm:px-4">
              {FAQ.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-b border-border/50 last:border-none px-2 sm:px-4">
                  <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary transition-colors py-5 sm:py-6 text-base sm:text-lg">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-5 sm:pb-6 text-sm sm:text-base">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* 6) FINAL CTA / TRUST SECTION */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-primary/20 via-lilac-primary/15 to-primary/10">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full bg-primary/30 blur-3xl opacity-50" />
              <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-lilac-primary/30 blur-3xl opacity-40" />
            </div>

            <CardContent className="relative p-8 sm:p-12 lg:p-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div>
                  <Badge
                    variant="secondary"
                    className="mb-5 px-4 py-2 text-sm font-medium bg-white/70 dark:bg-white/10 backdrop-blur-sm border border-border inline-flex items-center gap-1.5"
                  >
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span>Comece hoje mesmo</span>
                  </Badge>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-5 leading-tight">
                    Pronto para transformar seu salão?
                  </h2>
                  <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                    Teste grátis por {TRIAL_DAYS} dias sem cartão. Cancele quando quiser. Milhares de salões já economizaram tempo e aumentaram seus lucros com a gente.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      onClick={scrollToTop}
                      size="lg"
                      className="h-14 px-8 text-base font-bold shadow-xl shadow-primary/30 bg-primary hover:bg-primary/90 text-white hover:scale-[1.02] transition-all duration-200"
                    >
                      <ArrowUp className="w-5 h-5 mr-2" />
                      Ver planos novamente
                    </Button>
                    <Button
                      onClick={() => navigate(`/checkout?plan=profissional`)}
                      variant="outline"
                      size="lg"
                      className="h-14 px-8 text-base font-bold bg-white/60 dark:bg-white/5 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-white/10 hover:scale-[1.02] transition-all duration-200"
                    >
                      Ir direto para checkout
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                  <div className="flex items-start gap-4 p-5 rounded-xl bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-border/60">
                    <div className="w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground mb-1">Garantia de 7 dias</h4>
                      <p className="text-sm text-muted-foreground">
                        Teste sem compromisso. Se não gostar, devolvemos 100% do seu dinheiro.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-5 rounded-xl bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-border/60">
                    <div className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
                      <CreditCard className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground mb-1">Pagamento seguro Cakto</h4>
                      <p className="text-sm text-muted-foreground">
                        Checkout protegido com criptografia. Aceitamos Pix e cartão de crédito.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-5 rounded-xl bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-border/60">
                    <div className="w-11 h-11 rounded-xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground mb-1">Dados criptografados</h4>
                      <p className="text-sm text-muted-foreground">
                        Seus dados estão protegidos com TLS 1.3 e backups automáticos diários.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 7) RODAPÉ */}
      <footer className="py-10 border-t border-border bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center sm:text-left">
              © {new Date().getFullYear()} ZALU — Gestão de Salões de Beleza. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="/termos"
                className="text-sm text-muted-foreground hover:text-primary hover:underline transition-colors"
              >
                Termos de Uso
              </a>
              <a
                href="/privacidade"
                className="text-sm text-muted-foreground hover:text-primary hover:underline transition-colors"
              >
                Política de Privacidade
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
