import { r as reactExports, j as jsxRuntimeExports } from './react-vendor-BpXfDOw7.js';
import { J as Jt, C as Card, c as CardHeader, d as CardTitle, f as CardDescription, e as CardContent, j as Input, g as Button, B as Badge } from './index-BxmTkSue.js';
import { a as adminApi } from './useAdminApi-l0ys-icG.js';
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from './table-C1_qONOv.js';
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from './dialog-B2cdB-ir.js';
import './ui-libs-BJEWQG8b.js';
import './chart-libs-Cdz70zdY.js';

function AdminUsers() {
  const [users, setUsers] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [page, setPage] = reactExports.useState(1);
  const perPage = 50;
  const [search, setSearch] = reactExports.useState("");
  const [detailsOpen, setDetailsOpen] = reactExports.useState(false);
  const [selected, setSelected] = reactExports.useState(null);
  const [usage, setUsage] = reactExports.useState(null);
  const [usageLoading, setUsageLoading] = reactExports.useState(false);
  const load = reactExports.useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.users(page, perPage);
      setUsers(data.users);
    } catch {
      Jt.error("Não foi possível carregar usuários.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [page]);
  reactExports.useEffect(() => {
    void load();
  }, [load]);
  const filtered = reactExports.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => {
      const email = (u.email || "").toLowerCase();
      const nome = (u.profile?.nome_completo || "").toLowerCase();
      const sala = (u.profile?.nome_personalizado_app || "").toLowerCase();
      return email.includes(q) || nome.includes(q) || sala.includes(q) || u.id.toLowerCase().includes(q);
    });
  }, [search, users]);
  const openDetails = async (row) => {
    setSelected(row);
    setUsage(null);
    setDetailsOpen(true);
    setUsageLoading(true);
    try {
      const data = await adminApi.usage(row.id);
      setUsage(data);
    } catch {
      Jt.error("Falha ao carregar uso do usuário.");
    } finally {
      setUsageLoading(false);
    }
  };
  const sendReset = async (id) => {
    try {
      await adminApi.sendPasswordReset(id);
      Jt.success("E-mail de redefinição enviado.");
    } catch {
      Jt.error("Falha ao enviar redefinição de senha.");
    }
  };
  const copy = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      Jt.success("Copiado.");
    } catch {
      Jt.error("Não foi possível copiar.");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 sm:space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Usuários" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Lista de contas com e-mails completos para suporte" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Buscar..." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setPage((p) => Math.max(1, p - 1)), disabled: page === 1 || loading, children: "Anterior" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setPage((p) => p + 1), disabled: loading, children: "Próxima" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md border border-border overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "E-mail" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Último acesso" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Ações" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 4, className: "text-center text-muted-foreground", children: loading ? "Carregando..." : "Nenhum usuário encontrado" }) }) : filtered.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "min-w-[220px]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: u.email || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground truncate", children: u.profile?.nome_personalizado_app || u.profile?.nome_completo || u.id })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: u.profile?.paid_access ? "default" : "outline", children: u.profile?.paid_access ? "Pago" : "Não pago" }),
              u.inactive30d ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "destructive", children: "Inativo" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", children: "Ativo" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm text-muted-foreground", children: (u.last_sign_in_at || u.created_at).slice(0, 10) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "text-right space-x-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: () => void openDetails(u), children: "Detalhes" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: () => void sendReset(u.id), children: "Redefinir senha" })
            ] })
          ] }, u.id)) })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: detailsOpen, onOpenChange: setDetailsOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Detalhes do usuário" }) }),
      !selected ? null : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm", children: "Conta" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "ID e e-mail" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "ID:" }),
                " ",
                selected.id
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "E-mail:" }),
                " ",
                selected.email || "—"
              ] }),
              selected.email ? /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: () => void copy(selected.email), children: "Copiar e-mail" }) : null
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm", children: "Plano" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Status e pagamento" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-2 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "paid_access:" }),
                " ",
                String(!!selected.profile?.paid_access)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "subscription_status:" }),
                " ",
                selected.profile?.subscription_status || "—"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "paid_at:" }),
                " ",
                (selected.profile?.paid_at || "—").slice(0, 10)
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm", children: "Uso" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Indicadores simples por volume de registros" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: usageLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Carregando..." }) : !usage ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Sem dados" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-2 sm:grid-cols-3 text-sm", children: Object.entries(usage).map(([k, v]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-md border border-border p-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: k }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: v })
          ] }, k)) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Senhas não são visíveis nem recuperáveis. Use “Redefinir senha” para suporte." })
      ] })
    ] }) })
  ] });
}

export { AdminUsers as default };
