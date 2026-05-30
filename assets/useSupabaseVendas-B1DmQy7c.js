import { r as reactExports } from './react-vendor-BpXfDOw7.js';
import { s as supabase, J as Jt } from './index-BxmTkSue.js';

function useSupabaseCompras() {
  const [compras, setCompras] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const loadCompras = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data, error } = await supabase.from("compras").select("*, itens_compra(*)").eq("user_id", user.id).order("data_compra", { ascending: false });
      if (error) throw error;
      setCompras(data || []);
    } catch (error) {
      Jt.error("Erro ao carregar compras: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  const createCompra = async (compra) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");
      const { data: compraData, error: compraError } = await supabase.from("compras").insert([{
        user_id: user.id,
        fornecedor_id: compra.fornecedor_id,
        numero_nota: compra.numero_nota,
        data_compra: compra.data_compra,
        data_vencimento: compra.data_vencimento,
        valor_total: compra.valor_total,
        forma_pagamento: compra.forma_pagamento,
        observacoes: compra.observacoes
      }]).select().single();
      if (compraError) throw compraError;
      const itensComCompraId = compra.itens.map((item) => ({
        ...item,
        compra_id: compraData.id
      }));
      const { error: itensError } = await supabase.from("itens_compra").insert(itensComCompraId);
      if (itensError) throw itensError;
      const movimentacoes = compra.itens.map((item) => ({
        user_id: user.id,
        produto_id: item.produto_id,
        tipo: "entrada",
        quantidade: item.quantidade,
        valor_unitario: item.valor_unitario,
        valor_total: item.valor_total,
        motivo: `Compra ${compraData.numero_nota || compraData.id}`,
        origem_id: compraData.id,
        origem_tipo: "compra_produto"
      }));
      const { error: movError } = await supabase.from("movimentacoes_estoque").insert(movimentacoes);
      if (movError) throw movError;
      Jt.success("Compra registrada com sucesso!");
      await loadCompras();
    } catch (error) {
      Jt.error("Erro ao registrar compra: " + error.message);
      throw error;
    }
  };
  const registrarPagamento = async (compraId, valorPago) => {
    try {
      const compra = compras.find((c) => c.id === compraId);
      if (!compra) throw new Error("Compra não encontrada");
      const novoValorPago = compra.valor_pago + valorPago;
      const { error } = await supabase.from("compras").update({ valor_pago: novoValorPago }).eq("id", compraId);
      if (error) throw error;
      Jt.success("Pagamento registrado com sucesso!");
      await loadCompras();
    } catch (error) {
      Jt.error("Erro ao registrar pagamento: " + error.message);
      throw error;
    }
  };
  reactExports.useEffect(() => {
    loadCompras();
  }, []);
  return {
    compras,
    loading,
    createCompra,
    registrarPagamento,
    recarregar: loadCompras
  };
}

function useSupabaseVendas() {
  const [vendas, setVendas] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const loadVendas = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data, error } = await supabase.from("vendas_produtos").select("*, itens_venda(*)").eq("user_id", user.id).order("data_venda", { ascending: false });
      if (error) throw error;
      setVendas(data || []);
    } catch (error) {
      Jt.error("Erro ao carregar vendas: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  const createVenda = async (venda) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");
      const valorTotal = venda.itens.reduce((sum, item) => sum + item.valor_total, 0);
      const { data: vendaData, error: vendaError } = await supabase.from("vendas_produtos").insert([{
        user_id: user.id,
        cliente_id: venda.cliente_id,
        agendamento_id: venda.agendamento_id,
        data_venda: venda.data_venda,
        valor_total: valorTotal,
        status_pagamento: "pago",
        forma_pagamento: venda.forma_pagamento,
        observacoes: venda.observacoes
      }]).select().single();
      if (vendaError) throw vendaError;
      const itensComVendaId = venda.itens.map((item) => ({
        ...item,
        venda_id: vendaData.id
      }));
      const { error: itensError } = await supabase.from("itens_venda").insert(itensComVendaId);
      if (itensError) throw itensError;
      const movimentacoes = venda.itens.map((item) => ({
        user_id: user.id,
        produto_id: item.produto_id,
        tipo: "saida",
        quantidade: item.quantidade,
        valor_unitario: item.valor_unitario,
        valor_total: item.valor_total,
        motivo: `Venda ${vendaData.id}`,
        origem_id: vendaData.id,
        origem_tipo: "venda"
      }));
      const { error: movError } = await supabase.from("movimentacoes_estoque").insert(movimentacoes);
      if (movError) throw movError;
      Jt.success("Venda registrada com sucesso!");
      await loadVendas();
    } catch (error) {
      Jt.error("Erro ao registrar venda: " + error.message);
      throw error;
    }
  };
  reactExports.useEffect(() => {
    loadVendas();
  }, []);
  return {
    vendas,
    loading,
    createVenda,
    recarregar: loadVendas
  };
}

export { useSupabaseVendas as a, useSupabaseCompras as u };
