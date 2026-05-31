import { r as reactExports, j as jsxRuntimeExports } from './react-vendor-BpXfDOw7.js';
import { a as useNavigate, u as useSearchParams, C as Card, c as CardHeader, A as AppLogo, d as CardTitle, f as CardDescription, e as CardContent, g as Button, X as Link, s as supabase, J as Jt } from './index-U74ij7JC.js';
import './ui-libs-B5Rrhu1L.js';
import './chart-libs-Cdz70zdY.js';

const isOtpType = (value) => {
  return value === "signup" || value === "invite" || value === "magiclink" || value === "recovery" || value === "email_change";
};
function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = reactExports.useState("loading");
  const [errorMessage, setErrorMessage] = reactExports.useState("");
  const params = reactExports.useMemo(() => {
    return {
      code: searchParams.get("code"),
      token_hash: searchParams.get("token_hash"),
      type: searchParams.get("type"),
      next: searchParams.get("next")
    };
  }, [searchParams]);
  reactExports.useEffect(() => {
    const run = async () => {
      try {
        if (params.code) {
          const { error } = await supabase.auth.exchangeCodeForSession(params.code);
          if (error) throw error;
        } else if (params.token_hash && isOtpType(params.type)) {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: params.token_hash,
            type: params.type
          });
          if (error) throw error;
        }
        const { data } = await supabase.auth.getSession();
        const hasSession = !!data.session;
        const next = params.next || void 0;
        if (params.type === "recovery") {
          Jt.success("Link verificado. Defina sua nova senha.");
          navigate(next || "/redefinir-senha", { replace: true });
          return;
        }
        if (params.type === "signup") {
          Jt.success("E-mail confirmado com sucesso.");
          navigate(hasSession ? next || "/" : "/login?confirmed=1", { replace: true });
          return;
        }
        if (params.type === "email_change") {
          Jt.success("E-mail alterado com sucesso.");
          navigate(next || "/configuracoes?tab=conta", { replace: true });
          return;
        }
        Jt.success("Autenticação concluída.");
        navigate(next || "/", { replace: true });
      } catch (err) {
        setStatus("error");
        const message = err instanceof Error ? err.message : "Não foi possível concluir a autenticação.";
        setErrorMessage(message);
        Jt.error(message);
      }
    };
    void run();
  }, [navigate, params]);
  if (status === "error") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "w-full max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "space-y-1 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppLogo, { size: 48, rounded: "xl" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-2xl font-bold", children: "Não foi possível continuar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: errorMessage || "Tente novamente." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", children: "Ir para o login" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", className: "w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/esqueci-senha", children: "Recuperar senha" }) })
      ] })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "w-full max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "space-y-1 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppLogo, { size: 48, rounded: "xl" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-2xl font-bold", children: "Processando…" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Estamos validando seu acesso." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "flex items-center justify-center py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" }) })
  ] }) });
}

export { AuthCallback as default };
