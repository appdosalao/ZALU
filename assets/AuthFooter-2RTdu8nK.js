import { j as jsxRuntimeExports } from './react-vendor-BpXfDOw7.js';
import { U as Link } from './index-BxmTkSue.js';
import { ay as Mail, aw as MessageCircle } from './ui-libs-BJEWQG8b.js';

function AuthFooter() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 text-center space-y-2 text-muted-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-4 text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "a",
        {
          href: "mailto:resellr7@gmail.com",
          className: "inline-flex items-center gap-1 hover:text-primary transition-colors",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-3 w-3" }),
            "resellr7@gmail.com"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "a",
        {
          href: "https://wa.me/5533998542100?text=Ol%C3%A1%20suporte%2C%20preciso%20de%20ajuda",
          target: "_blank",
          rel: "noreferrer",
          className: "inline-flex items-center gap-1 hover:text-primary transition-colors",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-3 w-3" }),
            "WhatsApp (+55 33 99854-2100)"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/privacidade", className: "hover:underline", children: "Privacidade" }),
      " • ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/termos", className: "hover:underline", children: "Termos de Uso" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px]", children: [
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      " Lilac Luxe Salon"
    ] })
  ] });
}

export { AuthFooter as A };
