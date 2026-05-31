import { r as reactExports } from './react-vendor-BpXfDOw7.js';
import { b as useAuth, s as supabase, J as Jt } from './index-U74ij7JC.js';

function useSupabaseClientes() {
  const { user } = useAuth();
  const [clientes, setClientes] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const parseValor = (v) => {
    if (typeof v === "number") return v;
    if (typeof v === "string") {
      const s = v.replace(/\./g, "").replace(",", ".");
      const n = Number(s);
      return isNaN(n) ? 0 : n;
    }
    return 0;
  };
  const carregarEstatisticasCliente = reactExports.useCallback(async (clienteId) => {
    if (!user) return null;
    try {
      const [agsResult, servsResult] = await Promise.all([
        supabase.from("agendamentos").select("id, cliente_id, servico_id, data, hora, valor, valor_pago, status, status_pagamento").eq("user_id", user.id).eq("cliente_id", clienteId).neq("status", "cancelado"),
        supabase.from("servicos").select("id, nome").eq("user_id", user.id)
      ]);
      if (agsResult.error) throw agsResult.error;
      if (servsResult.error) throw servsResult.error;
      const ags = agsResult.data || [];
      const servs = servsResult.data || [];
      const servicoNomeMap = new Map(servs.map((s) => [s.id, s.nome]));
      const hojeStr = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      const historico = ags.map((a) => ({
        id: a.id,
        data: /* @__PURE__ */ new Date(`${a.data}T${a.hora || "00:00"}`),
        servico: servicoNomeMap.get(a.servico_id) || "Serviço",
        valor: (() => {
          const vp = parseValor(a.valor_pago);
          const vt = parseValor(a.valor);
          return vp > 0 ? vp : vt;
        })()
      })).sort((x, y) => y.data.getTime() - x.data.getTime());
      let servicoFrequente;
      if (ags.length > 0) {
        const freq = /* @__PURE__ */ new Map();
        ags.forEach((a) => {
          const key = servicoNomeMap.get(a.servico_id) || "Serviço";
          freq.set(key, (freq.get(key) || 0) + 1);
        });
        let max = 0;
        for (const [k, v] of freq.entries()) {
          if (v > max) {
            max = v;
            servicoFrequente = k;
          }
        }
      }
      const ultimaElegivel = ags.filter((a) => a.data <= hojeStr).map((a) => /* @__PURE__ */ new Date(`${a.data}T${a.hora || "00:00"}`)).sort((a, b) => b.getTime() - a.getTime())[0];
      const ultimaVisita = ultimaElegivel ? ultimaElegivel.toISOString() : historico[0]?.data?.toISOString() || void 0;
      const stats = {
        historicoServicos: historico,
        servicoFrequente,
        ultimaVisita
      };
      setClientes((prev) => prev.map(
        (c) => c.id === clienteId ? { ...c, ...stats } : c
      ));
      return stats;
    } catch (error) {
      console.error("Erro ao carregar estatísticas do cliente:", error);
      return null;
    }
  }, [user]);
  const carregarClientes = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await supabase.rpc("associar_clientes_agendamento_online", {
        p_user_id: user.id
      });
      const { data, error } = await supabase.from("clientes").select("*").eq("user_id", user.id).order("nome");
      if (error) {
        console.error("Erro ao carregar clientes:", error);
        Jt.error("Erro ao carregar clientes");
        return;
      }
      const clientesBase = (data || []).map((item) => ({
        id: item.id,
        nome: item.nome,
        nomeCompleto: item.nome,
        telefone: item.telefone,
        email: item.email || void 0,
        endereco: item.endereco || void 0,
        dataNascimento: item.data_nascimento || void 0,
        observacoes: item.observacoes || void 0,
        historicoServicos: [],
        // Inicialmente vazio
        servicoFrequente: void 0,
        ultimaVisita: void 0,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }));
      setClientes(clientesBase);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
      Jt.error("Erro ao carregar clientes");
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    carregarClientes();
  }, [user]);
  const criarCliente = async (clienteData) => {
    if (!user) {
      Jt.error("Usuário não autenticado");
      return false;
    }
    const nome = clienteData.nome || clienteData.nomeCompleto;
    if (!nome?.trim()) {
      Jt.error("Nome do cliente é obrigatório");
      return false;
    }
    if (!clienteData.telefone?.trim()) {
      Jt.error("Telefone do cliente é obrigatório");
      return false;
    }
    const clienteExistente = clientes.find(
      (c) => c.nome?.toLowerCase() === nome.toLowerCase()
    );
    if (clienteExistente) {
      Jt.error("Já existe um cliente com este nome");
      return false;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.from("clientes").insert({
        user_id: user.id,
        nome,
        telefone: clienteData.telefone,
        email: clienteData.email || null,
        endereco: clienteData.endereco || null,
        data_nascimento: clienteData.dataNascimento || null,
        observacoes: clienteData.observacoes || null,
        historico_servicos: []
      }).select().single();
      if (error) {
        console.error("Erro ao criar cliente:", error);
        Jt.error("Erro ao criar cliente");
        return false;
      }
      const novoCliente = {
        id: data.id,
        nome: data.nome,
        nomeCompleto: data.nome,
        telefone: data.telefone,
        email: data.email || void 0,
        endereco: data.endereco || void 0,
        dataNascimento: data.data_nascimento || void 0,
        observacoes: data.observacoes || void 0,
        historicoServicos: data.historico_servicos || [],
        servicoFrequente: void 0,
        ultimaVisita: void 0,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
      setClientes((prev) => [...prev, novoCliente]);
      Jt.success("Cliente criado com sucesso!");
      return true;
    } catch (error) {
      console.error("Erro ao criar cliente:", error);
      Jt.error("Erro ao criar cliente");
      return false;
    } finally {
      setLoading(false);
    }
  };
  const atualizarCliente = async (id, updates) => {
    if (!user) {
      Jt.error("Usuário não autenticado");
      return false;
    }
    setLoading(true);
    try {
      const updateData = {};
      if (updates.nome !== void 0) updateData.nome = updates.nome;
      if (updates.nomeCompleto !== void 0) updateData.nome = updates.nomeCompleto;
      if (updates.telefone !== void 0) updateData.telefone = updates.telefone;
      if (updates.email !== void 0) updateData.email = updates.email || null;
      if (updates.endereco !== void 0) updateData.endereco = updates.endereco || null;
      if (updates.dataNascimento !== void 0) updateData.data_nascimento = updates.dataNascimento || null;
      if (updates.observacoes !== void 0) updateData.observacoes = updates.observacoes || null;
      if (updates.historicoServicos !== void 0) updateData.historico_servicos = updates.historicoServicos;
      const { data, error } = await supabase.from("clientes").update(updateData).eq("id", id).eq("user_id", user.id).select().single();
      if (error) {
        console.error("Erro ao atualizar cliente:", error);
        Jt.error("Erro ao atualizar cliente");
        return false;
      }
      const clienteAtualizado = {
        id: data.id,
        nome: data.nome,
        nomeCompleto: data.nome,
        telefone: data.telefone,
        email: data.email || void 0,
        endereco: data.endereco || void 0,
        dataNascimento: data.data_nascimento || void 0,
        observacoes: data.observacoes || void 0,
        historicoServicos: data.historico_servicos || [],
        servicoFrequente: void 0,
        ultimaVisita: void 0,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
      setClientes((prev) => prev.map((c) => c.id === id ? clienteAtualizado : c));
      Jt.success("Cliente atualizado com sucesso!");
      return true;
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      Jt.error("Erro ao atualizar cliente");
      return false;
    } finally {
      setLoading(false);
    }
  };
  const excluirCliente = async (id) => {
    console.log("🔄 Iniciando exclusão do cliente:", id);
    if (!user) {
      console.error("❌ Usuário não autenticado");
      Jt.error("Usuário não autenticado");
      return false;
    }
    console.log("✅ Usuário autenticado:", user.id);
    setLoading(true);
    try {
      console.log("🗑️ Executando delete no Supabase...");
      const { error } = await supabase.from("clientes").delete().eq("id", id).eq("user_id", user.id);
      if (error) {
        console.error("❌ Erro do Supabase ao excluir cliente:", error);
        Jt.error("Erro ao excluir cliente: " + error.message);
        return false;
      }
      console.log("✅ Cliente excluído com sucesso no banco");
      setClientes((prev) => {
        const novaLista = prev.filter((c) => c.id !== id);
        console.log("📝 Lista atualizada:", novaLista.length, "clientes");
        return novaLista;
      });
      Jt.success("Cliente excluído com sucesso!");
      return true;
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
      Jt.error("Erro ao excluir cliente");
      return false;
    } finally {
      setLoading(false);
    }
  };
  const obterClienteComEstatisticas = (id) => {
    return clientes.find((c) => c.id === id);
  };
  return {
    loading,
    clientes,
    criarCliente,
    atualizarCliente,
    excluirCliente,
    obterClienteComEstatisticas,
    recarregar: carregarClientes,
    carregarEstatisticasCliente
  };
}

export { useSupabaseClientes as u };
