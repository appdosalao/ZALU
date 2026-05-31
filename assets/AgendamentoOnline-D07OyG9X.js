const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/AgendamentoOnlineForm-DSZyP4AQ.js","assets/react-vendor-BpXfDOw7.js","assets/index-U74ij7JC.js","assets/ui-libs-B5Rrhu1L.js","assets/chart-libs-Cdz70zdY.js","assets/index-B-tgh9gY.css","assets/label-C0AJeojg.js","assets/select-Ce9M_rda.js","assets/index-BfAAoDv6.js","assets/index-Ls-C4DWD.js","assets/textarea-D9C69N9T.js","assets/checkbox-CBroLTbH.js","assets/useAgendamentoOnlineService-ksgHdO0Y.js","assets/form-libs-BJ_wtrcd.js"])))=>i.map(i=>d[i]);
import { C as Card, c as CardHeader, d as CardTitle, f as CardDescription, e as CardContent, _ as __vitePreload } from './index-U74ij7JC.js';
import { j as jsxRuntimeExports, r as reactExports, R as React } from './react-vendor-BpXfDOw7.js';
import { m as LoaderCircle } from './ui-libs-B5Rrhu1L.js';
import './chart-libs-Cdz70zdY.js';

const AgendamentoOnlineForm = React.lazy(
  () => __vitePreload(() => import('./AgendamentoOnlineForm-DSZyP4AQ.js'),true?__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13]):void 0).then((module) => ({
    default: module.AgendamentoOnlineForm
  }))
);
function AgendamentoOnline() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-2xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    reactExports.Suspense,
    {
      fallback: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-3xl mb-2", children: "Carregando..." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Preparando o formulário de agendamento" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "flex justify-center py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-10 w-10 animate-spin text-primary" }) })
      ] }),
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(AgendamentoOnlineForm, {})
    }
  ) }) });
}

export { AgendamentoOnline as default };
