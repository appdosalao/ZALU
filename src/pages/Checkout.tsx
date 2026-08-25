import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Check, Loader2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { buildCaktoCheckoutUrl } from '@/lib/caktoCheckout';
import { PageMeta } from '@/components/seo/PageMeta';
import {
  PLANS,
  PLAN_ID_ORDER,
  getCaktoEnvUrl,
  getPlanDisplayPrice,
  getPriceSuffix,
  type PlanId,
  type BillingCycle,
} from '@/config/plans';

export default function Checkout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('profissional');
  const [consent, setConsent] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { isAuthenticated, session, usuario } = useSupabaseAuth();

  // Read plan from URL on initial load — accepts new IDs (essencial, profissional, semestral, anual)
  // and legacy IDs (mensal → profissional, vitalicio → anual) for backwards compat
  useEffect(() => {
    const planFromUrl = searchParams.get('plan') as string | null;
    if (planFromUrl === 'essencial') {
      setSelectedPlan('essencial');
    } else if (planFromUrl === 'semestral') {
      setSelectedPlan('semestral');
    } else if (planFromUrl === 'anual' || planFromUrl === 'vitalicio') {
      setSelectedPlan('anual');
    } else {
      // 'profissional', 'mensal', or anything else → default to profissional
      setSelectedPlan('profissional');
    }
  }, [searchParams]);

  // Reset consent whenever plan changes
  useEffect(() => {
    setConsent(false);
  }, [selectedPlan]);

  const plan = PLANS[selectedPlan];
  const PlanIcon = plan.icon;
  const billingCycle: BillingCycle = selectedPlan === 'semestral' ? 'annual' : 'monthly';

  const redirectToCakto = async () => {
    const userId = session?.user?.id ?? null;
    const baseUrl = getCaktoEnvUrl(selectedPlan);

    if (!isAuthenticated || !userId || !usuario) {
      toast.error('Faça login para continuar');
      navigate('/login');
      return;
    }

    if (!baseUrl) {
      toast.error(`Checkout do plano ${plan.name} não configurado`);
      return;
    }

    if (!consent) {
      toast.error('Confirme o termo para continuar');
      return;
    }

    setIsRedirecting(true);

    try {
      const redirectUrl = `${window.location.origin}/payment/success`;
      const checkoutUrl = buildCaktoCheckoutUrl({
        baseUrl,
        sck: userId,
        name: usuario?.nome_completo ?? null,
        email: usuario?.email ?? null,
        phone: usuario?.telefone ?? null,
        redirectUrl,
      });
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Erro ao processar checkout:', error);
      toast.error('Erro na conexão com o servidor.');
      setIsRedirecting(false);
    }
  };

  const accentButtonClass: Record<PlanId, string> = {
    essencial: 'bg-sky-600 hover:bg-sky-700 text-white shadow-sky-500/25',
    profissional: 'bg-primary hover:bg-primary/90 text-white shadow-primary/30',
    semestral: 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-500/25',
    anual: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/25',
  };

  const accentBorderClass: Record<PlanId, string> = {
    essencial: 'border-sky-500',
    profissional: 'border-primary',
    semestral: 'border-orange-500',
    anual: 'border-emerald-500',
  };

  const accentBgClass: Record<PlanId, string> = {
    essencial: 'bg-sky-500/10 border-sky-500/30',
    profissional: 'bg-primary/5 border-primary/30',
    semestral: 'bg-orange-500/10 border-orange-500/30',
    anual: 'bg-emerald-500/10 border-emerald-500/30',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <PageMeta
        title="Checkout — Assinatura ZALU"
        description="Assine o ZALU e profissionalize a gestão do seu salão de beleza com agendamentos, clientes e financeiro."
        path="/checkout"
        noindex
      />
      <div className="container mx-auto py-10 px-4 max-w-3xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Button variant="ghost" className="gap-2" onClick={() => navigate('/assinatura')}>
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div className="text-sm text-muted-foreground">Checkout Seguro</div>
        </div>

        {/* Plan Selector — 3 plans */}
        <div className="grid gap-3 mb-6 sm:grid-cols-3">
          {PLAN_ID_ORDER.map((planId) => {
            const p = PLANS[planId];
            const Icon = p.icon;
            const isSelected = selectedPlan === planId;
            const cycle: BillingCycle = planId === 'semestral' || planId === 'anual' ? 'annual' : 'monthly';

            return (
              <Card
                key={planId}
                className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                  isSelected
                    ? `border-2 ${accentBorderClass[planId]} shadow-lg`
                    : 'border border-border hover:border-border/80'
                }`}
                onClick={() => setSelectedPlan(planId)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={`h-4 w-4 ${p.accentColor}`} />
                    <h3 className="font-bold text-sm">{p.name}</h3>
                    {isSelected && (
                      <Badge className="ml-auto text-xs px-1.5 py-0.5">Selecionado</Badge>
                    )}
                  </div>
                  <p className={`text-xl font-extrabold ${p.accentColor}`}>
                    {getPlanDisplayPrice(planId, cycle)}
                    <span className="text-xs font-normal text-muted-foreground ml-1">
                      {getPriceSuffix(cycle, planId)}
                    </span>
                  </p>
                  {p.badgeText && (
                    <Badge className={`mt-2 text-[10px] ${p.badgeClass ?? ''}`}>
                      {p.badgeText}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className={`shadow-xl border ${accentBorderClass[selectedPlan]}/40`}>
          <CardHeader className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <PlanIcon className={`h-6 w-6 ${plan.accentColor}`} />
                  <CardTitle className="text-2xl">Finalizar Compra</CardTitle>
                </div>
                <CardDescription className="text-base mt-1">{plan.description}</CardDescription>
              </div>
              <Badge variant="outline" className="gap-1 shrink-0">
                <ShieldCheck className="h-3.5 w-3.5" />
                Checkout Cakto
              </Badge>
            </div>

            {/* Plan summary box */}
            <div className={`rounded-xl border p-4 ${accentBgClass[selectedPlan]}`}>
              <div className="text-sm text-muted-foreground">Você está adquirindo</div>
              <div className="mt-1 text-lg font-semibold">
                Plano {plan.name} —{' '}
                <span className={plan.accentColor}>
                  {getPlanDisplayPrice(selectedPlan, billingCycle)}
                  {getPriceSuffix(billingCycle, selectedPlan)}
                </span>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {plan.features.map((text) => (
                  <div key={text} className="flex items-start gap-2 text-sm">
                    <div className="mt-0.5 bg-green-100 dark:bg-green-900/30 rounded-full p-0.5">
                      <Check className="h-3 w-3 text-green-600 dark:text-green-400" strokeWidth={3} />
                    </div>
                    <span className="text-foreground/80">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {!isAuthenticated && (
              <Alert variant="destructive">
                <AlertDescription className="text-sm font-medium">
                  Para continuar para o pagamento, faça login ou crie sua conta.
                </AlertDescription>
              </Alert>
            )}

            <Alert className="border-yellow-500/30 bg-yellow-500/10">
              <AlertDescription className="text-sm">
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Garantia legal de arrependimento: em até 7 dias você pode solicitar suporte.
                </span>
                <div className="mt-1">
                  Contato:{' '}
                  <span className="font-medium">zalusaloes@gmail.com</span> |{' '}
                  <span className="font-medium">(33) 9714-0859</span>
                </div>
              </AlertDescription>
            </Alert>

            <div className="flex items-start gap-3 rounded-lg border p-4 bg-muted/30">
              <Checkbox
                id="consent"
                checked={consent}
                onCheckedChange={(v) => setConsent(Boolean(v))}
                className="mt-1"
              />
              <label htmlFor="consent" className="text-sm leading-snug cursor-pointer font-medium">
                {plan.consentText}
              </label>
            </div>

            <Button
              onClick={redirectToCakto}
              className={`w-full h-14 text-lg font-bold shadow-lg ${
                consent ? accentButtonClass[selectedPlan] : ''
              }`}
              disabled={isRedirecting || !consent}
            >
              {isRedirecting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Abrindo checkout...
                </>
              ) : (
                `Ir para o pagamento seguro — ${getPlanDisplayPrice(selectedPlan, billingCycle)}${getPriceSuffix(billingCycle, selectedPlan)}`
              )}
            </Button>

            <div className="text-xs text-muted-foreground">
              Ao continuar, você concorda com os{' '}
              <a className="text-primary underline underline-offset-4" href="/termos">Termos</a>
              {' '}e a{' '}
              <a className="text-primary underline underline-offset-4" href="/privacidade">Política de Privacidade</a>.
            </div>

            <div className="rounded-xl border bg-card/50 p-4">
              <div className="text-sm font-semibold">Perguntas frequentes</div>
              <Accordion type="single" collapsible className="mt-2">
                <AccordionItem value="faq-1">
                  <AccordionTrigger>Como o acesso é liberado?</AccordionTrigger>
                  <AccordionContent>
                    Após a confirmação do pagamento pela Cakto, seu usuário é liberado automaticamente em minutos.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-2">
                  <AccordionTrigger>Posso pagar no Pix ou cartão?</AccordionTrigger>
                  <AccordionContent>
                    Os métodos exibidos dependem do checkout configurado na Cakto. Você verá as opções disponíveis ao abrir o checkout.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-3">
                  <AccordionTrigger>A assinatura renova automaticamente?</AccordionTrigger>
                  <AccordionContent>
                    {selectedPlan === 'semestral'
                      ? 'O plano Semestral é um pagamento único por 6 meses, sem renovações automáticas mensais. Ao final do período, você decide se quer renovar.'
                      : selectedPlan === 'anual'
                        ? 'O plano Anual é um pagamento único anual, sem renovações automáticas mensais. Ao final do período, você decide se quer renovar.'
                        : 'Sim. Planos mensais têm cobrança recorrente conforme as regras exibidas no checkout. Você pode cancelar a qualquer momento.'}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
