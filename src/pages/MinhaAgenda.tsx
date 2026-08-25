import { useCallback, useEffect, useMemo, useState } from "react";
import { Calendar, Clock, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SearchInput } from "@/components/ui/search-input";
import { useAgendamentos } from "@/hooks/useAgendamentos";
import { useBuscaInteligenteAgenda, type RankingServicoItem } from "@/hooks/useBuscaInteligenteAgenda";
import AgendamentosList from "@/components/agendamentos/AgendamentosList";
import AgendamentoForm from "@/components/agendamentos/AgendamentoForm";
import AgendamentoDetalhes from "@/components/agendamentos/AgendamentoDetalhes";
import ReagendamentoDialog from "@/components/agendamentos/ReagendamentoDialog";
import TrocaHorarioDialog from "@/components/agendamentos/TrocaHorarioDialog";
import PagamentoDialog from "@/components/agendamentos/PagamentoDialog";
import ResultadosBuscaAgenda from "@/components/agendamentos/ResultadosBuscaAgenda";
import { AgendaDiaria } from "@/components/agenda/AgendaDiaria";
import { AgendaSemanal } from "@/components/agenda/AgendaSemanal";
import { AgendaMensal } from "@/components/agenda/AgendaMensal";
import type { Agendamento } from "@/types/agendamento";
import type { Cliente } from "@/types/cliente";
import type { Servico } from "@/types/servico";
import { useSearchParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

type Visualizacao = "lista" | "dia" | "semana" | "mes";
type VisualizacaoInterna = "lista" | "formulario" | "detalhes";

interface ResultadoBuscaState {
  pronto: boolean;
  clientesEncontrados: Cliente[];
  servicosEncontrados: Servico[];
  clienteSelecionadoId: string | null;
  servicoSelecionadoId: string | null;
  historico: Agendamento[];
  ranking: RankingServicoItem[];
}

const RESULTADO_BUSCA_VAZIO: ResultadoBuscaState = {
  pronto: false,
  clientesEncontrados: [],
  servicosEncontrados: [],
  clienteSelecionadoId: null,
  servicoSelecionadoId: null,
  historico: [],
  ranking: [],
};

export default function MinhaAgenda() {
  const [params, setParams] = useSearchParams();
  const tabParam = (params.get("tab") as Visualizacao) || "semana";
  const [tab, setTab] = useState<Visualizacao>(tabParam);
  const {
    agendamentos,
    agendamentosFiltrados,
    filtros,
    setFiltros,
    paginaAtual,
    setPaginaAtual,
    totalPaginas,
    clientes,
    servicos,
    criarAgendamento,
    atualizarAgendamento,
    excluirAgendamento,
    cancelarAgendamento,
    verificarConflito,
    todosAgendamentos,
  } = useAgendamentos();

  const [buscaTexto, setBuscaTexto] = useState("");
  const [visualizacaoAtual, setVisualizacaoAtual] = useState<VisualizacaoInterna>("lista");
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState<Agendamento | null>(null);
  const [dialogReagendamentoOpen, setDialogReagendamentoOpen] = useState(false);
  const [agendamentoParaReagendar, setAgendamentoParaReagendar] = useState<Agendamento | null>(null);
  const [dialogTrocaHorarioOpen, setDialogTrocaHorarioOpen] = useState(false);
  const [agendamentoParaTrocar, setAgendamentoParaTrocar] = useState<Agendamento | null>(null);
  const [dialogPagamentoOpen, setDialogPagamentoOpen] = useState(false);
  const [agendamentoParaPagar, setAgendamentoParaPagar] = useState<Agendamento | null>(null);
  const [initialForm, setInitialForm] = useState<any | null>(null);

  const {
    carregando: carregandoBusca,
    encontrarClientes,
    encontrarServicos,
    carregarHistoricoCliente,
    carregarRankingServico,
  } = useBuscaInteligenteAgenda();
  const [resultadoBusca, setResultadoBusca] = useState<ResultadoBuscaState>(RESULTADO_BUSCA_VAZIO);
  const termoBusca = buscaTexto.trim();
  const buscando = termoBusca.length >= 2;

  const enriquecerHistorico = useCallback(
    (lista: Agendamento[]): Agendamento[] =>
      lista.map((agendamento) => {
        const cliente = clientes.find((c) => c.id === agendamento.clienteId);
        const servico = servicos.find((s) => s.id === agendamento.servicoId);
        return {
          ...agendamento,
          clienteNome: cliente?.nome || cliente?.nomeCompleto || agendamento.clienteNome,
          servicoNome: servico?.nome || agendamento.servicoNome,
        };
      }),
    [clientes, servicos]
  );

  const enriquecerRanking = useCallback(
    (lista: RankingServicoItem[]): RankingServicoItem[] =>
      lista.map((item) => {
        const cliente = clientes.find((c) => c.id === item.clienteId);
        return {
          ...item,
          clienteNome: cliente?.nome || cliente?.nomeCompleto || 'Cliente removido',
          telefone: cliente?.telefone || '',
        };
      }),
    [clientes]
  );

  useEffect(() => {
    if (termoBusca.length < 2) {
      setResultadoBusca(RESULTADO_BUSCA_VAZIO);
      return;
    }

    let ativo = true;
    setResultadoBusca((prev) => ({ ...prev, pronto: false }));

    const timeout = setTimeout(async () => {
      const clientesEncontrados = encontrarClientes(termoBusca, clientes);
      const servicosEncontrados = encontrarServicos(termoBusca, servicos);
      const clienteId = clientesEncontrados[0]?.id ?? null;
      const servicoId = servicosEncontrados[0]?.id ?? null;

      const [historicoBruto, rankingBruto] = await Promise.all([
        clienteId ? carregarHistoricoCliente(clienteId) : Promise.resolve([]),
        servicoId ? carregarRankingServico(servicoId) : Promise.resolve([]),
      ]);

      if (!ativo) return;

      setResultadoBusca({
        pronto: true,
        clientesEncontrados,
        servicosEncontrados,
        clienteSelecionadoId: clienteId,
        servicoSelecionadoId: servicoId,
        historico: enriquecerHistorico(historicoBruto),
        ranking: enriquecerRanking(rankingBruto),
      });
    }, 300);

    return () => {
      ativo = false;
      clearTimeout(timeout);
    };
  }, [
    termoBusca,
    clientes,
    servicos,
    encontrarClientes,
    encontrarServicos,
    carregarHistoricoCliente,
    carregarRankingServico,
    enriquecerHistorico,
    enriquecerRanking,
  ]);

  const handleSelecionarClienteBusca = async (clienteId: string) => {
    const clienteEncontrado = clientes.find((c) => c.id === clienteId);
    if (!clienteEncontrado) return;

    setResultadoBusca((prev) => ({
      ...prev,
      pronto: false,
      clienteSelecionadoId: clienteId,
      clientesEncontrados: prev.clientesEncontrados.some((c) => c.id === clienteId)
        ? prev.clientesEncontrados
        : [...prev.clientesEncontrados, clienteEncontrado],
    }));

    const historicoBruto = await carregarHistoricoCliente(clienteId);
    setResultadoBusca((prev) => ({
      ...prev,
      pronto: true,
      historico: enriquecerHistorico(historicoBruto),
    }));
  };

  const handleSelecionarServicoBusca = async (servicoId: string) => {
    const servicoEncontrado = servicos.find((s) => s.id === servicoId);
    if (!servicoEncontrado) return;

    setResultadoBusca((prev) => ({
      ...prev,
      pronto: false,
      servicoSelecionadoId: servicoId,
      servicosEncontrados: prev.servicosEncontrados.some((s) => s.id === servicoId)
        ? prev.servicosEncontrados
        : [...prev.servicosEncontrados, servicoEncontrado],
    }));

    const rankingBruto = await carregarRankingServico(servicoId);
    setResultadoBusca((prev) => ({
      ...prev,
      pronto: true,
      ranking: enriquecerRanking(rankingBruto),
    }));
  };

  const clienteSelecionadoBusca = resultadoBusca.clienteSelecionadoId
    ? clientes.find((c) => c.id === resultadoBusca.clienteSelecionadoId) ?? null
    : null;
  const servicoSelecionadoBusca = resultadoBusca.servicoSelecionadoId
    ? servicos.find((s) => s.id === resultadoBusca.servicoSelecionadoId) ?? null
    : null;

  useEffect(() => {
    setParams(prev => {
      const p = new URLSearchParams(prev);
      p.set("tab", tab);
      return p;
    }, { replace: true });
    try { localStorage.setItem('minhaAgenda.tab', tab); } catch {
      // localStorage pode estar indisponível, ignora
    }
  }, [tab, setParams]);

  useEffect(() => {
    if (!params.get('tab')) {
      try {
        const saved = localStorage.getItem('minhaAgenda.tab') as Visualizacao | null;
        if (saved) setTab(saved);
      } catch {
        // localStorage pode estar indisponível, ignora
      }
    }
  }, []);

  const hoje = new Date().toISOString().split("T")[0];
  const amanha = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const inicioSemana = new Date();
  inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay());
  const fimSemana = new Date(inicioSemana);
  fimSemana.setDate(fimSemana.getDate() + 6);

  const agendamentosHoje = useMemo(
    () => agendamentosFiltrados.filter(ag => ag.data === hoje && ag.status !== "cancelado").length,
    [agendamentosFiltrados, hoje]
  );
  const agendamentosAmanha = useMemo(
    () => agendamentosFiltrados.filter(ag => ag.data === amanha && ag.status !== "cancelado").length,
    [agendamentosFiltrados, amanha]
  );
  const agendamentosEstaSemana = useMemo(() => {
    return agendamentosFiltrados.filter(ag => {
      const data = new Date(ag.data);
      return data >= inicioSemana && data <= fimSemana && ag.status !== "cancelado";
    }).length;
  }, [agendamentosFiltrados]);

  const handleNovoAgendamento = () => {
    setAgendamentoSelecionado(null);
    setVisualizacaoAtual("formulario");
    setTab("lista");
  };
  const handleEditarAgendamento = (agendamento: Agendamento) => {
    setAgendamentoSelecionado(agendamento);
    setVisualizacaoAtual("formulario");
    setTab("lista");
  };
  const handleVerDetalhes = (agendamento: Agendamento) => {
    setAgendamentoSelecionado(agendamento);
    setVisualizacaoAtual("detalhes");
    setTab("lista");
  };
  const handleSubmitFormulario = async (data: any) => {
    const sucesso = agendamentoSelecionado 
      ? await atualizarAgendamento(agendamentoSelecionado.id, data) 
      : await criarAgendamento({ ...data, origem: 'manual' });
    if (sucesso) {
      setVisualizacaoAtual("lista");
      setAgendamentoSelecionado(null);
    }
  };
  const handleVoltarParaLista = () => {
    setVisualizacaoAtual("lista");
    setAgendamentoSelecionado(null);
  };
  const handleCancelarAgendamento = () => {
    if (agendamentoSelecionado) {
      cancelarAgendamento(agendamentoSelecionado.id);
      setVisualizacaoAtual("lista");
      setAgendamentoSelecionado(null);
    }
  };
  const handleReagendar = (agendamento: Agendamento) => {
    setAgendamentoParaReagendar(agendamento);
    setDialogReagendamentoOpen(true);
  };
  const handleConfirmarReagendamento = async (agendamentoId: string, novaData: string, novaHora: string) => {
    const sucesso = await atualizarAgendamento(agendamentoId, { data: novaData, hora: novaHora });
    if (sucesso) {
      setDialogReagendamentoOpen(false);
      setAgendamentoParaReagendar(null);
    }
    return sucesso;
  };
  const handleTrocarHorario = (agendamento: Agendamento) => {
    setAgendamentoParaTrocar(agendamento);
    setDialogTrocaHorarioOpen(true);
  };
  const handleConfirmarTrocaHorario = async (agendamento1Id: string, agendamento2Id: string) => {
    try {
      const agendamento1 = todosAgendamentos.find(ag => ag.id === agendamento1Id);
      const agendamento2 = todosAgendamentos.find(ag => ag.id === agendamento2Id);
      if (!agendamento1 || !agendamento2) return false;
      const conflito1 = verificarConflito({ data: agendamento2.data, hora: agendamento2.hora, duracao: agendamento1.duracao }, agendamento2Id);
      if (conflito1) {
        toast({ title: "Conflito de horário", description: "O primeiro agendamento não cabe no novo horário.", variant: "destructive" });
        return false;
      }
      const conflito2 = verificarConflito({ data: agendamento1.data, hora: agendamento1.hora, duracao: agendamento2.duracao }, agendamento1Id);
      if (conflito2) {
        toast({ title: "Conflito de horário", description: "O segundo agendamento não cabe no novo horário.", variant: "destructive" });
        return false;
      }
      const s1 = await atualizarAgendamento(agendamento1Id, { data: agendamento2.data, hora: agendamento2.hora });
      const s2 = await atualizarAgendamento(agendamento2Id, { data: agendamento1.data, hora: agendamento1.hora });
      if (s1 && s2) {
        toast({ title: "Horários trocados", description: "Troca realizada com sucesso!" });
      }
      return s1 && s2;
    } catch {
      toast({ title: "Erro ao trocar horários", description: "Tente novamente.", variant: "destructive" });
      return false;
    }
  };
  const handleMarcarPagamento = (agendamento: Agendamento) => {
    setAgendamentoParaPagar(agendamento);
    setDialogPagamentoOpen(true);
  };
  const handleConfirmarPagamento = async (agendamentoId: string, valorPago: number, formaPagamento: string) => {
    const agendamento = todosAgendamentos.find(ag => ag.id === agendamentoId);
    if (!agendamento) return false;
    const novoValorPago = agendamento.valorPago + valorPago;
    const novoValorDevido = agendamento.valor - novoValorPago;
    let novoStatusPagamento: 'pago' | 'parcial' | 'em_aberto';
    let novoStatus = agendamento.status;
    if (novoValorDevido <= 0) {
      novoStatusPagamento = 'pago';
      novoStatus = 'concluido';
    } else if (novoValorPago > 0) {
      novoStatusPagamento = 'parcial';
    } else {
      novoStatusPagamento = 'em_aberto';
    }
    const sucesso = await atualizarAgendamento(agendamentoId, {
      valorPago: novoValorPago,
      valorDevido: Math.max(0, novoValorDevido),
      statusPagamento: novoStatusPagamento,
      status: novoStatus,
      formaPagamento: formaPagamento as any,
    });
    if (sucesso) {
      toast({
        title: "Pagamento registrado",
        description: novoStatusPagamento === 'pago'
          ? "Pagamento completo registrado com sucesso!"
          : `Pagamento parcial de R$ ${valorPago.toFixed(2)} registrado.`,
      });
      setDialogPagamentoOpen(false);
      setAgendamentoParaPagar(null);
      setTab("lista");
      setVisualizacaoAtual("lista");
    }
    return sucesso;
  };

  const formularioView = (
    <AgendamentoForm
      agendamento={agendamentoSelecionado || undefined}
      clientes={clientes}
      servicos={servicos}
      onSubmit={handleSubmitFormulario}
      onCancel={handleVoltarParaLista}
      verificarConflito={verificarConflito}
      initial={initialForm || undefined}
    />
  );
  const detalhesView = agendamentoSelecionado ? (
    <AgendamentoDetalhes
      agendamento={agendamentoSelecionado}
      cliente={{ nome: agendamentoSelecionado.clienteNome, telefone: "", email: "" }}
      servico={{ nome: agendamentoSelecionado.servicoNome }}
      onEdit={() => setVisualizacaoAtual("formulario")}
      onBack={handleVoltarParaLista}
      onCancel={handleCancelarAgendamento}
      onMarcarPagamento={() => agendamentoSelecionado && handleMarcarPagamento(agendamentoSelecionado)}
    />
  ) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-1 min-w-0">
          <h1 className="page-title text-foreground">Minha Agenda</h1>
          <p className="page-description">Organize, visualize e gerencie seus atendimentos</p>
        </div>
        <div className="flex flex-col md:flex-row gap-3">
          <SearchInput
            placeholder="Buscar cliente ou serviço..."
            className="w-full sm:w-64 md:w-72"
            value={buscaTexto}
            onChange={(e) => setBuscaTexto(e.target.value)}
          />
          <Button onClick={handleNovoAgendamento} className="w-full md:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Novo Agendamento
          </Button>
        </div>
      </div>

      {buscando ? (
        visualizacaoAtual === "formulario" ? (
          formularioView
        ) : visualizacaoAtual === "detalhes" && agendamentoSelecionado ? (
          detalhesView
        ) : (
          <ResultadosBuscaAgenda
          termo={buscaTexto}
          pronto={resultadoBusca.pronto}
          clientesEncontrados={resultadoBusca.clientesEncontrados}
          servicosEncontrados={resultadoBusca.servicosEncontrados}
          clienteSelecionado={clienteSelecionadoBusca}
          servicoSelecionado={servicoSelecionadoBusca}
          historico={resultadoBusca.historico}
          ranking={resultadoBusca.ranking}
          carregando={carregandoBusca}
          onSelecionarCliente={handleSelecionarClienteBusca}
          onSelecionarServico={handleSelecionarServicoBusca}
          onVerDetalhes={handleVerDetalhes}
          onLimparBusca={() => setBuscaTexto("")}
          />
      )) : (
        <>
      <div className="grid gap-3 md:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-lilac-light">
              <Calendar className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{agendamentosHoje}</p>
              <p className="text-xs text-muted-foreground">Hoje</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-lilac-primary to-pink-accent">
              <Clock className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{agendamentosAmanha}</p>
              <p className="text-xs text-muted-foreground">Amanhã</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-accent to-lavender">
              <Calendar className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{agendamentosEstaSemana}</p>
              <p className="text-xs text-muted-foreground">Esta Semana</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as Visualizacao)}>
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="lista">Lista</TabsTrigger>
          <TabsTrigger value="dia">Dia</TabsTrigger>
          <TabsTrigger value="semana">Semana</TabsTrigger>
          <TabsTrigger value="mes">Mês</TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="space-y-6">
          {visualizacaoAtual === "formulario" ? (
            formularioView
          ) : visualizacaoAtual === "detalhes" && agendamentoSelecionado ? (
            detalhesView
          ) : (
            <AgendamentosList
              agendamentos={agendamentos}
              filtros={{ ...filtros, busca: buscaTexto || filtros.busca }}
              onFiltrosChange={setFiltros}
              onEdit={handleEditarAgendamento}
              onDelete={excluirAgendamento}
              onCancel={cancelarAgendamento}
              onViewDetails={handleVerDetalhes}
              onReagendar={handleReagendar}
              onTrocarHorario={handleTrocarHorario}
              onMarcarPagamento={handleMarcarPagamento}
              clientes={clientes.map(c => ({ id: c.id, nome: c.nomeCompleto }))}
              paginaAtual={paginaAtual}
              totalPaginas={totalPaginas}
              onPaginaChange={setPaginaAtual}
            />
          )}
        </TabsContent>

        <TabsContent value="dia">
          <AgendaDiaria buscaTexto={buscaTexto} onSlotClick={(dataISO, hora) => {
            setInitialForm({ data: dataISO, hora, status: 'agendado', statusPagamento: 'em_aberto', formaPagamento: 'dinheiro' });
            setTab('lista');
            setVisualizacaoAtual('formulario');
          }} />
        </TabsContent>
        <TabsContent value="semana">
          <AgendaSemanal onSlotClick={(dataISO, hora) => {
            setInitialForm({ data: dataISO, hora, status: 'agendado', statusPagamento: 'em_aberto', formaPagamento: 'dinheiro' });
            setTab('lista');
            setVisualizacaoAtual('formulario');
          }} />
        </TabsContent>
        <TabsContent value="mes">
          <AgendaMensal />
        </TabsContent>
      </Tabs>
        </>
      )}

      <ReagendamentoDialog
        open={dialogReagendamentoOpen}
        onOpenChange={setDialogReagendamentoOpen}
        agendamento={agendamentoParaReagendar}
        onReagendar={handleConfirmarReagendamento}
        verificarConflito={verificarConflito}
      />

      <TrocaHorarioDialog
        open={dialogTrocaHorarioOpen}
        onOpenChange={setDialogTrocaHorarioOpen}
        agendamento={agendamentoParaTrocar}
        agendamentosDisponiveis={todosAgendamentos}
        onTrocarHorarios={handleConfirmarTrocaHorario}
      />

      <PagamentoDialog
        open={dialogPagamentoOpen}
        onOpenChange={setDialogPagamentoOpen}
        agendamento={agendamentoParaPagar}
        onConfirmar={handleConfirmarPagamento}
      />
    </div>
  );
}
