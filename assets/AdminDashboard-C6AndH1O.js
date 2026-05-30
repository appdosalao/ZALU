import { r as reactExports, j as jsxRuntimeExports } from './react-vendor-BpXfDOw7.js';
import { g as Button, C as Card, c as CardHeader, d as CardTitle, f as CardDescription, e as CardContent, J as Jt } from './index-BxmTkSue.js';
import { a as adminApi } from './useAdminApi-l0ys-icG.js';
import { R as RefreshCw } from './ui-libs-BJEWQG8b.js';
import './chart-libs-Cdz70zdY.js';

function AdminDashboard() {
  const [data, setData] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(false);
  const load = async () => {
    setLoading(true);
    try {
      const res = await adminApi.overview();
      setData(res);
    } catch {
      Jt.error("Sem permissão ou falha ao carregar dados do Admin.");
      setData(null);
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    void load();
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 sm:space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl sm:text-3xl font-bold", children: "Visão geral" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs sm:text-sm text-muted-foreground", children: "Contas, retenção e estimativas de receita" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => void load(), disabled: loading, className: "btn-touch", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: `h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}` }),
        "Atualizar"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm", children: "Contas" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Total cadastradas" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "text-2xl font-bold", children: data?.totalAccounts ?? "—" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm", children: "Ativas" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Últimos 30 dias" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "text-2xl font-bold", children: data?.activeAccounts30d ?? "—" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm", children: "Inativas" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "> 30 dias sem acesso" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "text-2xl font-bold", children: data?.inactiveAccounts30d ?? "—" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm", children: "Pagantes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "paid_access=true" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "text-2xl font-bold", children: data?.payingUsers ?? "—" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 sm:gap-4 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Retenção" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Baseado em trial_start_date e paid_access" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Trials iniciados" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: data?.trialStarted ?? "—" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Evasão pós-trial" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: data?.churnAfterTrial ?? "—" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Receita (estimativas)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Sem tabela de transações, é aproximação" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Preço do plano" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: data?.planPrice != null ? `R$ ${data.planPrice}` : "—" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "MRR estimado" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: data?.estimatedMrr != null ? `R$ ${data.estimatedMrr.toFixed(2).replace(".", ",")}` : "—" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Acumulada (est.)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: data?.estimatedCumulativeRevenue != null ? `R$ ${data.estimatedCumulativeRevenue.toFixed(2).replace(".", ",")}` : "—" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Notas" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Boas práticas" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "text-sm text-muted-foreground space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Senhas não são recuperáveis. Use redefinição por e-mail para suporte." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Para “receita real”, crie uma tabela de transações do provedor e grave amount/moeda/eventos." })
        ] })
      ] })
    ] })
  ] });
}

export { AdminDashboard as default };
