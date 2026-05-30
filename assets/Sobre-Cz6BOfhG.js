import { j as jsxRuntimeExports } from './react-vendor-BpXfDOw7.js';
import { C as Card, c as CardHeader, A as AppLogo, d as CardTitle, f as CardDescription, e as CardContent, g as Button, U as Link } from './index-BxmTkSue.js';
import { K as Calendar, U as Users, N as Scissors, V as DollarSign, j as ShieldCheck, i as Sparkles } from './ui-libs-BJEWQG8b.js';
import './chart-libs-Cdz70zdY.js';

const features = [
  { icon: Calendar, title: "Agendamentos Inteligentes", desc: "Organize sua agenda diária, semanal e mensal com confirmação e lembretes." },
  { icon: Users, title: "Clientes e Fidelidade", desc: "Cadastre clientes, histórico de serviços, pontos e recompensas." },
  { icon: Scissors, title: "Serviços e Produtos", desc: "Gerencie serviços, produtos de revenda e uso profissional." },
  { icon: DollarSign, title: "Financeiro Completo", desc: "Entradas, saídas, CMV, relatórios PDF/CSV e contas fixas." },
  { icon: ShieldCheck, title: "Privacidade e LGPD", desc: "Tratamento de dados conforme a Lei Geral de Proteção de Dados." },
  { icon: Sparkles, title: "PWA e Push", desc: "Instale como app e receba notificações com sons personalizados." }
];
const Sobre = () => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-responsive", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "w-full max-w-4xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppLogo, { size: 64, rounded: "xl" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-responsive-xl", children: "Salão de Bolso" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-responsive-sm", children: "Sistema de gestão para salões e profissionais — agendamentos, clientes, serviços, produtos e financeiro." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-responsive", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: features.map(({ icon: Icon, title, desc }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border rounded-xl bg-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: title })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: desc })
      ] }, title)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 justify-center mt-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "default", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", children: "Fazer Login" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/cadastro", children: "Criar Conta" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "ghost", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/privacidade", children: "Privacidade" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "ghost", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/termos", children: "Termos de Uso" }) })
      ] })
    ] })
  ] }) });
};

export { Sobre as default };
