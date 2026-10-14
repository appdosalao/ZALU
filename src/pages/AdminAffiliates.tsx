import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  Gift,
  Loader2,
  Pencil,
  RefreshCw,
  Search,
  Settings2,
  Users,
  Wallet,
} from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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

type CommissionMode = 'recurring' | 'first_payment';
type AffiliateSummary = {
  userId: string;
  name: string;
  email: string;
  referralCode: string;
  commissionRate: number;
  active: boolean;
  createdAt: string;
  totalReferrals: number;
  totalCommission: number;
  pendingCommission: number;
  paidCommission: number;
};
type AffiliateSettings = {
  defaultCommissionRate: number;
  commissionMode: CommissionMode;
};
type Commission = {
  id: string;
  referred_user_id: string;
  payment_reference: string;
  payment_amount: number;
  commission_rate: number;
  commission_amount: number;
  status: 'pending' | 'paid' | 'cancelled';
  payment_received_at: string;
  paid_at: string | null;
  cancelled_at: string | null;
};
type AffiliateReferral = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  subscriptionStatus: string | null;
  paidAccess: boolean;
  paidAt: string | null;
  commissions: Commission[];
};
type AffiliateDetail = {
  profile: {
    user_id: string;
    referral_code: string;
    commission_rate: number;
    active: boolean;
    created_at: string;
  };
  referrals: AffiliateReferral[];
};

const currency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
const date = (value: string | null) => value ? new Date(value).toLocaleDateString('pt-BR') : '—';

export default function AdminAffiliates() {
  const { session } = useSupabaseAuth();
  const [affiliates, setAffiliates] = useState<AffiliateSummary[]>([]);
  const [settings, setSettings] = useState<AffiliateSettings | null>(null);
  const [defaultRate, setDefaultRate] = useState('10');
  const [commissionMode, setCommissionMode] = useState<CommissionMode>('recurring');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState<AffiliateDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [editingAffiliate, setEditingAffiliate] = useState<AffiliateSummary | null>(null);
  const [editCode, setEditCode] = useState('');
  const [editRate, setEditRate] = useState('');
  const [savingAffiliate, setSavingAffiliate] = useState(false);
  const [affiliateToDeactivate, setAffiliateToDeactivate] = useState<AffiliateSummary | null>(null);
  const [commissionToPay, setCommissionToPay] = useState<Commission | null>(null);
  const [payingCommission, setPayingCommission] = useState(false);

  const request = useCallback(async (path: string, init?: RequestInit) => {
    if (!session?.access_token) throw new Error('Sua sessão expirou. Entre novamente no painel administrativo.');
    const response = await fetch(path, {
      ...init,
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
        ...init?.headers,
      },
    });
    return parseApiResponse<{ message?: string } & Record<string, unknown>>(response);
  }, [session?.access_token]);

  const loadAffiliates = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const result = await request('/api/admin/affiliates') as {
        settings: AffiliateSettings;
        affiliates: AffiliateSummary[];
      };
      setSettings(result.settings);
      setDefaultRate(String(result.settings.defaultCommissionRate));
      setCommissionMode(result.settings.commissionMode);
      setAffiliates(result.affiliates);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Não foi possível carregar os divulgadores.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [request]);

  useEffect(() => {
    void loadAffiliates();
  }, [loadAffiliates]);

  const loadDetail = async (affiliateId: string) => {
    setDetailLoading(true);
    try {
      const result = await request(`/api/admin/affiliates/${encodeURIComponent(affiliateId)}`) as AffiliateDetail;
      setDetail(result);
    } catch (detailError) {
      toast.error(detailError instanceof Error ? detailError.message : 'Não foi possível carregar os detalhes.');
    } finally {
      setDetailLoading(false);
    }
  };

  const saveSettings = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const rate = Number(defaultRate);
    if (!Number.isFinite(rate) || rate < 0 || rate > 100) {
      toast.error('A comissão padrão precisa estar entre 0% e 100%.');
      return;
    }
    setSavingSettings(true);
    try {
      await request('/api/admin/affiliates/settings', {
        method: 'PATCH',
        body: JSON.stringify({ defaultCommissionRate: rate, commissionMode }),
      });
      toast.success('Configuração global de comissões salva.');
      await loadAffiliates(true);
    } catch (saveError) {
      toast.error(saveError instanceof Error ? saveError.message : 'Não foi possível salvar as configurações.');
    } finally {
      setSavingSettings(false);
    }
  };

  const beginEdit = (affiliate: AffiliateSummary) => {
    setEditingAffiliate(affiliate);
    setEditCode(affiliate.referralCode);
    setEditRate(String(affiliate.commissionRate));
  };

  const saveAffiliate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingAffiliate) return;
    const rate = Number(editRate);
    const code = editCode.trim().toUpperCase();
    if (!/^[A-Z0-9]{6,8}$/.test(code)) {
      toast.error('O código precisa ter de 6 a 8 caracteres alfanuméricos.');
      return;
    }
    if (!Number.isFinite(rate) || rate < 0 || rate > 100) {
      toast.error('A comissão precisa estar entre 0% e 100%.');
      return;
    }

    setSavingAffiliate(true);
    try {
      await request(`/api/admin/affiliates/${encodeURIComponent(editingAffiliate.userId)}`, {
        method: 'POST',
        body: JSON.stringify({ active: editingAffiliate.active, referralCode: code, commissionRate: rate }),
      });
      toast.success('Código e comissão do divulgador atualizados.');
      setEditingAffiliate(null);
      await loadAffiliates(true);
      if (detail?.profile.user_id === editingAffiliate.userId) await loadDetail(editingAffiliate.userId);
    } catch (saveError) {
      toast.error(saveError instanceof Error ? saveError.message : 'Não foi possível salvar os dados do divulgador.');
    } finally {
      setSavingAffiliate(false);
    }
  };

  const setAffiliateActive = async (affiliate: AffiliateSummary, active: boolean) => {
    try {
      await request(`/api/admin/affiliates/${encodeURIComponent(affiliate.userId)}`, {
        method: 'POST',
        body: JSON.stringify({ active }),
      });
      toast.success(active ? 'Divulgador reativado.' : 'Divulgador desativado; histórico preservado.');
      setAffiliateToDeactivate(null);
      await loadAffiliates(true);
      if (detail?.profile.user_id === affiliate.userId) await loadDetail(affiliate.userId);
    } catch (actionError) {
      toast.error(actionError instanceof Error ? actionError.message : 'Não foi possível atualizar o divulgador.');
    }
  };

  const markCommissionPaid = async () => {
    if (!commissionToPay) return;
    setPayingCommission(true);
    try {
      await request(`/api/admin/affiliates/commissions/${encodeURIComponent(commissionToPay.id)}/pay`, {
        method: 'POST',
      });
      toast.success('Comissão marcada como paga com a data de hoje.');
      setCommissionToPay(null);
      await loadAffiliates(true);
      if (detail) await loadDetail(detail.profile.user_id);
    } catch (actionError) {
      toast.error(actionError instanceof Error ? actionError.message : 'Não foi possível registrar o pagamento.');
    } finally {
      setPayingCommission(false);
    }
  };

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return affiliates.filter((affiliate) => {
      const matches = !query
        || affiliate.name.toLowerCase().includes(query)
        || affiliate.email.toLowerCase().includes(query)
        || affiliate.referralCode.toLowerCase().includes(query);
      const statusMatches = activeFilter === 'all'
        || (activeFilter === 'active' && affiliate.active)
        || (activeFilter === 'inactive' && !affiliate.active);
      return matches && statusMatches;
    });
  }, [activeFilter, affiliates, search]);

  const pageSize = 10;
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const currentAffiliates = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totals = useMemo(() => ({
    referrals: affiliates.reduce((sum, affiliate) => sum + affiliate.totalReferrals, 0),
    pending: affiliates.reduce((sum, affiliate) => sum + affiliate.pendingCommission, 0),
    paid: affiliates.reduce((sum, affiliate) => sum + affiliate.paidCommission, 0),
  }), [affiliates]);

  useEffect(() => setPage(1), [search, activeFilter]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center gap-3 text-slate-200">
        <Loader2 className="h-6 w-6 animate-spin" /> Carregando divulgadores...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <Alert variant="destructive">
          <AlertTitle>Não foi possível carregar os divulgadores</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => void loadAffiliates(true)} disabled={refreshing}>
          <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} /> Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge variant="outline" className="mb-3 border-violet-300/30 bg-violet-400/10 text-violet-100">
            <Gift className="mr-1.5 h-3.5 w-3.5" /> Programa de indicação
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-white">Divulgadores</h1>
          <p className="mt-2 text-slate-300">Códigos, indicados e comissões em um só lugar.</p>
        </div>
        <Button
          variant="outline"
          onClick={() => void loadAffiliates(true)}
          disabled={refreshing}
          className="border-white/15 bg-slate-800 text-slate-100 hover:bg-slate-700 hover:text-white focus-visible:ring-violet-300"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} /> Atualizar
        </Button>
      </header>

      <form onSubmit={saveSettings}>
        <Card className="border-white/10 bg-slate-800/80 text-slate-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Settings2 className="h-5 w-5 text-violet-300" /> Configuração de comissões
            </CardTitle>
            <CardDescription className="text-slate-300">
              A taxa padrão vale para novos divulgadores; a alteração do modelo afeta novos pagamentos confirmados.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-[minmax(180px,0.6fr)_minmax(240px,1fr)_auto] sm:items-end">
            <div className="space-y-2">
              <Label htmlFor="default-commission-rate" className="text-slate-100">Comissão padrão (%)</Label>
              <Input
                id="default-commission-rate"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={defaultRate}
                onChange={(event) => setDefaultRate(event.target.value)}
                required
                className="border-white/15 bg-slate-950/50 text-white focus-visible:ring-violet-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="commission-mode" className="text-slate-100">Regra de geração</Label>
              <select
                id="commission-mode"
                value={commissionMode}
                onChange={(event) => setCommissionMode(event.target.value as CommissionMode)}
                className="h-10 w-full rounded-md border border-white/15 bg-slate-950/50 px-3 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
              >
                <option value="recurring">Recorrente enquanto houver pagamentos</option>
                <option value="first_payment">Somente no primeiro pagamento</option>
              </select>
            </div>
            <Button type="submit" disabled={savingSettings} className="bg-violet-500 text-white hover:bg-violet-400 focus-visible:ring-violet-300">
              {savingSettings ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
              Salvar configuração
            </Button>
            {settings && (
              <p className="text-xs text-slate-300 sm:col-span-3">
                Configuração atual: {settings.defaultCommissionRate}% · {settings.commissionMode === 'recurring' ? 'recorrente' : 'primeiro pagamento'}.
              </p>
            )}
          </CardContent>
        </Card>
      </form>

      <section className="grid gap-4 sm:grid-cols-3" aria-label="Resumo do programa de divulgação">
        <MetricCard icon={Users} label="Total de indicados" value={totals.referrals.toLocaleString('pt-BR')} />
        <MetricCard icon={Wallet} label="Comissões pendentes" value={currency(totals.pending)} />
        <MetricCard icon={Wallet} label="Comissões pagas" value={currency(totals.paid)} />
      </section>

      <Card className="border-white/10 bg-slate-800/80 text-slate-100">
        <CardHeader className="gap-4 border-b border-white/10">
          <div>
            <CardTitle className="text-white">Lista de divulgadores</CardTitle>
            <CardDescription className="mt-1 text-slate-300">
              Desativar preserva o código, as indicações e todo o histórico financeiro.
            </CardDescription>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                aria-label="Buscar divulgador por nome, e-mail ou código"
                placeholder="Buscar nome, e-mail ou código"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="border-white/15 bg-slate-950/50 pl-9 text-white placeholder:text-slate-400 focus-visible:ring-violet-300"
              />
            </div>
            <div className="flex gap-2">
              {([
                ['all', 'Todos'],
                ['active', 'Ativos'],
                ['inactive', 'Desativados'],
              ] as const).map(([value, label]) => (
                <Button
                  key={value}
                  type="button"
                  size="sm"
                  variant={activeFilter === value ? 'default' : 'outline'}
                  className={activeFilter === value
                    ? 'bg-violet-500 text-white hover:bg-violet-400'
                    : 'border-white/15 bg-slate-950/30 text-slate-200 hover:bg-white/10 hover:text-white'}
                  onClick={() => setActiveFilter(value)}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-slate-300">Divulgador</TableHead>
                  <TableHead className="text-slate-300">Código</TableHead>
                  <TableHead className="text-slate-300">Comissão</TableHead>
                  <TableHead className="text-slate-300">Indicados</TableHead>
                  <TableHead className="text-slate-300">Geradas</TableHead>
                  <TableHead className="text-slate-300">Pendentes</TableHead>
                  <TableHead className="text-slate-300">Pagas</TableHead>
                  <TableHead className="text-right text-slate-300">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentAffiliates.map((affiliate) => (
                  <TableRow key={affiliate.userId} className="border-white/5 hover:bg-white/[0.03]">
                    <TableCell className="min-w-52">
                      <div className="font-medium text-white">{affiliate.name}</div>
                      <div className="text-xs text-slate-300">{affiliate.email}</div>
                    </TableCell>
                    <TableCell className="font-mono font-semibold tracking-wider text-violet-100">{affiliate.referralCode}</TableCell>
                    <TableCell>{affiliate.commissionRate}%</TableCell>
                    <TableCell>{affiliate.totalReferrals}</TableCell>
                    <TableCell>{currency(affiliate.totalCommission)}</TableCell>
                    <TableCell>{currency(affiliate.pendingCommission)}</TableCell>
                    <TableCell>{currency(affiliate.paidCommission)}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label={`Ver detalhes de ${affiliate.name}`}
                          onClick={() => void loadDetail(affiliate.userId)}
                          className="text-slate-200 hover:bg-white/10 hover:text-white focus-visible:ring-violet-300"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label={`Editar código e comissão de ${affiliate.name}`}
                          onClick={() => beginEdit(affiliate)}
                          className="text-slate-200 hover:bg-white/10 hover:text-white focus-visible:ring-violet-300"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        {affiliate.active ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-white/15 bg-slate-950/30 text-slate-100 hover:bg-white/10 hover:text-white"
                            onClick={() => setAffiliateToDeactivate(affiliate)}
                          >
                            Desativar
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-emerald-300/30 bg-emerald-400/10 text-emerald-100 hover:bg-emerald-400/20 hover:text-white"
                            onClick={() => void setAffiliateActive(affiliate, true)}
                          >
                            Reativar
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {currentAffiliates.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="h-28 text-center text-slate-300">
                      {affiliates.length ? 'Nenhum divulgador corresponde à busca ou ao filtro.' : 'Ainda não há divulgadores. Use “Tornar divulgador” na lista de contas.'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {filtered.length > 0 && (
            <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4 text-sm text-slate-300 sm:flex-row sm:items-center sm:justify-between">
              <p aria-live="polite">
                Exibindo {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filtered.length)} de {filtered.length} divulgadores
              </p>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  aria-label="Página anterior"
                  className="border-white/15 bg-slate-950/30 text-slate-100 hover:bg-white/10 hover:text-white"
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                  disabled={currentPage <= 1}
                >
                  <ChevronLeft className="h-4 w-4" /> Anterior
                </Button>
                <span>Página {currentPage} de {pageCount}</span>
                <Button
                  size="sm"
                  variant="outline"
                  aria-label="Próxima página"
                  className="border-white/15 bg-slate-950/30 text-slate-100 hover:bg-white/10 hover:text-white"
                  onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
                  disabled={currentPage >= pageCount}
                >
                  Próxima <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!editingAffiliate} onOpenChange={(open) => !open && setEditingAffiliate(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar divulgador</DialogTitle>
            <DialogDescription>
              Alterações na taxa valem para os próximos pagamentos; as comissões existentes mantêm a taxa histórica registrada.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={saveAffiliate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-referral-code">Código de indicação</Label>
              <Input
                id="edit-referral-code"
                value={editCode}
                onChange={(event) => setEditCode(event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8))}
                minLength={6}
                maxLength={8}
                required
                autoComplete="off"
              />
              <p className="text-xs text-muted-foreground">Entre 6 e 8 caracteres alfanuméricos; o código precisa ser único.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-commission-rate">Comissão (%)</Label>
              <Input
                id="edit-commission-rate"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={editRate}
                onChange={(event) => setEditRate(event.target.value)}
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditingAffiliate(null)} disabled={savingAffiliate}>Cancelar</Button>
              <Button type="submit" disabled={savingAffiliate}>
                {savingAffiliate && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar alterações
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={detailLoading || !!detail} onOpenChange={(open) => !open && !detailLoading && setDetail(null)}>
        <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto">
          {detailLoading ? (
            <div className="flex min-h-48 items-center justify-center gap-3 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" /> Carregando indicados e comissões...
            </div>
          ) : detail ? (
            <>
              <DialogHeader>
                <DialogTitle>Indicados · {detail.profile.referral_code}</DialogTitle>
                <DialogDescription>
                  Código {detail.profile.active ? 'ativo' : 'desativado'} · {detail.profile.commission_rate}% por pagamento confirmado.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-5">
                <div>
                  <h3 className="mb-2 font-semibold">Contas indicadas</h3>
                  <div className="overflow-x-auto rounded-lg border">
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
                        {detail.referrals.map((referral) => (
                          <TableRow key={referral.id}>
                            <TableCell>
                              <div className="font-medium">{referral.name}</div>
                              <div className="text-xs text-muted-foreground">{referral.email}</div>
                            </TableCell>
                            <TableCell>{date(referral.createdAt)}</TableCell>
                            <TableCell>
                              <Badge variant={referral.paidAccess && referral.subscriptionStatus === 'active' ? 'default' : 'secondary'}>
                                {referral.paidAccess && referral.subscriptionStatus === 'active'
                                  ? 'Ativa'
                                  : referral.subscriptionStatus || 'Sem plano'}
                              </Badge>
                            </TableCell>
                            <TableCell>{date(referral.paidAt)}</TableCell>
                          </TableRow>
                        ))}
                        {!detail.referrals.length && (
                          <TableRow><TableCell colSpan={4} className="h-20 text-center text-muted-foreground">Nenhum indicado ainda.</TableCell></TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold">Pagamentos e comissões</h3>
                  <div className="overflow-x-auto rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Indicado</TableHead>
                          <TableHead>Data do pagamento</TableHead>
                          <TableHead>Valor pago</TableHead>
                          <TableHead>Comissão</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Ação</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {detail.referrals.flatMap((referral) => referral.commissions.map((commission) => (
                          <TableRow key={commission.id}>
                            <TableCell>{referral.name}</TableCell>
                            <TableCell>{date(commission.payment_received_at)}</TableCell>
                            <TableCell>{currency(commission.payment_amount)}</TableCell>
                            <TableCell>{currency(commission.commission_amount)} ({commission.commission_rate}%)</TableCell>
                            <TableCell>
                              <Badge variant={
                                commission.status === 'paid'
                                  ? 'default'
                                  : commission.status === 'pending'
                                    ? 'secondary'
                                    : 'destructive'
                              }>
                                {commission.status === 'pending' ? 'Pendente' : commission.status === 'paid' ? 'Paga' : 'Cancelada'}
                              </Badge>
                              {commission.paid_at && <div className="mt-1 text-xs text-muted-foreground">{date(commission.paid_at)}</div>}
                            </TableCell>
                            <TableCell>
                              {commission.status === 'pending' && (
                                <Button size="sm" variant="outline" onClick={() => setCommissionToPay(commission)}>
                                  Marcar paga
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        )))}
                        {!detail.referrals.some((referral) => referral.commissions.length > 0) && (
                          <TableRow><TableCell colSpan={6} className="h-20 text-center text-muted-foreground">Ainda não há pagamentos com comissão.</TableCell></TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!affiliateToDeactivate} onOpenChange={(open) => !open && setAffiliateToDeactivate(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Desativar este divulgador?</AlertDialogTitle>
            <AlertDialogDescription>
              O código deixará de gerar novas indicações e comissões. O cadastro, os indicados e o histórico de pagamentos serão preservados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                if (affiliateToDeactivate) void setAffiliateActive(affiliateToDeactivate, false);
              }}
            >
              Desativar divulgador
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!commissionToPay} onOpenChange={(open) => !open && !payingCommission && setCommissionToPay(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Registrar comissão como paga?</AlertDialogTitle>
            <AlertDialogDescription>
              {commissionToPay
                ? `Será salva a data de hoje para a comissão de ${currency(commissionToPay.commission_amount)}.`
                : 'Confirme o pagamento da comissão.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={payingCommission}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              disabled={payingCommission}
              onClick={(event) => {
                event.preventDefault();
                void markCommissionPaid();
              }}
            >
              {payingCommission && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirmar pagamento
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: string }) {
  return (
    <Card className="border-white/10 bg-slate-800/80 text-slate-100">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-300">{label}</CardTitle>
        <Icon className="h-4 w-4 text-violet-300" />
      </CardHeader>
      <CardContent><p className="text-2xl font-bold text-white">{value}</p></CardContent>
    </Card>
  );
}
