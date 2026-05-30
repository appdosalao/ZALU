import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { adminApi, type AdminOverview, type AdminUserRow } from '@/hooks/useAdminApi';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RefreshCw, ShieldAlert } from 'lucide-react';

const parseCsv = (value: string | undefined) => {
  return (value || '')
    .split(',')
    .map((v) => v.trim().toLowerCase())
    .filter(Boolean);
};

export default function Admin() {
  const { user } = useSupabaseAuth();
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 50;

  const allowedEmails = useMemo(() => parseCsv(import.meta.env.VITE_ADMIN_EMAILS), []);
  const isAdminClient = useMemo(() => {
    const email = (user?.email || '').trim().toLowerCase();
    if (!email) return false;
    if (allowedEmails.length === 0) return false;
    return allowedEmails.includes(email);
  }, [allowedEmails, user?.email]);

  const loadOverview = async () => {
    setLoading(true);
    try {
      const data = await adminApi.overview();
      setOverview(data);
    } catch {
      toast.error('Sem permissão para acessar a área administrativa.');
      setOverview(null);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async (nextPage: number) => {
    setLoadingUsers(true);
    try {
      const data = await adminApi.users(nextPage, perPage);
      setUsers(data.users);
    } catch {
      toast.error('Não foi possível carregar usuários.');
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (!isAdminClient) return;
    void loadOverview();
    void loadUsers(page);
  }, [isAdminClient, page]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => {
      const email = (u.email || '').toLowerCase();
      const nome = (u.profile?.nome_completo || '').toLowerCase();
      const sala = (u.profile?.nome_personalizado_app || '').toLowerCase();
      return email.includes(q) || nome.includes(q) || sala.includes(q) || u.id.toLowerCase().includes(q);
    });
  }, [search, users]);

  const sendReset = async (id: string) => {
    try {
      await adminApi.sendPasswordReset(id);
      toast.success('E-mail de redefinição enviado.');
    } catch {
      toast.error('Falha ao enviar redefinição de senha.');
    }
  };

  if (!isAdminClient) {
    return (
      <div className="container-responsive p-3 sm:p-6 space-y-6">
        <Card className="border-destructive/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-destructive" />
              Acesso restrito
            </CardTitle>
            <CardDescription>
              Esta área é exclusiva do desenvolvedor/administrador. Configure VITE_ADMIN_EMAILS e ADMIN_EMAILS para habilitar o acesso.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container-responsive p-3 sm:p-6 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold">Admin</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Monitoramento, suporte e métricas do produto</p>
        </div>
        <Button onClick={() => void loadOverview()} disabled={loading} className="btn-touch">
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
          <CardContent className="text-2xl font-bold">{overview?.totalAccounts ?? '—'}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Ativas</CardTitle>
            <CardDescription>Últimos 30 dias</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{overview?.activeAccounts30d ?? '—'}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Inativas</CardTitle>
            <CardDescription>&gt; 30 dias sem acesso</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{overview?.inactiveAccounts30d ?? '—'}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Pagantes</CardTitle>
            <CardDescription>paid_access=true</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{overview?.payingUsers ?? '—'}</CardContent>
        </Card>
      </div>

      <div className="grid gap-3 sm:gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Usuários</CardTitle>
            <CardDescription>Busca por e-mail, nome, salão ou ID</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar..." />
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1 || loadingUsers}>
                  Anterior
                </Button>
                <Button variant="outline" onClick={() => setPage((p) => p + 1)} disabled={loadingUsers}>
                  Próxima
                </Button>
              </div>
            </div>

            <div className="rounded-md border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Último acesso</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        {loadingUsers ? 'Carregando...' : 'Nenhum usuário encontrado'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell className="min-w-[220px]">
                          <div className="font-medium">{u.email || '—'}</div>
                          <div className="text-xs text-muted-foreground truncate">{u.profile?.nome_personalizado_app || u.profile?.nome_completo || u.id}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant={u.profile?.paid_access ? 'default' : 'outline'}>
                              {u.profile?.paid_access ? 'Pago' : 'Não pago'}
                            </Badge>
                            {u.inactive30d ? <Badge variant="destructive">Inativo</Badge> : <Badge variant="secondary">Ativo</Badge>}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {(u.last_sign_in_at || u.created_at).slice(0, 10)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => void sendReset(u.id)}>
                            Redefinir senha
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Retenção</CardTitle>
            <CardDescription>Estimativas com base no perfil</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Trials iniciados</span>
              <span className="font-semibold">{overview?.trialStarted ?? '—'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Evasão pós-trial</span>
              <span className="font-semibold">{overview?.churnAfterTrial ?? '—'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">MRR estimado</span>
              <span className="font-semibold">
                {overview?.estimatedMrr != null ? `R$ ${overview.estimatedMrr.toFixed(2).replace('.', ',')}` : '—'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Receita acumulada (est.)</span>
              <span className="font-semibold">
                {overview?.estimatedCumulativeRevenue != null ? `R$ ${overview.estimatedCumulativeRevenue.toFixed(2).replace('.', ',')}` : '—'}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              Senhas não são acessíveis. A ação “Redefinir senha” apenas dispara um e-mail de recuperação.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

