import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { adminApi, type AdminOverview } from '@/hooks/useAdminApi';

export default function AdminMetrics() {
  const [data, setData] = useState<AdminOverview | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await adminApi.overview();
        setData(res);
      } catch {
        toast.error('Não foi possível carregar métricas.');
      }
    };
    void run();
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-3xl font-bold">Métricas</h1>
        <p className="text-xs sm:text-sm text-muted-foreground">Visão consolidada para análise estratégica</p>
      </div>

      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Pagantes</CardTitle>
            <CardDescription>Usuários com acesso pago</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{data?.payingUsers ?? '—'}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">MRR estimado</CardTitle>
            <CardDescription>Planos ativos (aprox.)</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {data?.estimatedMrr != null ? `R$ ${data.estimatedMrr.toFixed(2).replace('.', ',')}` : '—'}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Receita acumulada (est.)</CardTitle>
            <CardDescription>Estimativa por paid_at</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {data?.estimatedCumulativeRevenue != null ? `R$ ${data.estimatedCumulativeRevenue.toFixed(2).replace('.', ',')}` : '—'}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Limitações</CardTitle>
          <CardDescription>O que falta para “receita real” e ROI</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <div>
            Hoje não existe tabela de transações do provedor (Cakto) com valores, moeda, chargebacks e eventos. Por isso as receitas aqui são estimadas.
          </div>
          <div>
            Para ROI (investimento em marketing), o ideal é gravar origem/campanha (UTM) no cadastro e eventos de conversão (trial_started, checkout_clicked, paid).
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

