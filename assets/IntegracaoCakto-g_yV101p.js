import { j as jsxRuntimeExports } from './react-vendor-BpXfDOw7.js';
import { b as useAuth, R as usePaidAccess, C as Card, c as CardHeader, d as CardTitle, f as CardDescription, B as Badge, e as CardContent } from './index-U74ij7JC.js';
import './ui-libs-B5Rrhu1L.js';
import './chart-libs-Cdz70zdY.js';

function IntegracaoCakto() {
  const { usuario, user } = useAuth();
  const { isPaid } = usePaidAccess();
  const mensalUrlConfigured = Boolean(
    "https://pay.cakto.com.br/3banwdk_876948"
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gradient-to-b from-background to-muted/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto py-12 px-4 max-w-4xl space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-2xl", children: "Integração Cakto" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Checklist e parâmetros usados pelo app (checkout hospedado + webhook)" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: isPaid ? "default" : "outline", children: isPaid ? "Acesso liberado" : "Acesso pendente" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Checkout mensal configurado" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: mensalUrlConfigured ? "default" : "outline", children: mensalUrlConfigured ? "OK" : "Faltando" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Parâmetro de vínculo (sck)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium truncate max-w-[60%]", children: user?.id ?? "—" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Último evento Cakto" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium truncate max-w-[60%]", children: usuario?.cakto_last_event ?? "—" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Último status do pedido" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium truncate max-w-[60%]", children: usuario?.cakto_last_status ?? "—" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Cakto order" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium truncate max-w-[60%]", children: usuario?.cakto_order_id ?? "—" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Cakto refId" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium truncate max-w-[60%]", children: usuario?.cakto_order_ref_id ?? "—" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border/60", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-lg", children: "Configuração no Painel Cakto" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Itens mínimos para o fluxo funcionar" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "1) Produto/Oferta: crie um produto de assinatura mensal (recorrente)." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "2) Link de checkout: configure em `VITE_CAKTO_CHECKOUT_MENSAL_URL`." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "3) Webhook: cadastre o endpoint e selecione pelo menos `purchase_approved`." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "4) Chave secreta: defina a mesma `CAKTO_WEBHOOK_SECRET` no webhook e no backend." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "5) Testes: use “Enviar evento de teste” para validar o recebimento." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border/60", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-lg", children: "Validação via API (opcional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "O backend pode validar o pedido consultando a API Cakto usando OAuth2" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "1) Crie uma chave de API no painel (client_id/client_secret) com escopo `orders`." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "2) Configure `CAKTO_CLIENT_ID`, `CAKTO_CLIENT_SECRET` no backend." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "3) Ative `CAKTO_VERIFY_BY_API=true` para buscar o pedido em `public_api/orders`." })
        ] })
      ] })
    ] })
  ] }) }) });
}

export { IntegracaoCakto as default };
