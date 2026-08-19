import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Check, Crown, Loader2, Lock, ShieldCheck, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { buildCaktoCheckoutUrl } from '@/lib/caktoCheckout';
import { PageMeta } from '@/components/seo/PageMeta';

type PlanType = 'mensal' | 'vitalicio';

const PLAN_DETAILS = {
  mensal: {
    name: 'Plano Mensal',
    price: 'R$ 7,90/mês',
    description: 'Assinatura recorrente com cobrança mensal',
    badgeVariant: 'default' as const,
    consentText: 'Li e concordo que estou assinando um plano mensal recorrente de R$ 7,90/mês e confirmo estar ciente das políticas de pagamento/cancelamento.',
    features: [
      'Acesso completo ao app enquanto a assinatura estiver ativa',
      'Agendamentos e clientes ilimitados',
      'Controle financeiro e relatórios',
      'Atualizações futuras inclusas',
    ],
    getEnvUrl: () => import.meta.env.VITE_CAKTO_CHECKOUT_MENSAL_URL,
    icon: Zap,
    color: 'text-primary',
  },
  vitalicio: {
    name: 'Plano Vitalício',
    price: 'R$ 197,00 (único pagamento)',
    description: 'Pagamento único, acesso permanente',
    badgeVariant: 'outline' as const,
    consentText: 'Li e concordo que estou comprando um plano vitalício de R$ 197,00 (pagamento único) e confirmo estar ciente das políticas de pagamento.',
    features: [
      'Acesso PERMANENTE ao app, sem mensalidades',
      'Agendamentos e clientes ilimitados',
      'Controle financeiro e relatórios',
      'Todas as atualizações futuras inclusas',
      'Suporte e melhorias contínuas',
      'Prioridade no atendimento',
    ],
    getEnvUrl: () => import.meta.env.VITE_CAKTO_CHECKOUT_VITALICIO_URL,
    icon: Crown,
    color: 'text-amber-500',
  },
};

export default function Checkout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [planType, setPlanType] = useState<PlanType>('mensal');
  const [consent, setConsent] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { isAuthenticated, session, usuario } = useSupabaseAuth();

  // Read plan from URL on initial load
  useEffect(() => {
    const planFromUrl = searchParams.get('plan');
    if (planFromUrl === 'vitalicio') {
      setPlanType('vitalicio');
    } else {
      setPlanType('mensal');
    }
  }, [searchParams]);

  const planDetails = PLAN_DETAILS[planType];
  const PlanIcon = planDetails.icon;

  const redirectToCakto = async () => {
    const userId = session?.user?.id ?? null;
    const baseUrl = planDetails.getEnvUrl();

    if (!isAuthenticated || !userId || !usuario) {
      toast.error('Faça login para continuar');
      navigate('/login');
      return;
    }

    if (!baseUrl) {
      toast.error(`Checkout ${planType} não configurado`);
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
          <Button variant="ghost" className="gap-2" onClick={() => navigate('/planos')}>
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div className="text-sm text-muted-foreground">Checkout Seguro</div>
        </div>

        {/* Plan Selector */}
        <div className="grid gap-4 mb-6 md:grid-cols-2">
          <Card 
            className={`cursor-pointer transition-all hover:scale-[1.02] ${planType === 'mensal' ? 'border-2 border-primary shadow-lg' : 'border border-border'}`}
            onClick={() => setPlanType('mensal')}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-lg">Plano Mensal</h3>
                {planType === 'mensal' && <Badge className="ml-auto">Selecionado</Badge>}
              </div>
              <p className="text-2xl font-extrabold text-primary">R$ 7,90/mês</p>
            </CardContent>
          </Card>
          
          <Card 
            className={`cursor-pointer transition-all hover:scale-[1.02] ${planType === 'vitalicio' ? 'border-2 border-amber-500 shadow-lg' : 'border border-border'}`}
            onClick={() => setPlanType('vitalicio')}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-5 w-5 text-amber-500" />
                <h3 className="font-bold text-lg">Plano Vitalício</h3>
                {planType === 'vitalicio' && <Badge className="ml-auto bg-amber-500">Selecionado</Badge>}
              </div>
              <p className="text-2xl font-extrabold text-amber-500">R$ 197,00</p>
            </CardContent>
          </Card>
        </div>

        <Card className={`shadow-xl ${planType === 'vitalicio' ? 'border-amber-500/50' : 'border-primary/20'}`}>
          <CardHeader className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <PlanIcon className={`h-6 w-6 ${planDetails.color}`} />
                  <CardTitle className="text-2xl">Finalizar Compra</CardTitle>
                </div>
                <CardDescription className="text-base">{planDetails.description}</CardDescription>
              </div>
              <Badge variant={planDetails.badgeVariant} className="gap-1">
                <Lock className="h-3.5 w-3.5" />
                Checkout Cakto
              </Badge>
            </div>
            <div className={`rounded-xl border p-4 ${planType === 'vitalicio' ? 'bg-amber-500/10 border-amber-500/30' : 'bg-primary/5 border-primary/30'}`}>
              <div className="text-sm text-muted-foreground">Você está adquirindo</div>
              <div className="mt-1 text-lg font-semibold">{planDetails.name}</div>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {planDetails.features.map((text) => (
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
            {!isAuthenticated ? (
              <Alert variant="destructive">
                <AlertDescription className="text-sm font-medium">
                  Para continuar para o pagamento, faça login ou crie sua conta.
                </AlertDescription>
              </Alert>
            ) : null}

            <Alert className="border-yellow-500/30 bg-yellow-500/10">
              <AlertDescription className="text-sm">
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Garantia legal de arrependimento: em até 7 dias você pode solicitar suporte.
                </span>
                <div className="mt-1">
                  Contato: <span className="font-medium">zalusaloes@gmail.com</span> |{' '}
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
                {planDetails.consentText}
              </label>
            </div>

            <Button 
              onClick={redirectToCakto} 
              className={`w-full h-14 text-lg font-bold ${planType === 'vitalicio' ? 'bg-amber-500 hover:bg-amber-600' : ''}`}
              disabled={isRedirecting || !consent}
            >
              {isRedirecting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Abrindo checkout...
                </>
              ) : (
                `Ir para o pagamento seguro - ${planDetails.price}`
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
                    Após a confirmação do pagamento pela Cakto, seu usuário é liberado automaticamente.
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
                    {planType === 'mensal' 
                      ? 'Sim. Por ser um plano mensal, a cobrança é recorrente conforme as regras exibidas no checkout. Você pode cancelar conforme a política do provedor de pagamento.'
                      : 'Não. O plano vitalício é um pagamento único, sem renovações automáticas.'}
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
