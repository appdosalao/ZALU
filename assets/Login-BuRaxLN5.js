import { r as reactExports, j as jsxRuntimeExports } from './react-vendor-BpXfDOw7.js';
import { a as useNavigate, u as useSearchParams, b as useAuth, U as Link, C as Card, c as CardHeader, A as AppLogo, d as CardTitle, f as CardDescription, e as CardContent, G as Alert, H as AlertDescription, j as Input, g as Button, B as Badge } from './index-BxmTkSue.js';
import { u as useForm, o as object, s as string } from './form-libs-BJ_wtrcd.js';
import { a } from './zod-BCTNax0R.js';
import { L as Label } from './label-Bu_HJwHE.js';
import { C as Checkbox } from './checkbox-DhCBsqD0.js';
import { A as AuthFooter } from './AuthFooter-2RTdu8nK.js';
import { i as Sparkles, Z as Zap, j as ShieldCheck, bB as EyeOff, aB as Eye, b8 as ArrowRight } from './ui-libs-BJEWQG8b.js';
import './chart-libs-Cdz70zdY.js';
import './index-Ls-C4DWD.js';

const loginSchema = object({
  email: string().email("E-mail inválido"),
  senha: string().min(1, "Senha é obrigatória")
});
const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const [error, setError] = reactExports.useState("");
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: a(loginSchema)
  });
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [rememberMe, setRememberMe] = reactExports.useState(true);
  reactExports.useEffect(() => {
    const savedTheme = localStorage.getItem("app-theme");
    if (savedTheme) {
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);
  reactExports.useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate(redirect, { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate, redirect]);
  const infoMessage = reactExports.useMemo(() => {
    if (searchParams.get("password_updated") === "1") return "Senha atualizada. Faça login novamente.";
    if (searchParams.get("confirmed") === "1") return "E-mail confirmado. Você já pode entrar.";
    if (searchParams.get("check_email") === "1") return "Conta criada. Verifique seu e-mail para confirmar e depois faça login.";
    return "";
  }, [searchParams]);
  const onSubmit = async (data) => {
    setIsLoading(true);
    setError("");
    try {
      const ok = await login(data.email, data.senha);
      if (ok) {
        navigate(redirect);
      } else {
        setError("E-mail ou senha incorretos. Verifique suas credenciais.");
      }
    } catch (err) {
      setError("Ocorreu um erro ao tentar entrar. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/5 p-4 lg:p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-5xl grid lg:grid-cols-2 gap-12 items-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden lg:flex flex-col space-y-8 animate-in fade-in slide-in-from-left duration-700", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4" }),
          "Bem-vinda(o) de volta"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-5xl font-extrabold tracking-tight text-foreground leading-tight", children: [
          "Acesse sua conta no ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "Salão de Bolso" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl text-muted-foreground max-w-md", children: "Continue transformando a gestão do seu negócio com as ferramentas mais modernas do mercado." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 items-center p-4 rounded-2xl bg-card border border-border/50 shadow-sm transition-all hover:shadow-md hover:border-primary/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-6 w-6 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold", children: "Acesso Rápido" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Sincronização em tempo real em todos os seus dispositivos." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 items-center p-4 rounded-2xl bg-card border border-border/50 shadow-sm transition-all hover:shadow-md hover:border-primary/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-6 w-6 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold", children: "Ambiente Seguro" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Seus dados estão protegidos com segurança de nível bancário." })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-8 border-t border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        "Não é profissional? ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/agendamento-online", className: "text-primary font-bold hover:underline", children: "Agende um serviço aqui" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col animate-in fade-in zoom-in duration-500", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-2xl border-primary/10 overflow-hidden backdrop-blur-sm bg-card/95", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "space-y-2 text-center pt-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 rounded-2xl bg-primary/10 ring-4 ring-primary/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppLogo, { size: 48, rounded: "xl" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-3xl font-bold tracking-tight", children: "Fazer Login" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-base", children: "Insira suas credenciais para acessar seu painel" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-8 pb-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-6", children: [
          infoMessage && /* @__PURE__ */ jsxRuntimeExports.jsx(Alert, { className: "animate-in slide-in-from-top-2 duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { className: "text-sm font-medium", children: infoMessage }) }),
          error && /* @__PURE__ */ jsxRuntimeExports.jsx(Alert, { variant: "destructive", className: "animate-in slide-in-from-top-2 duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { className: "text-sm font-medium", children: error }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", className: "text-sm font-semibold", children: "E-mail" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative group", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "email",
                  type: "email",
                  placeholder: "seu@email.com",
                  ...register("email"),
                  disabled: isLoading,
                  className: "h-12 bg-muted/30 border-border/50 focus:bg-background transition-all"
                }
              ) }),
              errors.email && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive font-medium mt-1", children: errors.email.message })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "senha", className: "text-sm font-semibold", children: "Senha" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Link,
                  {
                    to: "/esqueci-senha",
                    className: "text-xs text-primary hover:underline font-semibold",
                    children: "Esqueceu a senha?"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "senha",
                    type: showPassword ? "text" : "password",
                    placeholder: "••••••••",
                    ...register("senha"),
                    disabled: isLoading,
                    className: "h-12 bg-muted/30 border-border/50 focus:bg-background transition-all"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors",
                    onClick: () => setShowPassword((v) => !v),
                    children: showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" })
                  }
                )
              ] }),
              errors.senha && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive font-medium mt-1", children: errors.senha.message })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Checkbox,
              {
                id: "remember",
                checked: rememberMe,
                onCheckedChange: (c) => setRememberMe(!!c),
                className: "border-primary data-[state=checked]:bg-primary"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "remember", className: "text-sm text-muted-foreground cursor-pointer select-none", children: "Lembrar-me neste dispositivo" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "submit",
              className: "w-full h-14 text-lg font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all bg-primary hover:bg-primary/90 btn-3d",
              disabled: isLoading,
              children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex items-center gap-2", children: "Acessando..." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 text-white", children: [
                "Entrar no Sistema ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-5 w-5 ml-1" })
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative py-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-full border-t border-border/50" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative flex justify-center text-xs uppercase", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-card px-2 text-muted-foreground font-medium", children: "Ainda não tem acesso?" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              asChild: true,
              variant: "outline",
              className: "w-full h-14 text-lg font-bold border-2 border-primary/20 hover:bg-primary/5 hover:border-primary/50 hover:scale-[1.01] active:scale-[0.99] transition-all text-primary group",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/cadastro", className: "flex items-center justify-center gap-2", children: [
                "Criar Conta Grátis",
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "ml-1 text-[11px] h-5 px-2 bg-primary/10 text-primary border-none group-hover:bg-primary group-hover:text-white transition-colors", children: "7 DIAS" })
              ] })
            }
          )
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AuthFooter, {}) })
    ] })
  ] }) });
};

export { Login as default };
