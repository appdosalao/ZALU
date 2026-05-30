import { r as reactExports, j as jsxRuntimeExports } from './react-vendor-BpXfDOw7.js';
import { b as useAuth, g as Button, U as Link, A as AppLogo, K as Sheet, L as SheetTrigger, M as SheetContent, V as Outlet, W as NavLink } from './index-BxmTkSue.js';
import { by as ShieldAlert, n as LogOut, bz as Menu, J as LayoutDashboard, U as Users, b9 as ChartColumn, at as FileText } from './ui-libs-BJEWQG8b.js';
import './chart-libs-Cdz70zdY.js';

const parseCsv = (value) => {
  return (value || "").split(",").map((v) => v.trim().toLowerCase()).filter(Boolean);
};
const AdminNav = ({ onNavigate }) => {
  const items = [
    { title: "Visão geral", to: "/admin", icon: LayoutDashboard },
    { title: "Usuários", to: "/admin/usuarios", icon: Users },
    { title: "Métricas", to: "/admin/metricas", icon: ChartColumn },
    { title: "Auditoria", to: "/admin/auditoria", icon: FileText }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "space-y-1", children: items.map((item) => {
    const Icon = item.icon;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      NavLink,
      {
        to: item.to,
        onClick: onNavigate,
        className: ({ isActive }) => `flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`,
        end: item.to === "/admin",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: item.title })
        ]
      },
      item.to
    );
  }) });
};
function AdminLayout() {
  const { user, usuario, logout } = useAuth();
  const [open, setOpen] = reactExports.useState(false);
  const allowedEmails = reactExports.useMemo(() => parseCsv(undefined                                 ), []);
  const email = (user?.email || usuario?.email || "").trim().toLowerCase();
  const isAdmin = !!email && allowedEmails.includes(email);
  if (!isAdmin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gradient-to-br from-background via-muted/30 to-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container-responsive p-4 sm:p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-xl mx-auto rounded-xl border border-destructive/30 bg-card p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 rounded-lg bg-destructive/10 p-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "h-5 w-5 text-destructive" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-semibold", children: "Acesso restrito" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Esta área é exclusiva do administrador. Configure VITE_ADMIN_EMAILS e ADMIN_EMAILS para habilitar." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: "Voltar" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => void logout(), variant: "destructive", children: "Sair" })
      ] })
    ] }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gradient-to-br from-background via-muted/30 to-background", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "hidden md:flex w-64 flex-col border-r border-border/50 bg-card/70 backdrop-blur-xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 p-4 border-b border-border/50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AppLogo, { size: 28, rounded: "xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-bold truncate", children: "Admin" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground truncate", children: email })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminNav, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 border-t border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => void logout(), variant: "outline", className: "w-full justify-start gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" }),
        "Sair"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-30 h-14 flex items-center gap-3 border-b border-border/50 bg-card/70 backdrop-blur-xl px-3 sm:px-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Sheet, { open, onOpenChange: setOpen, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "icon", className: "btn-touch", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "h-4 w-4" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetContent, { side: "left", className: "p-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 p-4 border-b border-border/50", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AppLogo, { size: 28, rounded: "xl" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-bold truncate", children: "Admin" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground truncate", children: email })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminNav, { onNavigate: () => setOpen(false) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 border-t border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => void logout(), variant: "outline", className: "w-full justify-start gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" }),
              "Sair"
            ] }) })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold truncate", children: "Área Administrativa" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground truncate", children: "Acesso exclusivo" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", size: "sm", className: "hidden sm:inline-flex", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: "Ir para o App" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 overflow-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container-responsive p-3 sm:p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) }) })
    ] })
  ] }) });
}

export { AdminLayout as default };
