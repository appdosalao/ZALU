import { r as reactExports, j as jsxRuntimeExports } from './react-vendor-BpXfDOw7.js';
import { a3 as useEnhancedNotifications, C as Card, c as CardHeader, d as CardTitle, f as CardDescription, e as CardContent, g as Button, A as AppLogo } from './index-BxmTkSue.js';
import { a_ as Volume2, bF as VolumeX } from './ui-libs-BJEWQG8b.js';
import './chart-libs-Cdz70zdY.js';

const TesteSom = () => {
  const [isPlaying, setIsPlaying] = reactExports.useState(false);
  const { handleNewAppointment, handleServiceCompleted, handleExpenseReminder } = useEnhancedNotifications();
  const playTestSound = async (soundType) => {
    if (isPlaying) return;
    setIsPlaying(true);
    try {
      const defaultFiles = {
        notification: "Mensagem de Texto 1.mp3",
        notification2: "Mensagem de Texto 2.mp3",
        notification3: "Mensagem de Texto 3.mp3"
      };
      const filename = defaultFiles[soundType];
      const audio = new Audio(`/sounds/${encodeURIComponent(filename)}`);
      audio.volume = 0.7;
      await audio.play();
    } catch (error) {
      console.error("Erro ao reproduzir som:", error);
      setIsPlaying(false);
      return;
    }
    setTimeout(() => setIsPlaying(false), 2e3);
  };
  const testNotificationWithSound = async (type) => {
    const mockData = {
      id: "test-" + Date.now(),
      clienteNome: "Cliente Teste",
      servicoNome: "Corte de Cabelo",
      data: "2024-01-15",
      hora: "14:00",
      valor: 50
    };
    switch (type) {
      case "appointment":
        await handleNewAppointment(mockData);
        break;
      case "service":
        await handleServiceCompleted(mockData);
        break;
      case "expense":
        await handleExpenseReminder({
          descricao: "Aluguel",
          valor: 1500,
          dataVencimento: "2024-01-20"
        });
        break;
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "w-full max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Volume2, { className: "h-5 w-5" }),
        "Teste de Sons"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Teste os diferentes sons de notificação" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            onClick: () => playTestSound("notification"),
            disabled: isPlaying,
            className: "justify-start",
            children: [
              isPlaying ? /* @__PURE__ */ jsxRuntimeExports.jsx(VolumeX, { className: "h-4 w-4 mr-2" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Volume2, { className: "h-4 w-4 mr-2" }),
              "Som Padrão (Notification)"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            onClick: () => playTestSound("notification2"),
            disabled: isPlaying,
            className: "justify-start",
            children: [
              isPlaying ? /* @__PURE__ */ jsxRuntimeExports.jsx(VolumeX, { className: "h-4 w-4 mr-2" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Volume2, { className: "h-4 w-4 mr-2" }),
              "Som Alternativo (Notification 2)"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            onClick: () => playTestSound("notification3"),
            disabled: isPlaying,
            className: "justify-start",
            children: [
              isPlaying ? /* @__PURE__ */ jsxRuntimeExports.jsx(VolumeX, { className: "h-4 w-4 mr-2" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Volume2, { className: "h-4 w-4 mr-2" }),
              "Som Suave (Notification 3)"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t pt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-medium mb-2", children: "Testar Notificações Completas:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "secondary",
              size: "sm",
              onClick: () => testNotificationWithSound("appointment"),
              children: "Novo Agendamento"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "secondary",
              size: "sm",
              onClick: () => testNotificationWithSound("service"),
              children: "Serviço Finalizado"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "secondary",
              size: "sm",
              onClick: () => testNotificationWithSound("expense"),
              children: "Lembrete Despesa"
            }
          )
        ] })
      ] })
    ] })
  ] });
};

const TesteSomPage = () => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-responsive", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "w-full max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppLogo, { size: 56, rounded: "xl" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Teste de Sons" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Clique para reproduzir os sons configurados" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TesteSom, {}) })
  ] }) });
};

export { TesteSomPage as default };
