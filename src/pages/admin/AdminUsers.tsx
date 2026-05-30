import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { adminApi, type AdminUserRow } from '@/hooks/useAdminApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type Usage = Record<string, number>;

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 50;
  const [search, setSearch] = useState('');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selected, setSelected] = useState<AdminUserRow | null>(null);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [usageLoading, setUsageLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.users(page, perPage);
      setUsers(data.users);
    } catch {
      toast.error('Não foi possível carregar usuários.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    void load();
  }, [load]);

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

  const openDetails = async (row: AdminUserRow) => {
    setSelected(row);
    setUsage(null);
    setDetailsOpen(true);
    setUsageLoading(true);
    try {
      const data = await adminApi.usage(row.id);
      setUsage(data);
    } catch {
      toast.error('Falha ao carregar uso do usuário.');
    } finally {
      setUsageLoading(false);
    }
  };

  const sendReset = async (id: string) => {
    try {
      await adminApi.sendPasswordReset(id);
      toast.success('E-mail de redefinição enviado.');
    } catch {
      toast.error('Falha ao enviar redefinição de senha.');
    }
  };

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success('Copiado.');
    } catch {
      toast.error('Não foi possível copiar.');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Usuários</CardTitle>
          <CardDescription>Lista de contas com e-mails completos para suporte</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar..." />
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1 || loading}>
                Anterior
              </Button>
              <Button variant="outline" onClick={() => setPage((p) => p + 1)} disabled={loading}>
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
                      {loading ? 'Carregando...' : 'Nenhum usuário encontrado'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="min-w-[220px]">
                        <div className="font-medium">{u.email || '—'}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {u.profile?.nome_personalizado_app || u.profile?.nome_completo || u.id}
                        </div>
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
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" onClick={() => void openDetails(u)}>
                          Detalhes
                        </Button>
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

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do usuário</DialogTitle>
          </DialogHeader>
          {!selected ? null : (
            <div className="space-y-4">
              <div className="grid gap-2 sm:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Conta</CardTitle>
                    <CardDescription>ID e e-mail</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-sm">
                      <span className="text-muted-foreground">ID:</span> {selected.id}
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">E-mail:</span> {selected.email || '—'}
                    </div>
                    {selected.email ? (
                      <Button variant="outline" size="sm" onClick={() => void copy(selected.email as string)}>
                        Copiar e-mail
                      </Button>
                    ) : null}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Plano</CardTitle>
                    <CardDescription>Status e pagamento</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">paid_access:</span> {String(!!selected.profile?.paid_access)}
                    </div>
                    <div>
                      <span className="text-muted-foreground">subscription_status:</span> {selected.profile?.subscription_status || '—'}
                    </div>
                    <div>
                      <span className="text-muted-foreground">paid_at:</span> {(selected.profile?.paid_at || '—').slice(0, 10)}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Uso</CardTitle>
                  <CardDescription>Indicadores simples por volume de registros</CardDescription>
                </CardHeader>
                <CardContent>
                  {usageLoading ? (
                    <div className="text-sm text-muted-foreground">Carregando...</div>
                  ) : !usage ? (
                    <div className="text-sm text-muted-foreground">Sem dados</div>
                  ) : (
                    <div className="grid gap-2 sm:grid-cols-3 text-sm">
                      {Object.entries(usage).map(([k, v]) => (
                        <div key={k} className="flex items-center justify-between rounded-md border border-border p-2">
                          <span className="text-muted-foreground">{k}</span>
                          <span className="font-semibold">{v}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="text-xs text-muted-foreground">
                Senhas não são visíveis nem recuperáveis. Use “Redefinir senha” para suporte.
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

