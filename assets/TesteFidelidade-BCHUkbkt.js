import { r as reactExports, j as jsxRuntimeExports } from './react-vendor-BpXfDOw7.js';
import { b as useAuth, C as Card, c as CardHeader, d as CardTitle, e as CardContent, g as Button, J as Jt, s as supabase } from './index-U74ij7JC.js';
import './ui-libs-B5Rrhu1L.js';
import './chart-libs-Cdz70zdY.js';

const TesteFidelidade = () => {
  const { user } = useAuth();
  const [loading, setLoading] = reactExports.useState(false);
  const [resultado, setResultado] = reactExports.useState(null);
  const executarTeste = async () => {
    if (!user) {
      Jt.error("Faça login para executar o teste");
      return;
    }
    setLoading(true);
    setResultado(null);
    try {
      let programa = await supabase.from("programas_fidelidade").select("*").eq("user_id", user.id).limit(1).maybeSingle();
      if (programa.error) throw programa.error;
      if (!programa.data) {
        const novo = await supabase.from("programas_fidelidade").insert({
          user_id: user.id,
          nome: "Programa Teste",
          pontos_por_real: 1,
          ativo: true
        }).select().single();
        if (novo.error) throw novo.error;
        programa = { data: novo.data, error: null, status: 201, statusText: "" };
      }
      let servico = await supabase.from("servicos").select("*").eq("user_id", user.id).limit(1).maybeSingle();
      if (servico.error) throw servico.error;
      if (!servico.data) {
        const novo = await supabase.from("servicos").insert({
          user_id: user.id,
          nome: "Corte Teste",
          descricao: "Serviço teste",
          valor: 100,
          duracao: 60
        }).select().single();
        if (novo.error) throw novo.error;
        servico = { data: novo.data, error: null, status: 201, statusText: "" };
      }
      let cliente = await supabase.from("clientes").select("*").eq("user_id", user.id).limit(1).maybeSingle();
      if (cliente.error) throw cliente.error;
      if (!cliente.data) {
        const novo = await supabase.from("clientes").insert({
          user_id: user.id,
          nome: "Cliente Teste",
          telefone: "11999999999",
          email: "teste@example.com"
        }).select().single();
        if (novo.error) throw novo.error;
        cliente = { data: novo.data, error: null, status: 201, statusText: "" };
      }
      const hoje = /* @__PURE__ */ new Date();
      const dataStr = hoje.toISOString().slice(0, 10);
      const horaStr = "10:00";
      const agendamento = await supabase.from("agendamentos").insert({
        user_id: user.id,
        cliente_id: cliente.data.id,
        servico_id: servico.data.id,
        data: dataStr,
        hora: horaStr,
        duracao: 60,
        valor: 100,
        valor_devido: 0,
        status: "concluido",
        status_pagamento: "pago",
        forma_pagamento: "pix",
        observacoes: "Agendamento de teste fidelidade",
        origem: "manual",
        confirmado: true
      }).select().single();
      if (agendamento.error) throw agendamento.error;
      await new Promise((r) => setTimeout(r, 500));
      const { data: jaExiste } = await supabase.from("pontos_fidelidade").select("id").eq("user_id", user.id).eq("origem", "agendamento").eq("origem_id", agendamento.data.id).limit(1);
      if (!jaExiste || jaExiste.length === 0) {
        const ppr = Number(programa.data?.pontos_por_real ?? 1);
        const pontosGanhosCalc = Math.floor(100 * (isNaN(ppr) ? 1 : ppr));
        if (pontosGanhosCalc > 0) {
          await supabase.from("pontos_fidelidade").insert({
            user_id: user.id,
            cliente_id: cliente.data.id,
            pontos: pontosGanhosCalc,
            origem: "agendamento",
            origem_id: agendamento.data.id,
            descricao: "Pontos ganhos no serviço concluído",
            data_expiracao: programa.data?.expiracao_pontos_dias && programa.data.expiracao_pontos_dias > 0 ? new Date(
              Date.now() + programa.data.expiracao_pontos_dias * 24 * 60 * 60 * 1e3
            ).toISOString().slice(0, 10) : null,
            expirado: false
          });
        }
      }
      const pontos = await supabase.from("pontos_fidelidade").select("*").eq("user_id", user.id).eq("cliente_id", cliente.data.id).order("created_at", { ascending: false }).limit(1);
      if (pontos.error) throw pontos.error;
      const saldo = await supabase.from("saldo_pontos").select("*").eq("user_id", user.id).eq("cliente_id", cliente.data.id).maybeSingle();
      if (saldo.error && saldo.error.code !== "PGRST116") throw saldo.error;
      const ranking = await supabase.from("ranking_fidelidade").select("*").eq("user_id", user.id).eq("cliente_id", cliente.data.id).maybeSingle();
      if (ranking.error && ranking.error.code !== "PGRST116") throw ranking.error;
      setResultado({
        programaId: programa.data.id,
        clienteId: cliente.data.id,
        servicoId: servico.data.id,
        agendamentoId: agendamento.data.id,
        pontosGanhos: pontos.data && pontos.data.length > 0 ? pontos.data[0].pontos : 0,
        pontosDisponiveis: saldo.data ? saldo.data.pontos_disponiveis : 0,
        rankingPosicao: ranking.data ? ranking.data.ranking : null
      });
      Jt.success("Teste executado com sucesso");
    } catch (e) {
      Jt.error(e?.message || "Erro ao executar teste");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "max-w-2xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Teste Rápido de Fidelidade" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: executarTeste, disabled: loading, children: loading ? "Executando..." : "Executar Teste" }),
      resultado && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          "Programa: ",
          resultado.programaId
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          "Cliente: ",
          resultado.clienteId
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          "Serviço: ",
          resultado.servicoId
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          "Agendamento: ",
          resultado.agendamentoId
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          "Pontos ganhos: ",
          resultado.pontosGanhos
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          "Pontos disponíveis: ",
          resultado.pontosDisponiveis
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          "Posição no ranking: ",
          resultado.rankingPosicao ?? "N/A"
        ] })
      ] })
    ] })
  ] }) });
};

export { TesteFidelidade as default };
