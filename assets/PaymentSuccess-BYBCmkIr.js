import { r as reactExports, j as jsxRuntimeExports } from './react-vendor-BpXfDOw7.js';
import { a as useNavigate, C as Card, c as CardHeader, d as CardTitle, e as CardContent } from './index-BxmTkSue.js';
import { aP as CircleCheck, m as LoaderCircle } from './ui-libs-BJEWQG8b.js';
import './chart-libs-Cdz70zdY.js';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 3e3);
    return () => clearTimeout(timer);
  }, [navigate]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "max-w-md w-full shadow-2xl border-green-200 text-center animate-in fade-in zoom-in duration-500", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center animate-bounce", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-10 h-10 text-green-600" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-3xl font-extrabold text-green-800", children: "Pagamento Confirmado!" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg text-green-700 font-medium", children: "Sua assinatura foi ativada com sucesso. Aproveite todas as funcionalidades do Salão de Bolso!" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2 text-muted-foreground pt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin text-green-600" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: "Redirecionando para o seu dashboard..." })
      ] })
    ] })
  ] }) });
};

export { PaymentSuccess as default };
