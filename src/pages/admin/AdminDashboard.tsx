import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { adminApi, type AdminOverview } from '@/hooks/useAdminApi';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
  const [data, setData] = useState<AdminOverview | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminApi.overview();
      setData(res);
    } catch {
      toast.error('Sem permissão ou falha ao carregar dados do Admin.');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold">Visão geral</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Contas, retenção e estimativas de receita</p>
        </div>
        <Button onClick={() => void load()} disabled={loading} className="btn-touch">
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Contas</CardTitle>
            <CardDescription>Total cadastradas</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{data?.totalAccounts ?? '—'}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Ativas</CardTitle>
            <CardDescription>Últimos 30 dias</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{data?.activeAccounts30d ?? '—'}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Inativas</CardTitle>
            <CardDescription>&gt; 30 dias sem acesso</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{data?.inactiveAccounts30d ?? '—'}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Pagantes</CardTitle>
            <CardDescription>paid_access=true</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{data?.payingUsers ?? '—'}</CardContent>
        </Card>
      </div>

      <div className="grid gap-3 sm:gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Retenção</CardTitle>
            <CardDescription>Baseado em trial_start_date e paid_access</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Trials iniciados</span>
              <span className="font-semibold">{data?.trialStarted ?? '—'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Evasão pós-trial</span>
              <span className="font-semibold">{data?.churnAfterTrial ?? '—'}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Receita (estimativas)</CardTitle>
            <CardDescription>Sem tabela de transações, é aproximação</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Preço do plano</span>
              <span className="font-semibold">{data?.planPrice != null ? `R$ ${data.planPrice}` : '—'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">MRR estimado</span>
              <span className="font-semibold">
                {data?.estimatedMrr != null ? `R$ ${data.estimatedMrr.toFixed(2).replace('.', ',')}` : '—'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Acumulada (est.)</span>
              <span className="font-semibold">
                {data?.estimatedCumulativeRevenue != null
                  ? `R$ ${data.estimatedCumulativeRevenue.toFixed(2).replace('.', ',')}`
                  : '—'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notas</CardTitle>
            <CardDescription>Boas práticas</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <div>Senhas não são recuperáveis. Use redefinição por e-mail para suporte.</div>
            <div>Para “receita real”, crie uma tabela de transações do provedor e grave amount/moeda/eventos.</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

