import { r as reactExports, j as jsxRuntimeExports } from './react-vendor-BpXfDOw7.js';
import { a as useNavigate, u as useSearchParams, b as useAuth, R as usePaidAccess, C as Card, c as CardHeader, d as CardTitle, f as CardDescription, e as CardContent, G as Alert, H as AlertDescription, g as Button } from './index-BxmTkSue.js';
import './ui-libs-BJEWQG8b.js';
import './chart-libs-Cdz70zdY.js';

function RetornoPagamento() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { isAuthenticated, refreshProfile } = useAuth();
  const { isPaid, refetch } = usePaidAccess();
  const [status, setStatus] = reactExports.useState("checking");
  const hint = reactExports.useMemo(() => {
    const raw = (params.get("status") || params.get("s") || "").toLowerCase();
    if (!raw) return null;
    if (raw.includes("paid") || raw.includes("approved") || raw.includes("success")) return "success";
    if (raw.includes("pending") || raw.includes("waiting")) return "pending";
    if (raw.includes("cancel") || raw.includes("fail")) return "fail";
    return raw;
  }, [params]);
  const check = async () => {
    if (!isAuthenticated) {
      setStatus("unauthenticated");
      return;
    }
    await refreshProfile();
    const result = await refetch?.();
    const paid = typeof result?.data === "boolean" ? result.data : isPaid;
    setStatus(paid ? "active" : "pending");
  };
  reactExports.useEffect(() => {
    void check();
  }, [isAuthenticated]);
  reactExports.useEffect(() => {
    if (status !== "pending") return;
    const interval = window.setInterval(() => {
      void check();
    }, 5e3);
    return () => window.clearInterval(interval);
  }, [status, isAuthenticated]);
  reactExports.useEffect(() => {
    if (status !== "active") return;
    const t = window.setTimeout(() => navigate("/", { replace: true }), 900);
    return () => window.clearTimeout(t);
  }, [status, navigate]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gradient-to-b from-background to-muted/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto py-12 px-4 max-w-3xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-2xl", children: "Retorno do Pagamento" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Quando a Cakto confirmar o pagamento, seu acesso será liberado automaticamente." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
      hint ? /* @__PURE__ */ jsxRuntimeExports.jsx(Alert, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDescription, { className: "text-sm", children: [
        "Status informado pela Cakto: ",
        hint
      ] }) }) : null,
      status === "unauthenticated" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Alert, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { className: "text-sm", children: "Faça login para vincular o pagamento à sua conta." }) }) : null,
      status === "checking" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Verificando seu acesso..." }) : null,
      status === "pending" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Alert, { className: "border-yellow-500/30 bg-yellow-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { className: "text-sm", children: "Pagamento ainda não confirmado. Se você pagou via Pix/boleto, pode levar alguns instantes. Esta página atualiza automaticamente." }) }) : null,
      status === "active" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Alert, { className: "border-green-600/30 bg-green-600/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { className: "text-sm", children: "Pagamento confirmado! Redirecionando para o app..." }) }) : null,
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: status === "unauthenticated" ? "default" : "outline",
            onClick: () => navigate("/login"),
            className: "w-full",
            children: "Login"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => void check(), className: "w-full", children: "Atualizar status" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", onClick: () => navigate("/checkout"), className: "w-full", children: "Ir para o checkout da assinatura" })
    ] })
  ] }) }) });
}

export { RetornoPagamento as default };
