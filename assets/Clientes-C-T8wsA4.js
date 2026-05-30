import { r as reactExports, j as jsxRuntimeExports } from './react-vendor-BpXfDOw7.js';
import { j as Input, g as Button, h as cn, J as Jt, t as useConfigAgendamentoOnline, C as Card, c as CardHeader, d as CardTitle, e as CardContent, B as Badge, k as AlertDialog, E as AlertDialogTrigger, l as AlertDialogContent, m as AlertDialogHeader, n as AlertDialogTitle, o as AlertDialogDescription, p as AlertDialogFooter, q as AlertDialogCancel, r as AlertDialogAction, D as toast, s as supabase, f as CardDescription } from './index-BxmTkSue.js';
import { u as useSupabaseClientes } from './useSupabaseClientes-BZkRJk2t.js';
import { u as useForm, o as object, s as string, d as date } from './form-libs-BJ_wtrcd.js';
import { a } from './zod-BCTNax0R.js';
import { T as Textarea } from './textarea-CnhGhN_A.js';
import { P as Popover, a as PopoverTrigger, b as PopoverContent, C as Calendar$1 } from './popover-BRRZYsMD.js';
import { F as Form, a as FormField, b as FormItem, c as FormLabel, d as FormControl, e as FormMessage } from './form-ChGTXJpr.js';
import { D as Dialog, f as DialogTrigger, a as DialogContent, b as DialogHeader, c as DialogTitle } from './dialog-B2cdB-ir.js';
import { K as Calendar, aA as UserPlus, an as Search, X, ax as Phone, aw as MessageCircle, aB as Eye, ao as SquarePen, aq as Trash2, a9 as User, ak as ChevronLeft, al as ChevronRight, at as FileText, au as ShoppingBag, U as Users, ae as TrendingUp } from './ui-libs-BJEWQG8b.js';
import { f as format } from './format-DsTNzci_.js';
import { p as ptBR } from './pt-BR-HlQT9LXk.js';
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from './table-C1_qONOv.js';
import './chart-libs-Cdz70zdY.js';
import './subDays-C41zB5EI.js';
import './label-Bu_HJwHE.js';

const clienteSchema = object({
  nomeCompleto: string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: string().email("E-mail inválido").optional(),
  telefone: string().min(10, "Telefone deve ter pelo menos 10 dígitos").regex(/^[\d\s\-\+\(\)]+$/, "Telefone deve conter apenas números e símbolos padrões"),
  endereco: string().optional(),
  dataNascimento: string().optional(),
  servicoFrequente: string().optional(),
  ultimaVisita: date().optional(),
  observacoes: string().optional()
});
function ClienteForm({ cliente, onSubmit, trigger }) {
  const [open, setOpen] = reactExports.useState(false);
  const [isSubmitting, setIsSubmitting] = reactExports.useState(false);
  const form = useForm({
    resolver: a(clienteSchema),
    defaultValues: {
      nomeCompleto: cliente?.nomeCompleto || cliente?.nome || "",
      email: cliente?.email || "",
      telefone: cliente?.telefone || "",
      endereco: cliente?.endereco || "",
      dataNascimento: cliente?.dataNascimento || "",
      servicoFrequente: cliente?.servicoFrequente || "",
      ultimaVisita: cliente?.ultimaVisita ? new Date(cliente.ultimaVisita) : void 0,
      observacoes: cliente?.observacoes || ""
    }
  });
  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const success = await onSubmit(data);
      if (success) {
        form.reset();
        setOpen(false);
        Jt.success(cliente ? "Cliente atualizada - Os dados da cliente foram atualizados com sucesso." : "Cliente cadastrada - Nova cliente foi cadastrada com sucesso.");
      }
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const defaultTrigger = /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "bg-gradient-to-r from-primary to-lilac-primary shadow-lg hover:shadow-xl transition-all duration-300", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "mr-2 h-4 w-4" }),
    "Nova Cliente"
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: trigger || defaultTrigger }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-[600px] max-h-[90vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-lilac-primary bg-clip-text text-transparent", children: cliente ? "Editar Cliente" : "Nova Cliente" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Form, { ...form, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: form.handleSubmit(handleSubmit), className: "space-y-5 sm:space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FormField,
          {
            control: form.control,
            name: "nomeCompleto",
            render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: "text-foreground font-medium text-sm sm:text-base", children: "Nome Completo" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: "Digite o nome completo",
                  className: "h-12 sm:h-11 text-base sm:text-sm border-border/50 focus:ring-primary",
                  ...field
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FormField,
          {
            control: form.control,
            name: "email",
            render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: "text-foreground font-medium", children: "E-mail (opcional)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "email",
                  placeholder: "cliente@exemplo.com",
                  className: "border-border/50 focus:ring-primary",
                  ...field
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FormField,
          {
            control: form.control,
            name: "telefone",
            render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: "text-foreground font-medium", children: "Telefone" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: "(11) 99999-9999",
                  className: "border-border/50 focus:ring-primary",
                  ...field
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FormField,
          {
            control: form.control,
            name: "servicoFrequente",
            render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: "text-foreground font-medium", children: "Serviço Frequente (opcional)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: "Ex: Corte e Escova",
                  className: "border-border/50 focus:ring-primary",
                  ...field
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FormField,
          {
            control: form.control,
            name: "ultimaVisita",
            render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { className: "flex flex-col", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: "text-foreground font-medium", children: "Última Visita (opcional)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "outline",
                    className: cn(
                      "w-full pl-3 text-left font-normal border-border/50",
                      !field.value && "text-muted-foreground"
                    ),
                    children: [
                      field.value ? format(field.value, "PPP", { locale: ptBR }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Selecione uma data" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "ml-auto h-4 w-4 opacity-50" })
                    ]
                  }
                ) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverContent, { className: "w-auto p-0", align: "start", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Calendar$1,
                  {
                    mode: "single",
                    selected: field.value,
                    onSelect: field.onChange,
                    disabled: (date) => date > /* @__PURE__ */ new Date(),
                    initialFocus: true,
                    className: "p-3 pointer-events-auto"
                  }
                ) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FormField,
          {
            control: form.control,
            name: "observacoes",
            render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: "text-foreground font-medium", children: "Observações" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  placeholder: "Observações adicionais sobre a cliente...",
                  className: "min-h-[100px] border-border/50 focus:ring-primary resize-none",
                  ...field
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              className: "flex-1 h-11 btn-touch",
              onClick: () => setOpen(false),
              children: "Cancelar"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "submit",
              disabled: isSubmitting,
              className: "flex-1 h-11 btn-touch bg-gradient-to-r from-primary to-lilac-primary",
              children: isSubmitting ? "Salvando..." : cliente ? "Atualizar" : "Cadastrar"
            }
          )
        ] })
      ] }) })
    ] })
  ] });
}

const normalizeText = (text) => {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
};
const matchesAllTerms = (text, searchTerms) => {
  const normalizedText = normalizeText(text);
  return searchTerms.every((term) => normalizedText.includes(term));
};
const highlightText = (text, searchTerm) => {
  if (!searchTerm.trim()) return text;
  const searchTerms = normalizeText(searchTerm).split(/\s+/).filter(Boolean);
  if (searchTerms.length === 0) return text;
  const normalizedText = normalizeText(text);
  let result = [];
  let lastIndex = 0;
  const matches = [];
  searchTerms.forEach((term) => {
    let index = normalizedText.indexOf(term);
    while (index !== -1) {
      matches.push({ start: index, end: index + term.length });
      index = normalizedText.indexOf(term, index + 1);
    }
  });
  matches.sort((a, b) => a.start - b.start);
  const mergedMatches = [];
  for (const match of matches) {
    if (mergedMatches.length === 0 || match.start > mergedMatches[mergedMatches.length - 1].end) {
      mergedMatches.push({ ...match });
    } else {
      mergedMatches[mergedMatches.length - 1].end = Math.max(
        mergedMatches[mergedMatches.length - 1].end,
        match.end
      );
    }
  }
  for (const match of mergedMatches) {
    if (match.start > lastIndex) {
      result.push(text.slice(lastIndex, match.start));
    }
    result.push(
      /* @__PURE__ */ jsxRuntimeExports.jsx("mark", { className: "bg-primary/20 text-primary rounded px-0.5", children: text.slice(match.start, match.end) }, match.start)
    );
    lastIndex = match.end;
  }
  if (lastIndex < text.length) {
    result.push(text.slice(lastIndex));
  }
  return result.length > 0 ? result : text;
};
function ClientesList({ clientes, onEdit, onDelete, onViewDetails }) {
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const [currentPage, setCurrentPage] = reactExports.useState(1);
  const itemsPerPage = 10;
  const { config } = useConfigAgendamentoOnline();
  const filteredClientes = reactExports.useMemo(() => {
    if (!searchTerm.trim()) return clientes;
    const searchTerms = normalizeText(searchTerm).split(/\s+/).filter(Boolean);
    if (searchTerms.length === 0) return clientes;
    return clientes.filter((cliente) => {
      const nome = cliente.nomeCompleto || cliente.nome || "";
      const telefone = cliente.telefone?.replace(/\D/g, "") || "";
      const telefoneFormatado = cliente.telefone || "";
      const email = cliente.email || "";
      const servico = cliente.servicoFrequente || "";
      const searchableText = `${nome} ${telefone} ${telefoneFormatado} ${email} ${servico}`;
      return matchesAllTerms(searchableText, searchTerms);
    });
  }, [clientes, searchTerm]);
  const handleClearSearch = reactExports.useCallback(() => {
    setSearchTerm("");
    setCurrentPage(1);
  }, []);
  const sortedClientes = filteredClientes.sort(
    (a, b) => (a.nomeCompleto || a.nome || "").localeCompare(b.nomeCompleto || b.nome || "")
  );
  const totalPages = Math.ceil(sortedClientes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentClientes = sortedClientes.slice(startIndex, endIndex);
  const formatarTelefone = (telefone) => {
    const numeros = telefone.replace(/\D/g, "");
    if (numeros.length === 11) {
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
    }
    return telefone;
  };
  const abrirWhatsApp = (telefone, nome) => {
    const numeroLimpo = telefone.replace(/\D/g, "");
    const header = `${config.nome_salao || "Seu Salão"} • ${window.location.origin}`;
    const logoLine = config.logo_url ? `Logo: ${config.logo_url}` : "";
    const mensagem = `${header}
${logoLine}

Olá ${nome}! Tudo bem?`;
    const url = `https://wa.me/55${numeroLimpo}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
  };
  const ligar = (telefone) => {
    window.open(`tel:${telefone}`, "_self");
  };
  const handleDelete = (id, nome) => {
    onDelete(id);
    toast({
      title: "Cliente removida",
      description: `${nome} foi removida com sucesso.`
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border/50 bg-card/50 backdrop-blur-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-xl font-semibold", children: [
          "Lista de Clientes (",
          filteredClientes.length,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full sm:max-w-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: "Buscar por nome, telefone, email...",
              value: searchTerm,
              onChange: (e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              },
              className: "pl-10 pr-10 border-border/50"
            }
          ),
          searchTerm && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: handleClearSearch,
              className: "absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 hover:bg-muted",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
            }
          )
        ] })
      ] }),
      searchTerm && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 pb-2 text-sm text-muted-foreground", children: filteredClientes.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        'Nenhum cliente encontrado para "',
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: searchTerm }),
        '"'
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        filteredClientes.length,
        " cliente",
        filteredClientes.length !== 1 ? "s" : "",
        " encontrado",
        filteredClientes.length !== 1 ? "s" : "",
        ' para "',
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: searchTerm }),
        '"'
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: currentClientes.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden lg:block overflow-responsive", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-border/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold text-responsive-xs", children: "Nome Completo" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold text-responsive-xs", children: "Telefone" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold text-responsive-xs", children: "Serviço Frequente" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold text-responsive-xs", children: "Última Visita" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold text-right text-responsive-xs", children: "Ações" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: currentClientes.map((cliente) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TableRow,
          {
            className: "border-border/50 hover:bg-accent/50 cursor-pointer transition-colors",
            onClick: () => onViewDetails(cliente),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium text-responsive-sm", children: highlightText(cliente.nomeCompleto || cliente.nome || "", searchTerm) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-responsive-xs", children: formatarTelefone(cliente.telefone) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      size: "sm",
                      variant: "ghost",
                      onClick: (e) => {
                        e.stopPropagation();
                        ligar(cliente.telefone);
                      },
                      className: "btn-touch",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3 w-3" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      size: "sm",
                      variant: "ghost",
                      onClick: (e) => {
                        e.stopPropagation();
                        abrirWhatsApp(cliente.telefone, cliente.nomeCompleto || cliente.nome || "");
                      },
                      className: "btn-touch hover:bg-green-100",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-3 w-3 text-green-600" })
                    }
                  )
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "bg-accent/50 text-responsive-xs", children: cliente.servicoFrequente || "Não definido" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-responsive-xs", children: cliente.ultimaVisita ? (() => {
                try {
                  const data = new Date(cliente.ultimaVisita);
                  return isNaN(data.getTime()) ? "Data inválida" : format(data, "dd/MM/yyyy", { locale: ptBR });
                } catch (error) {
                  return "Data inválida";
                }
              })() : "Não definido" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 justify-end", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    size: "sm",
                    variant: "ghost",
                    onClick: (e) => {
                      e.stopPropagation();
                      onViewDetails(cliente);
                    },
                    className: "btn-touch",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-3 w-3" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ClienteForm,
                  {
                    cliente,
                    onSubmit: (data) => onEdit({ ...cliente, ...data }),
                    trigger: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        size: "sm",
                        variant: "ghost",
                        onClick: (e) => e.stopPropagation(),
                        className: "btn-touch",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "h-3 w-3" })
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialog, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      size: "sm",
                      variant: "ghost",
                      onClick: (e) => e.stopPropagation(),
                      className: "btn-touch hover:bg-destructive/10 hover:text-destructive",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3 w-3" })
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { className: "text-responsive-lg", children: "Confirmar exclusão" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { className: "text-responsive-sm", children: [
                        "Tem certeza que deseja excluir ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: cliente.nomeCompleto || cliente.nome }),
                        "? Esta ação não pode ser desfeita."
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { className: "btn-touch text-responsive-sm", children: "Cancelar" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        AlertDialogAction,
                        {
                          onClick: () => handleDelete(cliente.id, cliente.nomeCompleto || cliente.nome || ""),
                          className: "bg-destructive hover:bg-destructive/90 btn-touch text-responsive-sm",
                          children: "Excluir"
                        }
                      )
                    ] })
                  ] })
                ] })
              ] }) })
            ]
          },
          cliente.id
        )) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:hidden space-y-2 p-2", children: currentClientes.map((cliente) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        Card,
        {
          className: "border-border/50 bg-card/50 backdrop-blur-sm cursor-pointer active:scale-[0.99] transition-transform",
          onClick: () => onViewDetails(cliente),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-5 w-5 text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-sm truncate", children: highlightText(cliente.nomeCompleto || cliente.nome || "", searchTerm) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: formatarTelefone(cliente.telefone) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "bg-accent/50 text-[10px] h-5 px-1.5 font-normal", children: cliente.servicoFrequente || "Não definido" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-[10px] h-5 px-1.5 font-normal", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-2.5 w-2.5 mr-1" }),
                cliente.ultimaVisita ? (() => {
                  try {
                    const data = new Date(cliente.ultimaVisita);
                    return isNaN(data.getTime()) ? "Sem visita" : format(data, "dd/MM/yy", { locale: ptBR });
                  } catch (error) {
                    return "Sem visita";
                  }
                })() : "Sem visita"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  onClick: (e) => {
                    e.stopPropagation();
                    ligar(cliente.telefone);
                  },
                  className: "flex-1 h-9 text-xs btn-touch",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3.5 w-3.5 mr-1.5" }),
                    "Ligar"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  onClick: (e) => {
                    e.stopPropagation();
                    abrirWhatsApp(cliente.telefone, cliente.nomeCompleto || cliente.nome || "");
                  },
                  className: "flex-1 h-9 text-xs btn-touch bg-green-50 hover:bg-green-100 border-green-200",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-3.5 w-3.5 mr-1.5 text-green-600" }),
                    "WhatsApp"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 pt-2 border-t border-border/50", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ClienteForm,
                {
                  cliente,
                  onSubmit: (data) => onEdit({ ...cliente, ...data }),
                  trigger: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      size: "sm",
                      variant: "outline",
                      onClick: (e) => e.stopPropagation(),
                      className: "h-9 text-xs btn-touch",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "h-3 w-3 mr-1" }),
                        "Editar"
                      ]
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialog, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    size: "sm",
                    variant: "outline",
                    onClick: (e) => e.stopPropagation(),
                    className: "h-9 text-xs btn-touch hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3 w-3 mr-1" }),
                      "Excluir"
                    ]
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Confirmar exclusão" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
                      "Tem certeza que deseja excluir ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: cliente.nomeCompleto || cliente.nome }),
                      "? Esta ação não pode ser desfeita."
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { className: "flex-col sm:flex-row gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { className: "btn-touch m-0", children: "Cancelar" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      AlertDialogAction,
                      {
                        onClick: () => handleDelete(cliente.id, cliente.nomeCompleto || cliente.nome || ""),
                        className: "bg-destructive hover:bg-destructive/90 btn-touch m-0",
                        children: "Excluir"
                      }
                    )
                  ] })
                ] })
              ] })
            ] })
          ] }) })
        },
        cliente.id
      )) }),
      totalPages > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-4 border-t border-border/50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground", children: [
          "Mostrando ",
          startIndex + 1,
          " a ",
          Math.min(endIndex, sortedClientes.length),
          " de ",
          sortedClientes.length,
          " clientes"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => setCurrentPage((prev) => Math.max(prev - 1, 1)),
              disabled: currentPage === 1,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-medium", children: [
            currentPage,
            " de ",
            totalPages
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => setCurrentPage((prev) => Math.min(prev + 1, totalPages)),
              disabled: currentPage === totalPages,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" })
            }
          )
        ] })
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-12 px-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-lilac-light/10 mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-8 w-8 text-muted-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mb-2 text-lg font-semibold", children: searchTerm ? "Nenhuma cliente encontrada" : "Nenhuma cliente cadastrada" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-6", children: searchTerm ? "Tente buscar com outros termos ou limpe o filtro." : "Comece cadastrando sua primeira cliente para começar a usar o sistema." }),
      searchTerm && /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          onClick: () => setSearchTerm(""),
          children: "Limpar busca"
        }
      )
    ] }) })
  ] });
}

function ClienteDetalhes({ cliente, open, onOpenChange, onEdit }) {
  const [vendasCliente, setVendasCliente] = reactExports.useState([]);
  const [loadingVendas, setLoadingVendas] = reactExports.useState(true);
  const [historicoServicosLocal, setHistoricoServicosLocal] = reactExports.useState(cliente?.historicoServicos || []);
  const { config } = useConfigAgendamentoOnline();
  reactExports.useEffect(() => {
    if (cliente && open) {
      carregarVendasCliente();
      setHistoricoServicosLocal(cliente.historicoServicos || []);
    }
  }, [cliente?.id, cliente?.historicoServicos, open]);
  const carregarVendasCliente = async () => {
    if (!cliente) return;
    try {
      setLoadingVendas(true);
      const { data, error } = await supabase.from("vendas_produtos").select("*, itens_venda(*)").eq("cliente_id", cliente.id).order("data_venda", { ascending: false });
      if (error) throw error;
      setVendasCliente(data || []);
    } catch (error) {
      console.error("Erro ao carregar vendas:", error);
    } finally {
      setLoadingVendas(false);
    }
  };
  if (!cliente) return null;
  const formatarTelefone = (telefone) => {
    const numeros = telefone.replace(/\D/g, "");
    if (numeros.length === 11) {
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
    }
    return telefone;
  };
  const abrirWhatsApp = (telefone) => {
    const numeroLimpo = telefone.replace(/\D/g, "");
    const header = `${config.nome_salao || "Seu Salão"} • ${window.location.origin}`;
    const logoLine = config.logo_url ? `Logo: ${config.logo_url}` : "";
    const mensagem = `${header}
${logoLine}

Olá ${cliente?.nomeCompleto || cliente?.nome || ""}!`;
    const url = `https://wa.me/55${numeroLimpo}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
  };
  const enviarEmail = (email) => {
    if (!email) return;
    const assunto = `${config.nome_salao || "Seu Salão"} - Atendimento`;
    const corpo = `${config.nome_salao || "Seu Salão"}
${window.location.origin}
${config.logo_url ? `Logo: ${config.logo_url}
` : ""}
Olá ${cliente?.nomeCompleto || cliente?.nome || ""}!`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
  };
  const ligar = (telefone) => {
    window.open(`tel:${telefone}`, "_self");
  };
  const totalGasto = (historicoServicosLocal || []).reduce((total, servico) => total + servico.valor, 0);
  const totalGastoVendas = vendasCliente.reduce((total, venda) => total + Number(venda.valor_total), 0);
  const totalGeralGasto = totalGasto + totalGastoVendas;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-[700px] max-h-[90vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-2xl font-bold bg-gradient-to-r from-primary to-lilac-primary bg-clip-text text-transparent", children: cliente.nomeCompleto }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ClienteForm,
        {
          cliente,
          onSubmit: (data) => onEdit({ ...cliente, ...data }),
          trigger: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "h-4 w-4 mr-1" }),
            "Editar"
          ] })
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border/50 bg-card/50 backdrop-blur-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-lg", children: "Informações de Contato" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-4 w-4 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: formatarTelefone(cliente.telefone) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 ml-auto", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  onClick: () => ligar(cliente.telefone),
                  className: "h-8",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3 w-3 mr-1" }),
                    "Ligar"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  onClick: () => abrirWhatsApp(cliente.telefone),
                  className: "h-8 bg-green-600 hover:bg-green-700 text-white",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-3 w-3 mr-1" }),
                    "WhatsApp"
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4 text-lilac-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Última visita: " }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", children: cliente.ultimaVisita ? (() => {
              try {
                const data = typeof cliente.ultimaVisita === "string" ? new Date(cliente.ultimaVisita) : cliente.ultimaVisita;
                return isNaN(data.getTime()) ? "Data inválida" : format(data, "dd 'de' MMMM, yyyy", { locale: ptBR });
              } catch (error) {
                return "Data inválida";
              }
            })() : "Não informado" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4 text-pink-accent" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Serviço frequente: " }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "bg-accent/50", children: cliente.servicoFrequente })
          ] }),
          cliente.email && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: () => enviarEmail(cliente.email), children: "Enviar E-mail" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border/50 bg-card/50 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-lg", children: "Resumo Financeiro do Cliente" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { children: [
          "Serviços: R$ ",
          totalGasto.toFixed(2),
          " • Produtos: R$ ",
          totalGastoVendas.toFixed(2),
          " • Total: R$ ",
          totalGeralGasto.toFixed(2)
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border/50 bg-card/50 backdrop-blur-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-lg", children: "Histórico de Serviços" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { children: [
            "Total de ",
            historicoServicosLocal.length,
            " serviços realizados • Valor total: R$ ",
            totalGasto.toFixed(2)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: historicoServicosLocal.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: historicoServicosLocal.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()).map((servico) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 rounded-lg border border-border/50 bg-background/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: servico.servico }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: format(servico.data, "dd/MM/yyyy", { locale: ptBR }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "bg-primary/10 text-primary", children: [
            "R$ ",
            servico.valor.toFixed(2)
          ] })
        ] }, servico.id)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8 text-muted-foreground", children: "Nenhum serviço registrado ainda" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border/50 bg-card/50 backdrop-blur-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-lg flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-5 w-5" }),
            "Histórico de Compras de Produtos"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { children: [
            "Total de ",
            vendasCliente.length,
            " compras • Valor total: R$ ",
            totalGastoVendas.toFixed(2)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: loadingVendas ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8 text-muted-foreground", children: "Carregando compras..." }) : vendasCliente.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: vendasCliente.map((venda) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 rounded-lg border border-border/50 bg-background/50 space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: "Compra de Produtos" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: format(new Date(venda.data_venda), "dd/MM/yyyy", { locale: ptBR }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "bg-primary/10 text-primary", children: [
              "R$ ",
              Number(venda.valor_total).toFixed(2)
            ] })
          ] }),
          venda.itens_venda && venda.itens_venda.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pl-4 border-l-2 border-border/50 space-y-1", children: venda.itens_venda.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            "• ",
            item.quantidade,
            "x - R$ ",
            Number(item.valor_unitario).toFixed(2)
          ] }, item.id)) })
        ] }, venda.id)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8 text-muted-foreground", children: "Nenhuma compra de produtos registrada ainda" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border/50 bg-gradient-to-br from-primary/5 to-lilac-primary/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Total Gasto (Serviços + Produtos)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-3xl font-bold bg-gradient-to-r from-primary to-lilac-primary bg-clip-text text-transparent", children: [
            "R$ ",
            totalGeralGasto.toFixed(2)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            "Serviços: R$ ",
            totalGasto.toFixed(2)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            "Produtos: R$ ",
            totalGastoVendas.toFixed(2)
          ] })
        ] })
      ] }) }) }),
      cliente.observacoes && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border/50 bg-card/50 backdrop-blur-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-lg", children: "Observações" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground whitespace-pre-wrap", children: cliente.observacoes }) })
      ] })
    ] })
  ] }) });
}

function Clientes() {
  const { clientes, criarCliente, atualizarCliente, excluirCliente, carregarEstatisticasCliente } = useSupabaseClientes();
  const [clienteSelecionada, setClienteSelecionada] = reactExports.useState(null);
  const [detalhesOpen, setDetalhesOpen] = reactExports.useState(false);
  const handleAddCliente = async (data) => {
    return await criarCliente(data);
  };
  const handleEditCliente = async (clienteAtualizada) => {
    const sucesso = await atualizarCliente(clienteAtualizada.id, clienteAtualizada);
    if (sucesso && clienteSelecionada?.id === clienteAtualizada.id) {
      setClienteSelecionada(clienteAtualizada);
    }
    return sucesso;
  };
  const handleDeleteCliente = async (id) => {
    await excluirCliente(id);
    if (clienteSelecionada?.id === id) {
      setClienteSelecionada(null);
      setDetalhesOpen(false);
    }
  };
  const handleViewDetails = async (cliente) => {
    setClienteSelecionada(cliente);
    setDetalhesOpen(true);
    if (cliente.historicoServicos?.length === 0) {
      const stats = await carregarEstatisticasCliente(cliente.id);
      if (stats && clienteSelecionada?.id === cliente.id) {
        setClienteSelecionada((prev) => prev ? { ...prev, ...stats } : null);
      }
    }
  };
  const clientesAtivas = clientes.length;
  const novasEsteMes = clientes.filter((cliente) => {
    if (!cliente.ultimaVisita) return false;
    try {
      const agora = /* @__PURE__ */ new Date();
      const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);
      let ultimaVisita;
      if (typeof cliente.ultimaVisita === "string") {
        ultimaVisita = new Date(cliente.ultimaVisita);
      } else if (cliente.ultimaVisita instanceof Date) {
        ultimaVisita = cliente.ultimaVisita;
      } else {
        return false;
      }
      if (isNaN(ultimaVisita.getTime())) {
        return false;
      }
      return ultimaVisita >= inicioMes;
    } catch (error) {
      console.error("Erro ao processar data da última visita:", error);
      return false;
    }
  }).length;
  const totalServicos = clientes.reduce(
    (total, cliente) => total + (cliente.historicoServicos?.length || 0),
    0
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 sm:space-y-8 p-3 sm:p-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl sm:text-3xl font-bold text-foreground", children: "Clientes" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs sm:text-base text-muted-foreground", children: "Gerencie o cadastro e histórico das suas clientes" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ClienteForm, { onSubmit: handleAddCliente })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border/50 bg-card/50 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-center gap-2 sm:gap-3 p-3 sm:p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br from-primary to-lilac-light flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4 sm:h-6 sm:w-6 text-primary-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg sm:text-2xl font-bold", children: clientesAtivas }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] sm:text-sm text-muted-foreground", children: "Total" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border/50 bg-card/50 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-center gap-2 sm:gap-3 p-3 sm:p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br from-lilac-primary to-pink-accent flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-4 w-4 sm:h-6 sm:w-6 text-primary-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg sm:text-2xl font-bold", children: novasEsteMes }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] sm:text-sm text-muted-foreground", children: "Novas (Mês)" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border/50 bg-card/50 backdrop-blur-sm col-span-2 sm:col-span-2 lg:col-span-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-center gap-2 sm:gap-3 p-3 sm:p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br from-pink-accent to-lavender flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-4 w-4 sm:h-6 sm:w-6 text-primary-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg sm:text-2xl font-bold", children: totalServicos }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] sm:text-sm text-muted-foreground", children: "Serviços" })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ClientesList,
      {
        clientes,
        onEdit: handleEditCliente,
        onDelete: handleDeleteCliente,
        onViewDetails: handleViewDetails
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ClienteDetalhes,
      {
        cliente: clienteSelecionada,
        open: detalhesOpen,
        onOpenChange: setDetalhesOpen,
        onEdit: handleEditCliente
      }
    )
  ] });
}

export { Clientes as default };
