import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Receipt, AlertTriangle, FileText, Users, TrendingUp, Package, BadgeDollarSign, Plus } from "lucide-react";
import { useLancamentos } from "@/hooks/useLancamentos";
import { useContasFixas } from "@/hooks/useContasFixas";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useSupabaseAgendamentos } from "@/hooks/useSupabaseAgendamentos";
import { useAgendamentos } from "@/hooks/useAgendamentos";
import { Lancamento, NovoLancamento } from "@/types/lancamento";
import { ContaFixa, NovaContaFixa } from "@/types/contaFixa";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatBRL } from "@/lib/formatters";
import { ArrowDownToLine, ArrowUpFromLine, CalendarClock, CircleAlert, FileChartColumn, LayoutDashboard } from "lucide-react";
import ResumoFinanceiro from "@/components/financeiro/ResumoFinanceiro";
import LancamentosList from "@/components/financeiro/LancamentosList";
import { LancamentosListMobile } from "@/components/financeiro/LancamentosListMobile";
import { ContasFixasListMobile } from "@/components/financeiro/ContasFixasListMobile";
import LancamentoForm from "@/components/financeiro/LancamentoForm";
import GraficoFinanceiro from "@/components/financeiro/GraficoFinanceiro";
import TabelaPagamentosClientes from "@/components/financeiro/TabelaPagamentosClientes";
import ContasFixasList from "@/components/financeiro/ContasFixasList";
import ContaFixaForm from "@/components/financeiro/ContaFixaForm";
import ContasReceber from "@/components/financeiro/ContasReceber";
import RelatoriosAvancados from "@/components/financeiro/RelatoriosAvancados";
import AvisosVencimento from "@/components/financeiro/AvisosVencimento";
import MovimentacoesProdutos from "@/components/financeiro/MovimentacoesProdutos";

type ViewMode = 'list' | 'form';
type FormType = 'lancamento' | 'conta_fixa';

export default function Financeiro() {
  const { isMobile } = useBreakpoint();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [formType, setFormType] = useState<FormType>('lancamento');
  const [activeTab, setActiveTab] = useState('visao-geral');
  const [lancamentoEditando, setLancamentoEditando] = useState<Lancamento | undefined>();
  const [contaEditando, setContaEditando] = useState<ContaFixa | undefined>();
  
  const {
    lancamentos,
    resumoFinanceiro,
    categorias,
    filtros,
    setFiltros,
    criarLancamento,
    atualizarLancamento,
    removerLancamento,
  } = useLancamentos();

  useSupabaseAgendamentos();
  const { todosAgendamentos: agendamentosEnriquecidos } = useAgendamentos();

  const agendamentos = useMemo(() => agendamentosEnriquecidos || [], [agendamentosEnriquecidos]);

  const {
    contasFixas,
    categorias: categoriasContasFixas,
    criarContaFixa,
    atualizarContaFixa,
    removerContaFixa,
    marcarComoPaga,
    toggleAtiva,
    criarCategoria,
  } = useContasFixas();

  // Contadores dinâmicos para as abas
  const counts = useMemo(() => {
    const hoje = new Date().toISOString().split('T')[0];
    
    return {
      lancamentosHoje: (lancamentos || []).filter(l => {
        try {
          const dataStr = l.data instanceof Date ? l.data.toISOString().split('T')[0] : String(l.data).split('T')[0];
          return dataStr === hoje;
        } catch {
          return false;
        }
      }).length,
      contasPendentes: (contasFixas || []).filter(c => c.status === 'em_aberto' && c.ativa).length,
      contasVencidas: (contasFixas || []).filter(c => {
        if (!c.ativa || c.status === 'pago') return false;
        try {
          if (!c.proximoVencimento) return false;
          const [ano, mes, dia] = c.proximoVencimento.slice(0, 10).split('-').map(Number);
          const vencimento = new Date(ano, mes - 1, dia);
          const hoje = new Date();
          hoje.setHours(0, 0, 0, 0);
          return Number.isFinite(vencimento.getTime()) && vencimento < hoje;
        } catch {
          return false;
        }
      }).length,
      receberPendentes: (agendamentos || []).filter(a =>
        (a.statusPagamento === 'em_aberto' || a.statusPagamento === 'parcial') && Number(a.valorDevido) > 0
      ).length,
    };
  }, [lancamentos, contasFixas, agendamentos]);

  const resumoComPendencias = useMemo(() => ({
    ...resumoFinanceiro,
    valorEmAberto: (agendamentos || [])
      .filter(a => a.status !== 'nao_compareceu' && (a.statusPagamento === 'em_aberto' || a.statusPagamento === 'parcial') && Number(a.valorDevido) > 0)
      .reduce((total, a) => total + Number(a.valorDevido || 0), 0),
    contasAPagar: (contasFixas || [])
      .filter(conta => conta.ativa && conta.status === 'em_aberto')
      .reduce((total, conta) => total + Number(conta.valor || 0), 0),
  }), [resumoFinanceiro, agendamentos, contasFixas]);

  const contasVencidas = useMemo(() => (contasFixas || [])
    .filter(conta => {
      if (!conta.ativa || conta.status === 'pago' || !conta.proximoVencimento) return false;
      const [ano, mes, dia] = conta.proximoVencimento.slice(0, 10).split('-').map(Number);
      const vencimento = new Date(ano, mes - 1, dia);
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      return Number.isFinite(vencimento.getTime()) && vencimento < hoje;
    })
    .sort((a, b) => new Date(a.proximoVencimento || '').getTime() - new Date(b.proximoVencimento || '').getTime()),
  [contasFixas]);

  const handleNovoLancamento = () => {
    setLancamentoEditando(undefined);
    setFormType('lancamento');
    setViewMode('form');
  };

  const handleNovaContaFixa = () => {
    setContaEditando(undefined);
    setFormType('conta_fixa');
    setViewMode('form');
  };

  const handleEditarLancamento = (lancamento: Lancamento) => {
    setLancamentoEditando(lancamento);
    setViewMode('form');
  };

  const handleSubmitLancamento = async (data: NovoLancamento) => {
    let sucesso = false;
    if (lancamentoEditando) {
      sucesso = await atualizarLancamento(lancamentoEditando.id, data);
    } else {
      sucesso = await criarLancamento(data);
    }
    
    if (sucesso) {
      setViewMode('list');
      setLancamentoEditando(undefined);
    }
    return sucesso;
  };

  const handleSubmitContaFixa = async (data: NovaContaFixa) => {
    if (contaEditando) {
      await atualizarContaFixa(contaEditando.id, data);
    } else {
      await criarContaFixa(data);
    }
    setViewMode('list');
    setContaEditando(undefined);
  };

  const handleCancelarForm = () => {
    setViewMode('list');
    setLancamentoEditando(undefined);
    setContaEditando(undefined);
  };

  if (viewMode === 'form') {
    if (formType === 'lancamento') {
      return (
        <div className="space-y-6">
          <LancamentoForm
            lancamento={lancamentoEditando}
            categorias={categorias.map(c => c.nome)}
            onSubmit={handleSubmitLancamento}
            onCancel={handleCancelarForm}
          />
        </div>
      );
    } else {
      return (
        <div className="space-y-6">
          <ContaFixaForm
            conta={contaEditando}
            categorias={categoriasContasFixas}
            onSubmit={handleSubmitContaFixa}
            onCancel={handleCancelarForm}
            onCreateCategoria={async (nome: string, cor?: string) => {
              await criarCategoria({ nome, tipo: 'despesa', cor });
            }}
          />
        </div>
      );
    }
  }

  return (
    <div className="space-y-5 p-3 sm:space-y-7 sm:p-0">
      {/* Header - Hidden on mobile as Layout already shows title */}
      <div className="overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-card via-card to-emerald-500/[0.06] shadow-sm">
        <div className="flex flex-col gap-5 p-5 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <Badge variant="secondary" className="mb-3 rounded-full px-3 py-1">
              <LayoutDashboard className="mr-1.5 h-3.5 w-3.5" />
              Gestão financeira
            </Badge>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Financeiro</h1>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Acompanhe resultados, pendências, pagamentos e relatórios em um só lugar.
            </p>
          </div>
          <div className="grid w-full grid-cols-2 gap-2 sm:w-auto">
            <Button onClick={handleNovoLancamento} className="h-11 rounded-xl">
              <Plus className="mr-2 h-4 w-4" />
              Lançamento
            </Button>
            <Button onClick={handleNovaContaFixa} variant="outline" className="h-11 rounded-xl bg-background">
              <CalendarClock className="mr-2 h-4 w-4" />
              Conta fixa
            </Button>
          </div>
        </div>
      </div>

      {/* Abas do Sistema Financeiro */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
        <ScrollArea className="w-full whitespace-nowrap pb-1">
          <TabsList className="inline-flex h-auto w-max min-w-full gap-1 rounded-2xl border border-border/60 bg-muted/50 p-1.5 backdrop-blur-sm xl:grid xl:w-full xl:grid-cols-8">
            <TabsTrigger
              value="visao-geral"
              className="min-h-[44px] rounded-xl px-3 text-xs transition-all data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm sm:text-sm"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Visão geral</span>
            </TabsTrigger>
            <TabsTrigger 
              value="lancamentos" 
              className={cn(
                "relative text-xs sm:text-sm min-h-[44px] px-3 sm:px-4 flex items-center gap-2 rounded-lg transition-all duration-200",
                "data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md"
              )}
            >
              <Receipt className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>Lançamentos</span>
              {counts.lancamentosHoje > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 min-w-[20px] px-1 bg-primary/10 text-primary border-none text-[10px] animate-in zoom-in duration-300">
                  {counts.lancamentosHoje}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="contas-fixas" 
              className={cn(
                "relative text-xs sm:text-sm min-h-[44px] px-3 sm:px-4 flex items-center gap-2 rounded-lg transition-all duration-200",
                "data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md"
              )}
            >
              <AlertTriangle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>Contas Fixas</span>
              {counts.contasPendentes > 0 && (
                <Badge 
                  variant="destructive" 
                  className={cn(
                    "ml-1 h-5 min-w-[20px] px-1 border-none text-[10px] animate-pulse",
                    counts.contasVencidas > 0 ? "bg-destructive text-destructive-foreground" : "bg-orange-500 text-white"
                  )}
                >
                  {counts.contasPendentes}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="produtos" 
              className={cn(
                "relative text-xs sm:text-sm min-h-[44px] px-3 sm:px-4 flex items-center gap-2 rounded-lg transition-all duration-200",
                "data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md"
              )}
            >
              <Package className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>Produtos</span>
            </TabsTrigger>
            <TabsTrigger 
              value="contas-receber" 
              className={cn(
                "relative text-xs sm:text-sm min-h-[44px] px-3 sm:px-4 flex items-center gap-2 rounded-lg transition-all duration-200",
                "data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md"
              )}
            >
              <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>A Receber</span>
              {counts.receberPendentes > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 min-w-[20px] px-1 bg-green-500/10 text-green-600 border-none text-[10px]">
                  {counts.receberPendentes}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="pagamentos" 
              className={cn(
                "relative text-xs sm:text-sm min-h-[44px] px-3 sm:px-4 flex items-center gap-2 rounded-lg transition-all duration-200",
                "data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md"
              )}
            >
              <BadgeDollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>Pagamentos</span>
            </TabsTrigger>
            <TabsTrigger 
              value="graficos" 
              className={cn(
                "relative text-xs sm:text-sm min-h-[44px] px-3 sm:px-4 flex items-center gap-2 rounded-lg transition-all duration-200",
                "data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md"
              )}
            >
              <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>Gráficos</span>
            </TabsTrigger>
            <TabsTrigger 
              value="relatorios" 
              className={cn(
                "relative text-xs sm:text-sm min-h-[44px] px-3 sm:px-4 flex items-center gap-2 rounded-lg transition-all duration-200",
                "data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md"
              )}
            >
              <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>Relatórios</span>
            </TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" className="md:hidden" />
        </ScrollArea>

        <TabsContent value="visao-geral" className="space-y-5 animate-fade-in">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold sm:text-xl">Resumo do mês</h2>
            <p className="text-sm text-muted-foreground">Indicadores principais e itens que precisam de atenção.</p>
          </div>

          <ResumoFinanceiro resumo={resumoComPendencias} />

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.8fr)]">
            <Card className="overflow-hidden rounded-3xl border-border/60 shadow-sm">
              <CardHeader className="border-b bg-muted/20 p-4 sm:p-5">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <CircleAlert className="h-5 w-5 text-amber-600" />
                  Atenção financeira
                </CardTitle>
                <CardDescription>Contas vencidas e valores aguardando recebimento.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5">
                <button
                  type="button"
                  onClick={() => setActiveTab('contas-fixas')}
                  className="rounded-2xl border border-rose-200/70 bg-rose-500/[0.04] p-4 text-left transition-colors hover:bg-rose-500/[0.08] dark:border-rose-900"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                      <ArrowUpFromLine className="h-5 w-5" />
                    </div>
                    <Badge variant={contasVencidas.length ? 'destructive' : 'secondary'} className="rounded-full">
                      {contasVencidas.length} vencidas
                    </Badge>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">Total vencido</p>
                  <p className="mt-1 text-xl font-bold">{formatBRL(contasVencidas.reduce((total, conta) => total + Number(conta.valor || 0), 0))}</p>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('contas-receber')}
                  className="rounded-2xl border border-amber-200/70 bg-amber-500/[0.04] p-4 text-left transition-colors hover:bg-amber-500/[0.08] dark:border-amber-900"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                      <ArrowDownToLine className="h-5 w-5" />
                    </div>
                    <Badge variant="secondary" className="rounded-full">
                      {counts.receberPendentes} pendentes
                    </Badge>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">A receber</p>
                  <p className="mt-1 text-xl font-bold">{formatBRL(resumoComPendencias.valorEmAberto)}</p>
                </button>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-border/60 shadow-sm">
              <CardHeader className="border-b bg-muted/20 p-4 sm:p-5">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <FileChartColumn className="h-5 w-5 text-primary" />
                  Análises e controle
                </CardTitle>
                <CardDescription>Acesse ferramentas para acompanhar e planejar.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2 p-4 sm:p-5">
                <Button variant="outline" className="h-11 justify-between rounded-xl" onClick={() => setActiveTab('graficos')}>
                  Gráficos e tendências <TrendingUp className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="h-11 justify-between rounded-xl" onClick={() => setActiveTab('relatorios')}>
                  Relatórios avançados <FileText className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="h-11 justify-between rounded-xl" onClick={() => setActiveTab('pagamentos')}>
                  Histórico de pagamentos <Receipt className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>

          <AvisosVencimento
            contasFixas={contasFixas}
            onPagarConta={(contaId: string) => marcarComoPaga(contaId)}
          />
        </TabsContent>

        <TabsContent value="lancamentos" className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg sm:text-xl font-semibold">Lançamentos Financeiros</h2>
            <Button 
              onClick={handleNovoLancamento}
              className="bg-gradient-to-r from-primary to-lilac-primary shadow-sm hover:shadow-md transition-all h-9 sm:h-10 text-xs sm:text-sm btn-touch"
            >
              <Plus className="mr-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Novo Lançamento</span>
              <span className="sm:hidden">Novo</span>
            </Button>
          </div>
          
          {isMobile ? (
            <LancamentosListMobile
              lancamentos={lancamentos}
              onEdit={handleEditarLancamento}
              onDelete={removerLancamento}
            />
          ) : (
            <LancamentosList
              lancamentos={lancamentos}
              filtros={filtros}
              categorias={categorias.map(c => c.nome)}
              onFiltrosChange={setFiltros}
              onEdit={handleEditarLancamento}
              onDelete={removerLancamento}
            />
          )}
        </TabsContent>

        <TabsContent value="contas-fixas" className="space-responsive-lg animate-fade-in">
          <div className="flex-responsive flex-responsive-row-sm items-start justify-between gap-4">
            <h2 className="text-responsive-xl font-semibold">Contas Fixas Mensais</h2>
            <Button 
              onClick={handleNovaContaFixa}
              className="bg-gradient-to-r from-primary to-lilac-primary btn-touch flex-shrink-0 hover-scale"
            >
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Nova Conta Fixa</span>
              <span className="sm:hidden">Nova</span>
            </Button>
          </div>
          
          {isMobile ? (
            <ContasFixasListMobile
              contas={contasFixas}
              onEdit={(conta) => {
                setContaEditando(conta);
                setFormType('conta_fixa');
                setViewMode('form');
              }}
              onDelete={removerContaFixa}
              onPagar={marcarComoPaga}
              onToggleAtiva={toggleAtiva}
            />
          ) : (
            <ContasFixasList
              contas={contasFixas}
              categorias={categoriasContasFixas}
              onEdit={(conta) => {
                setContaEditando(conta);
                setFormType('conta_fixa');
                setViewMode('form');
              }}
              onDelete={removerContaFixa}
              onPagar={marcarComoPaga}
              onToggleAtiva={toggleAtiva}
            />
          )}
        </TabsContent>

        <TabsContent value="produtos" className="space-responsive-lg animate-fade-in">
          <h2 className="text-responsive-xl font-semibold mb-4">Movimentações de Produtos</h2>
          <MovimentacoesProdutos />
        </TabsContent>

        <TabsContent value="contas-receber" className="space-responsive-lg animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-6 w-6 flex-shrink-0" />
            <h2 className="text-responsive-xl font-semibold">Contas a Receber</h2>
          </div>
          
          <ContasReceber agendamentos={agendamentos} />
        </TabsContent>

        <TabsContent value="pagamentos" className="space-responsive-lg animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <Receipt className="h-6 w-6 flex-shrink-0" />
            <h2 className="text-responsive-xl font-semibold">Pagamentos dos Clientes</h2>
          </div>
          
          <TabelaPagamentosClientes agendamentos={agendamentos} />
        </TabsContent>

        <TabsContent value="graficos" className="space-responsive-lg animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-6 w-6 flex-shrink-0" />
            <h2 className="text-responsive-xl font-semibold">Gráficos e Análises</h2>
          </div>
          
          <GraficoFinanceiro lancamentos={lancamentos} />
        </TabsContent>

        <TabsContent value="relatorios" className="space-responsive-lg animate-fade-in">
          <RelatoriosAvancados />
        </TabsContent>
      </Tabs>
    </div>
  );
}