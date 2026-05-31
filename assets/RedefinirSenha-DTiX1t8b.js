import { r as reactExports, j as jsxRuntimeExports } from './react-vendor-BpXfDOw7.js';
import { a as useNavigate, C as Card, e as CardContent, c as CardHeader, A as AppLogo, d as CardTitle, f as CardDescription, g as Button, X as Link, j as Input, s as supabase, J as Jt } from './index-U74ij7JC.js';
import { u as useForm, o as object, s as string } from './form-libs-BJ_wtrcd.js';
import { a } from './zod-BCTNax0R.js';
import { L as Label } from './label-C0AJeojg.js';
import './ui-libs-B5Rrhu1L.js';
import './chart-libs-Cdz70zdY.js';

const schema = object({
  senha: string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  confirmar_senha: string().min(6, "A confirmação deve ter pelo menos 6 caracteres")
}).refine((data) => data.senha === data.confirmar_senha, {
  message: "As senhas não coincidem",
  path: ["confirmar_senha"]
});
function RedefinirSenha() {
  const navigate = useNavigate();
  const [checking, setChecking] = reactExports.useState(true);
  const [hasSession, setHasSession] = reactExports.useState(false);
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: a(schema)
  });
  reactExports.useEffect(() => {
    const run = async () => {
      const { data } = await supabase.auth.getSession();
      setHasSession(!!data.session);
      setChecking(false);
    };
    void run();
  }, []);
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: data.senha });
      if (error) throw error;
      Jt.success("Senha atualizada com sucesso. Faça login novamente.");
      const { error: signOutLocalError } = await supabase.auth.signOut({ scope: "local" });
      if (signOutLocalError) {
        await supabase.auth.signOut();
      }
      navigate("/login?password_updated=1", { replace: true });
    } catch (err) {
      Jt.error(err instanceof Error ? err.message : "Não foi possível atualizar a senha.");
    } finally {
      setIsLoading(false);
    }
  };
  if (checking) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "w-full max-w-md", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "flex items-center justify-center py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" }) }) }) });
  }
  if (!hasSession) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "w-full max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "space-y-1 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppLogo, { size: 48, rounded: "xl" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-2xl font-bold", children: "Link inválido ou expirado" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Solicite novamente o e-mail de recuperação para redefinir sua senha." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/esqueci-senha", children: "Solicitar novo link" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", className: "w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", children: "Voltar para o login" }) })
      ] })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "w-full max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "space-y-1 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppLogo, { size: 48, rounded: "xl" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-2xl font-bold", children: "Redefinir Senha" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Escolha uma nova senha para sua conta" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "senha", children: "Nova senha" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "senha", type: "password", ...register("senha"), disabled: isLoading }),
        errors.senha && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: errors.senha.message })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "confirmar_senha", children: "Confirmar nova senha" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "confirmar_senha", type: "password", ...register("confirmar_senha"), disabled: isLoading }),
        errors.confirmar_senha && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: errors.confirmar_senha.message })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "w-full", disabled: isLoading, children: isLoading ? "Salvando..." : "Salvar nova senha" })
    ] }) })
  ] }) });
}

export { RedefinirSenha as default };
