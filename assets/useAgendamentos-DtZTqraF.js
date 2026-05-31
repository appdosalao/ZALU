import { u as useSupabaseAgendamentos } from './useSupabaseAgendamentos-Dyaw1aY1.js';
import { u as useServicos } from './useServicos-B9TSefLo.js';
import { u as useSupabaseClientes } from './useSupabaseClientes-Bu4CtR3z.js';
import { r as reactExports } from './react-vendor-BpXfDOw7.js';

const parseSafeDate = (data, hora) => {
  const [year, month, day] = data.split("-").map(Number);
  const [hours, minutes] = hora.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes);
};
function useAgendamentos() {
  const agendamentosData = useSupabaseAgendamentos();
  const { todosServicos: servicos } = useServicos();
  const { clientes } = useSupabaseClientes();
  const todosAgendamentos = reactExports.useMemo(() => {
    const agendamentos = agendamentosData.todosAgendamentos || [];
    return agendamentos.map((agendamento) => {
      const cliente = clientes.find((c) => c.id === agendamento.clienteId);
      const servico = servicos.find((s) => s.id === agendamento.servicoId);
      return {
        ...agendamento,
        clienteNome: cliente?.nome || cliente?.nomeCompleto || agendamento.clienteNome || "Cliente não encontrado",
        servicoNome: servico?.nome || agendamento.servicoNome || "Serviço não encontrado",
        servicoValor: servico?.valor || agendamento.valor || 0,
        servicoDuracao: servico?.duracao || agendamento.duracao || 30,
        // Informações adicionais para a agenda
        clienteEmail: cliente?.email || "",
        clienteTelefone: cliente?.telefone || "",
        servicoDescricao: servico?.descricao || ""
      };
    });
  }, [agendamentosData.todosAgendamentos, clientes, servicos]);
  const normalizeText = (text) => {
    return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  };
  const agendamentosFiltradosEnriquecidos = reactExports.useMemo(() => {
    const agendamentos = agendamentosData.agendamentosFiltrados || [];
    let resultado = agendamentos.map((agendamento) => {
      const cliente = clientes.find((c) => c.id === agendamento.clienteId);
      const servico = servicos.find((s) => s.id === agendamento.servicoId);
      return {
        ...agendamento,
        clienteNome: cliente?.nome || cliente?.nomeCompleto || agendamento.clienteNome || "Cliente não encontrado",
        servicoNome: servico?.nome || agendamento.servicoNome || "Serviço não encontrado",
        servicoValor: servico?.valor || agendamento.valor || 0,
        servicoDuracao: servico?.duracao || agendamento.duracao || 30,
        // Informações adicionais para a agenda
        clienteEmail: cliente?.email || "",
        clienteTelefone: cliente?.telefone || "",
        servicoDescricao: servico?.descricao || ""
      };
    });
    const busca = agendamentosData.filtros?.busca;
    if (busca && busca.trim()) {
      const termosNormalizados = normalizeText(busca).split(/\s+/).filter(Boolean);
      resultado = resultado.filter((ag) => {
        const textoCompleto = normalizeText(`${ag.clienteNome} ${ag.servicoNome} ${ag.clienteTelefone}`);
        return termosNormalizados.every((termo) => textoCompleto.includes(termo));
      });
    }
    return resultado;
  }, [agendamentosData.agendamentosFiltrados, agendamentosData.filtros?.busca, clientes, servicos]);
  const verificarConflito = (agendamento, excluirId) => {
    if (!agendamento.data || !agendamento.hora || !agendamento.duracao) {
      return false;
    }
    const dataHora = parseSafeDate(agendamento.data, agendamento.hora);
    const fimAgendamento = new Date(dataHora.getTime() + agendamento.duracao * 6e4);
    return agendamentosData.todosAgendamentos.some((ag) => {
      if (ag.id === excluirId) return false;
      if (ag.data !== agendamento.data) return false;
      const dataHoraExistente = parseSafeDate(ag.data, ag.hora);
      const fimExistente = new Date(dataHoraExistente.getTime() + ag.duracao * 6e4);
      return dataHora >= dataHoraExistente && dataHora < fimExistente || fimAgendamento > dataHoraExistente && fimAgendamento <= fimExistente || dataHora <= dataHoraExistente && fimAgendamento >= fimExistente;
    });
  };
  const criarAgendamento = async (novoAgendamento) => {
    const servico = servicos.find((s) => s.id === novoAgendamento.servicoId);
    if (!servico) {
      console.error("Serviço não encontrado");
      return false;
    }
    const origem = novoAgendamento.origem ?? "manual";
    if (origem !== "manual") {
      const horarioDisponivel = await agendamentosData.verificarHorarioDisponivel?.(
        novoAgendamento.data,
        novoAgendamento.hora
      );
      if (!horarioDisponivel) {
        console.error("Horário não está disponível nas configurações de trabalho");
        return false;
      }
    }
    const agendamentoCompleto = {
      ...novoAgendamento,
      duracao: servico.duracao,
      valor: novoAgendamento.valor || servico.valor,
      valorPago: novoAgendamento.valorPago || 0,
      valorDevido: novoAgendamento.valorDevido || novoAgendamento.valor || servico.valor,
      formaPagamento: novoAgendamento.formaPagamento || "fiado",
      statusPagamento: novoAgendamento.statusPagamento || "em_aberto",
      status: novoAgendamento.status || "agendado",
      origem: novoAgendamento.origem || "manual",
      confirmado: novoAgendamento.confirmado ?? false
    };
    return await agendamentosData.criarAgendamento(agendamentoCompleto);
  };
  const adicionarAgendamentosCronograma = () => {
    console.log("Agendamentos de cronograma são criados automaticamente");
  };
  return {
    ...agendamentosData,
    // Substituir os dados originais pelos enriquecidos
    todosAgendamentos,
    agendamentosFiltrados: agendamentosFiltradosEnriquecidos,
    // Dados auxiliares
    clientes,
    servicos,
    // Funções
    verificarConflito,
    criarAgendamento,
    adicionarAgendamentosCronograma,
    verificarHorarioDisponivel: agendamentosData.verificarHorarioDisponivel
  };
}

export { useAgendamentos as u };
