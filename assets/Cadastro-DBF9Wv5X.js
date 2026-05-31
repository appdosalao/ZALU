import { r as reactExports, j as jsxRuntimeExports } from './react-vendor-BpXfDOw7.js';
import { a as useNavigate, b as useAuth, C as Card, B as Badge, c as CardHeader, A as AppLogo, d as CardTitle, f as CardDescription, e as CardContent, G as Alert, H as AlertDescription, j as Input, X as Link, g as Button, s as supabase, J as Jt } from './index-U74ij7JC.js';
import { u as useForm, o as object, s as string, _ as _enum } from './form-libs-BJ_wtrcd.js';
import { a } from './zod-BCTNax0R.js';
import { L as Label } from './label-C0AJeojg.js';
import { P as Progress } from './progress-QmpbPEhd.js';
import { C as Checkbox } from './checkbox-CBroLTbH.js';
import { A as AuthFooter } from './AuthFooter-DvijK3jX.js';
import { i as Sparkles, Q as Clock, j as ShieldCheck, bC as Star, bB as EyeOff, aB as Eye, k as CreditCard, aP as CircleCheck } from './ui-libs-B5Rrhu1L.js';
import './chart-libs-Cdz70zdY.js';
import './index-Ls-C4DWD.js';

const cadastroSchema = object({
  nome_personalizado_app: string().min(1, "Nome da profissional/salão é obrigatório"),
  nome_completo: string().min(1, "Nome completo é obrigatório"),
  email: string().email("E-mail inválido"),
  telefone: string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  tema_preferencia: _enum(["feminino", "masculino"]),
  senha: string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  confirmar_senha: string().min(1, "Confirmação de senha é obrigatória")
}).refine((data) => data.senha === data.confirmar_senha, {
  message: "Senhas não coincidem",
  path: ["confirmar_senha"]
});
const Cadastro = () => {
  const navigate = useNavigate();
  const { cadastrar } = useAuth();
  const [error, setError] = reactExports.useState("");
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const [isBuying, setIsBuying] = reactExports.useState(false);
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    resolver: a(cadastroSchema),
    defaultValues: {
      tema_preferencia: "feminino"
    }
  });
  const temaEscolhido = watch("tema_preferencia");
  const senhaValor = watch("senha") || "";
  const [showSenha, setShowSenha] = reactExports.useState(false);
  const [showConfirm, setShowConfirm] = reactExports.useState(false);
  const [termsAccepted, setTermsAccepted] = reactExports.useState(false);
  const calcStrength = (s) => {
    let score = 0;
    if (s.length >= 6) score += 25;
    if (/[A-Z]/.test(s)) score += 25;
    if (/[0-9]/.test(s)) score += 25;
    if (/[^A-Za-z0-9]/.test(s)) score += 25;
    return score;
  };
  const strength = calcStrength(senhaValor);
  reactExports.useEffect(() => {
    if (temaEscolhido) {
      document.documentElement.setAttribute("data-theme", temaEscolhido);
      localStorage.setItem("app-theme", temaEscolhido);
    }
  }, [temaEscolhido]);
  const onSubmit = async (data) => {
    setIsLoading(true);
    setError("");
    try {
      if (!termsAccepted) {
        setError("Você precisa aceitar os termos de uso para continuar.");
        setIsLoading(false);
        return;
      }
      const ok = await cadastrar(data);
      if (ok) {
        const { data: authData } = await supabase.auth.getSession();
        if (!authData.session) {
          const redirect = isBuying ? `/checkout` : `/`;
          Jt.success("Conta criada! Confirme seu e-mail para continuar.");
          navigate(`/login?check_email=1&redirect=${encodeURIComponent(redirect)}`);
          return;
        }
        Jt.success("Conta criada com sucesso! Redirecionando...");
        if (isBuying) navigate("/checkout");
        else setTimeout(() => navigate("/"), 1500);
      } else {
        setError("Erro ao criar conta. Verifique os dados e tente novamente.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar conta. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleBuyNow = (e) => {
    setIsBuying(true);
    handleSubmit(onSubmit)(e);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/5 p-4 lg:p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden lg:flex flex-col space-y-8 pr-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4" }),
          "O Salão de Bolso evoluiu"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-5xl font-extrabold tracking-tight text-foreground leading-[1.1]", children: [
          "Gerencie seu salão de ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "forma profissional" }),
          " e descomplicada."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl text-muted-foreground max-w-lg", children: "A ferramenta completa que cabe na palma da sua mão. Agendamentos, clientes, financeiro e muito mais." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 items-start", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-5 w-5 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-lg", children: "Teste Grátis por 7 Dias" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Experimente todas as funcionalidades sem compromisso. Sem necessidade de cartão." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 items-start", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-5 w-5 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-lg", children: "Segurança de Dados" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Suas informações e as de seus clientes estão seguras com criptografia de ponta." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 items-start", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-5 w-5 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-lg", children: "Design Moderno e Intuitivo" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Feito pensando na agilidade do seu dia a dia, com interface clara e rápida." })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-8 border-t border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex -space-x-3", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-full border-2 border-background bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: `https://i.pravatar.cc/150?u=${i}`, alt: "Avatar", className: "w-full h-full object-cover" }) }, i)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-foreground", children: "Junte-se a +1.000 profissionais" }),
          " que já transformaram seus salões."
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-2xl border-primary/10 overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-primary/5 p-4 border-b border-primary/10 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-5 w-5 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-primary", children: "7 DIAS DE TESTE GRÁTIS" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "bg-white dark:bg-black font-bold", children: "OFERTA LIMITADA" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "space-y-1 text-center pt-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mb-2 lg:hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppLogo, { size: 48, rounded: "xl" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-3xl font-bold", children: "Crie sua conta" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-base", children: "Comece agora mesmo a profissionalizar seu salão." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-5", children: [
          error && /* @__PURE__ */ jsxRuntimeExports.jsx(Alert, { variant: "destructive", className: "bg-destructive/10 text-destructive border-destructive/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { className: "font-medium", children: error }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "nome_personalizado_app", className: "font-semibold", children: "Nome do seu Negócio *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "nome_personalizado_app",
                  placeholder: "Ex: Studio Beauty",
                  ...register("nome_personalizado_app"),
                  disabled: isLoading
                }
              ) }),
              errors.nome_personalizado_app && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive mt-1 font-medium", children: errors.nome_personalizado_app.message })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "nome_completo", className: "font-semibold", children: "Seu Nome Completo *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "nome_completo",
                  placeholder: "Ex: Camila Lopes",
                  ...register("nome_completo"),
                  disabled: isLoading
                }
              ),
              errors.nome_completo && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive mt-1 font-medium", children: errors.nome_completo.message })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", className: "font-semibold", children: "E-mail Profissional *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "email",
                  type: "email",
                  placeholder: "contato@empresa.com",
                  ...register("email"),
                  disabled: isLoading
                }
              ),
              errors.email && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive mt-1 font-medium", children: errors.email.message })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "telefone", className: "font-semibold", children: "WhatsApp (com DDD) *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "telefone",
                  placeholder: "(11) 99999-9999",
                  ...register("telefone"),
                  disabled: isLoading
                }
              ),
              errors.telefone && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive mt-1 font-medium", children: errors.telefone.message })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-base font-semibold", children: "Esquema de Cores do seu App" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: `relative p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-primary/50 bg-card ${temaEscolhido === "feminino" ? "border-primary shadow-md ring-2 ring-primary/10" : "border-border"}`,
                  onClick: () => !isLoading && setValue("tema_preferencia", "feminino"),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center gap-2 mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full", style: { background: "linear-gradient(135deg, hsl(267 83% 58%), hsl(320 85% 75%))" } }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center font-bold text-sm", children: "Feminino" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute top-2 right-2 w-4 h-4 rounded-full border-2 transition-all ${temaEscolhido === "feminino" ? "bg-primary border-primary" : "border-border"}` })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: `relative p-4 border-2 rounded-xl cursor-pointer transition-all hover:border-primary/50 bg-card ${temaEscolhido === "masculino" ? "border-primary shadow-md ring-2 ring-primary/10" : "border-border"}`,
                  onClick: () => !isLoading && setValue("tema_preferencia", "masculino"),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center gap-2 mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full", style: { background: "linear-gradient(135deg, hsl(217 91% 60%), hsl(220 60% 50%))" } }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center font-bold text-sm", children: "Masculino" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `absolute top-2 right-2 w-4 h-4 rounded-full border-2 transition-all ${temaEscolhido === "masculino" ? "bg-primary border-primary" : "border-border"}` })
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "senha", title: "Crie uma senha forte", children: "Crie sua Senha *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "senha",
                    type: showSenha ? "text" : "password",
                    placeholder: "Mínimo 6 caracteres",
                    ...register("senha"),
                    disabled: isLoading,
                    className: "pr-10"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
                    onClick: () => setShowSenha((v) => !v),
                    children: showSenha ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: strength, className: "h-1.5 mt-2" }),
              errors.senha && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive mt-1 font-medium", children: errors.senha.message })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "confirmar_senha", children: "Confirme a Senha *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "confirmar_senha",
                    type: showConfirm ? "text" : "password",
                    placeholder: "Digite novamente",
                    ...register("confirmar_senha"),
                    disabled: isLoading,
                    className: "pr-10"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
                    onClick: () => setShowConfirm((v) => !v),
                    children: showConfirm ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" })
                  }
                )
              ] }),
              errors.confirmar_senha && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive mt-1 font-medium", children: errors.confirmar_senha.message })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 pt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Checkbox,
              {
                id: "terms",
                checked: termsAccepted,
                onCheckedChange: (c) => setTermsAccepted(!!c),
                className: "mt-0.5 border-primary data-[state=checked]:bg-primary"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "terms", className: "text-sm leading-tight text-muted-foreground", children: [
              "Eu aceito os ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/termos", className: "text-primary hover:underline font-semibold", children: "termos de uso" }),
              " e ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/privacidade", className: "text-primary hover:underline font-semibold", children: "políticas de privacidade" }),
              "."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 pt-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "submit",
                className: "w-full h-14 text-lg font-bold shadow-lg shadow-primary/20 hover:scale-[1.01] transition-all",
                disabled: isLoading,
                onClick: () => setIsBuying(false),
                children: isLoading && !isBuying ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex items-center gap-2", children: "Criando conta..." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                  "Começar Teste Grátis ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-5 w-5 ml-1" })
                ] })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative py-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-full border-t" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative flex justify-center text-xs uppercase", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-background px-2 text-muted-foreground font-medium", children: "Ou se preferir" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                className: "w-full h-14 text-lg font-bold border-2 border-primary/20 hover:bg-primary/5 hover:border-primary/50 transition-all text-primary group",
                disabled: isLoading,
                onClick: handleBuyNow,
                children: isLoading && isBuying ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex items-center gap-2 text-primary", children: "Processando..." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                  "Assinar Agora (R$ 7,90/mês)",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform" })
                ] })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground", children: [
            "Já tem uma conta?",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "text-primary hover:underline font-bold", children: "Faça login aqui" })
          ] }) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex items-center justify-center gap-6 grayscale opacity-60", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 font-bold text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-4 w-4" }),
          " SSL SECURE"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 font-bold text-sm uppercase", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4" }),
          " Pagamento Seguro"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AuthFooter, {}) })
    ] })
  ] }) });
};

export { Cadastro as default };
