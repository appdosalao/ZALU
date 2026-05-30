import { r as reactExports, j as jsxRuntimeExports } from './react-vendor-BpXfDOw7.js';
import { u as useSearchParams, a as useNavigate, b as useAuth, J as Jt, I as InstallPrompt, A as AppLogo, B as Badge, C as Card, c as CardHeader, d as CardTitle, e as CardContent, S as Skeleton, f as CardDescription, g as Button } from './index-BxmTkSue.js';
import { u as useAgendamentos } from './useAgendamentos-CqqJ1YJQ.js';
import { u as useLancamentos } from './useLancamentos-Bnp6CUC4.js';
import { i as Sparkles, K as Calendar, V as DollarSign, Q as Clock, ae as TrendingUp, af as PiggyBank, U as Users, ag as Plus, ah as CalendarPlus, ai as UserCheck, aj as Wallet, N as Scissors, _ as Package, Y as Megaphone } from './ui-libs-BJEWQG8b.js';
import { R as ResponsiveContainer, B as BarChart, C as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip, a as ReferenceLine, b as Bar, d as Cell } from './chart-libs-Cdz70zdY.js';
import './useSupabaseAgendamentos-O5V4jZ47.js';
import './useServicos-D2x3NEpY.js';
import './useSupabaseClientes-BZkRJk2t.js';

function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { agendamentosFiltrados, loading: loadingAgendamentos } = useAgendamentos();
  const { lancamentos, loading: loadingLancamentos } = useLancamentos();
  const { usuario, refreshProfile } = useAuth();
  reactExports.useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    if (paymentStatus === "success") {
      setSearchParams({});
      const MAX_RETRIES = 10;
      const RETRY_INTERVAL = 3e3;
      let retries = 0;
      const checkSubscription = async () => {
        const toastId = Jt.loading(`Verificando assinatura... (Tentativa ${retries + 1}/${MAX_RETRIES})`);
        try {
          await refreshProfile();
          if (usuario?.subscription_status === "active" || usuario?.paid_access) {
            Jt.success("🎉 Assinatura confirmada! Bem-vindo ao Salão de Bolso Pro.", { id: toastId });
            return;
          }
          if (retries < MAX_RETRIES - 1) {
            retries++;
            setTimeout(checkSubscription, RETRY_INTERVAL);
            Jt.dismiss(toastId);
          } else {
            Jt.error("O pagamento foi processado, mas a liberação automática falhou. Por favor, aguarde alguns minutos ou entre em contato com o suporte.", {
              id: toastId,
              duration: 1e4
            });
          }
        } catch (error) {
          console.error("Erro ao verificar assinatura:", error);
          if (retries < MAX_RETRIES - 1) {
            retries++;
            setTimeout(checkSubscription, RETRY_INTERVAL);
          }
          Jt.dismiss(toastId);
        }
      };
      Jt.success("🎉 Pagamento recebido com sucesso!");
      void checkSubscription();
    }
  }, [searchParams, setSearchParams, refreshProfile, usuario?.subscription_status, usuario?.paid_access]);
  const hoje = /* @__PURE__ */ new Date();
  const dataFormatada = hoje.toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  const dataHoje = hoje.toISOString().split("T")[0];
  const trialStart = typeof usuario?.trial_start_date === "string" ? new Date(usuario.trial_start_date) : null;
  const trialStartMs = trialStart && Number.isFinite(trialStart.getTime()) ? trialStart.getTime() : null;
  const trialEndMs = typeof trialStartMs === "number" ? trialStartMs + 7 * 24 * 60 * 60 * 1e3 : null;
  const trialRemainingDays = typeof trialEndMs === "number" ? Math.max(0, Math.ceil((trialEndMs - Date.now()) / (1e3 * 60 * 60 * 24))) : null;
  const trialValid = typeof trialEndMs === "number" && Date.now() < trialEndMs;
  const trialStatus = usuario?.subscription_status ?? null;
  const showTrialRemainingCard = !usuario?.paid_access && (trialValid && typeof trialRemainingDays === "number" || trialStatus === "trial");
  const agendamentosHoje = reactExports.useMemo(() => {
    return agendamentosFiltrados.filter(
      (ag) => ag.data === dataHoje && ag.status !== "cancelado"
    );
  }, [agendamentosFiltrados, dataHoje]);
  const totalRecebidoHoje = reactExports.useMemo(() => {
    const agendamentosConcluidos = agendamentosFiltrados.filter(
      (ag) => ag.data === dataHoje && ag.status === "concluido"
    );
    return agendamentosConcluidos.reduce((total, ag) => total + ag.valor, 0);
  }, [agendamentosFiltrados, dataHoje]);
  const proximoCliente = reactExports.useMemo(() => {
    const agora = /* @__PURE__ */ new Date();
    const horaAtual = agora.toTimeString().slice(0, 5);
    const proximosAgendamentos = agendamentosHoje.filter((ag) => ag.hora > horaAtual && ag.status === "agendado").sort((a, b) => a.hora.localeCompare(b.hora));
    return proximosAgendamentos[0] || null;
  }, [agendamentosHoje]);
  const agendamentosProximoDia = reactExports.useMemo(() => {
    const amanha = /* @__PURE__ */ new Date();
    amanha.setDate(amanha.getDate() + 1);
    const dataAmanha = amanha.toISOString().split("T")[0];
    return agendamentosFiltrados.filter((ag) => ag.data === dataAmanha && ag.status === "agendado").sort((a, b) => a.hora.localeCompare(b.hora));
  }, [agendamentosFiltrados]);
  const [periodo, setPeriodo] = reactExports.useState(7);
  const dadosPeriodo = reactExports.useMemo(() => {
    const pontos = [];
    for (let i = periodo - 1; i >= 0; i--) {
      const d = /* @__PURE__ */ new Date();
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().split("T")[0];
      const totalDia = lancamentos.filter((l) => l.data.toISOString().split("T")[0] === dStr && l.tipo === "entrada").reduce((total, l) => total + l.valor, 0);
      const label = periodo === 7 ? d.toLocaleDateString("pt-BR", { weekday: "short" }) : d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
      pontos.push({ label, valor: totalDia, iso: dStr });
    }
    return pontos;
  }, [lancamentos, periodo]);
  const totalPeriodo = reactExports.useMemo(
    () => dadosPeriodo.reduce((s, d) => s + d.valor, 0),
    [dadosPeriodo]
  );
  const mediaPeriodo = reactExports.useMemo(
    () => dadosPeriodo.length ? totalPeriodo / dadosPeriodo.length : 0,
    [totalPeriodo, dadosPeriodo.length]
  );
  const dadosGrafico = reactExports.useMemo(
    () => dadosPeriodo.map((d) => ({ dia: d.label, valor: d.valor, isHoje: d.iso === dataHoje })),
    [dadosPeriodo, dataHoje]
  );
  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(valor);
  };
  const concluidosHoje = reactExports.useMemo(() => {
    return agendamentosFiltrados.filter((ag) => ag.data === dataHoje && ag.status === "concluido");
  }, [agendamentosFiltrados, dataHoje]);
  const ticketMedioHoje = reactExports.useMemo(() => {
    const qtd = concluidosHoje.length;
    if (qtd === 0) return 0;
    return totalRecebidoHoje / qtd;
  }, [concluidosHoje, totalRecebidoHoje]);
  const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  const entradasMes = reactExports.useMemo(() => {
    return lancamentos.filter((l) => l.tipo === "entrada" && l.data >= inicioMes).reduce((s, l) => s + l.valor, 0);
  }, [lancamentos, inicioMes]);
  const saidasMes = reactExports.useMemo(() => {
    return lancamentos.filter((l) => l.tipo === "saida" && l.data >= inicioMes).reduce((s, l) => s + l.valor, 0);
  }, [lancamentos, inicioMes]);
  const lucroMes = entradasMes - saidasMes;
  const clientesUnicosHoje = reactExports.useMemo(() => {
    const set = new Set(agendamentosHoje.map((a) => a.clienteNome));
    return set.size;
  }, [agendamentosHoje]);
  const carregandoDados = agendamentosFiltrados.length === 0 && lancamentos.length === 0 && (loadingAgendamentos || loadingLancamentos);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 sm:space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(InstallPrompt, { variant: "card" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden rounded-lg sm:rounded-3xl bg-gradient-to-r from-primary to-lilac-light p-4 sm:p-responsive text-primary-foreground shadow-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2 sm:mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AppLogo, { size: 28, rounded: "xl" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-5 w-5 sm:h-8 sm:w-8 flex-shrink-0" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-xl sm:text-responsive-3xl font-bold", children: [
              "Olá, ",
              usuario?.nome_completo?.split(" ")[0] || "Profissional",
              "!"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "capitalize text-xs sm:text-sm", children: dataFormatada }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs sm:text-responsive-sm opacity-80", children: "Tenha um dia produtivo e cheio de sucesso!" }),
        showTrialRemainingCard ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 rounded-lg border border-white/25 bg-white/10 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs sm:text-sm font-semibold", children: "Teste grátis ativo" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs sm:text-sm opacity-90", children: typeof trialRemainingDays !== "number" ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Atualize o status para ver quantos dias ainda restam." }) : trialRemainingDays === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Seu teste expira hoje." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Restam ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: trialRemainingDays }),
            " dia(s) para aproveitar o teste."
          ] }) })
        ] }) : null
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-4 sm:-right-8 -top-4 sm:-top-8 h-16 w-16 sm:h-32 sm:w-32 rounded-full bg-white/10" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-6 sm:-bottom-12 -left-6 sm:-left-12 h-20 w-20 sm:h-40 sm:w-40 rounded-full bg-white/5" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 sm:gap-4 sm:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 p-3 sm:p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-xs font-medium text-muted-foreground truncate", children: "Agendamentos" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-3 pt-0 sm:p-4 sm:pt-0", children: [
          carregandoDados ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-12 rounded-md" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg sm:text-2xl font-bold text-foreground", children: agendamentosHoje.length }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] sm:text-xs text-muted-foreground", children: "Hoje" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-2 -top-2 h-8 w-8 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-primary/10 to-transparent" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 p-3 sm:p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-xs font-medium text-muted-foreground truncate", children: "Recebido" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-3 pt-0 sm:p-4 sm:pt-0", children: [
          carregandoDados ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-20 rounded-md" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg sm:text-2xl font-bold text-green-600", children: formatarMoeda(totalRecebidoHoje) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] sm:text-xs text-muted-foreground", children: "Hoje" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-2 -top-2 h-8 w-8 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-green-500/10 to-transparent" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm col-span-2 sm:col-span-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 p-3 sm:p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-xs font-medium text-muted-foreground truncate", children: "Amanhã" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3 sm:h-4 sm:w-4 text-lilac-primary flex-shrink-0" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-3 pt-0 sm:p-4 sm:pt-0", children: agendamentosProximoDia.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-lg sm:text-2xl font-bold text-foreground", children: [
            agendamentosProximoDia.length,
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-normal text-muted-foreground", children: "agend." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1 max-h-12 overflow-y-auto hidden sm:block", children: agendamentosProximoDia.slice(0, 2).map((agendamento) => /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground truncate", children: [
            agendamento.hora,
            " - ",
            agendamento.clienteNome
          ] }, agendamento.id)) })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg sm:text-2xl font-bold text-foreground", children: "0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] sm:text-xs text-muted-foreground", children: "Sem agendamentos" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-2 -top-2 h-8 w-8 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-lilac-primary/10 to-transparent" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 sm:gap-4 sm:grid-cols-3 mt-2 sm:mt-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 p-3 sm:p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-xs font-medium text-muted-foreground truncate", children: "Ticket Médio" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-3 pt-0 sm:p-4 sm:pt-0", children: [
          carregandoDados ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-20 rounded-md" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg sm:text-2xl font-bold", children: formatarMoeda(ticketMedioHoje) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] sm:text-xs text-muted-foreground truncate", children: "Por atendimento" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-2 -top-2 h-8 w-8 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-primary/10 to-transparent" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 p-3 sm:p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-xs font-medium text-muted-foreground truncate", children: "Entradas Mês" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-3 pt-0 sm:p-4 sm:pt-0", children: [
          carregandoDados ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-24 rounded-md" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg sm:text-2xl font-bold text-green-600", children: formatarMoeda(entradasMes) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] sm:text-xs text-muted-foreground truncate", children: "Receitas totais" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-2 -top-2 h-8 w-8 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-green-500/10 to-transparent" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm shadow-sm col-span-2 sm:col-span-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 p-3 sm:p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-xs font-medium text-muted-foreground truncate", children: "Lucro Mês" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PiggyBank, { className: "h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-3 pt-0 sm:p-4 sm:pt-0", children: [
          carregandoDados ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-24 rounded-md" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg sm:text-2xl font-bold", children: formatarMoeda(lucroMes) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] sm:text-xs text-muted-foreground truncate", children: "Entradas – Saídas" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-2 -top-2 h-8 w-8 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-primary/10 to-transparent" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 sm:gap-4 sm:grid-cols-3 mt-2 sm:mt-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 p-3 sm:p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-xs font-medium text-muted-foreground truncate", children: "Clientes Hoje" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-3 pt-0 sm:p-4 sm:pt-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg sm:text-2xl font-bold", children: clientesUnicosHoje }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] sm:text-xs text-muted-foreground truncate", children: "Únicos do dia" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-2 -top-2 h-8 w-8 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-primary/10 to-transparent" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 p-3 sm:p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-xs font-medium text-muted-foreground truncate", children: "Saídas Mês" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-3 w-3 sm:h-4 sm:w-4 text-destructive flex-shrink-0" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-3 pt-0 sm:p-4 sm:pt-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg sm:text-2xl font-bold text-destructive", children: formatarMoeda(saidasMes) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] sm:text-xs text-muted-foreground truncate", children: "Despesas totais" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-2 -top-2 h-8 w-8 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-red-500/10 to-transparent" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border/50 bg-card/50 backdrop-blur-sm shadow-sm rounded-2xl hover:shadow-md transition-shadow duration-300", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "p-responsive", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-responsive-lg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" }),
          "Ações Rápidas"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-responsive-sm", children: "Acesse rapidamente as funcionalidades mais usadas" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-responsive pt-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: () => navigate("/agendamentos"),
            className: "btn-touch btn-3d h-20 sm:h-24 flex-col gap-2 bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] text-white text-responsive-xs sm:text-responsive-sm hover:scale-105 hover:shadow-[0_10px_20px_rgba(139,92,246,0.4)] transition-all duration-300 animate-in fade-in zoom-in slide-in-from-bottom-2 group border-b-4 border-[#5B21B6] active:border-b-0 active:translate-y-1",
            size: "lg",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarPlus, { className: "h-6 w-6 sm:h-7 sm:w-7 text-white group-hover:scale-110 transition-transform duration-300 drop-shadow-md" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-white drop-shadow-sm", children: "Agendar" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: () => navigate("/clientes"),
            className: "btn-touch btn-3d h-20 sm:h-24 flex-col gap-2 bg-gradient-to-br from-[#D946EF] to-[#EC4899] text-white text-responsive-xs sm:text-responsive-sm hover:scale-105 hover:shadow-[0_10px_20px_rgba(217,70,239,0.4)] transition-all duration-300 animate-in fade-in zoom-in slide-in-from-bottom-2 delay-75 group border-b-4 border-[#9D174D] active:border-b-0 active:translate-y-1",
            size: "lg",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "h-6 w-6 sm:h-7 sm:w-7 text-white group-hover:scale-110 transition-transform duration-300 drop-shadow-md" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-white drop-shadow-sm", children: "Clientes" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: () => navigate("/financeiro"),
            className: "btn-touch btn-3d h-20 sm:h-24 flex-col gap-2 bg-gradient-to-br from-[#F59E0B] to-[#EF4444] text-white text-responsive-xs sm:text-responsive-sm hover:scale-105 hover:shadow-[0_10px_20px_rgba(245,158,11,0.4)] transition-all duration-300 animate-in fade-in zoom-in slide-in-from-bottom-2 delay-100 group border-b-4 border-[#991B1B] active:border-b-0 active:translate-y-1",
            size: "lg",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-6 w-6 sm:h-7 sm:w-7 text-white group-hover:scale-110 transition-transform duration-300 drop-shadow-md" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-white drop-shadow-sm", children: "Financeiro" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: () => navigate("/servicos"),
            className: "btn-touch btn-3d h-20 sm:h-24 flex-col gap-2 bg-gradient-to-br from-[#A855F7] to-[#7C3AED] text-white text-responsive-xs sm:text-responsive-sm hover:scale-105 hover:shadow-[0_10px_20px_rgba(168,85,247,0.4)] transition-all duration-300 animate-in fade-in zoom-in slide-in-from-bottom-2 delay-150 group border-b-4 border-[#581C87] active:border-b-0 active:translate-y-1",
            size: "lg",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Scissors, { className: "h-6 w-6 sm:h-7 sm:w-7 text-white group-hover:scale-110 transition-transform duration-300 drop-shadow-md" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-white drop-shadow-sm", children: "Serviços" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: () => navigate("/produtos"),
            className: "btn-touch btn-3d h-20 sm:h-24 flex-col gap-2 bg-gradient-to-br from-[#3B82F6] to-[#2563EB] text-white text-responsive-xs sm:text-responsive-sm hover:scale-105 hover:shadow-[0_10px_20px_rgba(59,130,246,0.4)] transition-all duration-300 animate-in fade-in zoom-in slide-in-from-bottom-2 delay-200 group border-b-4 border-[#1E40AF] active:border-b-0 active:translate-y-1",
            size: "lg",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-6 w-6 sm:h-7 sm:w-7 text-white group-hover:scale-110 transition-transform duration-300 drop-shadow-md" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-white drop-shadow-sm", children: "Produtos" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: () => navigate("/marketing"),
            className: "btn-touch btn-3d h-20 sm:h-24 flex-col gap-2 bg-gradient-to-br from-[#F43F5E] to-[#E11D48] text-white text-responsive-xs sm:text-responsive-sm hover:scale-105 hover:shadow-[0_10px_20px_rgba(244,63,94,0.4)] transition-all duration-300 animate-in fade-in zoom-in slide-in-from-bottom-2 delay-300 group border-b-4 border-[#9F1239] active:border-b-0 active:translate-y-1",
            size: "lg",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Megaphone, { className: "h-6 w-6 sm:h-7 sm:w-7 text-white group-hover:scale-110 transition-transform duration-300 drop-shadow-md" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-white drop-shadow-sm", children: "Marketing" })
            ]
          }
        )
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border/50 bg-card/50 backdrop-blur-sm shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "p-responsive", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-responsive-lg", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" }),
            "Faturamento – últimos ",
            periodo,
            " dias"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 bg-muted/40 p-1 rounded-lg", children: [7, 30, 90].map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: periodo === p ? "default" : "ghost",
              onClick: () => setPeriodo(p),
              className: "h-8 px-3",
              children: [
                p,
                "d"
              ]
            },
            p
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-responsive-sm", children: "Acompanhe seu desempenho semanal" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 text-muted-foreground text-xs sm:text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Total: ",
            formatarMoeda(totalPeriodo)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mx-2", children: "•" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Média diária: ",
            formatarMoeda(mediaPeriodo)
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-responsive pt-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-48 sm:h-64 overflow-responsive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", minWidth: 300, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data: dadosGrafico, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "fillPrimary", x1: "0", y1: "0", x2: "0", y2: "1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "hsl(var(--primary))", stopOpacity: "0.9" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "hsl(var(--primary))", stopOpacity: "0.3" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", vertical: false, stroke: "hsl(var(--border))" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          XAxis,
          {
            dataKey: "dia",
            axisLine: false,
            tickLine: false,
            className: "text-muted-foreground text-[10px] sm:text-xs",
            tick: { fontSize: 10 },
            interval: periodo > 7 ? "preserveStartEnd" : 0
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          YAxis,
          {
            axisLine: false,
            tickLine: false,
            className: "text-muted-foreground text-xs",
            tickFormatter: (value) => `R$ ${value}`,
            tick: { fontSize: 12 },
            width: 60
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Tooltip,
          {
            formatter: (value) => {
              const v = Number(value);
              const delta = mediaPeriodo > 0 ? (v - mediaPeriodo) / mediaPeriodo * 100 : 0;
              const sinal = delta >= 0 ? "+" : "";
              return [formatarMoeda(v), `Faturamento (${sinal}${delta.toFixed(0)}% vs média)`];
            },
            labelStyle: { color: "hsl(var(--foreground))" },
            contentStyle: {
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: "12px"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ReferenceLine,
          {
            y: mediaPeriodo,
            stroke: "hsl(var(--muted-foreground))",
            strokeDasharray: "5 5",
            label: {
              value: "Média",
              position: "right",
              fill: "hsl(var(--muted-foreground))",
              fontSize: 12
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Bar,
          {
            dataKey: "valor",
            fill: "url(#fillPrimary)",
            radius: [6, 6, 0, 0],
            maxBarSize: 28,
            children: dadosGrafico.map((entry, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              Cell,
              {
                fill: entry.isHoje ? "hsl(var(--primary))" : "url(#fillPrimary)",
                stroke: entry.isHoje ? "hsl(var(--primary))" : void 0,
                strokeWidth: entry.isHoje ? 1 : 0
              },
              `cell-${index}`
            ))
          }
        )
      ] }) }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border/50 bg-card/50 backdrop-blur-sm shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "p-responsive", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-responsive-lg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" }),
          "Próximo Cliente"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-responsive-sm", children: "Seu próximo atendimento de hoje" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-responsive pt-0", children: proximoCliente ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-primary/5 to-lilac-light/5 border border-primary/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-lilac-primary flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-6 w-6 text-white" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-responsive-lg font-bold text-foreground truncate", children: proximoCliente.clienteNome }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-responsive-sm text-muted-foreground", children: [
            proximoCliente.hora,
            " - ",
            proximoCliente.servicoNome
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-responsive-xs text-muted-foreground", children: [
            "Valor: ",
            formatarMoeda(proximoCliente.valor)
          ] })
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-12 w-12 text-muted-foreground/50 mx-auto mb-3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-responsive-lg font-medium text-muted-foreground", children: "Sem próximos atendimentos hoje" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-responsive-xs text-muted-foreground", children: "Você pode descansar ou aproveitar para outras atividades" })
      ] }) })
    ] }),
    agendamentosHoje.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border/50 bg-gradient-to-r from-primary/5 to-lilac-light/5 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-responsive", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-lilac-primary flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-5 w-5 sm:h-6 sm:w-6 text-white" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold text-foreground text-responsive-sm", children: [
          "Você já atendeu ",
          agendamentosFiltrados.filter((ag) => ag.data === dataHoje && ag.status === "concluido").length,
          " de ",
          agendamentosHoje.length,
          " clientes hoje!"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-responsive-xs text-muted-foreground", children: "Continue assim, você está indo muito bem! 💪" })
      ] })
    ] }) }) })
  ] });
}

export { Dashboard as default };
