import { r as reactExports } from './react-vendor-BpXfDOw7.js';
import { s as supabase } from './index-U74ij7JC.js';

const useSupabaseLancamentos = () => {
  const [lancamentos, setLancamentos] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const loadLancamentos = async (dataInicioParam, dataFimParam) => {
    try {
      setLoading(true);
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;
      let query = supabase.from("lancamentos").select("*").eq("user_id", user.user.id);
      if (dataInicioParam) {
        query = query.gte("data", dataInicioParam);
      } else {
        const noventaDiasAtras = /* @__PURE__ */ new Date();
        noventaDiasAtras.setDate(noventaDiasAtras.getDate() - 90);
        const dataFiltro = noventaDiasAtras.toISOString().split("T")[0];
        query = query.gte("data", dataFiltro);
      }
      if (dataFimParam) {
        query = query.lte("data", dataFimParam);
      }
      const { data, error: error2 } = await query.order("data", { ascending: false });
      if (error2) throw error2;
      const formattedLancamentos = (data || []).map((item) => ({
        id: item.id,
        tipo: item.tipo,
        valor: Number(item.valor),
        data: new Date(item.data),
        descricao: item.descricao,
        categoria: item.categoria,
        origemId: item.origem_id,
        origemTipo: item.origem_tipo,
        clienteId: item.cliente_id,
        created_at: new Date(item.created_at),
        updated_at: new Date(item.updated_at)
      }));
      setLancamentos(formattedLancamentos);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar lançamentos");
    } finally {
      setLoading(false);
    }
  };
  const createLancamento = async (lancamento) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Usuário não autenticado");
      const { data, error: error2 } = await supabase.from("lancamentos").insert({
        user_id: user.user.id,
        tipo: lancamento.tipo,
        valor: lancamento.valor,
        data: lancamento.data.toISOString().split("T")[0],
        descricao: lancamento.descricao,
        categoria: lancamento.categoria,
        origem_id: lancamento.origemId,
        origem_tipo: lancamento.origemTipo,
        cliente_id: lancamento.clienteId
      }).select().single();
      if (error2) throw error2;
      await loadLancamentos();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar lançamento");
      return false;
    }
  };
  const updateLancamento = async (id, updates) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Usuário não autenticado");
      const updateData = {};
      if (updates.tipo) updateData.tipo = updates.tipo;
      if (updates.valor !== void 0) updateData.valor = updates.valor;
      if (updates.data) updateData.data = updates.data.toISOString().split("T")[0];
      if (updates.descricao) updateData.descricao = updates.descricao;
      if (updates.categoria !== void 0) updateData.categoria = updates.categoria;
      if (updates.origemId !== void 0) updateData.origem_id = updates.origemId;
      if (updates.origemTipo !== void 0) updateData.origem_tipo = updates.origemTipo;
      if (updates.clienteId !== void 0) updateData.cliente_id = updates.clienteId;
      const { error: error2 } = await supabase.from("lancamentos").update(updateData).eq("id", id).eq("user_id", user.user.id);
      if (error2) throw error2;
      await loadLancamentos();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar lançamento");
      return false;
    }
  };
  const deleteLancamento = async (id) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Usuário não autenticado");
      const { error: error2 } = await supabase.from("lancamentos").delete().eq("id", id).eq("user_id", user.user.id);
      if (error2) throw error2;
      await loadLancamentos();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao deletar lançamento");
      throw err;
    }
  };
  const createLancamentoFromAgendamento = async (agendamento) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Usuário não autenticado");
      const { data, error: error2 } = await supabase.from("lancamentos").insert({
        user_id: user.user.id,
        tipo: "entrada",
        valor: agendamento.valorPago || agendamento.valor,
        data: agendamento.data,
        descricao: `Agendamento: ${agendamento.clienteNome || "Cliente"} - ${agendamento.servicoNome || "Serviço"}`,
        categoria: "Serviços",
        origem_id: agendamento.id,
        origem_tipo: "agendamento",
        cliente_id: agendamento.clienteId
      }).select().single();
      if (error2) throw error2;
      await loadLancamentos();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar lançamento de agendamento");
      throw err;
    }
  };
  const createLancamentoFromContaFixa = async (contaFixa, valorPago, dataPagamento) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Usuário não autenticado");
      const { data, error: error2 } = await supabase.from("lancamentos").insert({
        user_id: user.user.id,
        tipo: "saida",
        valor: valorPago,
        data: dataPagamento.toISOString().split("T")[0],
        descricao: `Pagamento: ${contaFixa.nome}`,
        categoria: contaFixa.categoria,
        origem_id: contaFixa.id,
        origem_tipo: "conta_fixa"
      }).select().single();
      if (error2) throw error2;
      await loadLancamentos();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar lançamento de conta fixa");
      throw err;
    }
  };
  const filterLancamentos = (filtros) => {
    return lancamentos.filter((lancamento) => {
      if (filtros.tipo && filtros.tipo !== "todos" && lancamento.tipo !== filtros.tipo) {
        return false;
      }
      if (filtros.categoria && lancamento.categoria !== filtros.categoria) {
        return false;
      }
      if (filtros.dataInicio && lancamento.data < filtros.dataInicio) {
        return false;
      }
      if (filtros.dataFim && lancamento.data > filtros.dataFim) {
        return false;
      }
      if (filtros.mes !== void 0 && filtros.ano !== void 0) {
        const lancamentoMes = lancamento.data.getMonth();
        const lancamentoAno = lancamento.data.getFullYear();
        if (lancamentoMes !== filtros.mes || lancamentoAno !== filtros.ano) {
          return false;
        }
      }
      return true;
    });
  };
  const calculateResumoFinanceiro = () => {
    const agora = /* @__PURE__ */ new Date();
    const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);
    const fimMes = new Date(agora.getFullYear(), agora.getMonth() + 1, 0);
    const lancamentosMesAtual = lancamentos.filter((l) => {
      const dataLancamento = new Date(l.data);
      return dataLancamento >= inicioMes && dataLancamento <= fimMes;
    });
    const totalEntradas = lancamentosMesAtual.filter((l) => l.tipo === "entrada").reduce((sum, l) => sum + l.valor, 0);
    const totalSaidas = lancamentosMesAtual.filter((l) => l.tipo === "saida").reduce((sum, l) => sum + l.valor, 0);
    return {
      totalEntradas,
      totalSaidas,
      lucro: totalEntradas - totalSaidas,
      valorEmAberto: 0,
      // Seria calculado com base em agendamentos não pagos
      contasAPagar: 0
      // Seria calculado com base em contas fixas em aberto
    };
  };
  reactExports.useEffect(() => {
    loadLancamentos();
    const channel = supabase.channel("lancamentos-realtime").on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "lancamentos"
      },
      () => {
        loadLancamentos();
      }
    ).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  return {
    lancamentos,
    loading,
    error,
    createLancamento,
    updateLancamento,
    deleteLancamento,
    filterLancamentos,
    calculateResumoFinanceiro,
    createLancamentoFromAgendamento,
    createLancamentoFromContaFixa,
    loadLancamentos
  };
};

const useSupabaseContasFixas = () => {
  const [contasFixas, setContasFixas] = reactExports.useState([]);
  const [categorias, setCategorias] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const loadContasFixas = async () => {
    try {
      setLoading(true);
      const { data, error: error2 } = await supabase.from("contas_fixas").select("*").order("created_at", { ascending: false });
      if (error2) throw error2;
      const formattedContas = (data || []).map((item) => ({
        id: item.id,
        nome: item.nome,
        valor: Number(item.valor),
        dataVencimento: item.data_vencimento,
        categoria: item.categoria,
        status: item.status,
        observacoes: item.observacoes,
        repetir: item.repetir,
        frequencia: item.frequencia,
        proximoVencimento: item.proximo_vencimento,
        ativa: item.ativa,
        created_at: new Date(item.created_at),
        updated_at: new Date(item.updated_at)
      }));
      setContasFixas(formattedContas);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar contas fixas");
    } finally {
      setLoading(false);
    }
  };
  const loadCategorias = async () => {
    try {
      const { data, error: error2 } = await supabase.from("categorias_financeiras").select("*").order("nome");
      if (error2) throw error2;
      const formattedCategorias = (data || []).map((item) => ({
        id: item.id,
        nome: item.nome,
        tipo: item.tipo,
        cor: item.cor,
        created_at: new Date(item.created_at),
        updated_at: new Date(item.updated_at)
      }));
      setCategorias(formattedCategorias);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar categorias");
    }
  };
  const createContaFixa = async (conta) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Usuário não autenticado");
      const hoje = /* @__PURE__ */ new Date();
      let proximoVencimento = new Date(hoje.getFullYear(), hoje.getMonth(), conta.dataVencimento);
      if (proximoVencimento <= hoje) {
        proximoVencimento.setMonth(proximoVencimento.getMonth() + 1);
      }
      const { data, error: error2 } = await supabase.from("contas_fixas").insert({
        user_id: user.user.id,
        nome: conta.nome,
        valor: conta.valor,
        data_vencimento: conta.dataVencimento,
        categoria: conta.categoria,
        observacoes: conta.observacoes,
        repetir: conta.repetir,
        frequencia: conta.frequencia,
        proximo_vencimento: proximoVencimento.toISOString().split("T")[0],
        ativa: conta.ativa ?? true
      }).select().single();
      if (error2) throw error2;
      await loadContasFixas();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar conta fixa");
      throw err;
    }
  };
  const updateContaFixa = async (id, updates) => {
    try {
      const updateData = {};
      if (updates.nome) updateData.nome = updates.nome;
      if (updates.valor !== void 0) updateData.valor = updates.valor;
      if (updates.dataVencimento !== void 0) updateData.data_vencimento = updates.dataVencimento;
      if (updates.categoria) updateData.categoria = updates.categoria;
      if (updates.status) updateData.status = updates.status;
      if (updates.observacoes !== void 0) updateData.observacoes = updates.observacoes;
      if (updates.repetir !== void 0) updateData.repetir = updates.repetir;
      if (updates.frequencia) updateData.frequencia = updates.frequencia;
      if (updates.proximoVencimento) updateData.proximo_vencimento = updates.proximoVencimento;
      if (updates.ativa !== void 0) updateData.ativa = updates.ativa;
      const { error: error2 } = await supabase.from("contas_fixas").update(updateData).eq("id", id);
      if (error2) throw error2;
      await loadContasFixas();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar conta fixa");
      throw err;
    }
  };
  const deleteContaFixa = async (id) => {
    try {
      const { error: error2 } = await supabase.from("contas_fixas").delete().eq("id", id);
      if (error2) throw error2;
      await loadContasFixas();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao deletar conta fixa");
      throw err;
    }
  };
  const createCategoria = async (categoria) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Usuário não autenticado");
      const { data, error: error2 } = await supabase.from("categorias_financeiras").insert({
        user_id: user.user.id,
        nome: categoria.nome,
        tipo: categoria.tipo,
        cor: categoria.cor
      }).select().single();
      if (error2) throw error2;
      await loadCategorias();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar categoria");
      throw err;
    }
  };
  reactExports.useEffect(() => {
    loadContasFixas();
    loadCategorias();
    const channel = supabase.channel("contas-fixas-realtime").on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "contas_fixas"
      },
      () => {
        loadContasFixas();
      }
    ).on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "categorias_financeiras"
      },
      () => {
        loadCategorias();
      }
    ).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  return {
    contasFixas,
    categorias,
    loading,
    error,
    createContaFixa,
    updateContaFixa,
    deleteContaFixa,
    createCategoria,
    loadContasFixas,
    loadCategorias
  };
};

function useLancamentos() {
  const [filtros, setFiltros] = reactExports.useState({});
  const supabaseHook = useSupabaseLancamentos();
  const { categorias } = useSupabaseContasFixas();
  reactExports.useEffect(() => {
    if (filtros.dataInicio || filtros.dataFim) {
      const dataInicioStr = filtros.dataInicio?.toISOString().split("T")[0];
      const dataFimStr = filtros.dataFim?.toISOString().split("T")[0];
      supabaseHook.loadLancamentos(dataInicioStr, dataFimStr);
    } else if (filtros.mes !== void 0 && filtros.ano !== void 0) {
      const dataInicio = new Date(filtros.ano, filtros.mes, 1).toISOString().split("T")[0];
      const dataFim = new Date(filtros.ano, filtros.mes + 1, 0).toISOString().split("T")[0];
      supabaseHook.loadLancamentos(dataInicio, dataFim);
    }
  }, [filtros.dataInicio, filtros.dataFim, filtros.mes, filtros.ano]);
  const lancamentosFiltrados = supabaseHook.filterLancamentos(filtros);
  const resumoFinanceiro = reactExports.useMemo(() => {
    return supabaseHook.calculateResumoFinanceiro();
  }, [supabaseHook]);
  return {
    ...supabaseHook,
    lancamentos: lancamentosFiltrados,
    filtros,
    setFiltros,
    resumoFinanceiro,
    categorias,
    // Funções com nomes compatíveis
    criarLancamento: supabaseHook.createLancamento,
    atualizarLancamento: supabaseHook.updateLancamento,
    removerLancamento: supabaseHook.deleteLancamento,
    adicionarLancamento: supabaseHook.createLancamento,
    // Alias para compatibilidade
    calcularResumo: supabaseHook.calculateResumoFinanceiro,
    recarregar: supabaseHook.loadLancamentos
  };
}

export { useSupabaseContasFixas as a, useLancamentos as u };
