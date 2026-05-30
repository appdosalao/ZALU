import { r as reactExports, j as jsxRuntimeExports } from './react-vendor-BpXfDOw7.js';
import { J as Jt, C as Card, c as CardHeader, d as CardTitle, f as CardDescription, e as CardContent, g as Button } from './index-BxmTkSue.js';
import { a as adminApi } from './useAdminApi-l0ys-icG.js';
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from './table-C1_qONOv.js';
import './ui-libs-BJEWQG8b.js';
import './chart-libs-Cdz70zdY.js';

function AdminAudit() {
  const [logs, setLogs] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [page, setPage] = reactExports.useState(1);
  const perPage = 50;
  const load = reactExports.useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.auditLogs(page, perPage);
      setLogs(res.logs);
    } catch {
      Jt.error("Não foi possível carregar auditoria.");
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [page]);
  reactExports.useEffect(() => {
    void load();
  }, [load]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4 sm:space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Auditoria do Admin" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Registros de acesso e ações administrativas" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setPage((p) => Math.max(1, p - 1)), disabled: page === 1 || loading, children: "Anterior" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setPage((p) => p + 1), disabled: loading, children: "Próxima" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md border border-border overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Data" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Ação" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Ator" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "IP" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: logs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 4, className: "text-center text-muted-foreground", children: loading ? "Carregando..." : "Sem registros" }) }) : logs.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm text-muted-foreground", children: l.created_at.slice(0, 19).replace("T", " ") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: l.action }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: l.actor_email || "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground truncate", children: l.actor_user_id || "—" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm text-muted-foreground", children: l.ip || "—" })
        ] }, l.id)) })
      ] }) })
    ] })
  ] }) });
}

export { AdminAudit as default };
