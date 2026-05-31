import { r as reactExports, j as jsxRuntimeExports } from './react-vendor-BpXfDOw7.js';
import { C as Card, c as CardHeader, A as AppLogo, d as CardTitle, f as CardDescription, e as CardContent, X as Link, j as Input, g as Button, s as supabase, J as Jt } from './index-U74ij7JC.js';
import { u as useForm, o as object, s as string } from './form-libs-BJ_wtrcd.js';
import { a } from './zod-BCTNax0R.js';
import { L as Label } from './label-C0AJeojg.js';
import './ui-libs-B5Rrhu1L.js';
import './chart-libs-Cdz70zdY.js';

const esqueceuSenhaSchema = object({
  email: string().email("E-mail inválido")
});
const EsqueciSenha = () => {
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const [success, setSuccess] = reactExports.useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: a(esqueceuSenhaSchema)
  });
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent("/redefinir-senha")}`;
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, { redirectTo });
      if (error) throw error;
      setSuccess(true);
    } catch (err) {
      Jt.error("Não foi possível enviar o e-mail de recuperação. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };
  if (success) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "w-full max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "space-y-1 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppLogo, { size: 48, rounded: "xl" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-2xl font-bold", children: "E-mail Enviado" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Se o e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "text-primary hover:underline font-medium", children: "Voltar para o login" }) }) })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "w-full max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "space-y-1 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppLogo, { size: 48, rounded: "xl" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-2xl font-bold", children: "Esqueci Minha Senha" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Digite seu e-mail para receber as instruções de recuperação" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", children: "E-mail" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "email",
            type: "email",
            placeholder: "seu@email.com",
            ...register("email"),
            disabled: isLoading
          }
        ),
        errors.email && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: errors.email.message })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "w-full", disabled: isLoading, children: isLoading ? "Enviando..." : "Enviar Instruções" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "text-sm text-muted-foreground hover:text-primary underline", children: "Voltar para o login" }) })
    ] }) })
  ] }) });
};

export { EsqueciSenha as default };
