import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { adminApi, type AdminAuditLogRow } from '@/hooks/useAdminApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function AdminAudit() {
  const [logs, setLogs] = useState<AdminAuditLogRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 50;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.auditLogs(page, perPage);
      setLogs(res.logs);
    } catch {
      toast.error('Não foi possível carregar auditoria.');
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Auditoria do Admin</CardTitle>
          <CardDescription>Registros de acesso e ações administrativas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1 || loading}>
              Anterior
            </Button>
            <Button variant="outline" onClick={() => setPage((p) => p + 1)} disabled={loading}>
              Próxima
            </Button>
          </div>

          <div className="rounded-md border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Ator</TableHead>
                  <TableHead>IP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      {loading ? 'Carregando...' : 'Sem registros'}
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((l) => (
                    <TableRow key={l.id}>
                      <TableCell className="text-sm text-muted-foreground">{l.created_at.slice(0, 19).replace('T', ' ')}</TableCell>
                      <TableCell className="font-medium">{l.action}</TableCell>
                      <TableCell className="text-sm">
                        <div>{l.actor_email || '—'}</div>
                        <div className="text-xs text-muted-foreground truncate">{l.actor_user_id || '—'}</div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{l.ip || '—'}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

