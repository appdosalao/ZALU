import { r as reactExports, j as jsxRuntimeExports } from './react-vendor-BpXfDOw7.js';
import { a as useNavigate, b as useAuth, R as usePaidAccess, C as Card, c as CardHeader, d as CardTitle, f as CardDescription, B as Badge, e as CardContent, g as Button, J as Jt } from './index-U74ij7JC.js';
import { b7 as Crown, l as Check, R as RefreshCw } from './ui-libs-B5Rrhu1L.js';
import './chart-libs-Cdz70zdY.js';

function Assinatura() {
  const navigate = useNavigate();
  const { usuario, refreshProfile } = useAuth();
  const { isPaid, isLoading: isPaidLoading, refetch } = usePaidAccess();
  const [loading, setLoading] = reactExports.useState(false);
  const trialStart = typeof usuario?.trial_start_date === "string" ? new Date(usuario.trial_start_date) : null;
  const trialStartMs = trialStart ? trialStart.getTime() : null;
  const nowMs = Date.now();
  const trialEligible = usuario?.subscription_status === "trial" || usuario?.subscription_status === "inactive" || usuario?.subscription_status === null;
  const trialValid = trialEligible && typeof trialStartMs === "number" && Number.isFinite(trialStartMs) && nowMs < trialStartMs + 7 * 24 * 60 * 60 * 1e3;
  const trialEndMs = typeof trialStartMs === "number" && Number.isFinite(trialStartMs) ? trialStartMs + 7 * 24 * 60 * 60 * 1e3 : null;
  const trialRemainingDays = typeof trialEndMs === "number" && Number.isFinite(trialEndMs) ? Math.max(0, Math.ceil((trialEndMs - nowMs) / (1e3 * 60 * 60 * 24))) : null;
  const formatDate = (value) => {
    if (!value) return "—";
    const d = value instanceof Date ? value : new Date(value);
    if (!Number.isFinite(d.getTime())) return "—";
    return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(d);
  };
  const statusLabel = reactExports.useMemo(() => {
    if (isPaidLoading) return "Verificando...";
    if (isPaid) return "Assinatura ativa";
    if (trialValid) return `Teste grátis ativo — ${trialRemainingDays ?? 0} dia(s) restante(s)`;
    if (usuario?.subscription_status === "trial") return "Teste grátis expirado — acesso pendente";
    return "Acesso pendente";
  }, [isPaid, isPaidLoading, trialValid, trialRemainingDays, usuario?.subscription_status]);
  const planLabel = reactExports.useMemo(() => {
    return isPaid ? "Mensal (R$ 7,90/mês)" : "Teste grátis (7 dias)";
  }, [isPaid]);
  const refresh = async () => {
    setLoading(true);
    try {
      await refreshProfile();
      await refetch?.();
      Jt.success("Status atualizado!");
    } catch {
      Jt.error("Erro ao verificar status");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gradient-to-b from-background to-muted/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto py-12 px-4 max-w-3xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-xl border-primary/10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "h-5 w-5 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-2xl", children: "Plano e Assinatura" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Confira seu status de acesso ao sistema" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: isPaid ? "default" : "outline", className: isPaid ? "bg-green-600 hover:bg-green-700" : "", children: statusLabel })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-muted/50 rounded-lg border border-border/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Plano atual" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: planLabel })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-muted/50 rounded-lg border border-border/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Liberação" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: isPaid ? formatDate(usuario?.paid_at) : trialValid ? formatDate(new Date(trialEndMs ?? 0)) : "Após pagamento aprovado" })
        ] })
      ] }),
      trialValid ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-primary/20 bg-primary/5 p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold text-primary", children: "Seu teste grátis está ativo" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-xs text-muted-foreground", children: [
          "Início: ",
          formatDate(usuario?.trial_start_date),
          " · Expira: ",
          trialEndMs ? formatDate(new Date(trialEndMs)) : "—"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-sm text-muted-foreground", children: "Aproveite o app durante o teste. Após expirar, será necessário assinar para continuar." })
      ] }) : null,
      !isPaid && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-medium text-primary mb-2", children: "Assinatura mensal disponível" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Assine para manter acesso completo ao app. Ideal para quem quer profissionalizar a gestão do salão e ganhar tempo no dia a dia." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-2 sm:grid-cols-2", children: [
          "Agenda com visão diária/semana",
          "Agendamentos e clientes ilimitados",
          "Controle financeiro e relatórios",
          "Atualizações futuras inclusas"
        ].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 bg-green-100 dark:bg-green-900/30 rounded-full p-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3 text-green-600 dark:text-green-400", strokeWidth: 3 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground/80", children: t })
        ] }, t)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: () => navigate("/checkout"),
            className: "w-full h-11",
            variant: isPaid ? "outline" : "default",
            disabled: isPaid,
            children: isPaid ? "Assinatura ativa" : "Assinar por R$ 7,90/mês"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => void refresh(), variant: "outline", disabled: loading || isPaidLoading, className: "w-full h-11 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: `h-4 w-4 ${loading ? "animate-spin" : ""}` }),
          loading ? "Verificando..." : "Atualizar Status"
        ] })
      ] })
    ] })
  ] }) }) });
}

export { Assinatura as default };
