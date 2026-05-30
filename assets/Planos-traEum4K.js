import { j as jsxRuntimeExports } from './react-vendor-BpXfDOw7.js';
import { a as useNavigate, R as usePaidAccess, C as Card, B as Badge, c as CardHeader, d as CardTitle, f as CardDescription, e as CardContent, g as Button } from './index-BxmTkSue.js';
import { N as Scissors, l as Check } from './ui-libs-BJEWQG8b.js';
import './chart-libs-Cdz70zdY.js';

function Planos() {
  const navigate = useNavigate();
  const { isPaid } = usePaidAccess();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gradient-to-b from-background to-muted/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto py-12 px-4 max-w-5xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Scissors, { className: "h-7 w-7 text-primary" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl font-bold mb-2", children: "Assinatura Mensal" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-lg", children: "Use o Salão de Bolso com acesso completo por R$ 7,90/mês." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-xl border-2 border-primary/40 bg-gradient-to-b from-primary/5 to-background max-w-md w-full relative overflow-hidden", children: [
      isPaid && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-4 right-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-green-600 hover:bg-green-700 text-white border-none shadow-sm", children: "Ativa" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "text-center pb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-3xl", children: "Plano Mensal" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Assinatura recorrente com cobrança mensal" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6 pt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-5xl font-extrabold text-primary leading-none", children: "R$ 7,90" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium mt-2 uppercase tracking-wider text-muted-foreground", children: "por mês • checkout via Cakto" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 bg-white/50 dark:bg-black/20 p-5 rounded-xl border border-border/50", children: [
          "Acesso completo ao app enquanto a assinatura estiver ativa",
          "Agendamentos e clientes ilimitados",
          "Controle financeiro e relatórios",
          "Atualizações futuras inclusas",
          "Suporte e melhorias contínuas"
        ].map((text) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 bg-green-100 dark:bg-green-900/30 rounded-full p-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3 text-green-600 dark:text-green-400", strokeWidth: 3 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: text })
        ] }, text)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: () => navigate("/checkout"),
            className: "w-full h-14 text-lg font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform",
            disabled: isPaid,
            children: isPaid ? "Assinatura ativa" : "Assinar por R$ 7,90/mês"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-12 max-w-2xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center text-sm text-muted-foreground mt-4", children: "🔒 Pagamento 100% seguro processado via Cakto." }) })
  ] }) });
}

export { Planos as default };
