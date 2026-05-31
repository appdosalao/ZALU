import { r as reactExports, j as jsxRuntimeExports } from './react-vendor-BpXfDOw7.js';
import { b as useAuth, s as supabase, J as Jt, C as Card, c as CardHeader, d as CardTitle, g as Button, f as CardDescription, e as CardContent, j as Input, B as Badge, G as Alert, H as AlertDescription } from './index-U74ij7JC.js';
import { L as Label } from './label-C0AJeojg.js';
import { S as Switch } from './switch-CkSMWSBt.js';
import { a0 as Settings, ar as Save, U as Users, av as Award, bo as Gift, ae as TrendingUp, R as RefreshCw, ag as Plus, bp as Pencil, aq as Trash2, aL as CircleAlert, bq as Trophy, br as Medal } from './ui-libs-B5Rrhu1L.js';
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from './table-CHN4Nieb.js';
import { D as Dialog, f as DialogTrigger, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription } from './dialog-DK5BU-Za.js';
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from './select-Ce9M_rda.js';
import { T as Textarea } from './textarea-D9C69N9T.js';
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from './tabs-CjCc2DlV.js';
import './chart-libs-Cdz70zdY.js';
import './index-Ls-C4DWD.js';
import './index-BfAAoDv6.js';

const useSupabaseFidelidade = () => {
  const { user } = useAuth();
  const [loading, setLoading] = reactExports.useState(false);
  const [programa, setPrograma] = reactExports.useState(null);
  const [recompensas, setRecompensas] = reactExports.useState([]);
  const [estatisticas, setEstatisticas] = reactExports.useState(null);
  const [ranking, setRanking] = reactExports.useState([]);
  const [classes, setClasses] = reactExports.useState([]);
  const parseValor = (v) => {
    if (typeof v === "number") return v;
    if (typeof v === "string") {
      const s = v.replace(/\./g, "").replace(",", ".");
      const n = Number(s);
      return isNaN(n) ? 0 : n;
    }
    return 0;
  };
  const carregarPrograma = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase.from("programas_fidelidade").select("*").eq("user_id", user.id).single();
      if (error && error.code !== "PGRST116") throw error;
      setPrograma(data);
    } catch (error) {
      console.error("Erro ao carregar programa:", error);
    }
  };
  const sincronizarDoHistorico = async () => {
    if (!user) {
      Jt.error("Usuário não autenticado");
      return false;
    }
    await carregarPrograma();
    if (!programa || !programa.ativo) {
      Jt.error("Ative o programa de fidelidade antes de sincronizar");
      return false;
    }
    try {
      setLoading(true);
      const { data: ags, error: errAg } = await supabase.from("agendamentos").select("id, cliente_id, valor, valor_pago, status, status_pagamento").eq("user_id", user.id).eq("status", "concluido").eq("status_pagamento", "pago");
      if (errAg) throw errAg;
      const ppr = Number(programa.pontos_por_real || 1);
      const expDias = Number(programa.expiracao_pontos_dias || 0);
      let inseridos = 0;
      for (const a of ags || []) {
        const valorBase = parseValor(a.valor_pago) > 0 ? parseValor(a.valor_pago) : parseValor(a.valor);
        const pontos = Math.floor(valorBase * (isNaN(ppr) ? 1 : ppr));
        if (pontos <= 0) continue;
        const { data: existe } = await supabase.from("pontos_fidelidade").select("id").eq("user_id", user.id).eq("origem", "agendamento").eq("origem_id", a.id).limit(1);
        if (existe && existe.length > 0) continue;
        const dataExp = expDias > 0 ? new Date(Date.now() + expDias * 24 * 60 * 60 * 1e3).toISOString().split("T")[0] : null;
        await supabase.from("pontos_fidelidade").insert({
          user_id: user.id,
          cliente_id: a.cliente_id,
          pontos,
          origem: "agendamento",
          origem_id: a.id,
          descricao: "Pontos sincronizados do histórico",
          data_expiracao: dataExp,
          expirado: false
        });
        inseridos++;
      }
      const { data: saldos } = await supabase.from("saldo_pontos").select("*").eq("user_id", user.id);
      const { data: cls } = await supabase.from("classes_fidelidade").select("*").eq("user_id", user.id).order("pontos_minimos", { ascending: true });
      for (const s of saldos || []) {
        const pontosTotais = Number(s.pontos_ganhos || 0);
        const disponiveis = Number(s.pontos_disponiveis || 0);
        let nivel = "Bronze";
        if (cls && cls.length > 0) {
          for (const c of cls) {
            if (pontosTotais >= Number(c.pontos_minimos || 0)) {
              nivel = c.nome;
            }
          }
        }
        await supabase.from("niveis_fidelidade").upsert({
          user_id: user.id,
          cliente_id: s.cliente_id,
          nivel,
          pontos_totais: pontosTotais,
          pontos_disponiveis: disponiveis,
          total_resgates: 0,
          data_atualizacao: (/* @__PURE__ */ new Date()).toISOString()
        }, { onConflict: "user_id,cliente_id" });
      }
      await carregarEstatisticas();
      await carregarRanking();
      Jt.success(`Sincronização concluída${inseridos ? ` (${inseridos} créditos novos)` : ""}`);
      return true;
    } catch (error) {
      console.error("Erro ao sincronizar histórico:", error);
      Jt.error("Erro ao sincronizar pontos do histórico");
      return false;
    } finally {
      setLoading(false);
    }
  };
  const carregarRecompensas = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase.from("recompensas").select("*").eq("user_id", user.id).order("pontos_necessarios", { ascending: true });
      if (error) throw error;
      setRecompensas(data || []);
    } catch (error) {
      console.error("Erro ao carregar recompensas:", error);
    }
  };
  const carregarEstatisticas = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase.from("estatisticas_fidelidade").select("*").eq("user_id", user.id).single();
      if (error && error.code !== "PGRST116") throw error;
      setEstatisticas(data);
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    }
  };
  const carregarRanking = async (limite = 10) => {
    if (!user) return;
    try {
      setLoading(true);
      const { data, error } = await supabase.from("ranking_fidelidade").select("*").eq("user_id", user.id).gt("pontos_totais", 0).order("pontos_totais", { ascending: false }).limit(limite);
      if (error) throw error;
      const rankingRecalculado = (data || []).map((item, index) => ({
        ...item,
        ranking: index + 1
      }));
      setRanking(rankingRecalculado);
    } catch (error) {
      console.error("Erro ao carregar ranking:", error);
    } finally {
      setLoading(false);
    }
  };
  const carregarClasses = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase.from("classes_fidelidade").select("*").eq("user_id", user.id).order("ordem", { ascending: true });
      if (error) throw error;
      setClasses(data || []);
    } catch (error) {
      console.error("Erro ao carregar classes:", error);
    }
  };
  const salvarPrograma = async (dados) => {
    if (!user) return null;
    try {
      setLoading(true);
      if (programa) {
        const { data, error } = await supabase.from("programas_fidelidade").update({
          ...dados,
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        }).eq("id", programa.id).select().single();
        if (error) throw error;
        setPrograma(data);
        Jt.success("Programa atualizado com sucesso!");
        return data;
      } else {
        const { data, error } = await supabase.from("programas_fidelidade").insert({
          ...dados,
          user_id: user.id
        }).select().single();
        if (error) throw error;
        setPrograma(data);
        Jt.success("Programa criado com sucesso!");
        return data;
      }
    } catch (error) {
      console.error("Erro ao salvar programa:", error);
      Jt.error("Erro ao salvar programa de fidelidade");
      return null;
    } finally {
      setLoading(false);
    }
  };
  const togglePrograma = async () => {
    if (!programa || !user) return;
    try {
      const { data, error } = await supabase.from("programas_fidelidade").update({ ativo: !programa.ativo }).eq("id", programa.id).select().single();
      if (error) throw error;
      setPrograma(data);
      Jt.success(data.ativo ? "Programa ativado!" : "Programa desativado!");
    } catch (error) {
      console.error("Erro ao alterar status do programa:", error);
      Jt.error("Erro ao alterar status do programa");
    }
  };
  const criarRecompensa = async (dados) => {
    if (!user) return null;
    try {
      setLoading(true);
      const { data, error } = await supabase.from("recompensas").insert({
        ...dados,
        user_id: user.id
      }).select().single();
      if (error) throw error;
      await carregarRecompensas();
      Jt.success("Recompensa criada com sucesso!");
      return data;
    } catch (error) {
      console.error("Erro ao criar recompensa:", error);
      Jt.error("Erro ao criar recompensa");
      return null;
    } finally {
      setLoading(false);
    }
  };
  const atualizarRecompensa = async (id, dados) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("recompensas").update({
        ...dados,
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      }).eq("id", id).select().single();
      if (error) throw error;
      await carregarRecompensas();
      Jt.success("Recompensa atualizada!");
      return data;
    } catch (error) {
      console.error("Erro ao atualizar recompensa:", error);
      Jt.error("Erro ao atualizar recompensa");
      return null;
    } finally {
      setLoading(false);
    }
  };
  const excluirRecompensa = async (id) => {
    try {
      setLoading(true);
      const { error } = await supabase.from("recompensas").delete().eq("id", id);
      if (error) throw error;
      await carregarRecompensas();
      Jt.success("Recompensa excluída!");
    } catch (error) {
      console.error("Erro ao excluir recompensa:", error);
      Jt.error("Erro ao excluir recompensa");
    } finally {
      setLoading(false);
    }
  };
  const criarClasse = async (dados) => {
    if (!user) return null;
    try {
      setLoading(true);
      const { data, error } = await supabase.from("classes_fidelidade").insert({
        ...dados,
        user_id: user.id
      }).select().single();
      if (error) throw error;
      await carregarClasses();
      Jt.success("Classe criada com sucesso!");
      return data;
    } catch (error) {
      console.error("Erro ao criar classe:", error);
      Jt.error("Erro ao criar classe");
      return null;
    } finally {
      setLoading(false);
    }
  };
  const atualizarClasse = async (id, dados) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("classes_fidelidade").update({
        ...dados,
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      }).eq("id", id).select().single();
      if (error) throw error;
      await carregarClasses();
      Jt.success("Classe atualizada!");
      return data;
    } catch (error) {
      console.error("Erro ao atualizar classe:", error);
      Jt.error("Erro ao atualizar classe");
      return null;
    } finally {
      setLoading(false);
    }
  };
  const excluirClasse = async (id) => {
    try {
      setLoading(true);
      const { error } = await supabase.from("classes_fidelidade").delete().eq("id", id);
      if (error) throw error;
      await carregarClasses();
      Jt.success("Classe excluída!");
    } catch (error) {
      console.error("Erro ao excluir classe:", error);
      Jt.error("Erro ao excluir classe");
    } finally {
      setLoading(false);
    }
  };
  const buscarSaldoCliente = async (clienteId) => {
    if (!user) return null;
    try {
      const { data, error } = await supabase.from("saldo_pontos").select("*").eq("user_id", user.id).eq("cliente_id", clienteId).single();
      if (error && error.code !== "PGRST116") throw error;
      return data;
    } catch (error) {
      console.error("Erro ao buscar saldo:", error);
      return null;
    }
  };
  const buscarNivelCliente = async (clienteId) => {
    if (!user) return null;
    try {
      const { data, error } = await supabase.from("niveis_fidelidade").select("*").eq("user_id", user.id).eq("cliente_id", clienteId).single();
      if (error && error.code !== "PGRST116") throw error;
      return data;
    } catch (error) {
      console.error("Erro ao buscar nível:", error);
      return null;
    }
  };
  const buscarHistoricoPontos = async (clienteId) => {
    if (!user) return [];
    try {
      const { data, error } = await supabase.from("pontos_fidelidade").select("*").eq("user_id", user.id).eq("cliente_id", clienteId).order("data_ganho", { ascending: false }).limit(50);
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Erro ao buscar histórico:", error);
      return [];
    }
  };
  const adicionarPontosManual = async (clienteId, pontos, descricao) => {
    if (!user || !programa) return null;
    try {
      setLoading(true);
      const dataExpiracao = programa.expiracao_pontos_dias > 0 ? new Date(Date.now() + programa.expiracao_pontos_dias * 24 * 60 * 60 * 1e3).toISOString().split("T")[0] : null;
      const { data, error } = await supabase.from("pontos_fidelidade").insert({
        user_id: user.id,
        cliente_id: clienteId,
        pontos,
        origem: "bonus",
        descricao,
        data_expiracao: dataExpiracao
      }).select().single();
      if (error) throw error;
      Jt.success(`${pontos} pontos adicionados!`);
      return data;
    } catch (error) {
      console.error("Erro ao adicionar pontos:", error);
      Jt.error("Erro ao adicionar pontos");
      return null;
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    if (!user) return;
    const channel = supabase.channel("fidelidade-changes").on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "programas_fidelidade",
        filter: `user_id=eq.${user.id}`
      },
      () => {
        carregarPrograma();
      }
    ).on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "recompensas",
        filter: `user_id=eq.${user.id}`
      },
      () => {
        carregarRecompensas();
      }
    ).on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "classes_fidelidade",
        filter: `user_id=eq.${user.id}`
      },
      () => {
        carregarClasses();
      }
    ).on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "pontos_fidelidade",
        filter: `user_id=eq.${user.id}`
      },
      () => {
        carregarEstatisticas();
        carregarRanking();
      }
    ).on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "historico_resgates",
        filter: `user_id=eq.${user.id}`
      },
      () => {
        carregarEstatisticas();
        carregarRanking();
      }
    ).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);
  reactExports.useEffect(() => {
    if (user) {
      carregarPrograma();
      carregarRecompensas();
      carregarEstatisticas();
      carregarRanking();
      carregarClasses();
    }
  }, [user]);
  return {
    loading,
    programa,
    recompensas,
    estatisticas,
    ranking,
    classes,
    salvarPrograma,
    togglePrograma,
    criarRecompensa,
    atualizarRecompensa,
    excluirRecompensa,
    criarClasse,
    atualizarClasse,
    excluirClasse,
    buscarSaldoCliente,
    buscarNivelCliente,
    buscarHistoricoPontos,
    adicionarPontosManual,
    sincronizarDoHistorico,
    carregarRanking,
    recarregar: () => {
      carregarPrograma();
      carregarRecompensas();
      carregarEstatisticas();
      carregarRanking();
      carregarClasses();
    }
  };
};

const ProgramaFidelidadeConfig = () => {
  const { programa, loading, salvarPrograma, togglePrograma } = useSupabaseFidelidade();
  const [editando, setEditando] = reactExports.useState(false);
  const [formData, setFormData] = reactExports.useState({
    nome: programa?.nome || "Programa de Fidelidade",
    pontos_por_real: programa?.pontos_por_real || 0.1,
    expiracao_pontos_dias: programa?.expiracao_pontos_dias || 365,
    data_inicio: programa?.data_inicio || (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    const sucesso = await salvarPrograma(formData);
    if (sucesso) {
      setEditando(false);
    }
  };
  const handleEdit = () => {
    if (programa) {
      setFormData({
        nome: programa.nome,
        pontos_por_real: programa.pontos_por_real,
        expiracao_pontos_dias: programa.expiracao_pontos_dias,
        data_inicio: programa.data_inicio
      });
    }
    setEditando(true);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-5 w-5 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Configurações do Programa" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
          programa && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "programa-ativo", children: "Ativo" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Switch,
              {
                id: "programa-ativo",
                checked: programa.ativo,
                onCheckedChange: togglePrograma
              }
            )
          ] }),
          !editando && programa && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: handleEdit, children: "Editar" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Configure as regras do seu programa de fidelidade" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: !programa && !editando ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-4", children: "Você ainda não configurou seu programa de fidelidade" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleEdit, children: "Criar Programa" })
    ] }) : editando ? /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "nome", children: "Nome do Programa" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "nome",
            value: formData.nome,
            onChange: (e) => setFormData({ ...formData, nome: e.target.value }),
            placeholder: "Ex: Clube VIP, Fidelidade Premium",
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "pontos_por_real", children: "Pontos por Real Gasto" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "pontos_por_real",
            type: "number",
            step: "0.01",
            min: "0",
            value: formData.pontos_por_real,
            onChange: (e) => setFormData({ ...formData, pontos_por_real: parseFloat(e.target.value) }),
            required: true
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: formData.pontos_por_real > 0 && `Clientes ganharão ${(formData.pontos_por_real * 100).toFixed(0)} pontos a cada R$ 100,00 gastos` })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "expiracao", children: "Validade dos Pontos (dias)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "expiracao",
            type: "number",
            min: "0",
            value: formData.expiracao_pontos_dias,
            onChange: (e) => setFormData({ ...formData, expiracao_pontos_dias: parseInt(e.target.value) }),
            required: true
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: formData.expiracao_pontos_dias === 0 ? "Pontos não expiram" : `Pontos expiram após ${formData.expiracao_pontos_dias} dias` })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "data_inicio", children: "Data de Início" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "data_inicio",
            type: "date",
            value: formData.data_inicio,
            onChange: (e) => setFormData({ ...formData, data_inicio: e.target.value }),
            required: true
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Data em que o programa começa a valer" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", disabled: loading, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4 mr-2" }),
          "Salvar"
        ] }),
        programa && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            onClick: () => setEditando(false),
            children: "Cancelar"
          }
        )
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-muted-foreground", children: "Nome" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-medium", children: programa?.nome })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-muted-foreground", children: "Pontos por Real" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-lg font-medium", children: [
          (programa.pontos_por_real * 100).toFixed(0),
          " pontos / R$ 100"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-muted-foreground", children: "Validade" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-medium", children: programa.expiracao_pontos_dias === 0 ? "Pontos não expiram" : `${programa.expiracao_pontos_dias} dias` })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-muted-foreground", children: "Data de Início" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-medium", children: new Date(programa.data_inicio).toLocaleDateString("pt-BR") })
      ] })
    ] }) })
  ] });
};

const EstatisticasFidelidade = () => {
  const { estatisticas, sincronizarDoHistorico, recarregar, loading } = useSupabaseFidelidade();
  reactExports.useEffect(() => {
    const key = "fid_last_sync";
    const last = localStorage.getItem(key);
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1e3;
    if (!last || now - parseInt(last) > dayMs) {
      (async () => {
        const ok = await sincronizarDoHistorico();
        if (ok) {
          localStorage.setItem(key, String(now));
          recarregar();
        }
      })();
    }
  }, [sincronizarDoHistorico, recarregar]);
  const stats = [
    {
      title: "Clientes no Programa",
      value: estatisticas?.total_clientes_programa || 0,
      icon: Users,
      color: "text-info"
    },
    {
      title: "Pontos Distribuídos",
      value: estatisticas?.total_pontos_distribuidos || 0,
      icon: Award,
      color: "text-success"
    },
    {
      title: "Pontos Resgatados",
      value: estatisticas?.total_pontos_resgatados || 0,
      icon: Gift,
      color: "text-primary"
    },
    {
      title: "Clientes Ativos (30d)",
      value: estatisticas?.clientes_ativos_30d || 0,
      icon: TrendingUp,
      color: "text-warning"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        variant: "outline",
        className: "gap-2",
        onClick: async () => {
          const ok = await sincronizarDoHistorico();
          if (ok) recarregar();
        },
        disabled: loading,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: `h-4 w-4 ${loading ? "animate-spin" : ""}` }),
          loading ? "Sincronizando..." : "Sincronizar do Histórico"
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-4", children: stats.map((stat) => {
      const Icon = stat.icon;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium", children: stat.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `h-4 w-4 ${stat.color}` })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold", children: stat.value.toLocaleString() }) })
      ] }, stat.title);
    }) })
  ] });
};

const RecompensasList = () => {
  const { recompensas, classes, loading, criarRecompensa, atualizarRecompensa, excluirRecompensa } = useSupabaseFidelidade();
  const [dialogOpen, setDialogOpen] = reactExports.useState(false);
  const [editandoId, setEditandoId] = reactExports.useState(null);
  const [formData, setFormData] = reactExports.useState({
    nome: "",
    descricao: "",
    pontos_necessarios: 0,
    tipo: "desconto_percentual",
    valor_desconto: 0,
    classe_id: void 0,
    validade_dias: 30
  });
  const resetForm = () => {
    setFormData({
      nome: "",
      descricao: "",
      pontos_necessarios: 0,
      tipo: "desconto_percentual",
      valor_desconto: 0,
      classe_id: void 0,
      validade_dias: 30
    });
    setEditandoId(null);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editandoId) {
      await atualizarRecompensa(editandoId, formData);
    } else {
      await criarRecompensa(formData);
    }
    setDialogOpen(false);
    resetForm();
  };
  const handleEdit = (recompensa) => {
    setFormData({
      nome: recompensa.nome,
      descricao: recompensa.descricao || "",
      pontos_necessarios: recompensa.pontos_necessarios,
      tipo: recompensa.tipo,
      valor_desconto: recompensa.valor_desconto,
      classe_id: recompensa.classe_id,
      validade_dias: recompensa.validade_dias
    });
    setEditandoId(recompensa.id);
    setDialogOpen(true);
  };
  const handleDelete = async (id) => {
    if (confirm("Tem certeza que deseja excluir esta recompensa?")) {
      await excluirRecompensa(id);
    }
  };
  const getTipoLabel = (tipo) => {
    const tipos = {
      desconto_percentual: "Desconto %",
      desconto_valor: "Desconto R$",
      servico_gratis: "Serviço Grátis"
    };
    return tipos[tipo] || tipo;
  };
  const getClasseNome = (classeId) => {
    if (!classeId) return "Todas";
    const classe = classes.find((c) => c.id === classeId);
    return classe?.nome || "Todas";
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { className: "h-5 w-5 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Recompensas" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: dialogOpen, onOpenChange: (open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-2" }),
            "Nova Recompensa"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-2xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: editandoId ? "Editar Recompensa" : "Nova Recompensa" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Configure uma recompensa para seus clientes fiéis" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "nome", children: "Nome da Recompensa" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "nome",
                      value: formData.nome,
                      onChange: (e) => setFormData({ ...formData, nome: e.target.value }),
                      placeholder: "Ex: 10% de desconto",
                      required: true
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "descricao", children: "Descrição" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Textarea,
                    {
                      id: "descricao",
                      value: formData.descricao,
                      onChange: (e) => setFormData({ ...formData, descricao: e.target.value }),
                      placeholder: "Detalhes da recompensa...",
                      rows: 2
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "pontos", children: "Pontos Necessários" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "pontos",
                      type: "number",
                      min: "0",
                      value: formData.pontos_necessarios,
                      onChange: (e) => setFormData({ ...formData, pontos_necessarios: parseInt(e.target.value) }),
                      required: true
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "tipo", children: "Tipo" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Select,
                    {
                      value: formData.tipo,
                      onValueChange: (value) => setFormData({ ...formData, tipo: value }),
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "desconto_percentual", children: "Desconto %" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "desconto_valor", children: "Desconto R$" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "servico_gratis", children: "Serviço Grátis" })
                        ] })
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "valor", children: "Valor do Desconto" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "valor",
                      type: "number",
                      min: "0",
                      step: formData.tipo === "desconto_percentual" ? "1" : "0.01",
                      value: formData.valor_desconto,
                      onChange: (e) => setFormData({ ...formData, valor_desconto: parseFloat(e.target.value) }),
                      required: true
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "classe", children: "Classe Exclusiva" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Select,
                    {
                      value: formData.classe_id || "todas",
                      onValueChange: (value) => setFormData({ ...formData, classe_id: value === "todas" ? void 0 : value }),
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Todas as classes" }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "todas", children: "Todas as classes" }),
                          classes.map((classe) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: classe.id, children: classe.nome }, classe.id))
                        ] })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Restrinja esta recompensa a uma classe específica" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "validade", children: "Validade (dias)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "validade",
                      type: "number",
                      min: "1",
                      value: formData.validade_dias,
                      onChange: (e) => setFormData({ ...formData, validade_dias: parseInt(e.target.value) }),
                      required: true
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", disabled: loading, className: "w-full", children: [
                editandoId ? "Atualizar" : "Criar",
                " Recompensa"
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Configure recompensas que seus clientes podem resgatar com pontos" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: recompensas.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Nenhuma recompensa cadastrada. Crie recompensas para incentivar seus clientes." }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Nome" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Tipo" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Pontos" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Valor" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Classe" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Ações" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: recompensas.map((recompensa) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: recompensa.nome }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: getTipoLabel(recompensa.tipo) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { children: [
          recompensa.pontos_necessarios,
          " pts"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: recompensa.tipo === "desconto_percentual" ? `${recompensa.valor_desconto}%` : recompensa.tipo === "desconto_valor" ? `R$ ${recompensa.valor_desconto.toFixed(2)}` : "-" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", children: getClasseNome(recompensa.classe_id) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: recompensa.ativo ? "default" : "secondary", children: recompensa.ativo ? "Ativo" : "Inativo" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: () => handleEdit(recompensa),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: () => handleDelete(recompensa.id),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
            }
          )
        ] }) })
      ] }, recompensa.id)) })
    ] }) })
  ] });
};

const ResgateRecompensaDialog = ({
  cliente,
  open,
  onOpenChange,
  onResgate
}) => {
  const { recompensas } = useSupabaseFidelidade();
  const [recompensaSelecionada, setRecompensaSelecionada] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [recompensasDisponiveis, setRecompensasDisponiveis] = reactExports.useState([]);
  reactExports.useEffect(() => {
    const disponiveis = recompensas.filter((r) => {
      if (!r.ativo) return false;
      if (r.pontos_necessarios > cliente.pontos_disponiveis) return false;
      if (r.classe_id && cliente.classe_nome) {
        return true;
      }
      return true;
    });
    setRecompensasDisponiveis(disponiveis);
  }, [recompensas, cliente]);
  const handleResgate = async () => {
    if (!recompensaSelecionada) {
      Jt.error("Selecione uma recompensa");
      return;
    }
    const recompensa = recompensas.find((r) => r.id === recompensaSelecionada);
    if (!recompensa) return;
    try {
      setLoading(true);
      const dataExpiracao = /* @__PURE__ */ new Date();
      dataExpiracao.setDate(dataExpiracao.getDate() + recompensa.validade_dias);
      const { data: resgate, error: erroResgate } = await supabase.from("historico_resgates").insert({
        user_id: cliente.user_id,
        cliente_id: cliente.cliente_id,
        recompensa_id: recompensa.id,
        pontos_gastos: recompensa.pontos_necessarios,
        data_expiracao: dataExpiracao.toISOString().split("T")[0]
      }).select().single();
      if (erroResgate) throw erroResgate;
      const { error: erroPontos } = await supabase.from("pontos_fidelidade").insert({
        user_id: cliente.user_id,
        cliente_id: cliente.cliente_id,
        pontos: -recompensa.pontos_necessarios,
        origem: "resgate",
        origem_id: resgate.id,
        descricao: `Resgate: ${recompensa.nome}`
      });
      if (erroPontos) throw erroPontos;
      const mensagem = `🎁 *Recompensa Resgatada!*

Olá ${cliente.cliente_nome}!

Você resgatou: *${recompensa.nome}*
Pontos gastos: ${recompensa.pontos_necessarios}
Pontos restantes: ${cliente.pontos_disponiveis - recompensa.pontos_necessarios}

${recompensa.descricao || ""}

Válido até: ${new Date(dataExpiracao).toLocaleDateString("pt-BR")}

Apresente esta mensagem no seu próximo atendimento! ✨`;
      const telefone = cliente.telefone.replace(/\D/g, "");
      const whatsappUrl = `https://wa.me/55${telefone}?text=${encodeURIComponent(mensagem)}`;
      window.open(whatsappUrl, "_blank");
      Jt.success("Resgate realizado! WhatsApp aberto para enviar confirmação.");
      onResgate();
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao resgatar recompensa:", error);
      Jt.error("Erro ao processar resgate");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { className: "h-5 w-5 text-primary" }),
        "Resgatar Recompensa"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
        "Cliente: ",
        cliente.cliente_nome
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDescription, { children: [
          "Pontos disponíveis: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: cliente.pontos_disponiveis })
        ] })
      ] }),
      recompensasDisponiveis.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Alert, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { children: "Este cliente não tem pontos suficientes para resgatar nenhuma recompensa no momento." }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Selecione a Recompensa" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: recompensaSelecionada, onValueChange: setRecompensaSelecionada, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Escolha uma recompensa" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: recompensasDisponiveis.map((recompensa) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: recompensa.id, children: [
              recompensa.nome,
              " - ",
              recompensa.pontos_necessarios,
              " pontos"
            ] }, recompensa.id)) })
          ] })
        ] }),
        recompensaSelecionada && (() => {
          const r = recompensas.find((x) => x.id === recompensaSelecionada);
          return r ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border rounded-lg bg-muted/50 space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-medium", children: r.nome }),
            r.descricao && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: r.descricao }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                "Pontos necessários: ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: r.pontos_necessarios })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                "Validade: ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                  r.validade_dias,
                  " dias"
                ] })
              ] })
            ] })
          ] }) : null;
        })(),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: handleResgate,
            disabled: !recompensaSelecionada || loading,
            className: "w-full",
            children: loading ? "Processando..." : "Resgatar e Enviar WhatsApp"
          }
        )
      ] })
    ] })
  ] }) });
};

const RankingClientes = () => {
  const { ranking, carregarRanking, classes, sincronizarDoHistorico, loading } = useSupabaseFidelidade();
  const [clienteSelecionado, setClienteSelecionado] = reactExports.useState(null);
  const [dialogAberto, setDialogAberto] = reactExports.useState(false);
  const [limite, setLimite] = reactExports.useState(10);
  const [classeFiltro, setClasseFiltro] = reactExports.useState("todas");
  const [busca, setBusca] = reactExports.useState("");
  const handleAbrirResgate = (cliente) => {
    setClienteSelecionado(cliente);
    setDialogAberto(true);
  };
  const handleResgate = () => {
    carregarRanking(limite);
  };
  const handleSincronizar = async () => {
    const sucesso = await sincronizarDoHistorico();
    if (sucesso) {
      carregarRanking(limite);
    }
  };
  reactExports.useEffect(() => {
    carregarRanking(limite);
  }, [limite]);
  const listaFiltrada = reactExports.useMemo(() => {
    return (ranking || []).filter((c) => (c.pontos_totais || 0) > 0).filter((c) => classeFiltro === "todas" || c.classe_nome === classeFiltro).filter((c) => {
      if (!busca.trim()) return true;
      const s = busca.toLowerCase();
      return (c.cliente_nome || "").toLowerCase().includes(s) || (c.telefone || "").includes(s);
    }).sort((a, b) => (b.pontos_totais || 0) - (a.pontos_totais || 0));
  }, [ranking, classeFiltro, busca]);
  const getNivelBadge = (cliente) => {
    if (cliente.classe_nome && cliente.classe_cor) {
      return {
        color: "border",
        label: cliente.classe_nome,
        style: { backgroundColor: cliente.classe_cor, color: "#fff" }
      };
    }
    return {
      color: "bg-muted text-muted-foreground",
      label: "Sem classe",
      style: void 0
    };
  };
  const getRankingIcon = (pos) => {
    if (pos === 1) return /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "h-5 w-5 text-accent" });
    if (pos === 2) return /* @__PURE__ */ jsxRuntimeExports.jsx(Medal, { className: "h-5 w-5 text-muted-foreground" });
    if (pos === 3) return /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "h-5 w-5 text-warning" });
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-medium text-muted-foreground", children: [
      "#",
      pos
    ] });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "h-5 w-5 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Top 10 Clientes" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Ranking dos clientes mais engajados no programa" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: classeFiltro, onValueChange: setClasseFiltro, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-[220px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Filtrar por classe" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "todas", children: "Todas as classes" }),
              classes.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c.nome, children: c.nome }, c.id))
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              value: busca,
              onChange: (e) => setBusca(e.target.value),
              placeholder: "Buscar por nome ou telefone",
              className: "h-9 px-3 rounded-md border bg-background"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setLimite(10), children: "Top 10" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setLimite(100), children: "Ver todos" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: listaFiltrada.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-12 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Nenhum cliente com pontos encontrado no programa ainda." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          onClick: handleSincronizar,
          disabled: loading,
          className: "gap-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: `h-4 w-4 ${loading ? "animate-spin" : ""}` }),
            "Sincronizar Pontos do Histórico"
          ]
        }
      )
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: listaFiltrada.map((cliente) => {
      const nivelInfo = getNivelBadge(cliente);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center w-10", children: getRankingIcon(cliente.ranking) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: cliente.cliente_nome }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: cliente.telefone })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-lg font-bold text-primary", children: [
                  cliente.pontos_totais,
                  " pts"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground", children: [
                  cliente.pontos_disponiveis,
                  " disponíveis"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    className: nivelInfo.color,
                    style: nivelInfo.style,
                    children: nivelInfo.label
                  }
                ),
                cliente.pontos_disponiveis > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    size: "sm",
                    variant: "outline",
                    onClick: () => handleAbrirResgate(cliente),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { className: "h-4 w-4 mr-1" }),
                      "Resgatar"
                    ]
                  }
                )
              ] })
            ] })
          ]
        },
        cliente.cliente_id
      );
    }) }) }),
    clienteSelecionado && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ResgateRecompensaDialog,
      {
        cliente: clienteSelecionado,
        open: dialogAberto,
        onOpenChange: setDialogAberto,
        onResgate: handleResgate
      }
    )
  ] });
};

const ClassesFidelidadeList = () => {
  const { classes, loading, criarClasse, atualizarClasse, excluirClasse } = useSupabaseFidelidade();
  const [dialogAberto, setDialogAberto] = reactExports.useState(false);
  const [editando, setEditando] = reactExports.useState(null);
  const [formData, setFormData] = reactExports.useState({
    nome: "",
    pontos_minimos: 0,
    cor: "#94a3b8",
    beneficios: "",
    ordem: classes.length
  });
  const resetForm = () => {
    setFormData({
      nome: "",
      pontos_minimos: 0,
      cor: "#94a3b8",
      beneficios: "",
      ordem: classes.length
    });
    setEditando(null);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const sucesso = editando ? await atualizarClasse(editando, formData) : await criarClasse(formData);
    if (sucesso) {
      setDialogAberto(false);
      resetForm();
    }
  };
  const handleEdit = (classe) => {
    setFormData({
      nome: classe.nome,
      pontos_minimos: classe.pontos_minimos,
      cor: classe.cor,
      beneficios: classe.beneficios || "",
      ordem: classe.ordem
    });
    setEditando(classe.id);
    setDialogAberto(true);
  };
  const handleDelete = async (id) => {
    if (confirm("Deseja realmente excluir esta classe?")) {
      await excluirClasse(id);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "h-5 w-5 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Classes de Fidelidade" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: dialogAberto, onOpenChange: (open) => {
          setDialogAberto(open);
          if (!open) resetForm();
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-2" }),
            "Nova Classe"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: editando ? "Editar Classe" : "Nova Classe" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "nome", children: "Nome da Classe" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "nome",
                    value: formData.nome,
                    onChange: (e) => setFormData({ ...formData, nome: e.target.value }),
                    placeholder: "Ex: Bronze, Prata, Ouro, Platina",
                    required: true
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "pontos_minimos", children: "Pontos Mínimos" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "pontos_minimos",
                    type: "number",
                    min: "0",
                    value: formData.pontos_minimos,
                    onChange: (e) => setFormData({ ...formData, pontos_minimos: parseInt(e.target.value) }),
                    required: true
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Pontos necessários para alcançar esta classe" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "cor", children: "Cor" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "cor",
                      type: "color",
                      value: formData.cor,
                      onChange: (e) => setFormData({ ...formData, cor: e.target.value }),
                      className: "w-20"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      type: "text",
                      value: formData.cor,
                      onChange: (e) => setFormData({ ...formData, cor: e.target.value }),
                      placeholder: "#94a3b8"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "beneficios", children: "Benefícios" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    id: "beneficios",
                    value: formData.beneficios,
                    onChange: (e) => setFormData({ ...formData, beneficios: e.target.value }),
                    placeholder: "Descreva os benefícios desta classe...",
                    rows: 3
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "ordem", children: "Ordem de Exibição" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "ordem",
                    type: "number",
                    min: "0",
                    value: formData.ordem,
                    onChange: (e) => setFormData({ ...formData, ordem: parseInt(e.target.value) }),
                    required: true
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Menor número aparece primeiro" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", disabled: loading, className: "w-full", children: [
                editando ? "Atualizar" : "Criar",
                " Classe"
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Configure as classes/níveis do seu programa de fidelidade" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: classes.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Nenhuma classe configurada. Crie classes para organizar seus clientes por nível de fidelidade." }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Ordem" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Nome" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Pontos Mínimos" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Cor" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Benefícios" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Ações" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: classes.map((classe) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: classe.ordem }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: classe.nome }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { children: [
          classe.pontos_minimos,
          " pts"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-6 h-6 rounded border",
              style: { backgroundColor: classe.cor }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: classe.cor })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "max-w-xs truncate", children: classe.beneficios || "-" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: () => handleEdit(classe),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: () => handleDelete(classe.id),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
            }
          )
        ] }) })
      ] }, classe.id)) })
    ] }) })
  ] });
};

function Marketing() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 sm:space-y-8 p-3 sm:p-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "h-5 w-5 sm:h-6 sm:w-6 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl sm:text-3xl font-bold", children: "Fidelidade" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs sm:text-base text-muted-foreground", children: "Programa de recompensas" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(EstatisticasFidelidade, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "configuracao", className: "space-y-4 sm:space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-full grid-cols-3 bg-muted p-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "configuracao", className: "text-xs sm:text-sm", children: "Configuração" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "recompensas", className: "text-xs sm:text-sm", children: "Recompensas" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "clientes", className: "text-xs sm:text-sm", children: "Clientes" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "configuracao", className: "space-y-4 sm:space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ProgramaFidelidadeConfig, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ClassesFidelidadeList, {})
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "recompensas", className: "space-y-4 sm:space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RecompensasList, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "clientes", className: "space-y-4 sm:space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RankingClientes, {}) })
    ] })
  ] });
}

export { Marketing as default };
