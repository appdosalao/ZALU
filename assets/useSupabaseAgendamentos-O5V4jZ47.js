import { r as reactExports } from './react-vendor-BpXfDOw7.js';
import { b as useAuth, s as supabase, J as Jt } from './index-BxmTkSue.js';

function useSupabaseAgendamentos() {
  const { user } = useAuth();
  const [agendamentos, setAgendamentos] = reactExports.useState([]);
  const [agendamentosOnline, setAgendamentosOnline] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [filtros, setFiltros] = reactExports.useState({ mes: (/* @__PURE__ */ new Date()).toISOString().slice(0, 7) });
  const [paginaAtual, setPaginaAtual] = reactExports.useState(1);
  const [itensPorPagina] = reactExports.useState(10);
  const verificarHorarioDisponivel = async (data, hora) => {
    if (!user) return false;
    try {
      const horaFormatada = hora.includes(":") ? hora : `${hora}:00`;
      const { data: horariosDisponiveis, error } = await supabase.rpc(
        "buscar_horarios_com_multiplos_intervalos",
        {
          data_selecionada: data,
          user_id_param: user.id,
          // O RPC ainda espera user_id_param
          duracao_servico: 30
          // Duração mínima para verificação
        }
      );
      if (error) {
        console.error("Erro ao verificar disponibilidade:", error);
        return false;
      }
      return horariosDisponiveis?.some((h) => {
        const horarioBanco = h.horario;
        const horarioBancoSemSegundos = horarioBanco ? horarioBanco.substring(0, 5) : "";
        return (horarioBanco === horaFormatada || horarioBancoSemSegundos === hora) && h.disponivel === true;
      }) || false;
    } catch (error) {
      console.error("Erro ao verificar disponibilidade:", error);
      return false;
    }
  };
  const carregarAgendamentosRegulares = async (mesFiltro) => {
    if (!user) return [];
    try {
      let query = supabase.from("agendamentos").select("*").eq("user_id", user.id).neq("status", "excluido");
      if (mesFiltro) {
        const [ano, mes] = mesFiltro.split("-").map(Number);
        const dataInicio = new Date(ano, mes - 1, 1);
        dataInicio.setDate(dataInicio.getDate() - 7);
        const dataFim = new Date(ano, mes, 0);
        dataFim.setDate(dataFim.getDate() + 15);
        const dataInicioStr = dataInicio.toISOString().split("T")[0];
        const dataFimStr = dataFim.toISOString().split("T")[0];
        query = query.gte("data", dataInicioStr).lte("data", dataFimStr);
      } else {
        const trintaDiasAtras = /* @__PURE__ */ new Date();
        trintaDiasAtras.setDate(trintaDiasAtras.getDate() - 30);
        const dataInicio = trintaDiasAtras.toISOString().split("T")[0];
        const noventaDiasAFrente = /* @__PURE__ */ new Date();
        noventaDiasAFrente.setDate(noventaDiasAFrente.getDate() + 90);
        const dataFim = noventaDiasAFrente.toISOString().split("T")[0];
        query = query.gte("data", dataInicio).lte("data", dataFim);
      }
      const { data, error } = await query.order("data").order("hora");
      if (error) {
        console.error("Erro ao carregar agendamentos regulares:", error);
        return [];
      }
      return (data || []).map((item) => ({
        id: item.id,
        clienteId: item.cliente_id,
        clienteNome: "Cliente",
        // Será resolvido depois
        servicoId: item.servico_id,
        servicoNome: "Serviço",
        // Será resolvido depois
        data: item.data,
        hora: item.hora,
        duracao: item.duracao,
        valor: parseFloat(item.valor?.toString() || "0"),
        valorPago: parseFloat(item.valor_pago?.toString() || "0"),
        valorDevido: parseFloat(item.valor_devido?.toString() || "0"),
        formaPagamento: item.forma_pagamento || "fiado",
        statusPagamento: item.status_pagamento || "em_aberto",
        status: item.status || "agendado",
        origem: item.origem || "manual",
        origem_cronograma: false,
        confirmado: item.confirmado,
        observacoes: item.observacoes || void 0,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }));
    } catch (error) {
      console.error("Erro ao carregar agendamentos regulares:", error);
      return [];
    }
  };
  const carregarAgendamentosOnline = async () => {
    if (!user) return [];
    try {
      const { data, error } = await supabase.from("agendamentos_online").select("*").eq("user_id", user.id).neq("status", "excluido").order("data", { ascending: true });
      if (error) {
        console.error("Erro ao carregar agendamentos online:", error);
        return [];
      }
      return (data || []).map((item) => ({
        id: item.id,
        nome_completo: item.nome_completo,
        email: item.email,
        telefone: item.telefone,
        servico_id: item.servico_id,
        data: item.data,
        horario: item.horario,
        observacoes: item.observacoes,
        status: item.status,
        valor: parseFloat(item.valor?.toString() || "0"),
        duracao: item.duracao,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));
    } catch (error) {
      console.error("Erro ao carregar agendamentos online:", error);
      return [];
    }
  };
  const converterAgendamentoOnline = (agendamentoOnline) => {
    return {
      id: `online_${agendamentoOnline.id}`,
      clienteId: "",
      // Não há cliente cadastrado
      clienteNome: agendamentoOnline.nome_completo,
      servicoId: agendamentoOnline.servico_id,
      servicoNome: "Serviço Online",
      // Será resolvido depois
      data: agendamentoOnline.data,
      hora: agendamentoOnline.horario,
      duracao: agendamentoOnline.duracao,
      valor: agendamentoOnline.valor,
      valorPago: 0,
      valorDevido: agendamentoOnline.valor,
      formaPagamento: "fiado",
      statusPagamento: "em_aberto",
      status: agendamentoOnline.status === "confirmado" ? "agendado" : "agendado",
      origem: "online",
      origem_cronograma: false,
      confirmado: agendamentoOnline.status === "confirmado",
      observacoes: agendamentoOnline.observacoes,
      createdAt: agendamentoOnline.created_at,
      updatedAt: agendamentoOnline.updated_at
    };
  };
  const carregarAgendamentos = async (mesFiltroArg) => {
    const mesFiltro = mesFiltroArg || filtros.mes;
    setLoading(true);
    try {
      const [agendamentosReg, agendamentosOnl] = await Promise.all([
        carregarAgendamentosRegulares(mesFiltro),
        carregarAgendamentosOnline()
      ]);
      setAgendamentos(agendamentosReg);
      setAgendamentosOnline(agendamentosOnl);
    } catch (error) {
      console.error("Erro ao carregar agendamentos:", error);
      Jt.error("Erro ao carregar agendamentos");
    } finally {
      setLoading(false);
    }
  };
  const agendamentosCombinados = reactExports.useMemo(() => {
    const onlineAtivos = agendamentosOnline.filter(
      (ag) => ag.status !== "convertido" && ag.status !== "excluido" && ag.status !== "cancelado"
    );
    const agendamentosOnlineConvertidos = onlineAtivos.map(converterAgendamentoOnline);
    return [...agendamentos, ...agendamentosOnlineConvertidos];
  }, [agendamentos, agendamentosOnline]);
  reactExports.useEffect(() => {
    carregarAgendamentos(filtros.mes);
    const channelOnline = supabase.channel("agendamentos-online-changes").on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "agendamentos_online",
        filter: user ? `user_id=eq.${user.id}` : void 0
        // user_id conforme definido no banco
      },
      () => {
        carregarAgendamentos(filtros.mes);
      }
    ).subscribe();
    const channelRegular = supabase.channel("agendamentos-regular-changes").on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "agendamentos",
        filter: user ? `user_id=eq.${user.id}` : void 0
        // user_id conforme definido no banco
      },
      () => {
        carregarAgendamentos(filtros.mes);
      }
    ).subscribe();
    return () => {
      supabase.removeChannel(channelOnline);
      supabase.removeChannel(channelRegular);
    };
  }, [user, filtros.mes]);
  const agendamentosFiltrados = reactExports.useMemo(() => {
    let resultado = [...agendamentosCombinados];
    if (filtros.mes) {
      resultado = resultado.filter((ag) => String(ag.data).slice(0, 7) === filtros.mes);
    }
    if (filtros.data) {
      resultado = resultado.filter((ag) => ag.data === filtros.data);
    }
    if (filtros.status) {
      resultado = resultado.filter((ag) => ag.status === filtros.status);
    }
    if (filtros.statusPagamento) {
      resultado = resultado.filter((ag) => ag.statusPagamento === filtros.statusPagamento);
    }
    if (filtros.clienteId) {
      resultado = resultado.filter((ag) => ag.clienteId === filtros.clienteId);
    }
    if (filtros.origem) {
      resultado = resultado.filter((ag) => ag.origem === filtros.origem);
    }
    resultado.sort((a, b) => {
      const dataHoraA = /* @__PURE__ */ new Date(`${a.data}T${a.hora}`);
      const dataHoraB = /* @__PURE__ */ new Date(`${b.data}T${b.hora}`);
      return dataHoraA.getTime() - dataHoraB.getTime();
    });
    return resultado;
  }, [agendamentosCombinados, filtros]);
  const totalPaginas = Math.ceil(agendamentosFiltrados.length / itensPorPagina);
  const agendamentosPaginados = reactExports.useMemo(() => {
    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    return agendamentosFiltrados.slice(inicio, fim);
  }, [agendamentosFiltrados, paginaAtual, itensPorPagina]);
  const converterAgendamentoOnlineParaRegular = async (agendamentoOnlineId) => {
    if (!user) {
      Jt.error("Usuário não autenticado");
      return false;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc("converter_agendamento_online", {
        agendamento_online_id: agendamentoOnlineId,
        user_id: user.id
      });
      if (error) {
        console.error("Erro ao converter agendamento:", error);
        Jt.error("Erro ao converter agendamento");
        return false;
      }
      await carregarAgendamentos();
      Jt.success("Agendamento convertido com sucesso!");
      return true;
    } catch (error) {
      console.error("Erro ao converter agendamento:", error);
      Jt.error("Erro ao converter agendamento");
      return false;
    } finally {
      setLoading(false);
    }
  };
  const confirmarAgendamentoOnline = async (agendamentoOnlineId) => {
    if (!user) return false;
    setLoading(true);
    try {
      const { error } = await supabase.from("agendamentos_online").update({ status: "confirmado" }).eq("id", agendamentoOnlineId).eq("user_id", user.id);
      if (error) {
        console.error("Erro ao confirmar agendamento:", error);
        Jt.error("Erro ao confirmar agendamento");
        return false;
      }
      await carregarAgendamentos();
      Jt.success("Agendamento confirmado!");
      return true;
    } catch (error) {
      console.error("Erro ao confirmar agendamento:", error);
      Jt.error("Erro ao confirmar agendamento");
      return false;
    } finally {
      setLoading(false);
    }
  };
  const criarAgendamento = async (novoAgendamento) => {
    if (!user) {
      Jt.error("Usuário não autenticado");
      return false;
    }
    const origem = novoAgendamento.origem ?? "manual";
    if (origem !== "manual") {
      const alvo = String(novoAgendamento.hora).slice(0, 5);
      const horarioDisponivel = await verificarHorarioDisponivel(novoAgendamento.data, alvo);
      if (!horarioDisponivel) {
        Jt.error("Horário não disponível para agendamento");
        return false;
      }
    }
    setLoading(true);
    try {
      const duracao = Number(novoAgendamento.duracao) > 0 ? Number(novoAgendamento.duracao) : 60;
      const valor = Number(novoAgendamento.valor ?? 0);
      const valorPago = Number(novoAgendamento.valorPago ?? 0);
      const valorDevido = Number(novoAgendamento.valorDevido ?? Math.max(0, valor - valorPago));
      const horaNorm = String(novoAgendamento.hora).slice(0, 5);
      const formaPagamento = novoAgendamento.formaPagamento || "fiado";
      const statusPagamento = novoAgendamento.statusPagamento || (valorPago >= valor ? "pago" : valorPago > 0 ? "parcial" : "em_aberto");
      const status = novoAgendamento.status || "agendado";
      const origemFinal = origem || "manual";
      const { data, error } = await supabase.from("agendamentos").insert({
        user_id: user.id,
        // user_id conforme definido no banco de dados
        cliente_id: novoAgendamento.clienteId,
        servico_id: novoAgendamento.servicoId,
        data: novoAgendamento.data,
        hora: horaNorm,
        duracao,
        valor,
        valor_pago: valorPago,
        valor_devido: valorDevido,
        forma_pagamento: formaPagamento,
        status_pagamento: statusPagamento,
        status,
        origem: origemFinal,
        confirmado: novoAgendamento.confirmado ?? true,
        observacoes: novoAgendamento.observacoes || null
      }).select().single();
      if (error) {
        console.error("Erro ao criar agendamento:", error);
        Jt.error(`Erro ao criar agendamento: ${error.message}`);
        return false;
      }
      await carregarAgendamentos();
      Jt.success("Agendamento criado com sucesso!");
      return true;
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
      Jt.error("Erro ao criar agendamento");
      return false;
    } finally {
      setLoading(false);
    }
  };
  const atualizarAgendamento = async (id, dadosAtualizados) => {
    if (!user) {
      Jt.error("Usuário não autenticado");
      return false;
    }
    if (id.startsWith("online_")) {
      const agendamentoOnlineId = id.replace("online_", "");
      return await confirmarAgendamentoOnline(agendamentoOnlineId);
    }
    setLoading(true);
    try {
      const updates = {};
      if (dadosAtualizados.clienteId !== void 0) updates.cliente_id = dadosAtualizados.clienteId;
      if (dadosAtualizados.servicoId !== void 0) updates.servico_id = dadosAtualizados.servicoId;
      if (dadosAtualizados.data !== void 0) updates.data = dadosAtualizados.data;
      if (dadosAtualizados.hora !== void 0) updates.hora = dadosAtualizados.hora;
      if (dadosAtualizados.duracao !== void 0) updates.duracao = dadosAtualizados.duracao;
      if (dadosAtualizados.valor !== void 0) updates.valor = dadosAtualizados.valor;
      if (dadosAtualizados.valorPago !== void 0) updates.valor_pago = dadosAtualizados.valorPago;
      if (dadosAtualizados.valorDevido !== void 0) updates.valor_devido = dadosAtualizados.valorDevido;
      if (dadosAtualizados.formaPagamento !== void 0) updates.forma_pagamento = dadosAtualizados.formaPagamento;
      if (dadosAtualizados.statusPagamento !== void 0) updates.status_pagamento = dadosAtualizados.statusPagamento;
      if (dadosAtualizados.status !== void 0) updates.status = dadosAtualizados.status;
      if (dadosAtualizados.origem !== void 0) updates.origem = dadosAtualizados.origem;
      if (dadosAtualizados.confirmado !== void 0) updates.confirmado = dadosAtualizados.confirmado;
      if (dadosAtualizados.observacoes !== void 0) updates.observacoes = dadosAtualizados.observacoes || null;
      const { error } = await supabase.from("agendamentos").update(updates).eq("id", id).eq("user_id", user.id);
      if (error) {
        console.error("Erro ao atualizar agendamento:", error);
        Jt.error("Erro ao atualizar agendamento");
        return false;
      }
      await carregarAgendamentos();
      Jt.success("Agendamento atualizado com sucesso!");
      return true;
    } catch (error) {
      console.error("Erro ao atualizar agendamento:", error);
      Jt.error("Erro ao atualizar agendamento");
      return false;
    } finally {
      setLoading(false);
    }
  };
  const excluirAgendamento = async (id) => {
    if (!user) {
      Jt.error("Usuário não autenticado");
      return false;
    }
    if (id.startsWith("online_")) {
      const agendamentoOnlineId = id.replace("online_", "");
      setLoading(true);
      try {
        console.log("🗑️ Executando soft delete de agendamento online no Supabase...", agendamentoOnlineId);
        const { error } = await supabase.from("agendamentos_online").update({ status: "excluido" }).eq("id", agendamentoOnlineId).eq("user_id", user.id);
        if (error) {
          console.error("❌ Erro do Supabase ao excluir agendamento online:", error);
          Jt.error("Erro ao excluir agendamento online: " + error.message);
          return false;
        }
        console.log("✅ Agendamento online marcado como excluído no banco");
        await carregarAgendamentos();
        Jt.success("Agendamento online excluído com sucesso!");
        return true;
      } catch (error) {
        console.error("❌ Erro ao excluir agendamento online:", error);
        Jt.error("Erro ao excluir agendamento online");
        return false;
      } finally {
        setLoading(false);
      }
    }
    setLoading(true);
    try {
      console.log("🗑️ Executando soft delete de agendamento no Supabase...", id);
      const { error } = await supabase.from("agendamentos").update({ status: "excluido" }).eq("id", id).eq("user_id", user.id);
      if (error) {
        console.error("❌ Erro do Supabase ao excluir agendamento:", error);
        Jt.error("Erro ao excluir agendamento: " + error.message);
        return false;
      }
      console.log("✅ Agendamento marcado como excluído no banco");
      await carregarAgendamentos();
      Jt.success("Agendamento excluído com sucesso!");
      return true;
    } catch (error) {
      console.error("❌ Erro ao excluir agendamento:", error);
      Jt.error("Erro ao excluir agendamento");
      return false;
    } finally {
      setLoading(false);
    }
  };
  const cancelarAgendamento = async (id) => {
    if (!user) {
      Jt.error("Usuário não autenticado");
      return false;
    }
    setLoading(true);
    try {
      if (id.startsWith("online_")) {
        const agendamentoOnlineId = id.replace("online_", "");
        const { error } = await supabase.from("agendamentos_online").update({ status: "cancelado" }).eq("id", agendamentoOnlineId).eq("user_id", user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("agendamentos").update({ status: "cancelado" }).eq("id", id).eq("user_id", user.id);
        if (error) throw error;
      }
      await carregarAgendamentos();
      Jt.success("Agendamento cancelado com sucesso!");
      return true;
    } catch (error) {
      console.error("Erro ao cancelar agendamento:", error);
      Jt.error("Erro ao cancelar agendamento");
      return false;
    } finally {
      setLoading(false);
    }
  };
  return {
    loading,
    agendamentos: agendamentosPaginados,
    agendamentosFiltrados,
    todosAgendamentos: agendamentosCombinados,
    filtros,
    setFiltros,
    paginaAtual,
    setPaginaAtual,
    totalPaginas,
    criarAgendamento,
    atualizarAgendamento,
    excluirAgendamento,
    cancelarAgendamento,
    recarregar: carregarAgendamentos,
    converterAgendamentoOnlineParaRegular,
    confirmarAgendamentoOnline,
    verificarHorarioDisponivel
  };
}

export { useSupabaseAgendamentos as u };
