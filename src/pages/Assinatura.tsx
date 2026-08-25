import { useMemo, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, RefreshCw, Zap, Lock, ShieldCheck, Headphones, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { usePaidAccess } from '@/hooks/usePaidAccess';
import { formatarDataHoraCurta } from '@/lib/format';
import { buildCaktoCheckoutUrl } from '@/lib/caktoCheckout';

export default function Assinatura() {
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario, refreshProfile, session } = useSupabaseAuth();
  const { isPaid, isLoading: isPaidLoading, refetch } = usePaidAccess();
  const [loading, setLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Impede que o usuário saia da página /assinatura quando não tiver acesso pago
  useEffect(() => {
    if (!isPaid && !isPaidLoading && location.pathname !== '/assinatura') {
      navigate('/assinatura', { replace: true });
    }
  }, [isPaid, isPaidLoading, location.pathname, navigate]);

  const trialStart = typeof usuario?.trial_start_date === 'string' ? new Date(usuario.trial_start_date) : null;
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
    nowMs < trialStartMs + 7 * 24 * 60 * 60 * 1000;
  const trialEndMs = typeof trialStartMs === 'number' && Number.isFinite(trialStartMs) ? trialStartMs + 7 * 24 * 60 * 60 * 1000 : null;
  const trialRemainingDays =
    typeof trialEndMs === 'number' && Number.isFinite(trialEndMs)
      ? Math.max(0, Math.ceil((trialEndMs - nowMs) / (1000 * 60 * 60 * 24)))
      : null;

  const formatDate = (value: string | Date | null | undefined) => {
    if (!value) return '—';
    const d = value instanceof Date ? value : new Date(value);
    if (!Number.isFinite(d.getTime())) return '—';
    return formatarDataHoraCurta(d);
  };

  const statusLabel = useMemo(() => {
    if (isPaidLoading) return 'Verificando...';
    if (isPaid) return 'Assinatura ativa';
    if (trialValid) return `Teste grátis ativo — ${trialRemainingDays ?? 0} dia(s) restante(s)`;
    if (usuario?.subscription_status === 'trial') return 'Teste grátis expirado — acesso pendente';
    return 'Acesso pendente';
  }, [isPaid, isPaidLoading, trialValid, trialRemainingDays, usuario?.subscription_status]);

  const planLabel = useMemo(() => {
    if (!isPaid) return 'Teste grátis (7 dias)';
    if (usuario?.plan_type === 'vitalicio') return 'Vitalício (acesso permanente)';
    return 'Mensal (R$ 7,90/mês)';
  }, [isPaid, usuario?.plan_type]);

  const refresh = async () => {
    setLoading(true);
    try {
      await refreshProfile();
      await refetch?.();
      toast.success('Status atualizado!');
    } catch {
      toast.error('Erro ao verificar status');
    } finally {
      setLoading(false);
    }
  };

  const handleBuyAccess = async () => {
    const userId = session?.user?.id ?? null;
    const baseUrl = String(
      import.meta.env.VITE_CAKTO_CHECKOUT_MENSAL_URL || import.meta.env.VITE_CAKTO_CHECKOUT_VITALICIO_URL || ''
    ).trim();

    if (!userId) {
      toast.error('Você precisa estar logado para comprar o acesso.');
      return;
    }

    if (!baseUrl) {
      toast.error('Checkout mensal não configurado.');
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
    } finally {
      setIsRedirecting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Plano e Assinatura</h1>
        <p className="page-description mt-1">Confira seu status de acesso ao sistema</p>
      </div>

      <div className="mx-auto w-full max-w-3xl">
        <Card className="shadow-xl border-primary/10">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Crown className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="section-title">Status do plano</CardTitle>
                  <CardDescription>Resumo da sua assinatura</CardDescription>
                </div>
              </div>
              <Badge variant={isPaid ? "default" : "outline"} className={isPaid ? "bg-green-600 hover:bg-green-700" : ""}>
                {statusLabel}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="p-4 bg-muted/50 rounded-lg border border-border/50">
                <div className="text-sm text-muted-foreground">Plano atual</div>
                <div className="text-sm font-semibold">{planLabel}</div>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg border border-border/50">
                <div className="text-sm text-muted-foreground">Liberação</div>
                <div className="text-sm font-semibold">{isPaid ? formatDate(usuario?.paid_at) : trialValid ? formatDate(new Date(trialEndMs ?? 0)) : 'Após pagamento aprovado'}</div>
              </div>
            </div>

            {trialValid ? (
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                <div className="text-sm font-semibold text-primary">Seu teste grátis está ativo</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Início: {formatDate(usuario?.trial_start_date)} · Expira: {trialEndMs ? formatDate(new Date(trialEndMs)) : '—'}
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Aproveite o app durante o teste. Após expirar, será necessário assinar para continuar.
                </div>
              </div>
            ) : null}

            {!isPaid && (
              <>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <h3 className="font-medium text-primary mb-2">Escolha seu plano</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Opções flexíveis para profissionalizar o seu salão.
                  </p>
                  <div className="grid gap-2 md:grid-cols-2">
                    {[
                      'Agenda com visão diária/semana',
                      'Agendamentos e clientes ilimitados',
                      'Controle financeiro e relatórios',
                      'Atualizações futuras inclusas',
                    ].map((t) => (
                      <div key={t} className="flex items-start gap-2 text-sm">
                        <div className="mt-0.5 bg-green-100 dark:bg-green-900/30 rounded-full p-1">
                          <Check className="h-3 w-3 text-green-600 dark:text-green-400" strokeWidth={3} />
                        </div>
                        <span className="text-foreground/80">{t}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border bg-primary/5 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary/15 flex items-center justify-center">
                      <Zap className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Assinatura mensal do ZALU</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="gap-1">
                          <Zap className="h-4 w-4" />
                          R$ 7,90/mês
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Tenha o controle do seu salão em um só lugar: agenda, clientes, serviços e financeiro com uma experiência rápida e profissional.
                  </p>
                  <div className="grid gap-3 md:grid-cols-2 mb-4">
                    {[
                      { icon: Lock, title: 'Pagamento seguro', desc: 'Checkout hospedado pela Cakto.' },
                      { icon: ShieldCheck, title: 'Acesso permanente', desc: 'Acesso liberado enquanto a assinatura estiver ativa.' },
                      { icon: Headphones, title: 'Suporte prioritário', desc: 'Ajuda rápida quando precisar.' },
                      { icon: CreditCard, title: 'Métodos flexíveis', desc: 'Pix/cartão conforme disponível.' },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.title} className="rounded-lg border bg-background/60 p-3">
                          <div className="flex items-start gap-2">
                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Icon className="h-4 w-4 text-primary" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-semibold">{item.title}</div>
                              <div className="text-xs text-muted-foreground">{item.desc}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <Button
                    className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20"
                    size="lg"
                    onClick={handleBuyAccess}
                    disabled={isRedirecting}
                  >
                    {isRedirecting ? 'Abrindo checkout...' : 'Assinar por R$ 7,90/mês'}
                  </Button>
                  <div className="text-xs text-muted-foreground mt-3 text-center">
                    Ao continuar, você concorda com os{' '}
                    <a className="text-primary underline underline-offset-4" href="/termos">Termos</a>
                    {' '}e a{' '}
                    <a className="text-primary underline underline-offset-4" href="/privacidade">Política de Privacidade</a>.
                  </div>
                </div>
              </>
            )}

            <div className="grid gap-3 md:grid-cols-2">
              {!isPaid && (
                <Button
                  onClick={handleBuyAccess}
                  className="w-full h-12"
                  disabled={isRedirecting}
                >
                  {isRedirecting ? 'Abrindo checkout...' : 'Assinar agora'}
                </Button>
              )}
              <Button onClick={() => void refresh()} variant="outline" disabled={loading || isPaidLoading} className="w-full h-12">
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Verificando...' : 'Atualizar Status'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
