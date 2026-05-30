import { r as reactExports, j as jsxRuntimeExports } from './react-vendor-BpXfDOw7.js';
import { C as Card, c as CardHeader, d as CardTitle, f as CardDescription, e as CardContent, J as Jt } from './index-BxmTkSue.js';
import { a as adminApi } from './useAdminApi-l0ys-icG.js';
import './ui-libs-BJEWQG8b.js';
import './chart-libs-Cdz70zdY.js';

function AdminMetrics() {
  const [data, setData] = reactExports.useState(null);
  reactExports.useEffect(() => {
    const run = async () => {
      try {
        const res = await adminApi.overview();
        setData(res);
      } catch {
        Jt.error("Não foi possível carregar métricas.");
      }
    };
    void run();
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 sm:space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl sm:text-3xl font-bold", children: "Métricas" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs sm:text-sm text-muted-foreground", children: "Visão consolidada para análise estratégica" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm", children: "Pagantes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Usuários com acesso pago" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "text-2xl font-bold", children: data?.payingUsers ?? "—" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm", children: "MRR estimado" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Planos ativos (aprox.)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "text-2xl font-bold", children: data?.estimatedMrr != null ? `R$ ${data.estimatedMrr.toFixed(2).replace(".", ",")}` : "—" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm", children: "Receita acumulada (est.)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Estimativa por paid_at" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "text-2xl font-bold", children: data?.estimatedCumulativeRevenue != null ? `R$ ${data.estimatedCumulativeRevenue.toFixed(2).replace(".", ",")}` : "—" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Limitações" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "O que falta para “receita real” e ROI" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "text-sm text-muted-foreground space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Hoje não existe tabela de transações do provedor (Cakto) com valores, moeda, chargebacks e eventos. Por isso as receitas aqui são estimadas." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Para ROI (investimento em marketing), o ideal é gravar origem/campanha (UTM) no cadastro e eventos de conversão (trial_started, checkout_clicked, paid)." })
      ] })
    ] })
  ] });
}

export { AdminMetrics as default };
