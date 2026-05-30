import { r as reactExports, j as jsxRuntimeExports } from './react-vendor-BpXfDOw7.js';
import { a as useNavigate, C as Card, c as CardHeader, A as AppLogo, d as CardTitle, f as CardDescription, g as Button, e as CardContent } from './index-BxmTkSue.js';
import { P as Progress } from './progress-DvecILDX.js';
import { i as Sparkles, K as Calendar, U as Users, V as DollarSign, bo as Gift, a8 as Bell, l as Check, as as ArrowLeft, b8 as ArrowRight } from './ui-libs-BJEWQG8b.js';
import './chart-libs-Cdz70zdY.js';

const onboardingSteps = [
  {
    title: "Bem-vindo ao seu Sistema de Gestão!",
    description: "Vamos fazer um tour rápido pelas principais funcionalidades",
    icon: Sparkles,
    features: [
      "Gerencie seus agendamentos de forma simples",
      "Controle completo de clientes e serviços",
      "Acompanhe seu financeiro em tempo real",
      "Fidelize seus clientes com recompensas"
    ]
  },
  {
    title: "Agendamentos e Agenda",
    description: "Organize seus horários de forma profissional",
    icon: Calendar,
    features: [
      "Visualização diária, semanal e mensal",
      "Notificações automáticas para você e seus clientes",
      "Agendamento online para seus clientes",
      "Controle de confirmações e reagendamentos"
    ]
  },
  {
    title: "Clientes e Serviços",
    description: "Mantenha tudo organizado",
    icon: Users,
    features: [
      "Cadastro completo de clientes com histórico",
      "Gestão de serviços com preços e durações",
      "Cronogramas de retorno automáticos",
      "Histórico completo de atendimentos"
    ]
  },
  {
    title: "Controle Financeiro",
    description: "Acompanhe seu faturamento",
    icon: DollarSign,
    features: [
      "Lançamentos de receitas e despesas",
      "Relatórios e gráficos detalhados",
      "Controle de contas a pagar e receber",
      "Visualização de lucro por período"
    ]
  },
  {
    title: "Programa de Fidelidade",
    description: "Fidelize e recompense seus clientes",
    icon: Gift,
    features: [
      "Sistema de pontos por agendamento",
      "Recompensas personalizáveis",
      "Níveis de fidelidade (Bronze, Prata, Ouro)",
      "Aumente seu faturamento e retenção"
    ]
  },
  {
    title: "Seu Acesso",
    description: "Aproveite todos os benefícios",
    icon: Bell,
    features: [
      "7 dias grátis para testar todas as funcionalidades",
      "Assinatura mensal por R$ 7,90/mês",
      "Acesso completo enquanto a assinatura estiver ativa",
      "Suporte prioritário e atualizações constantes"
    ]
  }
];
function Onboarding() {
  const [currentStep, setCurrentStep] = reactExports.useState(0);
  const navigate = useNavigate();
  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  const handleFinish = () => {
    localStorage.setItem("onboarding-completed", "true");
    navigate("/");
  };
  const handleSkip = () => {
    localStorage.setItem("onboarding-completed", "true");
    navigate("/");
  };
  const progress = (currentStep + 1) / onboardingSteps.length * 100;
  const step = onboardingSteps[currentStep];
  const StepIcon = step.icon;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "w-full max-w-2xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AppLogo, { size: 40, rounded: "xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StepIcon, { className: "h-6 w-6 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-2xl", children: step.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: step.description })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", onClick: handleSkip, children: "Pular" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Passo ",
            currentStep + 1,
            " de ",
            onboardingSteps.length
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            Math.round(progress),
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: progress, className: "h-2" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-3", children: step.features.map((feature, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base", children: feature })
      ] }, index)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            onClick: handlePrevious,
            disabled: currentStep === 0,
            className: "flex-1",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
              "Anterior"
            ]
          }
        ),
        currentStep === onboardingSteps.length - 1 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleFinish, className: "flex-1", children: [
          "Começar a usar",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "ml-2 h-4 w-4" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleNext, className: "flex-1", children: [
          "Próximo",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
        ] })
      ] })
    ] })
  ] }) });
}

export { Onboarding as default };
