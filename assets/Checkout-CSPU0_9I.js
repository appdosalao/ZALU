import { r as reactExports, j as jsxRuntimeExports } from './react-vendor-BpXfDOw7.js';
import { a as useNavigate, b as useAuth, g as Button, C as Card, c as CardHeader, d as CardTitle, f as CardDescription, B as Badge, e as CardContent, G as Alert, H as AlertDescription, Y as Accordion, Z as AccordionItem, $ as AccordionTrigger, a0 as AccordionContent, J as Jt, a1 as buildCaktoCheckoutUrl } from './index-U74ij7JC.js';
import { C as Checkbox } from './checkbox-CBroLTbH.js';
import { as as ArrowLeft, L as Lock, l as Check, j as ShieldCheck, m as LoaderCircle } from './ui-libs-B5Rrhu1L.js';
import './chart-libs-Cdz70zdY.js';
import './index-Ls-C4DWD.js';

function Checkout() {
  const navigate = useNavigate();
  const [mensalConsent, setMensalConsent] = reactExports.useState(false);
  const [isRedirecting, setIsRedirecting] = reactExports.useState(false);
  const { isAuthenticated, session, usuario } = useAuth();
  const resumo = reactExports.useMemo(() => {
    return "Assinatura mensal (R$ 7,90/mês)";
  }, []);
  const redirectToCakto = async () => {
    const userId = session?.user?.id ?? null;
    const baseUrl = String(
      "https://pay.cakto.com.br/3banwdk_876948"
    ).trim();
    if (!isAuthenticated || !userId || !usuario) {
      Jt.error("Faça login para continuar");
      navigate("/login");
      return;
    }
    if (!baseUrl) {
      Jt.error("Checkout mensal não configurado");
      return;
    }
    if (!mensalConsent) {
      Jt.error("Confirme o termo da assinatura mensal para continuar");
      return;
    }
    setIsRedirecting(true);
    try {
      const redirectUrl = `${window.location.origin}/payment/success`;
      const checkoutUrl = buildCaktoCheckoutUrl({
        baseUrl,
        sck: userId,
        name: usuario?.nome_completo ?? null,
        email: usuario?.email ?? null,
        phone: usuario?.telefone ?? null,
        redirectUrl
      });
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Erro ao processar checkout:", error);
      Jt.error("Erro na conexão com o servidor.");
      setIsRedirecting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gradient-to-b from-background to-muted/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto py-10 px-4 max-w-3xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", className: "gap-2", onClick: () => navigate("/planos"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
        "Voltar"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Checkout Seguro" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-xl border-primary/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-2xl", children: "Finalizar Compra" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-base", children: resumo })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-3.5 w-3.5" }),
            "Checkout Cakto"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-primary/5 p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Você está adquirindo" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-lg font-semibold", children: "Assinatura mensal do Salão de Bolso" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 grid gap-2 sm:grid-cols-2", children: [
            "Acesso completo ao app enquanto a assinatura estiver ativa",
            "Agendamentos e clientes ilimitados",
            "Controle financeiro e relatórios",
            "Atualizações futuras inclusas"
          ].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 bg-green-100 dark:bg-green-900/30 rounded-full p-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3 text-green-600 dark:text-green-400", strokeWidth: 3 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground/80", children: t })
          ] }, t)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6", children: [
        !isAuthenticated ? /* @__PURE__ */ jsxRuntimeExports.jsx(Alert, { variant: "destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { className: "text-sm font-medium", children: "Para continuar para o pagamento, faça login ou crie sua conta." }) }) : null,
        /* @__PURE__ */ jsxRuntimeExports.jsx(Alert, { className: "border-yellow-500/30 bg-yellow-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDescription, { className: "text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-4 w-4" }),
            "Garantia legal de arrependimento: em até 7 dias você pode solicitar suporte."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1", children: [
            "Contato: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "resellr7@gmail.com" }),
            " |",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "(33) 99854-2100" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 rounded-lg border p-4 bg-muted/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Checkbox,
            {
              id: "mensal-consent",
              checked: mensalConsent,
              onCheckedChange: (v) => setMensalConsent(Boolean(v)),
              className: "mt-1"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "mensal-consent", className: "text-sm leading-snug cursor-pointer font-medium", children: "Li e concordo que estou assinando um plano mensal recorrente de R$ 7,90/mês e confirmo estar ciente das políticas de pagamento/cancelamento." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: redirectToCakto,
            className: "w-full h-14 text-lg font-bold",
            disabled: isRedirecting || !mensalConsent,
            children: isRedirecting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-5 w-5 animate-spin" }),
              "Abrindo checkout..."
            ] }) : "Ir para o pagamento seguro"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
          "Ao continuar, você concorda com os",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { className: "text-primary underline underline-offset-4", href: "/termos", children: "Termos" }),
          " ",
          "e a",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { className: "text-primary underline underline-offset-4", href: "/privacidade", children: "Política de Privacidade" }),
          "."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-card/50 p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: "Perguntas frequentes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Accordion, { type: "single", collapsible: true, className: "mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AccordionItem, { value: "faq-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionTrigger, { children: "Como o acesso é liberado?" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionContent, { children: "Após a confirmação do pagamento pela Cakto, seu usuário é liberado automaticamente." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AccordionItem, { value: "faq-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionTrigger, { children: "Posso pagar no Pix ou cartão?" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionContent, { children: "Os métodos exibidos dependem do checkout configurado na Cakto. Você verá as opções disponíveis ao abrir o checkout." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AccordionItem, { value: "faq-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionTrigger, { children: "A assinatura renova automaticamente?" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionContent, { children: "Sim. Por ser um plano mensal, a cobrança é recorrente conforme as regras exibidas no checkout. Você pode cancelar conforme a política do provedor de pagamento." })
            ] })
          ] })
        ] })
      ] })
    ] })
  ] }) });
}

export { Checkout as default };
