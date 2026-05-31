import { r as reactExports, j as jsxRuntimeExports } from './react-vendor-BpXfDOw7.js';
import { s as supabase, U as normalizeUsuario, J as Jt, g as Button, C as Card, e as CardContent, j as Input, c as CardHeader, d as CardTitle, K as Sheet, M as SheetContent, N as SheetHeader, O as SheetTitle, V as SheetClose, W as SheetDescription, v as Separator, B as Badge, b as useAuth, A as AppLogo } from './index-U74ij7JC.js';
import { T as Tabs, a as TabsList, b as TabsTrigger } from './tabs-CjCc2DlV.js';
import { S as ScrollArea } from './scroll-area-BG3HujHg.js';
import { D as Download, an as Search, ay as Mail, ax as Phone, X, N as Scissors, U as Users, Q as Clock, K as Calendar, V as DollarSign, b9 as ChartColumn, ae as TrendingUp, a8 as Bell, bw as MessageSquare, bx as SquareCheckBig, a0 as Settings } from './ui-libs-B5Rrhu1L.js';
import './chart-libs-Cdz70zdY.js';
import './index-BfAAoDv6.js';

function useSupabaseAdmin() {
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [usuarios, setUsuarios] = reactExports.useState([]);
  const loadAllUsuarios = reactExports.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: queryError } = await supabase.from("usuarios").select("*").order("created_at", { ascending: false });
      if (queryError) throw queryError;
      const mappedUsuarios = (data || []).map((u) => {
        const usuario = normalizeUsuario(u);
        return {
          ...usuario,
          isAdmin: usuario.email === "resellr7@gmail.com"
        };
      });
      setUsuarios(mappedUsuarios);
      return mappedUsuarios;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao carregar usuários";
      setError(errorMessage);
      Jt.error(errorMessage);
      console.error("Erro ao carregar usuários:", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);
  const loadUserServicos = reactExports.useCallback(async (userId) => {
    try {
      const { data, error: queryError } = await supabase.from("servicos").select("*").eq("user_id", userId);
      if (queryError) throw queryError;
      return data || [];
    } catch (err) {
      console.error("Erro ao carregar serviços do usuário:", err);
      return [];
    }
  }, []);
  const loadUserClientes = reactExports.useCallback(async (userId) => {
    try {
      const { data, error: queryError } = await supabase.from("clientes").select("*").eq("user_id", userId);
      if (queryError) throw queryError;
      return data || [];
    } catch (err) {
      console.error("Erro ao carregar clientes do usuário:", err);
      return [];
    }
  }, []);
  const loadUserAgendamentos = reactExports.useCallback(async (userId) => {
    try {
      const { data, error: queryError } = await supabase.from("agendamentos").select("*").eq("user_id", userId);
      if (queryError) throw queryError;
      return data || [];
    } catch (err) {
      console.error("Erro ao carregar agendamentos do usuário:", err);
      return [];
    }
  }, []);
  const updateUsuario = reactExports.useCallback(async (id, updates) => {
    setLoading(true);
    try {
      const { error: error2 } = await supabase.from("usuarios").update(updates).eq("id", id);
      if (error2) throw error2;
      Jt.success("Usuário atualizado com sucesso!");
      await loadAllUsuarios();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao atualizar usuário";
      Jt.error(errorMessage);
      console.error("Erro ao atualizar usuário:", err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [loadAllUsuarios]);
  reactExports.useEffect(() => {
    const channel = supabase.channel("admin-usuarios-changes").on(
      "postgres_changes",
      { event: "*", schema: "public", table: "usuarios" },
      () => loadAllUsuarios()
    ).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadAllUsuarios]);
  return {
    loading,
    error,
    usuarios,
    loadAllUsuarios,
    loadUserServicos,
    loadUserClientes,
    loadUserAgendamentos,
    updateUsuario
  };
}

const exportToCSV = (usuarios) => {
  const headers = [
    "ID",
    "Nome Completo",
    "E-mail",
    "Telefone",
    "Data de Cadastro",
    "Plano",
    "Status",
    "Data Último Pagamento",
    "Acesso Pago"
  ];
  const csvContent = [
    headers.join(","),
    ...usuarios.map((u) => [
      u.id,
      `"${u.nome_completo}"`,
      u.email,
      u.telefone,
      u.created_at,
      u.plan_type || "-",
      u.subscription_status || "-",
      u.paid_at || "-",
      u.paid_access ? "Sim" : "Não"
    ].join(","))
  ].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `usuarios_salao_de_bolso_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
function AdminUsuarios() {
  const { usuarios, loading, loadAllUsuarios, loadUserServicos, loadUserClientes, loadUserAgendamentos } = useSupabaseAdmin();
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const [activeFilter, setActiveFilter] = reactExports.useState("todos");
  const [selectedUser, setSelectedUser] = reactExports.useState(null);
  const [userDetails, setUserDetails] = reactExports.useState({ servicos: [], clientes: [], agendamentos: [], loading: false });
  reactExports.useEffect(() => {
    loadAllUsuarios();
  }, [loadAllUsuarios]);
  reactExports.useEffect(() => {
    if (selectedUser) {
      const loadDetails = async () => {
        setUserDetails((prev) => ({ ...prev, loading: true }));
        const [servicos, clientes, agendamentos] = await Promise.all([
          loadUserServicos(selectedUser.id),
          loadUserClientes(selectedUser.id),
          loadUserAgendamentos(selectedUser.id)
        ]);
        setUserDetails({ servicos, clientes, agendamentos, loading: false });
      };
      loadDetails();
    }
  }, [selectedUser, loadUserServicos, loadUserClientes, loadUserAgendamentos]);
  const filteredUsuarios = reactExports.useMemo(() => {
    let filtered = usuarios;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (u) => u.nome_completo.toLowerCase().includes(term) || u.email.toLowerCase().includes(term)
      );
    }
    if (activeFilter === "ativos") {
      filtered = filtered.filter(
        (u) => u.subscription_status === "active" || u.paid_access
      );
    } else if (activeFilter === "inativos") {
      filtered = filtered.filter(
        (u) => u.subscription_status !== "active" && !u.paid_access
      );
    }
    return filtered;
  }, [usuarios, searchTerm, activeFilter]);
  const renderStatusBadge = (usuario) => {
    if (usuario.isAdmin) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-rose-500 text-white hover:bg-rose-600", children: "Admin" });
    }
    if (usuario.paid_access || usuario.subscription_status === "active") {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-green-500 text-white hover:bg-green-600", children: "Ativo" });
    }
    if (usuario.subscription_status === "trial") {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-yellow-500 text-white hover:bg-yellow-600", children: "Em Teste" });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-gray-500 text-white hover:bg-gray-600", children: "Inativo" });
  };
  const calculateStats = () => {
    if (!selectedUser) return null;
    const { servicos, clientes, agendamentos } = userDetails;
    const now = /* @__PURE__ */ new Date();
    const twelveMonthsAgo = new Date(now.getFullYear() - 1, now.getMonth(), 1);
    const agendamentosLastYear = agendamentos.filter(
      (a) => new Date(a.data) >= twelveMonthsAgo
    );
    const agendamentosByMonth = {};
    agendamentosLastYear.forEach((a) => {
      const date = new Date(a.data);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      agendamentosByMonth[key] = (agendamentosByMonth[key] || 0) + 1;
    });
    const monthCount = Object.keys(agendamentosByMonth).length || 1;
    const averageAgendamentos = agendamentosLastYear.length / monthCount;
    return {
      totalServicos: servicos.length,
      totalClientes: clientes.length,
      totalAgendamentos: agendamentos.length,
      averageAgendamentos: averageAgendamentos.toFixed(1)
    };
  };
  const stats = calculateStats();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold text-gray-800", children: "Usuários" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: () => exportToCSV(filteredUsuarios),
          className: "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-md flex items-center gap-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-5 h-5" }),
            "Exportar CSV"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row gap-4 items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "Buscar por nome ou e-mail...",
            className: "pl-10",
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Tabs,
        {
          defaultValue: "todos",
          value: activeFilter,
          onValueChange: (v) => setActiveFilter(v),
          className: "w-full md:w-auto",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "bg-gray-100", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "todos", className: "data-[state=active]:bg-white", children: "Todos" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "ativos", className: "data-[state=active]:bg-green-100 data-[state=active]:text-green-700", children: "Ativos" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "inativos", className: "data-[state=active]:bg-gray-200", children: "Inativos" })
          ] })
        }
      )
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-gradient-to-br from-blue-50 to-indigo-100", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-1", children: "Total de Usuários" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold text-gray-800", children: usuarios.length })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-gradient-to-br from-green-50 to-emerald-100", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-1", children: "Usuários Ativos" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold text-green-800", children: usuarios.filter((u) => u.subscription_status === "active" || u.paid_access).length })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-gradient-to-br from-yellow-50 to-amber-100", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-1", children: "Em Teste" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold text-yellow-800", children: usuarios.filter((u) => u.subscription_status === "trial").length })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-gradient-to-br from-rose-50 to-pink-100", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-1", children: "Inativos" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold text-rose-800", children: usuarios.filter((u) => u.subscription_status !== "active" && !u.paid_access && u.subscription_status !== "trial").length })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-xl", children: [
        "Lista de Usuários (",
        filteredUsuarios.length,
        ")"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-12 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin h-12 w-12 border-4 border-rose-500 border-t-transparent rounded-full mx-auto mb-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Carregando usuários..." })
      ] }) : filteredUsuarios.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-12 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-lg", children: "Nenhum usuário encontrado" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-gray-50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-4 text-sm font-semibold text-gray-700", children: "Usuário" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-4 text-sm font-semibold text-gray-700", children: "Contato" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-4 text-sm font-semibold text-gray-700", children: "Data de Cadastro" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-4 text-sm font-semibold text-gray-700", children: "Plano" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-4 text-sm font-semibold text-gray-700", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-4 text-sm font-semibold text-gray-700", children: "Último Pagamento" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-gray-200", children: filteredUsuarios.map((usuario) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            className: "hover:bg-gray-50 transition-colors cursor-pointer",
            onClick: () => setSelectedUser(usuario),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white font-bold", children: usuario.nome_completo.charAt(0).toUpperCase() }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-gray-900", children: usuario.nome_completo }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500", children: usuario.nome_personalizado_app })
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-3 h-3 text-gray-400" }),
                  usuario.email
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "w-3 h-3 text-gray-400" }),
                  usuario.telefone
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: new Date(usuario.created_at).toLocaleDateString("pt-BR") }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: usuario.plan_type === "mensal" ? "Mensal" : usuario.plan_type === "vitalicio" ? "Vitalício" : "-" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4", children: renderStatusBadge(usuario) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: usuario.paid_at ? new Date(usuario.paid_at).toLocaleDateString("pt-BR") : "-" }) })
            ]
          },
          usuario.id
        )) })
      ] }) }) })
    ] }),
    selectedUser && /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open: !!selectedUser, onOpenChange: (open) => !open && setSelectedUser(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetContent, { className: "w-full sm:max-w-lg md:max-w-2xl overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetHeader, { className: "pb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTitle, { className: "text-xl", children: "Detalhes do Usuário" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SheetClose, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", className: "h-8 w-8 p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SheetDescription, { children: "Visualize todos os dados e estatísticas do usuário" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "h-[calc(100vh-8rem)] pr-4", children: userDetails.loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-12 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin h-10 w-10 border-4 border-rose-500 border-t-transparent rounded-full mx-auto mb-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Carregando detalhes..." })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 py-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white text-2xl font-bold", children: selectedUser.nome_completo.charAt(0).toUpperCase() }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold", children: selectedUser.nome_completo }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: selectedUser.email })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Nome do Salão" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: selectedUser.nome_personalizado_app })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Telefone" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: selectedUser.telefone })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Data de Cadastro" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: new Date(selectedUser.created_at).toLocaleDateString("pt-BR") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1", children: renderStatusBadge(selectedUser) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Plano" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: selectedUser.plan_type === "mensal" ? "Mensal" : selectedUser.plan_type === "vitalicio" ? "Vitalício" : "Sem Plano" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Último Pagamento" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: selectedUser.paid_at ? new Date(selectedUser.paid_at).toLocaleDateString("pt-BR") : "Nunca" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-yellow-50 p-4 rounded-lg border border-yellow-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-yellow-800", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Aviso:" }),
            " Senhas são armazenadas de forma criptografada e não podem ser recuperadas."
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
        stats && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-lg font-semibold", children: "Estatísticas" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-gradient-to-br from-pink-50 to-rose-100", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 bg-pink-200 rounded-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Scissors, { className: "w-5 h-5 text-pink-700" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Serviços" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-pink-800", children: stats.totalServicos })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-gradient-to-br from-blue-50 to-indigo-100", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 bg-blue-200 rounded-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-5 h-5 text-blue-700" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Clientes" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-blue-800", children: stats.totalClientes })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-gradient-to-br from-green-50 to-emerald-100", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 bg-green-200 rounded-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-5 h-5 text-green-700" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Total Agendamentos" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-green-800", children: stats.totalAgendamentos })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-gradient-to-br from-yellow-50 to-amber-100", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 bg-yellow-200 rounded-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-5 h-5 text-yellow-700" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Média/Mês" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-yellow-800", children: stats.averageAgendamentos })
              ] })
            ] }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-lg font-semibold", children: "Serviços Cadastrados" }),
          userDetails.servicos.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Nenhum serviço cadastrado" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: userDetails.servicos.map((servico) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-gray-50 rounded-lg flex justify-between items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: servico.nome }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
                "R$ ",
                servico.preco?.toFixed(2)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", children: [
              servico.duracao,
              " min"
            ] })
          ] }, servico.id)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-lg font-semibold", children: "Clientes Cadastrados" }),
          userDetails.clientes.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Nenhum cliente cadastrado" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            userDetails.clientes.slice(0, 5).map((cliente) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-gray-50 rounded-lg", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: cliente.nome }),
              cliente.telefone && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: cliente.telefone })
            ] }, cliente.id)),
            userDetails.clientes.length > 5 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
              "+ ",
              userDetails.clientes.length - 5,
              " mais clientes"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-lg font-semibold", children: "Agendamentos Recentes" }),
          userDetails.agendamentos.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Nenhum agendamento cadastrado" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            userDetails.agendamentos.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()).slice(0, 5).map((agendamento) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 bg-gray-50 rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: new Date(agendamento.data).toLocaleDateString("pt-BR") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: agendamento.hora })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: agendamento.status === "confirmado" ? "default" : agendamento.status === "cancelado" ? "destructive" : "secondary", children: agendamento.status || "Pendente" })
            ] }) }, agendamento.id)),
            userDetails.agendamentos.length > 5 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
              "+ ",
              userDetails.agendamentos.length - 5,
              " mais agendamentos"
            ] })
          ] })
        ] })
      ] }) })
    ] }) })
  ] });
}

function AdminFinanceiro() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold text-gray-800", children: "Financeiro" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-gradient-to-br from-emerald-50 to-green-100", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "w-6 h-6 text-emerald-600" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Receita Mensal" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold text-emerald-800", children: "R$ 0,00" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-gradient-to-br from-blue-50 to-indigo-100", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "w-6 h-6 text-blue-600" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Receita Acumulada" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold text-blue-800", children: "R$ 0,00" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-gradient-to-br from-amber-50 to-yellow-100", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-6 h-6 text-amber-600" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Taxa de Inadimplência" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold text-amber-800", children: "0%" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Gráficos e Métricas" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-center py-12", children: "Em desenvolvimento: gráficos de evolução de receita, histórico de pagamentos e projeções" }) })
    ] })
  ] });
}

function AdminConfiguracoes() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold text-gray-800", children: "Configurações" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Configurações Gerais da Plataforma" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Em desenvolvimento: ajustes de layout, funcionalidades por plano, regras de acesso e ferramentas de manutenção" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Logs de Alterações" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Em desenvolvimento: registro de todas as alterações nas configurações para rastreabilidade" }) })
    ] })
  ] });
}

function AdminPlanejador() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold text-gray-800", children: "Planejador" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Dashboard de Projetos" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-center py-12", children: "Em desenvolvimento: criação de tarefas, prazos, atribuição de responsáveis e acompanhamento de progresso" }) })
    ] })
  ] });
}

function AdminNotificacoes() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold text-gray-800", children: "Notificações e Suporte" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "w-5 h-5" }),
          "Enviar Notificações"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Em desenvolvimento: enviar notificações push, e-mail e in-app personalizadas" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "w-5 h-5" }),
          "Sistema de Suporte"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Em desenvolvimento: centralizar solicitações, responder diretamente e histórico de atendimentos" }) })
      ] })
    ] })
  ] });
}

function Admin() {
  const { usuario } = useAuth();
  const [activeSection, setActiveSection] = reactExports.useState("usuarios");
  const navItems = [
    { id: "usuarios", label: "Usuários", icon: Users },
    { id: "financeiro", label: "Financeiro", icon: TrendingUp },
    { id: "planejador", label: "Planejador", icon: SquareCheckBig },
    { id: "notificacoes", label: "Notificações e Suporte", icon: Bell },
    { id: "configuracoes", label: "Configurações", icon: Settings }
  ];
  const renderActiveSection = () => {
    switch (activeSection) {
      case "usuarios":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminUsuarios, {});
      case "financeiro":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminFinanceiro, {});
      case "configuracoes":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminConfiguracoes, {});
      case "planejador":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminPlanejador, {});
      case "notificacoes":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminNotificacoes, {});
      default:
        return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminUsuarios, {});
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-64 bg-white border-r border-rose-100 shadow-sm flex flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 border-b border-rose-100", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AppLogo, { size: 36, rounded: "xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold text-rose-600", children: "Admin Panel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Salão de Bolso" })
          ] })
        ] }),
        usuario && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 p-3 bg-rose-50 rounded-lg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-rose-800 font-medium", children: "Bem-vindo(a)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-rose-900 truncate", children: usuario.nome_completo })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex-1 p-4 space-y-2", children: navItems.map((item) => {
        const Icon = item.icon;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: activeSection === item.id ? "default" : "ghost",
            className: `w-full justify-start gap-3 ${activeSection === item.id ? "bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white shadow-md" : "text-gray-700 hover:bg-rose-50 hover:text-rose-600"}`,
            onClick: () => setActiveSection(item.id),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-5 h-5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: item.label })
            ]
          },
          item.id
        );
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 p-8 overflow-auto", children: renderActiveSection() })
  ] });
}

export { Admin as default };
