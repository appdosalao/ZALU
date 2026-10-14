import { useCallback, useEffect, useMemo, useState } from 'react';
import { Copy, Gift, Loader2, RefreshCw, Share2, Users, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { parseApiResponse } from '@/lib/apiResponse';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type AffiliateReferral = {
  id: string;
  email: string;
  nome_completo: string;
  nome_personalizado_app: string;
  created_at: string;
  subscription_status: string | null;
  paid_access: boolean;
  paid_at: string | null;
};

type AffiliateCommission = {
  id: string;
  referred_user_id: string;
  payment_amount: number;
  commission_rate: number;
  commission_amount: number;
  status: 'pending' | 'paid' | 'cancelled';
  payment_received_at: string;
  paid_at: string | null;
};

type AffiliateData = {
  profile: {
    referral_code: string;
    commission_rate: number;
  };
  summary: {
    referrals: number;
    pendingCommissions: number;
    paidCommissions: number;
  };
  referrals: AffiliateReferral[];
  commissions: AffiliateCommission[];
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const formatDate = (value: string | null) =>
  value ? new Date(value).toLocaleDateString('pt-BR') : '—';

const statusLabel: Record<AffiliateCommission['status'], string> = {
  pending: 'Pendente',
  paid: 'Paga',
  cancelled: 'Cancelada',
};

export default function AffiliateDashboard() {
  const { session } = useSupabaseAuth();
  const [data, setData] = useState<AffiliateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (refresh = false) => {
    if (!session?.access_token) {
      setError('Sua sessão expirou. Entre novamente para acessar a área de divulgação.');
      setLoading(false);
      return;
    }
    if (refresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/referrals/me', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const body = await parseApiResponse<AffiliateData>(response);
      setData(body);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Erro inesperado ao carregar sua divulgação.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [session?.access_token]);

  useEffect(() => {
    void load();
  }, [load]);

  const referralLink = useMemo(() => {
    if (!data) return '';
    return `${window.location.origin}/cadastro?ref=${encodeURIComponent(data.profile.referral_code)}`;
  }, [data]);

  const referralById = useMemo(
    () => new Map(data?.referrals.map((referral) => [referral.id, referral]) ?? []),
    [data?.referrals]
  );

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      toast.success('Link de indicação copiado.');
    } catch (copyError) {
      console.error('[Divulgação] Falha ao copiar link:', copyError);
      toast.error('Não foi possível copiar o link. Selecione e copie o endereço manualmente.');
    }
  };

  const shareWhatsApp = () => {
    const message = `Conheça o ZALU e crie sua conta com meu código de indicação: ${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
        Carregando sua área de divulgação...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Alert variant="destructive">
          <AlertTitle>Área de divulgação indisponível</AlertTitle>
          <AlertDescription>{error || 'Não foi possível carregar seus dados.'}</AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => void load(true)} disabled={refreshing}>
          <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge variant="secondary" className="mb-3 gap-1.5">
            <Gift className="h-3.5 w-3.5" />
            Programa de divulgação
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight">Divulgação</h1>
          <p className="mt-2 text-muted-foreground">
            Compartilhe seu link e acompanhe as indicações e comissões.
          </p>
        </div>
        <Button variant="outline" onClick={() => void load(true)} disabled={refreshing}>
          <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </header>

      <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card">
        <CardContent className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">Seu código de indicação</p>
            <p className="font-mono text-3xl font-bold tracking-[0.18em] text-primary sm:text-4xl">
              {data.profile.referral_code}
            </p>
            <p className="text-sm text-muted-foreground">
              Comissão: {data.profile.commission_rate}% · Link pessoal
            </p>
            <label htmlFor="affiliate-referral-link" className="sr-only">Link pessoal de indicação</label>
            <input
              id="affiliate-referral-link"
              readOnly
              value={referralLink}
              className="w-full rounded-lg border bg-background/80 px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
            <Button onClick={() => void copyLink()} className="gap-2">
              <Copy className="h-4 w-4" />
              Copiar link
            </Button>
            <Button variant="outline" onClick={shareWhatsApp} className="gap-2">
              <Share2 className="h-4 w-4" />
              Compartilhar no WhatsApp
            </Button>
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-4 sm:grid-cols-3" aria-label="Resumo das indicações">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Indicados</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent><p className="text-2xl font-bold">{data.summary.referrals}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Comissões pendentes</CardTitle>
            <Wallet className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent><p className="text-2xl font-bold">{formatCurrency(data.summary.pendingCommissions)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Comissões pagas</CardTitle>
            <Wallet className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent><p className="text-2xl font-bold">{formatCurrency(data.summary.paidCommissions)}</p></CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Indicados</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Conta</TableHead>
                <TableHead>Cadastro</TableHead>
                <TableHead>Assinatura</TableHead>
                <TableHead>Pagamento</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.referrals.map((referral) => (
                <TableRow key={referral.id}>
                  <TableCell>
                    <div className="font-medium">{referral.nome_personalizado_app || referral.nome_completo}</div>
                    <div className="text-xs text-muted-foreground">{referral.email}</div>
                  </TableCell>
                  <TableCell>{formatDate(referral.created_at)}</TableCell>
                  <TableCell>
                    <Badge variant={referral.paid_access && referral.subscription_status === 'active' ? 'default' : 'secondary'}>
                      {referral.paid_access && referral.subscription_status === 'active'
                        ? 'Ativa'
                        : referral.subscription_status === 'trial'
                          ? 'Em teste'
                          : referral.subscription_status || 'Sem plano'}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(referral.paid_at)}</TableCell>
                </TableRow>
              ))}
              {data.referrals.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    Ainda não há indicações registradas. Compartilhe seu link para começar.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Comissões</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Indicado</TableHead>
                <TableHead>Pagamento recebido</TableHead>
                <TableHead>Base</TableHead>
                <TableHead>Comissão</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.commissions.map((commission) => (
                <TableRow key={commission.id}>
                  <TableCell>{referralById.get(commission.referred_user_id)?.nome_completo || 'Indicado'}</TableCell>
                  <TableCell>{formatDate(commission.payment_received_at)}</TableCell>
                  <TableCell>{formatCurrency(commission.payment_amount)}</TableCell>
                  <TableCell>{formatCurrency(commission.commission_amount)} ({commission.commission_rate}%)</TableCell>
                  <TableCell>
                    <Badge variant={commission.status === 'paid' ? 'default' : commission.status === 'pending' ? 'secondary' : 'destructive'}>
                      {statusLabel[commission.status]}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {data.commissions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    As comissões aparecerão após pagamentos confirmados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
