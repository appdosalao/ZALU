import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowUpRight,
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Loader2,
  RefreshCw,
  Search,
  UserRoundCheck,
  UserRoundX,
  Users,
} from 'lucide-react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type AdminCustomer = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  lastSignInAt: string | null;
  activity: 'active' | 'inactive';
  isTrial: boolean;
  isPaidActive: boolean;
  subscriptionStatus: string | null;
  planType: string | null;
  planName: string | null;
  productId: string | null;
  monthlyRevenue: number | null;
};

type AdminOverview = {
  generatedAt: string;
  summary: {
    totalCustomers: number;
    activeCustomers: number;
    inactiveCustomers: number;
    trialCustomers: number;
    paidCustomers: number;
    newCustomersThisMonth: number;
    paidCustomersWithoutPlan: number;
    estimatedMonthlyRevenue: number;
  };
  plans: { name: string; activeCustomers: number; monthlyRevenue: number }[];
  customers: AdminCustomer[];
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const formatDate = (value: string | null) =>
  value
    ? new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
    : 'Nunca acessou';

export default function AdminDashboard() {
  const { session } = useSupabaseAuth();
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'trial' | 'paid'>('all');

  const loadOverview = useCallback(async (isRefresh = false) => {
    if (!session?.access_token) {
      setError('Sua sessão expirou. Entre novamente para acessar o painel administrativo.');
      setLoading(false);
      return;
    }

    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/overview', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const responseBody = await response.text();
      const contentType = response.headers.get('content-type') ?? '';
      if (!contentType.toLowerCase().includes('application/json')) {
        if (/^\s*<!doctype html|^\s*<html/i.test(responseBody)) {
          throw new Error(
            'A rota administrativa não chegou ao backend e retornou a página do aplicativo. No ambiente local, inicie o servidor com “npm run server:dev”; em produção, verifique se o deploy inclui a função de API.'
          );
        }
        throw new Error(`A API administrativa retornou uma resposta inválida (HTTP ${response.status}).`);
      }

      let payload: AdminOverview & { message?: string };
      try {
        payload = JSON.parse(responseBody) as AdminOverview & { message?: string };
      } catch {
        throw new Error('A API administrativa retornou um JSON inválido. Tente novamente mais tarde.');
      }
      if (!response.ok) {
        throw new Error(payload.message || 'Não foi possível carregar os dados administrativos.');
      }
      setOverview(payload);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Erro inesperado ao carregar o painel.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [session?.access_token]);

  useEffect(() => {
    void loadOverview();
  }, [loadOverview]);

  const filteredCustomers = useMemo(() => {
    if (!overview) return [];
    const query = search.trim().toLowerCase();
    return overview.customers.filter((customer) => {
      const matchesQuery =
        !query ||
        customer.name.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query);
      const matchesFilter =
        filter === 'all' ||
        (filter === 'active' && customer.activity === 'active') ||
        (filter === 'inactive' && customer.activity === 'inactive') ||
        (filter === 'trial' && customer.isTrial) ||
        (filter === 'paid' && customer.isPaidActive);
      return matchesQuery && matchesFilter;
    });
  }, [filter, overview, search]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center gap-3 text-slate-300">
        <Loader2 className="h-6 w-6 animate-spin" />
        Carregando indicadores administrativos...
      </div>
    );
  }

  if (error || !overview) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <Alert variant="destructive" className="border-red-300/20 bg-red-950/40 text-red-100 [&>svg]:text-red-300">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Não foi possível abrir a área administrativa</AlertTitle>
          <AlertDescription className="text-red-100/75">{error || 'Os dados do painel não estão disponíveis.'}</AlertDescription>
        </Alert>
        <Button
          variant="outline"
          className="border-white/15 bg-slate-800 text-slate-100 hover:bg-slate-700 hover:text-white"
          onClick={() => void loadOverview(true)}
          disabled={refreshing}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Tentar novamente
        </Button>
      </div>
    );
  }

  const { summary } = overview;
  const cards = [
    {
      title: 'Contas cadastradas',
      value: summary.totalCustomers.toLocaleString('pt-BR'),
      detail: `+${summary.newCustomersThisMonth} neste mês`,
      icon: Users,
      color: 'text-primary',
    },
    {
      title: 'Ativos nos últimos 30 dias',
      value: summary.activeCustomers.toLocaleString('pt-BR'),
      detail: 'Com login recente',
      icon: UserRoundCheck,
      color: 'text-emerald-300',
    },
    {
      title: 'Inativos há mais de 30 dias',
      value: summary.inactiveCustomers.toLocaleString('pt-BR'),
      detail: 'Inclui contas que nunca acessaram',
      icon: UserRoundX,
      color: 'text-amber-300',
    },
    {
      title: 'Em período de teste',
      value: summary.trialCustomers.toLocaleString('pt-BR'),
      detail: 'Teste vigente de 7 dias',
      icon: Clock3,
      color: 'text-sky-300',
    },
    {
      title: 'Planos pagos ativos',
      value: summary.paidCustomers.toLocaleString('pt-BR'),
      detail: 'Assinatura ativa e acesso pago',
      icon: CheckCircle2,
      color: 'text-violet-300',
    },
  ];

  const filters: { value: typeof filter; label: string }[] = [
    { value: 'all', label: 'Todos' },
    { value: 'active', label: 'Ativos' },
    { value: 'inactive', label: 'Inativos' },
    { value: 'trial', label: 'Em teste' },
    { value: 'paid', label: 'Pagantes' },
  ];

  return (
    <div className="space-y-8">
      <section
        id="visao-geral"
        className="scroll-mt-24 overflow-hidden rounded-3xl border border-violet-300/15 bg-gradient-to-br from-violet-500/15 via-slate-800/90 to-slate-800 p-6 shadow-2xl shadow-black/10 sm:p-8"
      >
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-violet-200">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
              Visão geral da plataforma
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Central administrativa
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
              Acompanhe o crescimento do ZALU, a saúde das assinaturas e a atividade das contas em um só lugar.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Atualizado em</p>
              <p className="mt-1 text-sm font-semibold text-slate-100">
                {new Date(overview.generatedAt).toLocaleString('pt-BR', {
                  day: '2-digit',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <Button
              onClick={() => void loadOverview(true)}
              disabled={refreshing}
              className="h-12 rounded-xl bg-violet-500 px-5 text-white shadow-lg shadow-violet-950/30 hover:bg-violet-400"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Atualizar painel
            </Button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 rounded-2xl border border-white/10 bg-slate-950/35 p-5 sm:grid-cols-2 sm:items-center sm:p-6">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-violet-200">
              <CircleDollarSign className="h-4 w-4" />
              Receita recorrente mensal estimada
            </div>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {formatCurrency(summary.estimatedMonthlyRevenue)}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Estimativa baseada nos planos pagos ativos, com valores trimestrais e anuais rateados.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 sm:justify-end">
            <div className="min-w-36 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
              <p className="text-xs text-slate-400">Pagantes ativos</p>
              <p className="mt-1 text-xl font-semibold text-white">{summary.paidCustomers}</p>
            </div>
            <div className="min-w-36 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
              <p className="text-xs text-slate-400">Novos este mês</p>
              <p className="mt-1 flex items-center gap-1 text-xl font-semibold text-white">
                {summary.newCustomersThisMonth}
                <ArrowUpRight className="h-4 w-4 text-emerald-400" />
              </p>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Indicadores principais" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map(({ title, value, detail, icon: Icon, color }) => (
          <Card key={title} className="group rounded-2xl border-white/10 bg-slate-800/80 text-slate-100 shadow-lg shadow-black/10 transition-all hover:-translate-y-0.5 hover:border-violet-300/20 hover:bg-slate-800">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">{title}</CardTitle>
              <div className="rounded-xl border border-white/10 bg-slate-950/30 p-2">
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold tracking-tight text-white">{value}</p>
              <p className="mt-1 text-xs text-slate-500">{detail}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {summary.paidCustomersWithoutPlan > 0 && (
        <Alert className="border-amber-400/20 bg-amber-400/10 text-amber-100 [&>svg]:text-amber-300">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Existem assinaturas sem produto identificado</AlertTitle>
          <AlertDescription className="text-amber-100/75">
            {summary.paidCustomersWithoutPlan} conta(s) pagante(s) ativa(s) não têm um ID de produto
            reconhecido. Elas não entram no MRR estimado; confira se o webhook da Cakto já atualizou
            essas assinaturas.
          </AlertDescription>
        </Alert>
      )}

      <section aria-label="Assinaturas e resumo operacional" className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.8fr)]">
        <Card className="rounded-2xl border-white/10 bg-slate-800/80 text-slate-100 shadow-lg shadow-black/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <CalendarDays className="h-5 w-5 text-violet-300" />
              Planos ativos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {overview.plans.map((plan) => {
              const share = summary.paidCustomers
                ? (plan.activeCustomers / summary.paidCustomers) * 100
                : 0;
              return (
                <div key={plan.name} className="space-y-2">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-medium">{plan.name}</span>
                    <span className="text-slate-400">
                      {plan.activeCustomers} · {formatCurrency(plan.monthlyRevenue)}/mês
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-700">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-400 transition-all"
                      style={{ width: `${share}%` }}
                    />
                  </div>
                </div>
              );
            })}
            <p className="border-t border-white/10 pt-3 text-xs text-slate-500">
              Valores trimestral e anual rateados por mês. O MRR é uma estimativa, não o total
              efetivamente recebido no mês.
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-white/10 bg-slate-800/80 text-slate-100 shadow-lg shadow-black/10">
          <CardHeader>
            <CardTitle className="text-lg text-white">Resumo operacional</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-slate-400">Novos cadastros neste mês</span>
              <Badge variant="secondary" className="border border-emerald-300/20 bg-emerald-400/10 text-emerald-200">{summary.newCustomersThisMonth}</Badge>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-slate-400">Pagantes sem plano reconhecido</span>
              <Badge variant={summary.paidCustomersWithoutPlan ? 'destructive' : 'secondary'}>
                {summary.paidCustomersWithoutPlan}
              </Badge>
            </div>
            <p className="border-t border-white/10 pt-3 text-xs text-slate-500">
              A atividade considera o último login registrado no Supabase. Os dados são atualizados sob demanda.
            </p>
          </CardContent>
        </Card>
      </section>

      <Card id="contas-clientes" className="scroll-mt-24 rounded-2xl border-white/10 bg-slate-800/80 text-slate-100 shadow-lg shadow-black/10">
        <CardHeader className="gap-4 border-b border-white/10">
          <div>
            <CardTitle className="text-lg text-white">Contas de clientes</CardTitle>
            <p className="mt-1 text-sm text-slate-400">
              Situação de atividade e plano cadastrado por conta.
            </p>
          </div>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="border-white/10 bg-slate-950/40 pl-9 text-white placeholder:text-slate-500 focus-visible:ring-violet-400"
                placeholder="Buscar por nome ou e-mail"
                aria-label="Buscar por nome ou e-mail"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.map((item) => (
                <Button
                  key={item.value}
                  type="button"
                  size="sm"
                  variant={filter === item.value ? 'default' : 'outline'}
                  className={filter === item.value
                    ? 'rounded-lg bg-violet-500 text-white hover:bg-violet-400'
                    : 'rounded-lg border-white/10 bg-slate-950/30 text-slate-300 hover:bg-white/10 hover:text-white'}
                  onClick={() => setFilter(item.value)}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table className="text-slate-200">
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-slate-400">Conta</TableHead>
                <TableHead className="text-slate-400">Atividade</TableHead>
                <TableHead className="text-slate-400">Assinatura</TableHead>
                <TableHead className="text-slate-400">Plano</TableHead>
                <TableHead className="text-slate-400">Último acesso</TableHead>
                <TableHead className="text-slate-400">Cadastro</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id} className="border-white/5 hover:bg-white/[0.03]">
                  <TableCell className="min-w-52">
                    <div className="font-medium text-slate-100">{customer.name}</div>
                    <div className="text-xs text-slate-500">{customer.email}</div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={customer.activity === 'active'
                        ? 'border-emerald-300/20 bg-emerald-400/10 text-emerald-200'
                        : 'border-slate-600 bg-slate-700/40 text-slate-300'}
                    >
                      {customer.activity === 'active' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {customer.isTrial ? (
                      <Badge variant="outline" className="border-sky-300/20 bg-sky-400/10 text-sky-200">Em teste</Badge>
                    ) : customer.isPaidActive ? (
                      <Badge className="border-0 bg-violet-400/15 text-violet-200 hover:bg-violet-400/20">Plano ativo</Badge>
                    ) : (
                      <span className="text-sm text-slate-500">
                        {customer.subscriptionStatus === 'expired' ? 'Expirado' : 'Sem plano ativo'}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-slate-200">
                      {customer.planName || (customer.isPaidActive ? 'Não identificado' : '—')}
                    </span>
                    {customer.isPaidActive && customer.monthlyRevenue !== null && (
                      <div className="text-xs text-slate-500">
                        {formatCurrency(customer.monthlyRevenue)}/mês
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-slate-400">{formatDate(customer.lastSignInAt)}</TableCell>
                  <TableCell className="text-slate-400">{formatDate(customer.createdAt)}</TableCell>
                </TableRow>
              ))}
              {filteredCustomers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                    Nenhuma conta encontrada para esse filtro.
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
