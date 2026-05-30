import { r as reactExports, j as jsxRuntimeExports } from './react-vendor-BpXfDOw7.js';
import { u as useAgendamentos } from './useAgendamentos-CqqJ1YJQ.js';
import { u as useAgendamentoOnlineService } from './useAgendamentoOnlineService-BK8cjOUM.js';
import { C as Card, c as CardHeader, d as CardTitle, e as CardContent, g as Button, J as Jt } from './index-BxmTkSue.js';
import { S as ScrollArea } from './scroll-area-CnYv1PDO.js';
import { f as format } from './format-DsTNzci_.js';
import './useSupabaseAgendamentos-O5V4jZ47.js';
import './useServicos-D2x3NEpY.js';
import './useSupabaseClientes-BZkRJk2t.js';
import './ui-libs-BJEWQG8b.js';
import './chart-libs-Cdz70zdY.js';
import './index-BfAAoDv6.js';

const TesteAgendamentosPage = () => {
  const [logs, setLogs] = reactExports.useState([]);
  const {
    todosAgendamentos,
    clientes,
    servicos: servicosInternos,
    criarAgendamento: criarAgendamentoInterno
  } = useAgendamentos();
  const {
    servicos: servicosPublicos,
    carregarServicos: carregarServicosPublicos,
    calcularHorariosDisponiveis,
    criarAgendamento: criarAgendamentoPublico
  } = useAgendamentoOnlineService();
  const addLog = (msg) => {
    const time = (/* @__PURE__ */ new Date()).toLocaleTimeString();
    setLogs((prev) => [`[${time}] ${msg}`, ...prev]);
    console.log(`[TESTE] ${msg}`);
  };
  const testarListagemInterna = () => {
    addLog(`--- TESTE INTERNO: LISTAGEM ---`);
    addLog(`Agendamentos carregados: ${todosAgendamentos?.length || 0}`);
    addLog(`Clientes carregados: ${clientes?.length || 0}`);
    addLog(`Serviços internos carregados: ${servicosInternos?.length || 0}`);
    if (todosAgendamentos?.length > 0) {
      addLog(`Primeiro agendamento: ${JSON.stringify(todosAgendamentos[0])}`);
    }
  };
  const testarCriacaoInterna = async () => {
    addLog(`--- TESTE INTERNO: CRIAÇÃO ---`);
    if (!clientes?.length || !servicosInternos?.length) {
      addLog(`ERRO: Precisa ter clientes e serviços cadastrados para testar.`);
      Jt.error("Sem dados para teste interno");
      return;
    }
    const cliente = clientes[0];
    const servico = servicosInternos[0];
    const dataHoje = format(/* @__PURE__ */ new Date(), "yyyy-MM-dd");
    const horaTeste = "10:00";
    addLog(`Tentando criar agendamento para Cliente: ${cliente.nome} (${cliente.id})`);
    addLog(`Serviço: ${servico.nome} (${servico.id})`);
    addLog(`Data: ${dataHoje} ${horaTeste}`);
    try {
      const novoAgendamento = {
        clienteId: cliente.id,
        servicoId: servico.id,
        data: dataHoje,
        hora: horaTeste,
        origem: "manual",
        status: "agendado",
        observacoes: "Teste Automatizado Interno"
      };
      const result = await criarAgendamentoInterno(novoAgendamento);
      addLog(`Resultado da criação: ${JSON.stringify(result)}`);
      Jt.success("Teste de criação interna executado");
    } catch (error) {
      addLog(`ERRO ao criar agendamento interno: ${error.message}`);
      Jt.error("Erro no teste interno");
    }
  };
  const testarListagemPublica = async () => {
    addLog(`--- TESTE PÚBLICO: LISTAGEM ---`);
    try {
      await carregarServicosPublicos();
      addLog(`Função carregarServicosPublicos chamada.`);
    } catch (error) {
      addLog(`ERRO ao carregar serviços públicos: ${error.message}`);
    }
  };
  reactExports.useEffect(() => {
    if (servicosPublicos?.length > 0) {
      addLog(`Serviços públicos atualizados: ${servicosPublicos.length} encontrados.`);
    }
  }, [servicosPublicos]);
  const testarDisponibilidadePublica = async () => {
    addLog(`--- TESTE PÚBLICO: DISPONIBILIDADE ---`);
    if (!servicosPublicos?.length) {
      addLog(`ERRO: Carregue os serviços públicos primeiro.`);
      Jt.error("Carregue serviços primeiro");
      return;
    }
    const servico = servicosPublicos[0];
    const dataHoje = format(/* @__PURE__ */ new Date(), "yyyy-MM-dd");
    addLog(`Verificando horários para: ${servico.nome} (${servico.id}) em ${dataHoje}`);
    try {
      const horarios = await calcularHorariosDisponiveis(servico.id, dataHoje);
      addLog(`Horários encontrados: ${horarios.length}`);
      if (horarios.length > 0) {
        addLog(`Exemplos: ${horarios.slice(0, 3).map((h) => h.horario).join(", ")}...`);
      } else {
        addLog(`Nenhum horário disponível retornado.`);
      }
    } catch (error) {
      addLog(`ERRO ao verificar disponibilidade: ${error.message}`);
    }
  };
  const testarCriacaoPublica = async () => {
    addLog(`--- TESTE PÚBLICO: CRIAÇÃO ---`);
    if (!servicosPublicos?.length) {
      addLog(`ERRO: Carregue os serviços públicos primeiro.`);
      return;
    }
    const servico = servicosPublicos[0];
    const dataHoje = format(/* @__PURE__ */ new Date(), "yyyy-MM-dd");
    let horarioTeste = "14:00";
    try {
      const horarios = await calcularHorariosDisponiveis(servico.id, dataHoje);
      if (horarios.length > 0) {
        horarioTeste = horarios[0].horario;
      } else {
        addLog(`AVISO: Nenhum horário disponível encontrado. Tentando forçar 14:00.`);
      }
    } catch (e) {
      addLog(`Erro ao buscar horário, usando fallback 14:00`);
    }
    addLog(`Tentando criar agendamento PÚBLICO em ${dataHoje} às ${horarioTeste}`);
    const dadosAgendamento = {
      servico_id: servico.id,
      data: dataHoje,
      horario: horarioTeste,
      nome_completo: "Teste Público Automatizado",
      telefone: "11999999999",
      email: "teste@exemplo.com",
      observacoes: "Criado via Painel de Teste"
    };
    try {
      const sucesso = await criarAgendamentoPublico(dadosAgendamento);
      if (sucesso) {
        addLog(`SUCESSO: Agendamento público criado!`);
        Jt.success("Agendamento público criado");
      } else {
        addLog(`FALHA: criarAgendamento retornou false.`);
        Jt.error("Falha na criação pública");
      }
    } catch (error) {
      addLog(`ERRO EXCEÇÃO na criação pública: ${error.message}`);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto p-6 space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold mb-6", children: "Painel de Teste de Integração" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Hook Interno (useAgendamentos)" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-muted rounded-md text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
              "Status: ",
              todosAgendamentos ? "Carregado" : "Carregando..."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
              "Agendamentos: ",
              todosAgendamentos?.length || 0
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: testarListagemInterna, className: "w-full", children: "1. Testar Listagem (Log)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: testarCriacaoInterna, variant: "secondary", className: "w-full", children: "2. Testar Criação (Mock)" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Hook Público (useAgendamentoOnlineService)" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-muted rounded-md text-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            "Serviços Públicos: ",
            servicosPublicos?.length || 0
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: testarListagemPublica, className: "w-full", children: "1. Carregar Serviços" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: testarDisponibilidadePublica, variant: "outline", className: "w-full", children: "2. Verificar Disponibilidade (Hoje)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: testarCriacaoPublica, variant: "secondary", className: "w-full", children: "3. Testar Criação (Mock)" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "h-96", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Logs de Execução" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "h-64 w-full rounded-md border p-4 font-mono text-sm", children: logs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Nenhum teste executado ainda..." }) : logs.map((log, index) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-1 border-b border-border/50 pb-1 last:border-0", children: log }, index)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => setLogs([]), variant: "ghost", size: "sm", className: "mt-2", children: "Limpar Logs" })
      ] })
    ] })
  ] });
};

export { TesteAgendamentosPage as default };
