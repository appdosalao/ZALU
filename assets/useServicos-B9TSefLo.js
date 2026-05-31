import { r as reactExports } from './react-vendor-BpXfDOw7.js';
import { b as useAuth, s as supabase, J as Jt } from './index-U74ij7JC.js';

function useServicos() {
  const { user } = useAuth();
  const [servicos, setServicos] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [filtros, setFiltros] = reactExports.useState({
    ordenacao: "nome",
    direcao: "asc"
  });
  const carregarServicos = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.from("servicos").select("*").eq("user_id", user.id).order("nome");
      if (error) {
        console.error("Erro ao carregar serviços:", error);
        Jt.error("Erro ao carregar serviços");
        return;
      }
      const servicosFormatados = (data || []).map((item) => ({
        id: item.id,
        nome: item.nome,
        valor: parseFloat(item.valor.toString()),
        duracao: item.duracao,
        descricao: item.descricao || void 0,
        observacoes: item.observacoes || void 0,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }));
      setServicos(servicosFormatados);
    } catch (error) {
      console.error("Erro ao carregar serviços:", error);
      Jt.error("Erro ao carregar serviços");
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    carregarServicos();
  }, [user]);
  const servicosFiltrados = reactExports.useMemo(() => {
    let resultado = [...servicos];
    if (filtros.busca) {
      const busca = filtros.busca.toLowerCase();
      resultado = resultado.filter(
        (servico) => servico.nome.toLowerCase().includes(busca) || servico.descricao?.toLowerCase().includes(busca)
      );
    }
    if (filtros.ordenacao) {
      resultado.sort((a, b) => {
        const campo = filtros.ordenacao;
        let valorA = a[campo];
        let valorB = b[campo];
        if (typeof valorA === "string") {
          valorA = valorA.toLowerCase();
          valorB = valorB.toLowerCase();
        }
        if (filtros.direcao === "desc") {
          return valorB > valorA ? 1 : valorB < valorA ? -1 : 0;
        }
        return valorA > valorB ? 1 : valorA < valorB ? -1 : 0;
      });
    }
    return resultado;
  }, [servicos, filtros]);
  const criarServico = async (novoServico) => {
    if (!user) {
      Jt.error("Usuário não autenticado");
      return false;
    }
    if (!novoServico.nome.trim()) {
      Jt.error("Nome do serviço é obrigatório");
      return false;
    }
    if (novoServico.valor <= 0 || novoServico.duracao <= 0) {
      Jt.error("Valor e duração devem ser maiores que zero");
      return false;
    }
    const servicoExistente = servicos.find(
      (s) => s.nome.toLowerCase() === novoServico.nome.toLowerCase()
    );
    if (servicoExistente) {
      Jt.error("Já existe um serviço com este nome");
      return false;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.from("servicos").insert({
        user_id: user.id,
        nome: novoServico.nome,
        valor: novoServico.valor,
        duracao: novoServico.duracao,
        descricao: novoServico.descricao || null,
        observacoes: novoServico.observacoes || null
      }).select().single();
      if (error) {
        console.error("Erro ao criar serviço:", error);
        Jt.error("Erro ao criar serviço");
        return false;
      }
      const novoServicoFormatado = {
        id: data.id,
        nome: data.nome,
        valor: parseFloat(data.valor.toString()),
        duracao: data.duracao,
        descricao: data.descricao || void 0,
        observacoes: data.observacoes || void 0,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
      setServicos((prev) => [...prev, novoServicoFormatado]);
      Jt.success("Serviço criado com sucesso!");
      return true;
    } catch (error) {
      console.error("Erro ao criar serviço:", error);
      Jt.error("Erro ao criar serviço");
      return false;
    } finally {
      setLoading(false);
    }
  };
  const atualizarServico = async (id, dadosAtualizados) => {
    if (!user) {
      Jt.error("Usuário não autenticado");
      return false;
    }
    if (dadosAtualizados.nome !== void 0 && !dadosAtualizados.nome.trim()) {
      Jt.error("Nome do serviço é obrigatório");
      return false;
    }
    if (dadosAtualizados.valor !== void 0 && dadosAtualizados.valor <= 0) {
      Jt.error("Valor deve ser maior que zero");
      return false;
    }
    if (dadosAtualizados.duracao !== void 0 && dadosAtualizados.duracao <= 0) {
      Jt.error("Duração deve ser maior que zero");
      return false;
    }
    setLoading(true);
    try {
      const updates = {};
      if (dadosAtualizados.nome !== void 0) updates.nome = dadosAtualizados.nome;
      if (dadosAtualizados.valor !== void 0) updates.valor = dadosAtualizados.valor;
      if (dadosAtualizados.duracao !== void 0) updates.duracao = dadosAtualizados.duracao;
      if (dadosAtualizados.descricao !== void 0) updates.descricao = dadosAtualizados.descricao || null;
      if (dadosAtualizados.observacoes !== void 0) updates.observacoes = dadosAtualizados.observacoes || null;
      const { data, error } = await supabase.from("servicos").update(updates).eq("id", id).eq("user_id", user.id).select().single();
      if (error) {
        console.error("Erro ao atualizar serviço:", error);
        Jt.error("Erro ao atualizar serviço");
        return false;
      }
      const servicoAtualizado = {
        id: data.id,
        nome: data.nome,
        valor: parseFloat(data.valor.toString()),
        duracao: data.duracao,
        descricao: data.descricao || void 0,
        observacoes: data.observacoes || void 0,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
      setServicos((prev) => prev.map((s) => s.id === id ? servicoAtualizado : s));
      Jt.success("Serviço atualizado com sucesso!");
      return true;
    } catch (error) {
      console.error("Erro ao atualizar serviço:", error);
      Jt.error("Erro ao atualizar serviço");
      return false;
    } finally {
      setLoading(false);
    }
  };
  const excluirServico = async (id) => {
    if (!user) {
      Jt.error("Usuário não autenticado");
      return false;
    }
    setLoading(true);
    try {
      console.log("🗑️ Iniciando exclusão de serviço:", id, "Usuário:", user.id);
      const { data: permissionCheck, error: permError } = await supabase.rpc("test_delete_permissions", {
        table_name: "servicos",
        record_id: id
      });
      if (permError) {
        console.error("❌ Erro ao verificar permissões:", permError);
      } else {
        console.log("🔍 Verificação de permissões:", permissionCheck);
        const checkResult = permissionCheck;
        if (checkResult && typeof checkResult === "object") {
          if (!checkResult.can_delete) {
            if (!checkResult.record_exists) {
              Jt.error("Serviço não encontrado");
              return false;
            }
            if (!checkResult.user_owns_record) {
              Jt.error("Você não tem permissão para excluir este serviço");
              return false;
            }
          }
        }
      }
      const { data: agendamentosOnline, error: checkError } = await supabase.from("agendamentos_online").select("id, nome_completo").eq("servico_id", id);
      if (checkError) {
        console.error("❌ Erro ao verificar agendamentos online:", checkError);
      }
      const { error } = await supabase.from("servicos").delete().eq("id", id).eq("user_id", user.id);
      if (error) {
        console.error("❌ Erro do Supabase ao excluir serviço:", error);
        Jt.error("Erro ao excluir serviço: " + error.message);
        return false;
      }
      console.log("✅ Serviço excluído com sucesso no banco");
      if (agendamentosOnline && agendamentosOnline.length > 0) {
        Jt.success(`Serviço excluído com sucesso! ${agendamentosOnline.length} agendamento(s) online foram atualizados.`);
      } else {
        Jt.success("Serviço excluído com sucesso!");
      }
      setServicos((prev) => {
        const novaLista = prev.filter((s) => s.id !== id);
        console.log("📝 Lista de serviços atualizada:", novaLista.length, "serviços");
        return novaLista;
      });
      return true;
    } catch (error) {
      console.error("Erro ao excluir serviço:", error);
      Jt.error("Erro ao excluir serviço");
      return false;
    } finally {
      setLoading(false);
    }
  };
  const obterServicoPorId = (id) => {
    return servicos.find((s) => s.id === id);
  };
  return {
    loading,
    servicos: servicosFiltrados,
    todosServicos: servicos,
    filtros,
    setFiltros,
    criarServico,
    atualizarServico,
    excluirServico,
    obterServicoPorId,
    recarregar: carregarServicos
  };
}

export { useServicos as u };
