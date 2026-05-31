import { r as reactExports } from './react-vendor-BpXfDOw7.js';
import { s as supabase } from './index-U74ij7JC.js';

const useSupabaseCronogramas = () => {
  const [cronogramas, setCronogramas] = reactExports.useState([]);
  const [retornos, setRetornos] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const loadCronogramas = async () => {
    try {
      setLoading(true);
      const { data, error: error2 } = await supabase.from("cronogramas_completos").select("*").order("created_at", { ascending: false });
      if (error2) throw error2;
      const formattedCronogramas = (data || []).map((item) => ({
        id_cronograma: item.id_cronograma,
        cliente_id: item.cliente_id,
        cliente_nome: item.cliente_nome,
        servico_id: item.servico_id,
        tipo_servico: item.tipo_servico,
        data_inicio: item.data_inicio,
        hora_inicio: item.hora_inicio,
        duracao_minutos: item.duracao_minutos,
        recorrencia: item.recorrencia,
        intervalo_dias: item.intervalo_dias,
        observacoes: item.observacoes,
        status: item.status,
        created_at: item.created_at,
        updated_at: item.updated_at,
        // Dados relacionados
        cliente_nome_real: item.cliente_nome_real,
        cliente_telefone: item.cliente_telefone,
        cliente_email: item.cliente_email,
        servico_nome_real: item.servico_nome_real,
        servico_valor: item.servico_valor,
        servico_duracao: item.servico_duracao,
        total_retornos: item.total_retornos || 0,
        retornos_pendentes: item.retornos_pendentes || 0,
        retornos_realizados: item.retornos_realizados || 0,
        proximo_retorno: item.proximo_retorno
      }));
      setCronogramas(formattedCronogramas);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar cronogramas");
    } finally {
      setLoading(false);
    }
  };
  const loadRetornos = async () => {
    try {
      const { data, error: error2 } = await supabase.from("retornos_completos").select("*").order("data_retorno", { ascending: true });
      if (error2) throw error2;
      const formattedRetornos = (data || []).map((item) => ({
        id_retorno: item.id_retorno,
        id_cliente: item.id_cliente,
        id_cronograma: item.id_cronograma,
        data_retorno: item.data_retorno,
        status: item.status,
        id_agendamento_retorno: item.id_agendamento_retorno,
        created_at: item.created_at,
        updated_at: item.updated_at,
        // Dados relacionados
        cliente_nome: item.cliente_nome,
        cliente_telefone: item.cliente_telefone,
        tipo_servico: item.tipo_servico,
        hora_inicio: item.hora_inicio,
        recorrencia: item.recorrencia,
        agendamento_data: item.agendamento_data,
        agendamento_hora: item.agendamento_hora,
        agendamento_status: item.agendamento_status
      }));
      setRetornos(formattedRetornos);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar retornos");
    }
  };
  const createCronograma = async (cronograma) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Usuário não autenticado");
      const { data, error: error2 } = await supabase.from("cronogramas_novos").insert({
        user_id: user.user.id,
        cliente_id: cronograma.cliente_id,
        cliente_nome: cronograma.cliente_nome,
        servico_id: cronograma.servico_id,
        tipo_servico: cronograma.tipo_servico,
        data_inicio: cronograma.data_inicio,
        hora_inicio: cronograma.hora_inicio,
        duracao_minutos: cronograma.duracao_minutos,
        recorrencia: cronograma.recorrencia,
        intervalo_dias: cronograma.intervalo_dias,
        observacoes: cronograma.observacoes,
        status: cronograma.status
      }).select().single();
      if (error2) throw error2;
      await loadCronogramas();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar cronograma");
      throw err;
    }
  };
  const updateCronograma = async (id, updates) => {
    try {
      const { error: error2 } = await supabase.from("cronogramas_novos").update(updates).eq("id_cronograma", id);
      if (error2) throw error2;
      await loadCronogramas();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar cronograma");
      throw err;
    }
  };
  const deleteCronograma = async (id) => {
    try {
      const { error: error2 } = await supabase.from("cronogramas_novos").delete().eq("id_cronograma", id);
      if (error2) throw error2;
      await loadCronogramas();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao deletar cronograma");
      throw err;
    }
  };
  const createRetorno = async (retorno) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Usuário não autenticado");
      const { data, error: error2 } = await supabase.from("retornos_novos").insert({
        user_id: user.user.id,
        id_cliente: retorno.id_cliente,
        id_cronograma: retorno.id_cronograma,
        data_retorno: retorno.data_retorno,
        status: retorno.status,
        id_agendamento_retorno: retorno.id_agendamento_retorno
      }).select().single();
      if (error2) throw error2;
      await loadRetornos();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar retorno");
      throw err;
    }
  };
  const updateRetorno = async (id, updates) => {
    try {
      const { error: error2 } = await supabase.from("retornos_novos").update(updates).eq("id_retorno", id);
      if (error2) throw error2;
      await loadRetornos();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar retorno");
      throw err;
    }
  };
  const criarAgendamentoDeRetorno = async (retornoId, dataAgendamento, horaAgendamento) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Usuário não autenticado");
      const retorno = retornos.find((r) => r.id_retorno === retornoId);
      if (!retorno) throw new Error("Retorno não encontrado");
      const { data: cronogramaData, error: cronogramaError } = await supabase.from("cronogramas_novos").select("*, servicos(*)").eq("id_cronograma", retorno.id_cronograma).single();
      if (cronogramaError) throw cronogramaError;
      const { data: agendamento, error: agendamentoError } = await supabase.from("agendamentos").insert({
        user_id: user.user.id,
        cliente_id: retorno.id_cliente,
        servico_id: cronogramaData.servico_id,
        data: dataAgendamento,
        hora: horaAgendamento,
        duracao: cronogramaData.duracao_minutos,
        valor: cronogramaData.servicos?.valor || 0,
        valor_devido: cronogramaData.servicos?.valor || 0,
        status: "agendado",
        observacoes: `Retorno do cronograma: ${cronogramaData.tipo_servico}`
      }).select().single();
      if (agendamentoError) throw agendamentoError;
      await updateRetorno(retornoId, {
        status: "Realizado",
        id_agendamento_retorno: agendamento.id
      });
      return agendamento;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar agendamento de retorno");
      throw err;
    }
  };
  reactExports.useEffect(() => {
    loadCronogramas();
    loadRetornos();
    const channel = supabase.channel("cronogramas-realtime").on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "cronogramas_novos"
      },
      () => {
        loadCronogramas();
      }
    ).on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "retornos_novos"
      },
      () => {
        loadRetornos();
        loadCronogramas();
      }
    ).on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "clientes"
      },
      () => {
        loadCronogramas();
      }
    ).on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "servicos"
      },
      () => {
        loadCronogramas();
      }
    ).on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "agendamentos"
      },
      () => {
        loadRetornos();
      }
    ).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  return {
    cronogramas,
    retornos,
    loading,
    error,
    createCronograma,
    updateCronograma,
    deleteCronograma,
    createRetorno,
    updateRetorno,
    criarAgendamentoDeRetorno,
    loadCronogramas,
    loadRetornos
  };
};

const useCronogramas = () => {
  const { cronogramas, createCronograma, updateCronograma, deleteCronograma, loading } = useSupabaseCronogramas();
  const createCronogramaLocal = async (cronograma) => {
    return await createCronograma(cronograma);
  };
  const updateCronogramaLocal = async (id, updates) => {
    return await updateCronograma(id, updates);
  };
  const deleteCronogramaLocal = async (id) => {
    return await deleteCronograma(id);
  };
  return {
    cronogramas,
    loading,
    error: null,
    createCronograma: createCronogramaLocal,
    updateCronograma: updateCronogramaLocal,
    deleteCronograma: deleteCronogramaLocal
  };
};
const useRetornos = () => {
  const { retornos, createRetorno, updateRetorno, loading } = useSupabaseCronogramas();
  const marcarRetornoRealizado = async (id, idAgendamento) => {
    await updateRetorno(id, {
      status: "Realizado",
      id_agendamento_retorno: idAgendamento
    });
  };
  const cancelarRetorno = async (id) => {
    await updateRetorno(id, { status: "Cancelado" });
  };
  const getRetornosPendentes = () => {
    return retornos.filter((r) => r.status === "Pendente");
  };
  const getRetornosPorCliente = (idCliente) => {
    return retornos.filter((r) => r.id_cliente === idCliente);
  };
  const getRetornosPorCronograma = (idCronograma) => {
    return retornos.filter((r) => r.id_cronograma === idCronograma);
  };
  return {
    retornos,
    loading,
    error: null,
    createRetorno,
    updateRetorno,
    marcarRetornoRealizado,
    cancelarRetorno,
    getRetornosPendentes,
    getRetornosPorCliente,
    getRetornosPorCronograma
  };
};

export { useRetornos as a, useCronogramas as u };
