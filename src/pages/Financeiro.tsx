import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Plus, Receipt, AlertTriangle, FileText, Users, TrendingUp, Package, BadgeDollarSign } from "lucide-react";
import { useLancamentos } from "@/hooks/useLancamentos";
import { useContasFixas } from "@/hooks/useContasFixas";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useAgendamentos } from "@/hooks/useAgendamentos";
import { Lancamento, NovoLancamento } from "@/types/lancamento";
import { ContaFixa, NovaContaFixa } from "@/types/contaFixa";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
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
  const [activeTab, setActiveTab] = useState('lancamentos');
  const [lancamentoEditando, setLancamentoEditando] = useState<Lancamento | undefined>();
  const [contaEditando, setContaEditando] = useState<ContaFixa | undefined>();
  
  const {
    lancamentos,
    resumoFinanceiro,
    categorias,
    filtros,
    setFiltros,
    adicionarLancamento,
    atualizarLancamento,
    removerLancamento,
  } = useLancamentos();

  const { todosAgendamentos: agendamentosEnriquecidos } = useAgendamentos();
  
  // Usamos os enriquecidos para as listas e o raw filtrado para os contadores se necessário
  const agendamentos = useMemo(() => agendamentosEnriquecidos || [], [agendamentosEnriquecidos]);

  const { 
    contasFixas, 
    categorias: categoriasContasFixas, 
    criarContaFixa, 
    atualizarContaFixa, 
    removerContaFixa, 
    pagarContaFixa,
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
          const venc = c.proximoVencimento ? new Date(c.proximoVencimento) : null;
          return venc && venc < new Date();
        } catch {
          return false;
        }
      }).length,
      receberPendentes: (agendamentos || []).filter(a => a.statusPagamento === 'em_aberto' || a.statusPagamento === 'parcial').length,
    };
  }, [lancamentos, contasFixas, agendamentos]);

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
      sucesso = await adicionarLancamento(data);
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
    <div className="space-y-4 md:space-y-8">
      {/* Header - Hidden on mobile as Layout already shows title */}
      <div className="hidden md:flex flex-col gap-3 md:gap-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="page-title text-foreground">Financeiro</h1>
          <p className="page-description mt-1">
            Controle completo das finanças do seu salão
          </p>
        </div>
      </div>

      {/* Avisos de Vencimento */}
      <AvisosVencimento 
        contasFixas={contasFixas} 
        onPagarConta={(contaId: string) => pagarContaFixa(contaId)}
      />

      {/* Resumo Financeiro */}
      <ResumoFinanceiro resumo={resumoFinanceiro} />

      {/* Abas do Sistema Financeiro */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 md:space-y-8">
        <ScrollArea className="w-full whitespace-nowrap pb-1">
          <TabsList className="inline-flex h-auto w-max min-w-full md:w-full md:grid md:grid-cols-7 gap-1 p-1 bg-muted/50 backdrop-blur-sm rounded-xl border border-border/50">
            <TabsTrigger 
              value="lancamentos" 
              className={cn(
                "relative text-xs md:text-sm min-h-[44px] px-3 md:px-4 flex items-center gap-2 rounded-lg transition-all duration-200",
                "data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md"
              )}
            >
              <Receipt className="h-4 w-4" />
              <span>Lançamentos</span>
              {counts.lancamentosHoje > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 min-w-[20px] px-1 bg-primary/10 text-primary border-none text-2xs animate-in zoom-in duration-300">
                  {counts.lancamentosHoje}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="contas-fixas" 
              className={cn(
                "relative text-xs md:text-sm min-h-[44px] px-3 md:px-4 flex items-center gap-2 rounded-lg transition-all duration-200",
                "data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md"
              )}
            >
              <AlertTriangle className="h-4 w-4" />
              <span>Contas Fixas</span>
              {counts.contasPendentes > 0 && (
                <Badge 
                  variant="destructive" 
                  className={cn(
                    "ml-1 h-5 min-w-[20px] px-1 border-none text-2xs animate-pulse",
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
                "relative text-xs md:text-sm min-h-[44px] px-3 md:px-4 flex items-center gap-2 rounded-lg transition-all duration-200",
                "data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md"
              )}
            >
              <Package className="h-4 w-4" />
              <span>Produtos</span>
            </TabsTrigger>
            <TabsTrigger 
              value="contas-receber" 
              className={cn(
                "relative text-xs md:text-sm min-h-[44px] px-3 md:px-4 flex items-center gap-2 rounded-lg transition-all duration-200",
                "data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md"
              )}
            >
              <Users className="h-4 w-4" />
              <span>A Receber</span>
              {counts.receberPendentes > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 min-w-[20px] px-1 bg-green-500/10 text-green-600 border-none text-2xs">
                  {counts.receberPendentes}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="pagamentos" 
              className={cn(
                "relative text-xs md:text-sm min-h-[44px] px-3 md:px-4 flex items-center gap-2 rounded-lg transition-all duration-200",
                "data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md"
              )}
            >
              <BadgeDollarSign className="h-4 w-4" />
              <span>Pagamentos</span>
            </TabsTrigger>
            <TabsTrigger 
              value="graficos" 
              className={cn(
                "relative text-xs md:text-sm min-h-[44px] px-3 md:px-4 flex items-center gap-2 rounded-lg transition-all duration-200",
                "data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md"
              )}
            >
              <TrendingUp className="h-4 w-4" />
              <span>Gráficos</span>
            </TabsTrigger>
            <TabsTrigger 
              value="relatorios" 
              className={cn(
                "relative text-xs md:text-sm min-h-[44px] px-3 md:px-4 flex items-center gap-2 rounded-lg transition-all duration-200",
                "data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md"
              )}
            >
              <FileText className="h-4 w-4" />
              <span>Relatórios</span>
            </TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" className="md:hidden" />
        </ScrollArea>

        <TabsContent value="lancamentos" className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg md:text-xl font-semibold">Lançamentos Financeiros</h2>
            <Button 
              onClick={handleNovoLancamento}
              className="bg-gradient-to-r from-primary to-lilac-primary shadow-sm hover:shadow-md transition-all btn-touch"
            >
              <Plus className="mr-2 h-4 w-4 md:h-4 md:w-4" />
              <span className="hidden md:inline">Novo Lançamento</span>
              <span className="md:hidden">Novo</span>
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
              <span className="hidden md:inline">Nova Conta Fixa</span>
              <span className="md:hidden">Nova</span>
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
              onPagar={pagarContaFixa}
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
              onPagar={pagarContaFixa}
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
