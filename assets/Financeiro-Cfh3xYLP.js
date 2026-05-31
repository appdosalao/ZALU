import { r as reactExports, j as jsxRuntimeExports } from './react-vendor-BpXfDOw7.js';
import { C as Card, e as CardContent, c as CardHeader, d as CardTitle, j as Input, B as Badge, g as Button, k as AlertDialog, E as AlertDialogTrigger, l as AlertDialogContent, m as AlertDialogHeader, n as AlertDialogTitle, o as AlertDialogDescription, p as AlertDialogFooter, q as AlertDialogCancel, r as AlertDialogAction, D as toast, h as cn, s as supabase, t as useConfigAgendamentoOnline, K as Sheet, L as SheetTrigger, M as SheetContent, N as SheetHeader, O as SheetTitle, G as Alert, H as AlertDescription } from './index-U74ij7JC.js';
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from './tabs-CjCc2DlV.js';
import { S as ScrollArea, a as ScrollBar } from './scroll-area-BG3HujHg.js';
import { a as useSupabaseContasFixas, u as useLancamentos } from './useLancamentos-DIQBLP4o.js';
import { u as useSupabaseAgendamentos } from './useSupabaseAgendamentos-Dyaw1aY1.js';
import { u as useAgendamentos } from './useAgendamentos-DtZTqraF.js';
import { ae as TrendingUp, aK as TrendingDown, af as PiggyBank, V as DollarSign, Q as Clock, aL as CircleAlert, am as Filter, an as Search, aM as Receipt, aN as Pen, aq as Trash2, az as Tag, ao as SquarePen, K as Calendar, aO as Repeat, aP as CircleCheck, aQ as PowerOff, aR as Power, as as ArrowLeft, ar as Save, a9 as User, aw as MessageCircle, k as CreditCard, ag as Plus, D as Download, at as FileText, a8 as Bell, ac as TriangleAlert, m as LoaderCircle, aS as ShoppingCart, _ as Package, U as Users, aT as BadgeDollarSign } from './ui-libs-B5Rrhu1L.js';
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from './select-Ce9M_rda.js';
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from './table-CHN4Nieb.js';
import { t as toDate, f as format, a as startOfYear, s as startOfWeek } from './format-DsTNzci_.js';
import { p as ptBR } from './pt-BR-HlQT9LXk.js';
import { u as useForm, o as object, s as string, d as date, _ as _enum, b as boolean, n as number } from './form-libs-BJ_wtrcd.js';
import { a } from './zod-BCTNax0R.js';
import { T as Textarea } from './textarea-D9C69N9T.js';
import { F as Form, a as FormField, b as FormItem, c as FormLabel, d as FormControl, e as FormMessage } from './form-9btzSTa_.js';
import { P as Popover, a as PopoverTrigger, b as PopoverContent, C as Calendar$1 } from './popover-DZXUgq1P.js';
import { u as useSupabaseCompras, a as useSupabaseVendas } from './useSupabaseVendas-Dmom5SC3.js';
import { R as ResponsiveContainer, P as PieChart, e as Pie, d as Cell, T as Tooltip, B as BarChart, C as CartesianGrid, X as XAxis, Y as YAxis, L as Legend, b as Bar, A as AreaChart, f as Area, g as Line } from './chart-libs-Cdz70zdY.js';
import { S as Switch } from './switch-CkSMWSBt.js';
import { D as Dialog, f as DialogTrigger, a as DialogContent, b as DialogHeader, c as DialogTitle } from './dialog-DK5BU-Za.js';
import { d as endOfMonth, c as startOfMonth, e as endOfWeek } from './subDays-C41zB5EI.js';
import { s as subMonths } from './subMonths-CGcExbdS.js';
import { L as Label } from './label-C0AJeojg.js';
import './index-BfAAoDv6.js';
import './useServicos-B9TSefLo.js';
import './useSupabaseClientes-Bu4CtR3z.js';
import './index-Ls-C4DWD.js';

/**
 * @name startOfQuarter
 * @category Quarter Helpers
 * @summary Return the start of a year quarter for the given date.
 *
 * @description
 * Return the start of a year quarter for the given date.
 * The result will be in the local timezone.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The original date
 *
 * @returns The start of a quarter
 *
 * @example
 * // The start of a quarter for 2 September 2014 11:55:00:
 * const result = startOfQuarter(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Tue Jul 01 2014 00:00:00
 */
function startOfQuarter(date) {
  const _date = toDate(date);
  const currentMonth = _date.getMonth();
  const month = currentMonth - (currentMonth % 3);
  _date.setMonth(month, 1);
  _date.setHours(0, 0, 0, 0);
  return _date;
}

/**
 * @name endOfYear
 * @category Year Helpers
 * @summary Return the end of a year for the given date.
 *
 * @description
 * Return the end of a year for the given date.
 * The result will be in the local timezone.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The original date
 *
 * @returns The end of a year
 *
 * @example
 * // The end of a year for 2 September 2014 11:55:00:
 * const result = endOfYear(new Date(2014, 8, 2, 11, 55, 00))
 * //=> Wed Dec 31 2014 23:59:59.999
 */
function endOfYear(date) {
  const _date = toDate(date);
  const year = _date.getFullYear();
  _date.setFullYear(year + 1, 0, 0);
  _date.setHours(23, 59, 59, 999);
  return _date;
}

/**
 * @name endOfQuarter
 * @category Quarter Helpers
 * @summary Return the end of a year quarter for the given date.
 *
 * @description
 * Return the end of a year quarter for the given date.
 * The result will be in the local timezone.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The original date
 *
 * @returns The end of a quarter
 *
 * @example
 * // The end of a quarter for 2 September 2014 11:55:00:
 * const result = endOfQuarter(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Tue Sep 30 2014 23:59:59.999
 */
function endOfQuarter(date) {
  const _date = toDate(date);
  const currentMonth = _date.getMonth();
  const month = currentMonth - (currentMonth % 3) + 3;
  _date.setMonth(month, 0);
  _date.setHours(23, 59, 59, 999);
  return _date;
}

/**
 * @name isWithinInterval
 * @category Interval Helpers
 * @summary Is the given date within the interval?
 *
 * @description
 * Is the given date within the interval? (Including start and end.)
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to check
 * @param interval - The interval to check
 *
 * @returns The date is within the interval
 *
 * @example
 * // For the date within the interval:
 * isWithinInterval(new Date(2014, 0, 3), {
 *   start: new Date(2014, 0, 1),
 *   end: new Date(2014, 0, 7)
 * })
 * //=> true
 *
 * @example
 * // For the date outside of the interval:
 * isWithinInterval(new Date(2014, 0, 10), {
 *   start: new Date(2014, 0, 1),
 *   end: new Date(2014, 0, 7)
 * })
 * //=> false
 *
 * @example
 * // For date equal to interval start:
 * isWithinInterval(date, { start, end: date })
 * // => true
 *
 * @example
 * // For date equal to interval end:
 * isWithinInterval(date, { start: date, end })
 * // => true
 */
function isWithinInterval(date, interval) {
  const time = +toDate(date);
  const [startTime, endTime] = [
    +toDate(interval.start),
    +toDate(interval.end),
  ].sort((a, b) => a - b);

  return time >= startTime && time <= endTime;
}

function useContasFixas() {
  const supabaseHook = useSupabaseContasFixas();
  const estatisticas = reactExports.useMemo(() => {
    const total = supabaseHook.contasFixas.length;
    const pagas = supabaseHook.contasFixas.filter((c) => c.status === "pago").length;
    const emAberto = supabaseHook.contasFixas.filter((c) => c.status === "em_aberto").length;
    const valorTotal = supabaseHook.contasFixas.reduce((sum, c) => sum + c.valor, 0);
    return {
      total,
      pagas,
      emAberto,
      valorTotal
    };
  }, [supabaseHook.contasFixas]);
  return {
    ...supabaseHook,
    // Funções de CRUD renomeadas para compatibilidade com código existente
    criarContaFixa: supabaseHook.createContaFixa,
    atualizarContaFixa: supabaseHook.updateContaFixa,
    removerContaFixa: supabaseHook.deleteContaFixa,
    criarCategoria: supabaseHook.createCategoria,
    recarregar: supabaseHook.loadContasFixas,
    estatisticas,
    // Funcionalidades específicas que precisam ser implementadas
    marcarComoPaga: async (id) => {
      return supabaseHook.updateContaFixa(id, { status: "pago" });
    },
    pagarContaFixa: async (id) => {
      return supabaseHook.updateContaFixa(id, { status: "pago" });
    },
    marcarComoEmAberto: async (id) => {
      return supabaseHook.updateContaFixa(id, { status: "em_aberto" });
    },
    toggleAtiva: async (id) => {
      const conta = supabaseHook.contasFixas.find((c) => c.id === id);
      if (conta) {
        return supabaseHook.updateContaFixa(id, { ativa: !conta.ativa });
      }
    },
    getContasVencidas: () => {
      const hoje = /* @__PURE__ */ new Date();
      return supabaseHook.contasFixas.filter((conta) => {
        if (!conta.ativa || conta.status === "pago") return false;
        const proximoVencimento = conta.proximoVencimento ? new Date(conta.proximoVencimento) : null;
        return proximoVencimento && proximoVencimento < hoje;
      });
    },
    getContasAVencer: () => {
      const hoje = /* @__PURE__ */ new Date();
      const proximasSemana = /* @__PURE__ */ new Date();
      proximasSemana.setDate(hoje.getDate() + 7);
      return supabaseHook.contasFixas.filter((conta) => {
        if (!conta.ativa || conta.status === "pago") return false;
        const proximoVencimento = conta.proximoVencimento ? new Date(conta.proximoVencimento) : null;
        return proximoVencimento && proximoVencimento >= hoje && proximoVencimento <= proximasSemana;
      });
    }
  };
}

const MOBILE_BREAKPOINT = 640;
const TABLET_BREAKPOINT = 1024;
function useBreakpoint() {
  const [breakpoint, setBreakpoint] = reactExports.useState("desktop");
  const [isMobile, setIsMobile] = reactExports.useState(false);
  const [isSmallMobile, setIsSmallMobile] = reactExports.useState(false);
  const [isTablet, setIsTablet] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth;
      setIsSmallMobile(width < MOBILE_BREAKPOINT);
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < TABLET_BREAKPOINT);
      if (width < 768) {
        setBreakpoint("mobile");
      } else if (width < TABLET_BREAKPOINT) {
        setBreakpoint("tablet");
      } else {
        setBreakpoint("desktop");
      }
    };
    checkBreakpoint();
    const mql = window.matchMedia(`(max-width: ${TABLET_BREAKPOINT - 1}px)`);
    mql.addEventListener("change", checkBreakpoint);
    return () => mql.removeEventListener("change", checkBreakpoint);
  }, []);
  return {
    breakpoint,
    isMobile,
    isSmallMobile,
    isTablet,
    isDesktop: breakpoint === "desktop"
  };
}

function ResumoFinanceiro({ resumo }) {
  const formatarValor = (valor) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(valor);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 sm:gap-4 sm:grid-cols-3 lg:grid-cols-5 animate-fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border/50 bg-card/50 backdrop-blur-sm hover-scale transition-all", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-center gap-2 sm:gap-4 p-3 sm:p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl bg-success flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-4 w-4 sm:h-6 sm:w-6 text-success-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg sm:text-xl font-bold text-success truncate", children: formatarValor(resumo.totalEntradas) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] sm:text-sm text-muted-foreground", children: "Entradas" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border/50 bg-card/50 backdrop-blur-sm hover-scale transition-all", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-center gap-2 sm:gap-4 p-3 sm:p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl bg-destructive flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "h-4 w-4 sm:h-6 sm:w-6 text-destructive-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg sm:text-xl font-bold text-destructive truncate", children: formatarValor(resumo.totalSaidas) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] sm:text-sm text-muted-foreground", children: "Saídas" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border/50 bg-card/50 backdrop-blur-sm hover-scale transition-all col-span-2 sm:col-span-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-center gap-2 sm:gap-4 p-3 sm:p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex h-8 w-8 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl flex-shrink-0 ${resumo.lucro >= 0 ? "bg-primary" : "bg-destructive"}`, children: resumo.lucro >= 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(PiggyBank, { className: "h-4 w-4 sm:h-6 sm:w-6 text-primary-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-4 w-4 sm:h-6 sm:w-6 text-destructive-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-lg sm:text-xl font-bold truncate ${resumo.lucro >= 0 ? "text-primary" : "text-destructive"}`, children: formatarValor(resumo.lucro) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] sm:text-sm text-muted-foreground", children: resumo.lucro >= 0 ? "Lucro" : "Prejuízo" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border/50 bg-card/50 backdrop-blur-sm hover-scale transition-all", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-center gap-2 sm:gap-4 p-3 sm:p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl bg-warning flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 sm:h-4 sm:w-4 text-warning-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg sm:text-xl font-bold text-warning truncate", children: formatarValor(resumo.valorEmAberto) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] sm:text-sm text-muted-foreground", children: "Em Aberto" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border/50 bg-card/50 backdrop-blur-sm hover-scale transition-all", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-center gap-2 sm:gap-4 p-3 sm:p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl bg-destructive flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 sm:h-4 sm:w-4 text-destructive-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg sm:text-xl font-bold text-destructive truncate", children: formatarValor(resumo.contasAPagar) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] sm:text-sm text-muted-foreground", children: "A Pagar" })
      ] })
    ] }) })
  ] });
}

function LancamentosList({
  lancamentos,
  filtros,
  categorias,
  onFiltrosChange,
  onEdit,
  onDelete
}) {
  const [busca, setBusca] = reactExports.useState("");
  const lancamentosFiltrados = lancamentos.filter(
    (lancamento) => lancamento.descricao.toLowerCase().includes(busca.toLowerCase()) || (lancamento.categoria?.toLowerCase().includes(busca.toLowerCase()) ?? false)
  );
  const handleDelete = (id) => {
    onDelete(id);
    toast({
      title: "Lançamento excluído",
      description: "O lançamento foi removido com sucesso."
    });
  };
  const formatarValor = (valor) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(valor);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border/50 bg-card/50 backdrop-blur-sm animate-fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Filter, { className: "h-5 w-5 text-primary" }),
      "Lançamentos Financeiros"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-3 h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: "Buscar lançamento...",
              value: busca,
              onChange: (e) => setBusca(e.target.value),
              className: "pl-9"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: filtros.tipo || "todos",
            onValueChange: (value) => onFiltrosChange({
              ...filtros,
              tipo: value === "todos" ? void 0 : value
            }),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Tipo" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "todos", children: "Todos os tipos" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "entrada", children: "Entradas" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "saida", children: "Saídas" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: filtros.categoria || "todas",
            onValueChange: (value) => onFiltrosChange({
              ...filtros,
              categoria: value === "todas" ? void 0 : value
            }),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Categoria" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "todas", children: "Todas as categorias" }),
                categorias.map((categoria) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: categoria, children: categoria }, categoria))
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: filtros.mes ? `${filtros.mes}-${filtros.ano}` : "todos",
            onValueChange: (value) => {
              if (value === "todos") {
                onFiltrosChange({ ...filtros, mes: void 0, ano: void 0 });
              } else {
                const [mes, ano] = value.split("-").map(Number);
                onFiltrosChange({ ...filtros, mes, ano });
              }
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Mês" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "todos", children: "Todos os meses" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "12-2024", children: "Dezembro 2024" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "11-2024", children: "Novembro 2024" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "10-2024", children: "Outubro 2024" })
              ] })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md border border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Tipo" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Descrição" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Categoria" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Data" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Valor" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-[100px]", children: "Ações" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: lancamentosFiltrados.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 6, className: "text-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3 animate-fade-in", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { className: "h-12 w-12 text-muted-foreground/50" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-medium text-foreground", children: "Nenhum lançamento encontrado" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: busca || filtros.tipo || filtros.categoria ? "Tente ajustar os filtros de busca" : "Adicione seu primeiro lançamento financeiro" })
          ] })
        ] }) }) }) : lancamentosFiltrados.map((lancamento) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Badge,
            {
              variant: lancamento.tipo === "entrada" ? "default" : "destructive",
              className: "flex items-center gap-1 w-fit",
              children: [
                lancamento.tipo === "entrada" ? /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-3 w-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "h-3 w-3" }),
                lancamento.tipo === "entrada" ? "Entrada" : "Saída"
              ]
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: lancamento.descricao }),
            lancamento.origemTipo && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
              lancamento.origemTipo === "agendamento" && "📅 Agendamento",
              lancamento.origemTipo === "compra_produto" && "🛒 Compra de Produto",
              lancamento.origemTipo === "venda_produto" && "💰 Venda de Produto",
              lancamento.origemTipo === "conta_fixa" && "📌 Conta Fixa"
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: lancamento.categoria && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", children: lancamento.categoria }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: format(new Date(lancamento.data), "dd/MM/yyyy", { locale: ptBR }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: `font-semibold ${lancamento.tipo === "entrada" ? "text-green-600" : "text-red-600"}`, children: formatarValor(lancamento.valor) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "sm",
                onClick: () => onEdit(lancamento),
                className: "hover-scale",
                "aria-label": "Editar lançamento",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialog, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "sm",
                  className: "hover-scale",
                  "aria-label": "Excluir lançamento",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Excluir lançamento" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "Tem certeza que deseja excluir este lançamento? Esta ação não pode ser desfeita." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancelar" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    AlertDialogAction,
                    {
                      onClick: () => handleDelete(lancamento.id),
                      className: "bg-red-600 hover:bg-red-700",
                      children: "Excluir"
                    }
                  )
                ] })
              ] })
            ] })
          ] }) })
        ] }, lancamento.id)) })
      ] }) })
    ] })
  ] });
}

function LancamentosListMobile({
  lancamentos,
  onEdit,
  onDelete
}) {
  const formatarValor = (valor) => {
    return `R$ ${valor.toFixed(2).replace(".", ",")}`;
  };
  if (lancamentos.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border/50 bg-card/50 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "py-8 sm:py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2 sm:gap-3 animate-fade-in", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { className: "h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground/50" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm sm:text-base font-medium text-foreground", children: "Nenhum lançamento encontrado" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs sm:text-sm text-muted-foreground mt-1", children: "Adicione seu primeiro lançamento financeiro" })
      ] })
    ] }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 sm:space-y-3", children: lancamentos.map((lancamento) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    Card,
    {
      className: "border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden hover-scale animate-fade-in active:scale-[0.99] transition-transform",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-3 mobile-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 sm:space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2 sm:gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-1 min-w-0", children: [
            lancamento.tipo === "entrada" ? /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "h-4 w-4 sm:h-5 sm:w-5 text-red-600 flex-shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-xs sm:text-base truncate", children: lancamento.descricao }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] sm:text-xs text-muted-foreground", children: format(new Date(lancamento.data), "dd/MM/yyyy", { locale: ptBR }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-right flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: `font-bold text-sm sm:text-lg ${lancamento.tipo === "entrada" ? "text-green-600" : "text-red-600"}`, children: [
            lancamento.tipo === "entrada" ? "+" : "-",
            " ",
            formatarValor(lancamento.valor)
          ] }) })
        ] }),
        lancamento.categoria && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 sm:gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "h-2.5 w-2.5 sm:h-3 sm:w-3 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[10px] sm:text-xs h-5 px-1.5 font-normal", children: lancamento.categoria })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 pt-2 border-t border-border/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => onEdit(lancamento),
              className: "h-9 text-xs btn-touch hover-scale",
              "aria-label": "Editar lançamento",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1.5" }),
                "Editar"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialog, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                className: "h-9 text-xs btn-touch hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 hover-scale",
                "aria-label": "Excluir lançamento",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1.5" }),
                  "Excluir"
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Confirmar exclusão" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
                  'Tem certeza que deseja excluir o lançamento "',
                  lancamento.descricao,
                  '"? Esta ação não pode ser desfeita.'
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { className: "btn-touch", children: "Cancelar" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  AlertDialogAction,
                  {
                    onClick: () => onDelete(lancamento.id),
                    className: "bg-destructive hover:bg-destructive/90 btn-touch",
                    children: "Excluir"
                  }
                )
              ] })
            ] })
          ] })
        ] })
      ] }) })
    },
    lancamento.id
  )) });
}

function ContasFixasListMobile({
  contas,
  onEdit,
  onDelete,
  onPagar,
  onToggleAtiva
}) {
  const formatarValor = (valor) => {
    return `R$ ${valor.toFixed(2).replace(".", ",")}`;
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "pago":
        return "bg-green-100 text-green-800 border-green-200";
      case "em_aberto":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
  const getStatusText = (status) => {
    switch (status) {
      case "pago":
        return "Pago";
      case "em_aberto":
        return "Em Aberto";
      default:
        return status;
    }
  };
  const getFrequenciaTexto = (frequencia) => {
    switch (frequencia) {
      case "mensal":
        return "Mensal";
      case "trimestral":
        return "Trimestral";
      case "semestral":
        return "Semestral";
      case "anual":
        return "Anual";
      default:
        return frequencia;
    }
  };
  if (contas.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border/50 bg-card/50 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3 animate-fade-in", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-12 w-12 text-muted-foreground/50" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-medium text-foreground", children: "Nenhuma conta fixa encontrada" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Adicione sua primeira conta fixa recorrente" })
      ] })
    ] }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: contas.map((conta) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    Card,
    {
      className: `border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden hover-scale animate-fade-in ${!conta.ativa ? "opacity-60" : ""}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4 mobile-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: `h-5 w-5 flex-shrink-0 ${conta.status === "pago" ? "text-green-600" : "text-red-600"}` }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-sm sm:text-base truncate", children: conta.nome }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                "Vence dia ",
                conta.dataVencimento
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-right flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-base sm:text-lg text-foreground", children: formatarValor(conta.valor) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "outline",
              className: `text-xs ${getStatusColor(conta.status)}`,
              children: getStatusText(conta.status)
            }
          ),
          conta.categoria && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "h-3 w-3 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: conta.categoria })
          ] }),
          conta.repetir && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Repeat, { className: "h-3 w-3 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: getFrequenciaTexto(conta.frequencia) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 pt-2 border-t border-border/50", children: [
          conta.status === "em_aberto" && conta.ativa && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => onPagar(conta.id),
              className: "h-10 text-xs btn-touch border-green-500/50 hover:bg-green-50 hover:text-green-700 hover-scale",
              "aria-label": "Marcar conta como paga",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3 mr-1" }),
                "Pagar"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => onToggleAtiva(conta.id, !conta.ativa),
              className: "h-10 text-xs btn-touch hover-scale",
              "aria-label": conta.ativa ? "Desativar conta" : "Ativar conta",
              children: conta.ativa ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(PowerOff, { className: "h-3 w-3 mr-1" }),
                "Desativar"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Power, { className: "h-3 w-3 mr-1" }),
                "Ativar"
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => onEdit(conta),
              className: "h-10 text-xs btn-touch hover-scale",
              "aria-label": "Editar conta",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "h-3 w-3 mr-1" }),
                "Editar"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialog, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                className: "h-10 text-xs btn-touch hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 hover-scale",
                "aria-label": "Excluir conta",
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
                  'Tem certeza que deseja excluir a conta "',
                  conta.nome,
                  '"? Esta ação não pode ser desfeita.'
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { className: "btn-touch", children: "Cancelar" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  AlertDialogAction,
                  {
                    onClick: () => onDelete(conta.id),
                    className: "bg-destructive hover:bg-destructive/90 btn-touch",
                    children: "Excluir"
                  }
                )
              ] })
            ] })
          ] })
        ] })
      ] }) })
    },
    conta.id
  )) });
}

const formSchema = object({
  tipo: _enum(["entrada", "saida"], {
    message: "Selecione o tipo do lançamento"
  }),
  valor: string().min(1, "Valor é obrigatório").refine(
    (val) => {
      const num = parseFloat(val.replace(",", "."));
      return !isNaN(num) && num > 0;
    },
    "Valor deve ser maior que zero"
  ),
  data: date({
    message: "Data é obrigatória"
  }),
  descricao: string().min(1, "Descrição é obrigatória"),
  categoria: string().optional()
});
function LancamentoForm({
  lancamento,
  categorias,
  onSubmit,
  onCancel
}) {
  const [isSubmitting, setIsSubmitting] = reactExports.useState(false);
  const form = useForm({
    resolver: a(formSchema),
    defaultValues: {
      tipo: lancamento?.tipo || void 0,
      valor: lancamento?.valor ? lancamento.valor.toString() : "",
      data: lancamento?.data ? new Date(lancamento.data) : /* @__PURE__ */ new Date(),
      descricao: lancamento?.descricao || "",
      categoria: lancamento?.categoria || ""
    }
  });
  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const novoLancamento = {
        tipo: data.tipo,
        valor: parseFloat(data.valor.replace(",", ".")),
        data: data.data,
        descricao: data.descricao,
        categoria: data.categoria || void 0
      };
      const success = await onSubmit(novoLancamento);
      if (success) {
        toast({
          title: lancamento ? "Lançamento atualizado" : "Lançamento criado",
          description: `${lancamento ? "Alterações salvas" : "Novo lançamento adicionado"} com sucesso.`
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o lançamento.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border/50 bg-card/50 backdrop-blur-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", onClick: onCancel, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: lancamento ? "Editar Lançamento" : "Novo Lançamento" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Form, { ...form, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: form.handleSubmit(handleSubmit), className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FormField,
          {
            control: form.control,
            name: "tipo",
            render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: "text-sm sm:text-base", children: "Tipo *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { onValueChange: field.onChange, defaultValue: field.value, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione o tipo" }) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "entrada", children: "Entrada" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "saida", children: "Saída" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FormField,
          {
            control: form.control,
            name: "valor",
            render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: "text-sm sm:text-base", children: "Valor (R$) *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: "0,00",
                  className: "h-12",
                  ...field,
                  onChange: (e) => {
                    let value = e.target.value.replace(/[^\d,]/g, "");
                    if (value.includes(",")) {
                      const parts = value.split(",");
                      if (parts[1] && parts[1].length > 2) {
                        value = parts[0] + "," + parts[1].substring(0, 2);
                      }
                    }
                    field.onChange(value);
                  }
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
            name: "data",
            render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { className: "flex flex-col", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: "text-sm sm:text-base", children: "Data *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "outline",
                    className: cn(
                      "w-full pl-3 text-left font-normal h-12",
                      !field.value && "text-muted-foreground"
                    ),
                    children: [
                      field.value ? format(field.value, "dd/MM/yyyy", { locale: ptBR }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Selecione a data" }),
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
                    disabled: (date) => date > /* @__PURE__ */ new Date() || date < /* @__PURE__ */ new Date("1900-01-01"),
                    initialFocus: true,
                    className: cn("p-3 pointer-events-auto")
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
            name: "categoria",
            render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: "text-sm sm:text-base", children: "Categoria" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: "Ex: Serviços, Produtos, Despesas...",
                  className: "h-12",
                  ...field,
                  list: "categorias"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("datalist", { id: "categorias", children: categorias.map((categoria) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: categoria }, categoria)) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
            ] })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        FormField,
        {
          control: form.control,
          name: "descricao",
          render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: "text-sm sm:text-base", children: "Descrição *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                placeholder: "Descreva o lançamento...",
                className: "resize-none min-h-[100px]",
                rows: 3,
                ...field
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "submit",
            disabled: isSubmitting,
            className: "bg-gradient-to-r from-primary to-lilac-primary shadow-lg hover:shadow-xl transition-all duration-300 h-12 btn-touch",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "mr-2 h-4 w-4" }),
              isSubmitting ? "Salvando..." : "Salvar Lançamento"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: onCancel, className: "h-12 btn-touch", children: "Cancelar" })
      ] })
    ] }) }) })
  ] });
}

function GraficoFinanceiro({ lancamentos }) {
  const { compras } = useSupabaseCompras();
  const { vendas } = useSupabaseVendas();
  const agora = /* @__PURE__ */ new Date();
  const mesAtual = agora.getMonth();
  const anoAtual = agora.getFullYear();
  const lancamentosDoMes = lancamentos.filter((l) => {
    const dataLancamento = new Date(l.data);
    return dataLancamento.getMonth() === mesAtual && dataLancamento.getFullYear() === anoAtual;
  });
  const comprasDoMes = reactExports.useMemo(() => {
    return compras.filter((c) => {
      const dataCompra = new Date(c.data_compra);
      return dataCompra.getMonth() === mesAtual && dataCompra.getFullYear() === anoAtual;
    });
  }, [compras, mesAtual, anoAtual]);
  const vendasDoMes = reactExports.useMemo(() => {
    return vendas.filter((v) => {
      const dataVenda = new Date(v.data_venda);
      return dataVenda.getMonth() === mesAtual && dataVenda.getFullYear() === anoAtual;
    });
  }, [vendas, mesAtual, anoAtual]);
  const totalCompras = comprasDoMes.reduce((sum, c) => sum + c.valor_total, 0);
  const totalVendas = vendasDoMes.reduce((sum, v) => sum + v.valor_total, 0);
  const totalEntradas = lancamentosDoMes.filter((l) => l.tipo === "entrada").reduce((total, l) => total + l.valor, 0) + totalVendas;
  const totalSaidas = lancamentosDoMes.filter((l) => l.tipo === "saida").reduce((total, l) => total + l.valor, 0) + totalCompras;
  const dadosPizza = [
    { name: "Entradas", value: totalEntradas, fill: "#22c55e" },
    { name: "Saídas", value: totalSaidas, fill: "#ef4444" }
  ];
  const categorias = lancamentosDoMes.reduce((acc, l) => {
    const categoria = l.categoria || "Sem categoria";
    if (!acc[categoria]) {
      acc[categoria] = { entradas: 0, saidas: 0 };
    }
    if (l.tipo === "entrada") {
      acc[categoria].entradas += l.valor;
    } else {
      acc[categoria].saidas += l.valor;
    }
    return acc;
  }, {});
  if (totalVendas > 0) {
    if (!categorias["Venda de Produtos"]) {
      categorias["Venda de Produtos"] = { entradas: 0, saidas: 0 };
    }
    categorias["Venda de Produtos"].entradas += totalVendas;
  }
  if (totalCompras > 0) {
    if (!categorias["Compra de Produtos"]) {
      categorias["Compra de Produtos"] = { entradas: 0, saidas: 0 };
    }
    categorias["Compra de Produtos"].saidas += totalCompras;
  }
  const dadosBarras = Object.entries(categorias).map(([categoria, dados]) => ({
    categoria,
    entradas: dados.entradas,
    saidas: dados.saidas
  }));
  const formatarValor = (valor) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(valor);
  };
  const temDados = totalEntradas > 0 || totalSaidas > 0;
  const [produtoNomes, setProdutoNomes] = reactExports.useState({});
  const itensMes = reactExports.useMemo(() => {
    return vendasDoMes.flatMap((v) => v.itens_venda || []);
  }, [vendasDoMes]);
  const agregadosProdutos = reactExports.useMemo(() => {
    const agg = {};
    itensMes.forEach((i) => {
      const id = i.produto_id;
      if (!agg[id]) agg[id] = { id, quantidade: 0, valor: 0 };
      agg[id].quantidade += Number(i.quantidade || 0);
      agg[id].valor += Number(i.valor_total || 0);
    });
    return Object.values(agg).sort((a, b) => b.valor - a.valor).slice(0, 5);
  }, [itensMes]);
  reactExports.useEffect(() => {
    const carregarNomes = async () => {
      const ids = agregadosProdutos.map((a) => a.id);
      if (ids.length === 0) return;
      const { data } = await supabase.from("produtos").select("id,nome").in("id", ids);
      const map = {};
      (data || []).forEach((p) => {
        map[p.id] = p.nome;
      });
      setProdutoNomes(map);
    };
    carregarNomes();
  }, [agregadosProdutos]);
  const dadosTopProdutos = agregadosProdutos.map((a) => ({
    produto: produtoNomes[a.id] || a.id.slice(0, 6),
    quantidade: a.quantidade,
    valor: a.valor
  }));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 md:grid-cols-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border/50 bg-card/50 backdrop-blur-sm animate-fade-in", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-5 w-5 text-primary" }),
        "Entradas vs Saídas"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: !temDados ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center h-[300px] gap-3 animate-fade-in", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-12 w-12 text-muted-foreground/50" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-medium text-foreground", children: "Sem dados para exibir" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Adicione lançamentos para visualizar o gráfico" })
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 300, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Pie,
          {
            data: dadosPizza,
            cx: "50%",
            cy: "50%",
            labelLine: false,
            label: ({ name, value }) => `${name}: ${formatarValor(value)}`,
            outerRadius: 80,
            fill: "#8884d8",
            dataKey: "value",
            animationDuration: 800,
            children: dadosPizza.map((entry, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { fill: entry.fill }, `cell-${index}`))
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { formatter: (value) => formatarValor(Number(value)) })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border/50 bg-card/50 backdrop-blur-sm animate-fade-in", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-5 w-5 text-primary" }),
        "Por Categoria"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: dadosBarras.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center h-[300px] gap-3 animate-fade-in", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-12 w-12 text-muted-foreground/50" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-medium text-foreground", children: "Sem categorias para exibir" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Organize seus lançamentos em categorias" })
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 300, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data: dadosBarras, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          XAxis,
          {
            dataKey: "categoria",
            tick: { fontSize: 12 },
            angle: -45,
            textAnchor: "end",
            height: 60
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { tick: { fontSize: 12 } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { formatter: (value) => formatarValor(Number(value)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "entradas", fill: "#22c55e", name: "Entradas", animationDuration: 800 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "saidas", fill: "#ef4444", name: "Saídas", animationDuration: 800 })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border/50 bg-card/50 backdrop-blur-sm animate-fade-in md:col-span-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-5 w-5 text-primary" }),
        "Top Produtos (mês)"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: dadosTopProdutos.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center h-[300px] gap-3 animate-fade-in", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-12 w-12 text-muted-foreground/50" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-medium text-foreground", children: "Sem vendas de produtos neste mês" }) })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 300, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data: dadosTopProdutos, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "produto", tick: { fontSize: 12 } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { tick: { fontSize: 12 } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { formatter: (value, name) => name === "valor" ? formatarValor(Number(value)) : value }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "valor", fill: "#7c3aed", name: "Valor", animationDuration: 800 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "quantidade", fill: "#06b6d4", name: "Quantidade", animationDuration: 800 })
      ] }) }) })
    ] })
  ] });
}

function TabelaPagamentosClientes({ agendamentos }) {
  const [busca, setBusca] = reactExports.useState("");
  const agendamentosComPagamento = agendamentos.filter(
    (agendamento) => (agendamento.status === "concluido" || agendamento.valorPago > 0) && (agendamento.clienteNome || "").toLowerCase().includes(busca.toLowerCase())
  );
  const formatarValor = (valor) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(valor);
  };
  const handleEnviarCobranca = (agendamento) => {
    const telefone = "";
    const mensagem = `Olá ${agendamento.clienteNome}! 

Você tem um saldo devedor de ${formatarValor(agendamento.valorDevido || 0)} referente ao serviço ${agendamento.servicoNome} realizado em ${format(new Date(agendamento.data), "dd/MM/yyyy", { locale: ptBR })}.

${agendamento.dataPrevistaPagamento ? `Data prevista para pagamento: ${format(new Date(agendamento.dataPrevistaPagamento), "dd/MM/yyyy", { locale: ptBR })}` : ""}

Por favor, entre em contato para acertarmos o pagamento. Obrigado!`;
    const whatsappUrl = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
    window.open(whatsappUrl, "_blank");
    toast({
      title: "WhatsApp aberto",
      description: "Mensagem de cobrança preparada no WhatsApp."
    });
  };
  const getStatusBadge = (agendamento) => {
    if (agendamento.statusPagamento === "pago") {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "default", className: "bg-green-500", children: "Pago" });
    } else if (agendamento.statusPagamento === "parcial") {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "border-orange-500 text-orange-600", children: "Parcial" });
    } else {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "destructive", children: "Em Aberto" });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border/50 bg-card/50 backdrop-blur-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-5 w-5 text-primary" }),
      "Pagamentos dos Clientes"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-3 h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "Buscar cliente...",
            value: busca,
            onChange: (e) => setBusca(e.target.value),
            className: "pl-9"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md border border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Cliente" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Serviço" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Data" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Valor Total" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Valor Pago" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Saldo Devedor" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Data Prevista" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-[100px]", children: "Ações" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: agendamentosComPagamento.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 9, className: "text-center py-8 text-muted-foreground", children: "Nenhum pagamento encontrado" }) }) : agendamentosComPagamento.map((agendamento) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: agendamento.clienteNome }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: agendamento.servicoNome }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4 text-muted-foreground" }),
            format(new Date(agendamento.data), "dd/MM/yy", { locale: ptBR })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-semibold", children: formatarValor(agendamento.valor) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-green-600 font-semibold", children: formatarValor(agendamento.valorPago) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: `font-semibold ${(agendamento.valorDevido || 0) > 0 ? "text-red-600" : "text-green-600"}`, children: formatarValor(agendamento.valorDevido || 0) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: getStatusBadge(agendamento) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: agendamento.dataPrevistaPagamento ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 text-orange-500" }),
            format(new Date(agendamento.dataPrevistaPagamento), "dd/MM/yy", { locale: ptBR })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "-" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: (agendamento.valorDevido || 0) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => handleEnviarCobranca(agendamento),
              className: "flex items-center gap-1",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-4 w-4" }),
                "Cobrar"
              ]
            }
          ) })
        ] }, agendamento.id)) })
      ] }) }),
      agendamentosComPagamento.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-muted/30 rounded-lg p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Total de Clientes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-primary", children: new Set(agendamentosComPagamento.map((a) => a.clienteId)).size })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Valor Total Pago" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-green-600", children: formatarValor(agendamentosComPagamento.reduce((total, a) => total + a.valorPago, 0)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Saldo Total Devedor" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-red-600", children: formatarValor(agendamentosComPagamento.reduce((total, a) => total + (a.valorDevido || 0), 0)) })
        ] })
      ] }) })
    ] })
  ] });
}

function ContasFixasList({
  contas,
  categorias,
  onEdit,
  onDelete,
  onPagar,
  onToggleAtiva
}) {
  const [filtroCategoria, setFiltroCategoria] = reactExports.useState("todas");
  const [filtroStatus, setFiltroStatus] = reactExports.useState("todos");
  const [busca, setBusca] = reactExports.useState("");
  const contasFiltradas = contas.filter((conta) => {
    const matchBusca = conta.nome.toLowerCase().includes(busca.toLowerCase());
    const matchCategoria = filtroCategoria === "todas" || conta.categoria === filtroCategoria;
    const matchStatus = filtroStatus === "todos" || conta.status === filtroStatus;
    return matchBusca && matchCategoria && matchStatus;
  });
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(value);
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "pago":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "em_aberto":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };
  const getVencimentoStatus = (dataVencimento) => {
    const hoje = /* @__PURE__ */ new Date();
    const mesAtual = hoje.getMonth() + 1;
    const anoAtual = hoje.getFullYear();
    hoje.getDate();
    const vencimento = new Date(anoAtual, mesAtual - 1, dataVencimento);
    const diasParaVencimento = Math.ceil((vencimento.getTime() - hoje.getTime()) / (1e3 * 60 * 60 * 24));
    if (diasParaVencimento < 0) {
      return { texto: "Vencido", cor: "text-red-600" };
    } else if (diasParaVencimento <= 3) {
      return { texto: "Vence em breve", cor: "text-orange-600" };
    } else {
      return { texto: `Vence dia ${dataVencimento}`, cor: "text-gray-600" };
    }
  };
  const getFrequenciaTexto = (frequencia) => {
    switch (frequencia) {
      case "mensal":
        return "Mensal";
      case "trimestral":
        return "Trimestral";
      case "semestral":
        return "Semestral";
      case "anual":
        return "Anual";
      default:
        return "Única";
    }
  };
  const totalEmAberto = contasFiltradas.filter((c) => c.status === "em_aberto").reduce((sum, c) => sum + c.valor, 0);
  const totalPago = contasFiltradas.filter((c) => c.status === "pago").reduce((sum, c) => sum + c.valor, 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "Em Aberto" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-red-600", children: formatCurrency(totalEmAberto) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "h-8 w-8 text-red-600" })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "Pagas" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-green-600", children: formatCurrency(totalPago) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-8 w-8 text-green-600" })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "Total de Contas" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold", children: contasFiltradas.length })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-8 w-8 text-primary" })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Filter, { className: "h-5 w-5" }),
        "Filtros"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-3 h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: "Buscar conta...",
              value: busca,
              onChange: (e) => setBusca(e.target.value),
              className: "pl-9"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: filtroCategoria, onValueChange: setFiltroCategoria, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Todas as categorias" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "todas", children: "Todas as categorias" }),
            categorias.filter((c) => c.tipo === "despesa").map((categoria) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: categoria.nome, children: categoria.nome }, categoria.id))
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: filtroStatus, onValueChange: setFiltroStatus, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Todos os status" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "todos", children: "Todos os status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "em_aberto", children: "Em Aberto" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "pago", children: "Pago" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            onClick: () => {
              setBusca("");
              setFiltroCategoria("todas");
              setFiltroStatus("todos");
            },
            children: "Limpar Filtros"
          }
        )
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Contas Fixas" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-x-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Nome" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Categoria" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Valor" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Vencimento" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Repetição" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Ações" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: contasFiltradas.map((conta) => {
            const vencimentoStatus = getVencimentoStatus(conta.dataVencimento);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: conta.nome }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", children: conta.categoria }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-mono", children: formatCurrency(conta.valor) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: vencimentoStatus.cor, children: vencimentoStatus.texto }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: conta.repetir ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Repeat, { className: "h-4 w-4 text-blue-600" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: getFrequenciaTexto(conta.frequencia) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Power, { className: `h-3 w-3 ${conta.ativa ? "text-green-600" : "text-gray-400"}` }),
                    conta.ativa ? "Ativa" : "Inativa"
                  ] })
                ] })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: "Única" }) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: getStatusColor(conta.status), children: conta.status === "pago" ? "Pago" : "Em Aberto" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2", children: [
                conta.status === "em_aberto" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    size: "sm",
                    variant: "outline",
                    onClick: () => onPagar(conta.id),
                    className: "text-green-600 border-green-600 hover:bg-green-50 hover-scale btn-touch",
                    "aria-label": "Marcar conta como paga",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-4 w-4 mr-1" }),
                      "Pagar"
                    ]
                  }
                ),
                conta.repetir && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    size: "sm",
                    variant: "outline",
                    onClick: () => onToggleAtiva(conta.id, !conta.ativa),
                    className: `hover-scale btn-touch ${conta.ativa ? "text-orange-600 border-orange-600" : "text-green-600 border-green-600"}`,
                    "aria-label": conta.ativa ? "Desativar conta" : "Ativar conta",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Power, { className: "h-4 w-4 mr-1" }),
                      conta.ativa ? "Desativar" : "Ativar"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    size: "sm",
                    variant: "outline",
                    onClick: () => onEdit(conta),
                    className: "hover-scale btn-touch",
                    "aria-label": "Editar conta",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "h-4 w-4" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialog, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      size: "sm",
                      variant: "outline",
                      className: "text-red-600 hover-scale btn-touch",
                      "aria-label": "Excluir conta",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Excluir Conta Fixa" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
                        'Tem certeza que deseja excluir a conta "',
                        conta.nome,
                        '"? Esta ação não pode ser desfeita.'
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancelar" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        AlertDialogAction,
                        {
                          onClick: () => onDelete(conta.id),
                          className: "bg-red-600 hover:bg-red-700",
                          children: "Excluir"
                        }
                      )
                    ] })
                  ] })
                ] })
              ] }) })
            ] }, conta.id);
          }) })
        ] }),
        contasFiltradas.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3 py-12 animate-fade-in", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-12 w-12 text-muted-foreground/50" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-medium text-foreground", children: "Nenhuma conta fixa encontrada" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: busca || filtroCategoria !== "todas" || filtroStatus !== "todos" ? "Tente ajustar os filtros de busca" : "Adicione sua primeira conta fixa recorrente" })
          ] })
        ] })
      ] }) })
    ] })
  ] });
}

const contaFixaSchema = object({
  nome: string().min(1, "Nome é obrigatório"),
  valor: number().min(0.01, "Valor deve ser maior que zero"),
  dataVencimento: number().min(1).max(31, "Dia deve estar entre 1 e 31"),
  categoria: string().min(1, "Categoria é obrigatória"),
  observacoes: string().optional(),
  repetir: boolean(),
  frequencia: _enum(["mensal", "trimestral", "semestral", "anual"]),
  ativa: boolean().optional()
});
const novaCategoriaSchema = object({
  nome: string().min(1, "Nome da categoria é obrigatório"),
  cor: string().optional()
});
function ContaFixaForm({
  conta,
  categorias,
  onSubmit,
  onCancel,
  onCreateCategoria
}) {
  const [loading, setLoading] = reactExports.useState(false);
  const [showCategoriaDialog, setShowCategoriaDialog] = reactExports.useState(false);
  const [loadingCategoria, setLoadingCategoria] = reactExports.useState(false);
  const form = useForm({
    resolver: a(contaFixaSchema),
    defaultValues: {
      nome: conta?.nome || "",
      valor: conta?.valor || 0,
      dataVencimento: conta?.dataVencimento || 1,
      categoria: conta?.categoria || "",
      observacoes: conta?.observacoes || "",
      repetir: conta?.repetir ?? true,
      frequencia: conta?.frequencia || "mensal",
      ativa: conta?.ativa ?? true
    }
  });
  const categoriaForm = useForm({
    resolver: a(novaCategoriaSchema),
    defaultValues: {
      nome: "",
      cor: "#3b82f6"
    }
  });
  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      await onSubmit(data);
    } finally {
      setLoading(false);
    }
  };
  const handleCreateCategoria = async (data) => {
    if (!onCreateCategoria) return;
    setLoadingCategoria(true);
    try {
      await onCreateCategoria(data.nome, data.cor);
      categoriaForm.reset();
      setShowCategoriaDialog(false);
      form.setValue("categoria", data.nome);
      toast({
        title: "Categoria criada",
        description: `A categoria "${data.nome}" foi criada com sucesso.`
      });
    } catch (error) {
      toast({
        title: "Erro ao criar categoria",
        description: "Não foi possível criar a categoria. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoadingCategoria(false);
    }
  };
  const categoriasDespesa = categorias.filter((c) => c.tipo === "despesa");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          size: "icon",
          onClick: onCancel,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-foreground", children: conta ? "Editar Conta Fixa" : "Nova Conta Fixa" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: conta ? "Atualize os dados da conta fixa" : "Cadastre uma nova despesa recorrente" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Dados da Conta" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Form, { ...form, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: form.handleSubmit(handleSubmit), className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            FormField,
            {
              control: form.control,
              name: "nome",
              render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: "text-sm sm:text-base", children: "Nome da Conta" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    placeholder: "Ex: Aluguel, Energia, Internet...",
                    className: "h-12",
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
              name: "valor",
              render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: "text-sm sm:text-base", children: "Valor (R$)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    type: "number",
                    step: "0.01",
                    placeholder: "0,00",
                    className: "h-12",
                    ...field,
                    onChange: (e) => field.onChange(parseFloat(e.target.value) || 0)
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
              name: "dataVencimento",
              render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: "text-sm sm:text-base", children: "Dia do Vencimento" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    type: "number",
                    min: "1",
                    max: "31",
                    placeholder: "1",
                    className: "h-12",
                    ...field,
                    onChange: (e) => field.onChange(parseInt(e.target.value) || 1)
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
              name: "categoria",
              render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: "text-sm sm:text-base", children: "Categoria" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { onValueChange: field.onChange, defaultValue: field.value, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "flex-1 h-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione uma categoria" }) }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: categoriasDespesa.map((categoria) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: categoria.nome, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "w-3 h-3 rounded-full",
                          style: { backgroundColor: categoria.cor }
                        }
                      ),
                      categoria.nome
                    ] }) }, categoria.id)) })
                  ] }),
                  onCreateCategoria && /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: showCategoriaDialog, onOpenChange: setShowCategoriaDialog, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        type: "button",
                        variant: "outline",
                        size: "icon",
                        className: "flex-shrink-0 h-12 w-12 btn-touch",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" })
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Nova Categoria" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Form, { ...categoriaForm, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: categoriaForm.handleSubmit(handleCreateCategoria), className: "space-y-4", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          FormField,
                          {
                            control: categoriaForm.control,
                            name: "nome",
                            render: ({ field: field2 }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: "text-sm sm:text-base", children: "Nome da Categoria" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                Input,
                                {
                                  placeholder: "Ex: Aluguel, Energia, Internet...",
                                  className: "h-12",
                                  ...field2
                                }
                              ) }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
                            ] })
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          FormField,
                          {
                            control: categoriaForm.control,
                            name: "cor",
                            render: ({ field: field2 }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: "text-sm sm:text-base", children: "Cor" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  Input,
                                  {
                                    type: "color",
                                    className: "w-16 h-12 p-1 border rounded",
                                    ...field2
                                  }
                                ),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  Input,
                                  {
                                    placeholder: "#3b82f6",
                                    ...field2,
                                    className: "flex-1 h-12"
                                  }
                                )
                              ] }) }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
                            ] })
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-2 pt-4", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Button,
                            {
                              type: "submit",
                              disabled: loadingCategoria,
                              className: "bg-gradient-to-r from-primary to-lilac-primary h-12 btn-touch",
                              children: loadingCategoria ? "Criando..." : "Criar Categoria"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Button,
                            {
                              type: "button",
                              variant: "outline",
                              onClick: () => setShowCategoriaDialog(false),
                              className: "h-12 btn-touch",
                              children: "Cancelar"
                            }
                          )
                        ] })
                      ] }) })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
              ] })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-muted/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-base", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Repeat, { className: "h-4 w-4 text-primary" }),
            "Configurações de Repetição"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              FormField,
              {
                control: form.control,
                name: "repetir",
                render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { className: "flex flex-row items-center justify-between rounded-lg border p-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: "text-base font-medium", children: "Conta Recorrente" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Esta conta se repete automaticamente" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Switch,
                    {
                      checked: field.value,
                      onCheckedChange: field.onChange
                    }
                  ) })
                ] })
              }
            ),
            form.watch("repetir") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                FormField,
                {
                  control: form.control,
                  name: "frequencia",
                  render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(FormLabel, { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4" }),
                      "Frequência de Repetição"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { onValueChange: field.onChange, defaultValue: field.value, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione a frequência" }) }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "mensal", children: "📅 Mensal" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "trimestral", children: "📅 Trimestral (3 meses)" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "semestral", children: "📅 Semestral (6 meses)" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "anual", children: "📅 Anual (12 meses)" })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
                  ] })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                FormField,
                {
                  control: form.control,
                  name: "ativa",
                  render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { className: "flex flex-row items-center justify-between rounded-lg border p-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: "text-sm font-medium", children: "Conta Ativa" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Gerar automaticamente" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Switch,
                      {
                        checked: field.value ?? true,
                        onCheckedChange: field.onChange
                      }
                    ) })
                  ] })
                }
              )
            ] }),
            form.watch("repetir") && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg bg-blue-50 border border-blue-200 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-full bg-blue-100 p-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4 text-blue-600" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-blue-900 mb-1", children: "Como funciona a repetição:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-blue-700 space-y-1 text-xs", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• A conta será criada automaticamente conforme a frequência" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                    "• O vencimento será no dia ",
                    form.watch("dataVencimento"),
                    " de cada período"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Você pode ativar/desativar a geração automática" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Contas já vencidas podem ser marcadas como pagas individualmente" })
                ] })
              ] })
            ] }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FormField,
          {
            control: form.control,
            name: "observacoes",
            render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: "text-sm sm:text-base", children: "Observações" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  placeholder: "Informações adicionais sobre a conta...",
                  rows: 3,
                  className: "min-h-[100px]",
                  ...field
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "submit",
              disabled: loading,
              className: "bg-gradient-to-r from-primary to-lilac-primary h-12 btn-touch",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "mr-2 h-4 w-4" }),
                loading ? "Salvando..." : "Salvar Conta"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: onCancel,
              className: "h-12 btn-touch",
              children: "Cancelar"
            }
          )
        ] })
      ] }) }) })
    ] })
  ] });
}

function ContasReceber({ agendamentos }) {
  const [busca, setBusca] = reactExports.useState("");
  const { config } = useConfigAgendamentoOnline();
  const contasReceber = agendamentos.filter(
    (agendamento) => (agendamento.statusPagamento === "em_aberto" || agendamento.statusPagamento === "parcial") && agendamento.valorDevido > 0
  ).filter(
    (agendamento) => (agendamento.clienteNome || "").toLowerCase().includes(busca.toLowerCase())
  );
  const totalReceber = contasReceber.reduce((total, agendamento) => total + agendamento.valorDevido, 0);
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(value);
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };
  const enviarCobrancaWhatsApp = (agendamento) => {
    const header = `${config.nome_salao || "Seu Salão"} • ${window.location.origin}`;
    const logoLine = config.logo_url ? `Logo: ${config.logo_url}` : "";
    const mensagem = `${header}
${logoLine}

Olá ${agendamento.clienteNome}! 
    
Você tem um saldo pendente de ${formatCurrency(agendamento.valorDevido)} referente ao serviço de ${agendamento.servicoNome} realizado em ${formatDate(agendamento.data)}.

Para facilitar o pagamento, entre em contato conosco.

Obrigado!`;
    const telefone = "";
    const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "Total a Receber" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-orange-600", children: formatCurrency(totalReceber) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-8 w-8 text-orange-600" })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Buscar Cliente" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-3 h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "Buscar por nome do cliente...",
            value: busca,
            onChange: (e) => setBusca(e.target.value),
            className: "pl-9"
          }
        )
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Contas a Receber" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-x-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Cliente" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Serviço" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Data" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Valor Total" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Valor Pago" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Valor Devedor" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Ações" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: contasReceber.map((agendamento) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: agendamento.clienteNome }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: agendamento.servicoNome }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: formatDate(agendamento.data) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-mono", children: formatCurrency(agendamento.valor) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-mono", children: formatCurrency(agendamento.valorPago) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-mono font-bold text-orange-600", children: formatCurrency(agendamento.valorDevido) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "outline",
                className: agendamento.statusPagamento === "em_aberto" ? "border-red-500 text-red-700" : "border-orange-500 text-orange-700",
                children: agendamento.statusPagamento === "em_aberto" ? "Em Aberto" : "Parcial"
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                variant: "outline",
                onClick: () => enviarCobrancaWhatsApp(agendamento),
                className: "text-green-600 border-green-600 hover:bg-green-50",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-4 w-4 mr-1" }),
                  "WhatsApp"
                ]
              }
            ) })
          ] }, agendamento.id)) })
        ] }),
        contasReceber.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8 text-muted-foreground", children: busca ? "Nenhum cliente encontrado" : "Nenhuma conta a receber no momento" })
      ] }) })
    ] })
  ] });
}

function useRelatoriosFinanceiros(lancamentos, contasFixas, agendamentos) {
  const [filtros, setFiltros] = reactExports.useState({
    periodo: "mensal",
    incluirContasFixas: true,
    incluirAgendamentos: true,
    incluirLancamentos: true
  });
  const intervaloData = reactExports.useMemo(() => {
    const hoje = /* @__PURE__ */ new Date();
    switch (filtros.periodo) {
      case "semanal":
        return {
          inicio: startOfWeek(hoje, { locale: ptBR }),
          fim: endOfWeek(hoje, { locale: ptBR })
        };
      case "mensal":
        return {
          inicio: startOfMonth(hoje),
          fim: endOfMonth(hoje)
        };
      case "trimestral":
        return {
          inicio: startOfQuarter(hoje),
          fim: endOfQuarter(hoje)
        };
      case "semestral":
        const inicioSemestre = hoje.getMonth() < 6 ? new Date(hoje.getFullYear(), 0, 1) : new Date(hoje.getFullYear(), 6, 1);
        const fimSemestre = hoje.getMonth() < 6 ? new Date(hoje.getFullYear(), 5, 30) : new Date(hoje.getFullYear(), 11, 31);
        return {
          inicio: inicioSemestre,
          fim: fimSemestre
        };
      case "anual":
        return {
          inicio: startOfYear(hoje),
          fim: endOfYear(hoje)
        };
      case "personalizado":
        return {
          inicio: filtros.dataInicio || startOfMonth(hoje),
          fim: filtros.dataFim || endOfMonth(hoje)
        };
      default:
        return {
          inicio: startOfMonth(hoje),
          fim: endOfMonth(hoje)
        };
    }
  }, [filtros.periodo, filtros.dataInicio, filtros.dataFim]);
  const dadosFiltrados = reactExports.useMemo(() => {
    const lancamentosFiltrados = filtros.incluirLancamentos ? lancamentos.filter((l) => {
      const dataLancamento = new Date(l.data);
      return isWithinInterval(dataLancamento, { start: intervaloData.inicio, end: intervaloData.fim });
    }) : [];
    const contasFixasFiltradas = filtros.incluirContasFixas ? contasFixas.filter((c) => {
      if (!c.proximoVencimento) return false;
      const dataVencimento = new Date(c.proximoVencimento);
      return isWithinInterval(dataVencimento, { start: intervaloData.inicio, end: intervaloData.fim });
    }) : [];
    const agendamentosFiltrados = filtros.incluirAgendamentos ? agendamentos.filter((a) => {
      const dataAgendamento = new Date(a.data);
      return isWithinInterval(dataAgendamento, { start: intervaloData.inicio, end: intervaloData.fim });
    }) : [];
    return {
      lancamentos: lancamentosFiltrados,
      contasFixas: contasFixasFiltradas,
      agendamentos: agendamentosFiltrados
    };
  }, [lancamentos, contasFixas, agendamentos, intervaloData, filtros]);
  const dadosRelatorio = reactExports.useMemo(() => {
    const { lancamentos: lancFiltrados, contasFixas: contasFiltradas, agendamentos: agendFiltrados } = dadosFiltrados;
    const totalEntradas = lancFiltrados.filter((l) => l.tipo === "entrada").reduce((sum, l) => sum + l.valor, 0);
    const totalSaidas = lancFiltrados.filter((l) => l.tipo === "saida").reduce((sum, l) => sum + l.valor, 0);
    const agendamentosPagos = agendFiltrados.filter((a) => a.statusPagamento === "pago").reduce((sum, a) => sum + (a.valorPago || 0), 0);
    const agendamentosAbertos = agendFiltrados.filter((a) => a.statusPagamento !== "pago").reduce((sum, a) => sum + a.valorDevido, 0);
    const contasFixasPagas = contasFiltradas.filter((c) => c.status === "pago").reduce((sum, c) => sum + c.valor, 0);
    const contasFixasAbertas = contasFiltradas.filter((c) => c.status !== "pago").reduce((sum, c) => sum + c.valor, 0);
    const servicosMap = /* @__PURE__ */ new Map();
    agendFiltrados.forEach((agendamento) => {
      const servicoNome = "Serviço";
      const atual = servicosMap.get(servicoNome) || { quantidade: 0, valor: 0 };
      servicosMap.set(servicoNome, {
        quantidade: atual.quantidade + 1,
        valor: atual.valor + agendamento.valor
      });
    });
    const servicosMaisVendidos = Array.from(servicosMap.entries()).map(([nome, dados]) => ({
      nome,
      quantidade: dados.quantidade,
      valorTotal: dados.valor,
      percentual: dados.valor / (totalEntradas + agendamentosPagos) * 100
    })).sort((a, b) => b.valorTotal - a.valorTotal).slice(0, 5);
    const categoriasMap = /* @__PURE__ */ new Map();
    lancFiltrados.forEach((lancamento) => {
      const categoria = lancamento.categoria || "Sem categoria";
      const atual = categoriasMap.get(categoria) || { entradas: 0, saidas: 0 };
      if (lancamento.tipo === "entrada") {
        atual.entradas += lancamento.valor;
      } else {
        atual.saidas += lancamento.valor;
      }
      categoriasMap.set(categoria, atual);
    });
    const categoriasMaisLucrativas = Array.from(categoriasMap.entries()).map(([categoria, dados]) => ({
      categoria,
      entradas: dados.entradas,
      saidas: dados.saidas,
      lucro: dados.entradas - dados.saidas,
      percentual: (dados.entradas - dados.saidas) / (totalEntradas - totalSaidas) * 100
    })).sort((a, b) => b.lucro - a.lucro);
    const evolucaoMensal = [];
    for (let i = 5; i >= 0; i--) {
      const mesAtual = subMonths(/* @__PURE__ */ new Date(), i);
      const inicioMes = startOfMonth(mesAtual);
      const fimMes = endOfMonth(mesAtual);
      const lancamentosMes = lancamentos.filter((l) => {
        const dataLancamento = new Date(l.data);
        return isWithinInterval(dataLancamento, { start: inicioMes, end: fimMes });
      });
      const entradasMes = lancamentosMes.filter((l) => l.tipo === "entrada").reduce((sum, l) => sum + l.valor, 0);
      const saidasMes = lancamentosMes.filter((l) => l.tipo === "saida").reduce((sum, l) => sum + l.valor, 0);
      evolucaoMensal.push({
        periodo: format(mesAtual, "MMM/yyyy", { locale: ptBR }),
        entradas: entradasMes,
        saidas: saidasMes,
        lucro: entradasMes - saidasMes
      });
    }
    return {
      totalEntradas: totalEntradas + agendamentosPagos,
      totalSaidas: totalSaidas + contasFixasPagas,
      lucroLiquido: totalEntradas + agendamentosPagos - (totalSaidas + contasFixasPagas),
      contasAPagar: contasFixasAbertas,
      contasRecebidas: agendamentosPagos,
      agendamentosPagos,
      agendamentosAbertos,
      contasFixasPagas,
      contasFixasAbertas,
      servicosMaisVendidos,
      categoriasMaisLucrativas,
      evolucaoMensal
    };
  }, [dadosFiltrados, lancamentos]);
  return {
    filtros,
    setFiltros,
    dadosRelatorio,
    intervaloData,
    dadosFiltrados
  };
}

function FiltrosRelatorio({ filtros, onFiltrosChange }) {
  const { isMobile } = useBreakpoint();
  const handlePeriodoChange = (periodo) => {
    onFiltrosChange({ ...filtros, periodo });
  };
  const handleDataInicioChange = (dataInicio) => {
    onFiltrosChange({ ...filtros, dataInicio });
  };
  const handleDataFimChange = (dataFim) => {
    onFiltrosChange({ ...filtros, dataFim });
  };
  const handleIncluirChange = (campo, valor) => {
    onFiltrosChange({ ...filtros, [campo]: valor });
  };
  const FiltrosContent = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-responsive-sm", children: "Período" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: filtros.periodo, onValueChange: handlePeriodoChange, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione o período" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "semanal", children: "Esta Semana" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "mensal", children: "Este Mês" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "trimestral", children: "Este Trimestre" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "semestral", children: "Este Semestre" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "anual", children: "Este Ano" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "personalizado", children: "Período Personalizado" })
        ] })
      ] })
    ] }),
    filtros.periodo === "personalizado" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-responsive-sm", children: "Data Início" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              className: cn(
                "w-full justify-start text-left font-normal h-12",
                !filtros.dataInicio && "text-muted-foreground"
              ),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "mr-2 h-4 w-4" }),
                filtros.dataInicio ? format(filtros.dataInicio, "PPP", { locale: ptBR }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Selecione a data" })
              ]
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverContent, { className: "w-auto p-0", align: "start", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Calendar$1,
            {
              mode: "single",
              selected: filtros.dataInicio,
              onSelect: handleDataInicioChange,
              initialFocus: true,
              className: cn("p-3 pointer-events-auto")
            }
          ) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-responsive-sm", children: "Data Fim" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              className: cn(
                "w-full justify-start text-left font-normal h-12",
                !filtros.dataFim && "text-muted-foreground"
              ),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "mr-2 h-4 w-4" }),
                filtros.dataFim ? format(filtros.dataFim, "PPP", { locale: ptBR }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Selecione a data" })
              ]
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverContent, { className: "w-auto p-0", align: "start", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Calendar$1,
            {
              mode: "single",
              selected: filtros.dataFim,
              onSelect: handleDataFimChange,
              initialFocus: true,
              className: cn("p-3 pointer-events-auto")
            }
          ) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-responsive-sm font-semibold", children: "Incluir nos Relatórios" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "incluir-lancamentos", className: "text-responsive-sm cursor-pointer", children: "Lançamentos Manuais" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Switch,
          {
            id: "incluir-lancamentos",
            checked: filtros.incluirLancamentos,
            onCheckedChange: (checked) => handleIncluirChange("incluirLancamentos", checked)
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "incluir-agendamentos", className: "text-responsive-sm cursor-pointer", children: "Agendamentos" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Switch,
          {
            id: "incluir-agendamentos",
            checked: filtros.incluirAgendamentos,
            onCheckedChange: (checked) => handleIncluirChange("incluirAgendamentos", checked)
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "incluir-contas-fixas", className: "text-responsive-sm cursor-pointer", children: "Contas Fixas" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Switch,
          {
            id: "incluir-contas-fixas",
            checked: filtros.incluirContasFixas,
            onCheckedChange: (checked) => handleIncluirChange("incluirContasFixas", checked)
          }
        )
      ] })
    ] })
  ] });
  if (isMobile) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Sheet, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "btn-touch w-full sm:w-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Filter, { className: "mr-2 h-4 w-4" }),
        "Filtros"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetContent, { side: "bottom", className: "h-[90vh]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SheetHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTitle, { children: "Filtros do Relatório" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 overflow-y-auto h-[calc(90vh-80px)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FiltrosContent, {}) })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "animate-fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Filtros do Relatório" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(FiltrosContent, {}) })
  ] });
}

const CORES = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
  "#00ff00",
  "#ff0000",
  "#00ffff",
  "#ff00ff",
  "#ffff00",
  "#000080"
];
function GraficosAvancados({ dados }) {
  const formatarValor = (valor) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(valor);
  };
  const dadosResumo = [
    {
      categoria: "Entradas",
      valor: dados.totalEntradas,
      cor: "#10b981"
    },
    {
      categoria: "Saídas",
      valor: dados.totalSaidas,
      cor: "#ef4444"
    },
    {
      categoria: "Lucro",
      valor: dados.lucroLiquido,
      cor: dados.lucroLiquido >= 0 ? "#3b82f6" : "#ef4444"
    }
  ];
  const dadosPizzaCategorias = dados.categoriasMaisLucrativas.slice(0, 5).map((cat, index) => ({
    name: cat.categoria,
    value: Math.abs(cat.lucro),
    lucro: cat.lucro,
    percentual: cat.percentual
  }));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Resumo Financeiro" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 300, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data: dadosResumo, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "categoria" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { tickFormatter: formatarValor }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { formatter: (value) => formatarValor(Number(value)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "valor", fill: "#8884d8", children: dadosResumo.map((entry, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { fill: entry.cor }, `cell-${index}`)) })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Evolução dos Últimos 6 Meses" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 300, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AreaChart, { data: dados.evolucaoMensal, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "periodo" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { tickFormatter: formatarValor }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { formatter: (value) => formatarValor(Number(value)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Area,
          {
            type: "monotone",
            dataKey: "entradas",
            stackId: "1",
            stroke: "#10b981",
            fill: "#10b981",
            fillOpacity: 0.6,
            name: "Entradas"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Area,
          {
            type: "monotone",
            dataKey: "saidas",
            stackId: "2",
            stroke: "#ef4444",
            fill: "#ef4444",
            fillOpacity: 0.6,
            name: "Saídas"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Line,
          {
            type: "monotone",
            dataKey: "lucro",
            stroke: "#3b82f6",
            strokeWidth: 3,
            name: "Lucro"
          }
        )
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Categorias Mais Lucrativas" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 300, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Pie,
            {
              data: dadosPizzaCategorias,
              cx: "50%",
              cy: "50%",
              labelLine: false,
              label: ({ name, percentual }) => `${name}: ${percentual.toFixed(1)}%`,
              outerRadius: 80,
              fill: "#8884d8",
              dataKey: "value",
              children: dadosPizzaCategorias.map((entry, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { fill: CORES[index % CORES.length] }, `cell-${index}`))
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { formatter: (value) => formatarValor(Number(value)) })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Top 5 Serviços" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 300, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          BarChart,
          {
            data: dados.servicosMaisVendidos,
            layout: "horizontal",
            margin: { left: 50 },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { type: "number", tickFormatter: formatarValor }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { dataKey: "nome", type: "category", width: 100 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Tooltip,
                {
                  formatter: (value, name) => [
                    name === "valorTotal" ? formatarValor(Number(value)) : value,
                    name === "valorTotal" ? "Valor Total" : "Quantidade"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "valorTotal", fill: "#3b82f6", name: "Valor Total" })
            ]
          }
        ) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Detalhamento de Contas" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-4 bg-green-50 rounded-lg border border-green-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-green-600", children: formatarValor(dados.agendamentosPagos) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-green-600", children: "Agendamentos Pagos" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-4 bg-orange-50 rounded-lg border border-orange-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-orange-600", children: formatarValor(dados.agendamentosAbertos) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-orange-600", children: "Agendamentos em Aberto" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-4 bg-blue-50 rounded-lg border border-blue-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-blue-600", children: formatarValor(dados.contasFixasPagas) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-blue-600", children: "Contas Fixas Pagas" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-4 bg-red-50 rounded-lg border border-red-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-red-600", children: formatarValor(dados.contasFixasAbertas) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-red-600", children: "Contas Fixas em Aberto" })
        ] })
      ] }) })
    ] })
  ] });
}

function downloadBlob(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
function exportRelatorioJSON(relatorio) {
  const filename = `relatorio-financeiro-${relatorio.periodo.replace(/\s+/g, "_")}.json`;
  downloadBlob(JSON.stringify(relatorio, null, 2), filename, "application/json");
}
function toCSV(rows) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v) => {
    if (v == null) return "";
    const s = String(v);
    if (s.includes(",") || s.includes('"') || s.includes("\n")) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => escape(row[h])).join(","));
  }
  return lines.join("\n");
}
function exportLancamentosCSV(lancamentos, filename = "lancamentos.csv") {
  const rows = lancamentos.map((l) => ({
    id: l.id,
    tipo: l.tipo,
    valor: l.valor,
    data: new Date(l.data).toISOString().split("T")[0],
    descricao: l.descricao,
    categoria: l.categoria || "",
    origemId: l.origemId || "",
    origemTipo: l.origemTipo || "",
    clienteId: l.clienteId || "",
    created_at: new Date(l.created_at).toISOString(),
    updated_at: new Date(l.updated_at).toISOString()
  }));
  downloadBlob(toCSV(rows), filename, "text/csv;charset=utf-8");
}
function exportContasFixasCSV(contas, filename = "contas_fixas.csv") {
  const rows = contas.map((c) => ({
    id: c.id,
    nome: c.nome,
    categoria: c.categoria,
    valor: c.valor,
    vencimento: c.vencimento,
    pago: c.pago ? "sim" : "não",
    created_at: c.created_at,
    updated_at: c.updated_at
  }));
  downloadBlob(toCSV(rows), filename, "text/csv;charset=utf-8");
}
function exportAgendamentosCSV(agendamentos, filename = "agendamentos.csv") {
  const rows = agendamentos.map((a) => ({
    id: a.id,
    clienteId: a.clienteId,
    clienteNome: a.clienteNome,
    servicoId: a.servicoId,
    servicoNome: a.servicoNome,
    data: a.data,
    hora: a.hora,
    duracao: a.duracao,
    valor: a.valor,
    valorPago: a.valorPago,
    valorDevido: a.valorDevido,
    formaPagamento: a.formaPagamento,
    statusPagamento: a.statusPagamento,
    status: a.status,
    origem: a.origem || "",
    confirmado: a.confirmado ? "sim" : "não",
    createdAt: a.createdAt,
    updatedAt: a.updatedAt
  }));
  downloadBlob(toCSV(rows), filename, "text/csv;charset=utf-8");
}
function exportRelatorioCSV(relatorio) {
  exportLancamentosCSV(relatorio.dadosDetalhados.lancamentos, `lancamentos-${relatorio.periodo.replace(/\s+/g, "_")}.csv`);
  exportContasFixasCSV(relatorio.dadosDetalhados.contasFixas, `contas-fixas-${relatorio.periodo.replace(/\s+/g, "_")}.csv`);
  exportAgendamentosCSV(relatorio.dadosDetalhados.agendamentos, `agendamentos-${relatorio.periodo.replace(/\s+/g, "_")}.csv`);
}
function exportRelatorioPDF(relatorio, brand) {
  const win = window.open("", "_blank");
  if (!win) return;
  const style = `
    body { font-family: Arial, sans-serif; padding: 16px; color: #111; }
    .header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
    .logo { width: 48px; height: 48px; border-radius: 8px; object-fit: cover; border: 2px solid #d6b2e7; }
    .brand { font-size: 16px; font-weight: 700; }
    h1 { font-size: 18px; margin: 0 0 8px; }
    h2 { font-size: 14px; margin: 12px 0 6px; }
    table { width: 100%; border-collapse: collapse; margin-top: 6px; font-size: 12px; }
    th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }
    .summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; font-size: 12px; }
    .summary div { background: #f7f7f7; padding: 8px; border: 1px solid #eee; }
  `;
  const fmt = (v) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
  const html = `
    <html><head><meta charset="utf-8"/><style>${style}</style><title>Relatório Financeiro</title></head>
    <body>
      <div class="header">
        ${brand?.logoUrl ? `<img class="logo" src="${brand.logoUrl}" />` : ""}
        <div class="brand">${brand?.salonName || "Relatório Financeiro"}</div>
      </div>
      <h1>Relatório Financeiro • ${relatorio.periodo}</h1>
      <div class="summary">
        <div><strong>Entradas:</strong> ${fmt(relatorio.dadosResumo.totalEntradas)}</div>
        <div><strong>Saídas:</strong> ${fmt(relatorio.dadosResumo.totalSaidas)}</div>
        <div><strong>Lucro:</strong> ${fmt(relatorio.dadosResumo.lucroLiquido)}</div>
      </div>
      <h2>Lançamentos</h2>
      <table>
        <thead><tr><th>Tipo</th><th>Valor</th><th>Data</th><th>Descrição</th><th>Categoria</th></tr></thead>
        <tbody>
          ${relatorio.dadosDetalhados.lancamentos.map((l) => `
            <tr><td>${l.tipo}</td><td>${fmt(l.valor)}</td><td>${new Date(l.data).toLocaleDateString("pt-BR")}</td><td>${l.descricao}</td><td>${l.categoria || ""}</td></tr>
          `).join("")}
        </tbody>
      </table>
      <h2>Contas Fixas</h2>
      <table>
        <thead><tr><th>Nome</th><th>Categoria</th><th>Valor</th><th>Vencimento</th><th>Pago</th></tr></thead>
        <tbody>
          ${relatorio.dadosDetalhados.contasFixas.map((c) => `
            <tr><td>${c.nome}</td><td>${c.categoria}</td><td>${fmt(c.valor)}</td><td>${c.vencimento}</td><td>${c.pago ? "Sim" : "Não"}</td></tr>
          `).join("")}
        </tbody>
      </table>
      <h2>Agendamentos</h2>
      <table>
        <thead><tr><th>Cliente</th><th>Serviço</th><th>Data</th><th>Hora</th><th>Valor</th><th>Status</th></tr></thead>
        <tbody>
          ${relatorio.dadosDetalhados.agendamentos.map((a) => `
            <tr><td>${a.clienteNome}</td><td>${a.servicoNome}</td><td>${a.data}</td><td>${a.hora}</td><td>${fmt(a.valor)}</td><td>${a.status}</td></tr>
          `).join("")}
        </tbody>
      </table>
      <script>window.print();<\/script>
    </body></html>
  `;
  win.document.open();
  win.document.write(html);
  win.document.close();
}
function exportDespesasUsoCSV(rows, filename = "despesas_de_uso.csv") {
  const csv = toCSV(rows.map((r) => ({
    data: r.data,
    categoria: r.categoria,
    valor: r.valor,
    descricao: r.descricao
  })));
  downloadBlob(csv, filename, "text/csv;charset=utf-8");
}
function exportDespesasUsoPDF(rows, periodo, brand) {
  const win = window.open("", "_blank");
  if (!win) return;
  const style = `
    body { font-family: Arial, sans-serif; padding: 16px; color: #111; }
    .header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
    .logo { width: 48px; height: 48px; border-radius: 8px; object-fit: cover; border: 2px solid #d6b2e7; }
    .brand { font-size: 16px; font-weight: 700; }
    h1 { font-size: 18px; margin: 0 0 8px; }
    table { width: 100%; border-collapse: collapse; margin-top: 6px; font-size: 12px; }
    th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }
  `;
  const fmt = (v) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
  const html = `
    <html><head><meta charset="utf-8"/><style>${style}</style><title>Despesas de Uso</title></head>
    <body>
      <div class="header">
        ${brand?.logoUrl ? `<img class="logo" src="${brand.logoUrl}" />` : ""}
        <div class="brand">${brand?.salonName || "Despesas de Uso"}</div>
      </div>
      <h1>Despesas de Uso • ${periodo}</h1>
      <table>
        <thead><tr><th>Data</th><th>Categoria</th><th>Valor</th><th>Descrição</th></tr></thead>
        <tbody>
          ${rows.map((r) => `<tr><td>${r.data}</td><td>${r.categoria}</td><td>${fmt(r.valor)}</td><td>${r.descricao}</td></tr>`).join("")}
        </tbody>
      </table>
      <script>window.print();<\/script>
    </body></html>
  `;
  win.document.open();
  win.document.write(html);
  win.document.close();
}
function exportVendasPorProdutoCSV(rows, filename = "vendas_por_produto.csv") {
  const csv = toCSV(rows.map((r) => ({
    produto: r.produto,
    quantidade: r.quantidade,
    valor_total: r.valor_total
  })));
  downloadBlob(csv, filename, "text/csv;charset=utf-8");
}
function exportVendasPorProdutoPDF(rows, periodo, brand) {
  const win = window.open("", "_blank");
  if (!win) return;
  const style = `
    body { font-family: Arial, sans-serif; padding: 16px; color: #111; }
    .header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
    .logo { width: 48px; height: 48px; border-radius: 8px; object-fit: cover; border: 2px solid #d6b2e7; }
    .brand { font-size: 16px; font-weight: 700; }
    h1 { font-size: 18px; margin: 0 0 8px; }
    table { width: 100%; border-collapse: collapse; margin-top: 6px; font-size: 12px; }
    th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }
  `;
  const fmt = (v) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
  const html = `
    <html><head><meta charset="utf-8"/><style>${style}</style><title>Vendas por Produto</title></head>
    <body>
      <div class="header">
        ${brand?.logoUrl ? `<img class="logo" src="${brand.logoUrl}" />` : ""}
        <div class="brand">${brand?.salonName || "Vendas por Produto"}</div>
      </div>
      <h1>Vendas por Produto • ${periodo}</h1>
      <table>
        <thead><tr><th>Produto</th><th>Quantidade</th><th>Total</th></tr></thead>
        <tbody>
          ${rows.map((r) => `<tr><td>${r.produto}</td><td>${r.quantidade}</td><td>${fmt(r.valor_total)}</td></tr>`).join("")}
        </tbody>
      </table>
      <script>window.print();<\/script>
    </body></html>
  `;
  win.document.open();
  win.document.write(html);
  win.document.close();
}
function exportMovimentacoesEstoqueCSV(rows, filename = "movimentacoes_produtos.csv") {
  const csv = toCSV(rows.map((r) => ({
    id: r.id,
    tipo: r.tipo,
    data: r.data,
    valor: r.valor,
    descricao: r.descricao,
    status: r.status || "",
    itens: r.itens || 0
  })));
  downloadBlob(csv, filename, "text/csv;charset=utf-8");
}
function exportMovimentacoesEstoquePDF(rows, periodo, brand) {
  const win = window.open("", "_blank");
  if (!win) return;
  const style = `
    body { font-family: Arial, sans-serif; padding: 16px; color: #111; }
    .header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
    .logo { width: 48px; height: 48px; border-radius: 8px; object-fit: cover; border: 2px solid #d6b2e7; }
    .brand { font-size: 16px; font-weight: 700; }
    h1 { font-size: 18px; margin: 0 0 8px; }
    table { width: 100%; border-collapse: collapse; margin-top: 6px; font-size: 12px; }
    th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }
  `;
  const fmt = (v) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
  const html = `
    <html><head><meta charset="utf-8"/><style>${style}</style><title>Movimentações de Produtos</title></head>
    <body>
      <div class="header">
        ${""}
        <div class="brand">${"Movimentações de Produtos"}</div>
      </div>
      <h1>Movimentações de Produtos${""}</h1>
      <table>
        <thead><tr><th>Tipo</th><th>Data</th><th>Valor</th><th>Descrição</th><th>Status</th><th>Itens</th></tr></thead>
        <tbody>
          ${rows.map((r) => `<tr><td>${r.tipo}</td><td>${r.data}</td><td>${fmt(r.valor)}</td><td>${r.descricao}</td><td>${r.status || ""}</td><td>${r.itens || 0}</td></tr>`).join("")}
        </tbody>
      </table>
      <script>window.print();<\/script>
    </body></html>
  `;
  win.document.open();
  win.document.write(html);
  win.document.close();
}

function TabelaDetalhada({ dados, dadosDetalhados }) {
  const [paginaLancamentos, setPaginaLancamentos] = reactExports.useState(1);
  const [paginaContas, setPaginaContas] = reactExports.useState(1);
  const [paginaAgendamentos, setPaginaAgendamentos] = reactExports.useState(1);
  const itensPorPagina = 10;
  const formatarValor = (valor) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(valor);
  };
  const formatarData = (data) => {
    return format(new Date(data), "dd/MM/yyyy", { locale: ptBR });
  };
  const getStatusBadge = (status) => {
    const statusMap = {
      "pago": { variant: "default", label: "Pago" },
      "em_aberto": { variant: "destructive", label: "Em Aberto" },
      "pendente": { variant: "outline", label: "Pendente" },
      "agendado": { variant: "secondary", label: "Agendado" },
      "concluido": { variant: "default", label: "Concluído" },
      "cancelado": { variant: "destructive", label: "Cancelado" }
    };
    const config = statusMap[status] || { variant: "outline", label: status };
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: config.variant, children: config.label });
  };
  const exportarPDF = () => {
    exportRelatorioPDF({
      periodo: "Detalhado",
      dadosResumo: dados,
      dadosDetalhados});
  };
  const exportarExcel = () => {
    exportLancamentosCSV(dadosDetalhados.lancamentos, "lancamentos.csv");
    exportContasFixasCSV(dadosDetalhados.contasFixas, "contas_fixas.csv");
    exportAgendamentosCSV(dadosDetalhados.agendamentos, "agendamentos.csv");
  };
  const lancamentosPaginados = dadosDetalhados.lancamentos.slice(
    (paginaLancamentos - 1) * itensPorPagina,
    paginaLancamentos * itensPorPagina
  );
  const contasPaginadas = dadosDetalhados.contasFixas.slice(
    (paginaContas - 1) * itensPorPagina,
    paginaContas * itensPorPagina
  );
  const agendamentosPaginados = dadosDetalhados.agendamentos.slice(
    (paginaAgendamentos - 1) * itensPorPagina,
    paginaAgendamentos * itensPorPagina
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Análise por Categorias" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: exportarPDF, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4 mr-2" }),
            "PDF"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: exportarExcel, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4 mr-2" }),
            "Excel"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Categoria" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Entradas" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Saídas" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Lucro" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Participação" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: dados.categoriasMaisLucrativas.map((categoria, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: categoria.categoria }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right text-green-600", children: formatarValor(categoria.entradas) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right text-red-600", children: formatarValor(categoria.saidas) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: `text-right ${categoria.lucro >= 0 ? "text-green-600" : "text-red-600"}`, children: formatarValor(categoria.lucro) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "text-right", children: [
            categoria.percentual.toFixed(1),
            "%"
          ] })
        ] }, index)) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Serviços Mais Vendidos" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Serviço" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Quantidade" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Valor Total" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Participação" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: dados.servicosMaisVendidos.map((servico, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: servico.nome }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: servico.quantidade }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right text-green-600", children: formatarValor(servico.valorTotal) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "text-right", children: [
            servico.percentual.toFixed(1),
            "%"
          ] })
        ] }, index)) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Dados Detalhados" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "lancamentos", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-full grid-cols-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "lancamentos", children: [
            "Lançamentos (",
            dadosDetalhados.lancamentos.length,
            ")"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "agendamentos", children: [
            "Agendamentos (",
            dadosDetalhados.agendamentos.length,
            ")"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "contas", children: [
            "Contas Fixas (",
            dadosDetalhados.contasFixas.length,
            ")"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "lancamentos", className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Data" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Descrição" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Categoria" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Tipo" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Valor" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: lancamentosPaginados.map((lancamento) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: formatarData(lancamento.data) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: lancamento.descricao }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: lancamento.categoria || "Sem categoria" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: lancamento.tipo === "entrada" ? "default" : "destructive", children: lancamento.tipo === "entrada" ? "Entrada" : "Saída" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: `text-right ${lancamento.tipo === "entrada" ? "text-green-600" : "text-red-600"}`, children: formatarValor(lancamento.valor) })
          ] }, lancamento.id)) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "agendamentos", className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Data" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Cliente" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Pagamento" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Valor" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Pago" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: agendamentosPaginados.map((agendamento) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: formatarData(agendamento.data) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: "Cliente" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: getStatusBadge(agendamento.status || "agendado") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: getStatusBadge(agendamento.statusPagamento || "em_aberto") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: formatarValor(agendamento.valor) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right text-green-600", children: formatarValor(agendamento.valorPago || 0) })
          ] }, agendamento.id)) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "contas", className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Nome" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Categoria" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Vencimento" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Valor" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: contasPaginadas.map((conta) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium", children: conta.nome }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: conta.categoria }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: conta.proximoVencimento ? formatarData(conta.proximoVencimento) : "-" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: getStatusBadge(conta.status) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right text-red-600", children: formatarValor(conta.valor) })
          ] }, conta.id)) })
        ] }) })
      ] }) })
    ] })
  ] });
}

function RelatoriosAvancados() {
  const { lancamentos } = useLancamentos();
  const { contasFixas } = useContasFixas();
  const { agendamentos } = useAgendamentos();
  const {
    filtros,
    setFiltros,
    dadosRelatorio,
    intervaloData,
    dadosFiltrados
  } = useRelatoriosFinanceiros(lancamentos, contasFixas, agendamentos);
  const { config: configOnline } = useConfigAgendamentoOnline();
  const brand = { salonName: configOnline?.nome_salao, logoUrl: configOnline?.logo_url || void 0 };
  const [usoTotals, setUsoTotals] = reactExports.useState({ prof: 0, pessoal: 0 });
  reactExports.useEffect(() => {
    const loadUsoTotals = async () => {
      const inicioISO = new Date(intervaloData.inicio.getTime()).toISOString().slice(0, 10);
      const fimISO = new Date(intervaloData.fim.getTime()).toISOString().slice(0, 10);
      const { data } = await supabase.from("lancamentos").select("categoria, valor").gte("data", inicioISO).lte("data", fimISO).in("categoria", ["Uso Profissional", "Uso Pessoal"]);
      const prof = (data || []).filter((l) => l.categoria === "Uso Profissional").reduce((s, l) => s + Number(l.valor || 0), 0);
      const pessoal = (data || []).filter((l) => l.categoria === "Uso Pessoal").reduce((s, l) => s + Number(l.valor || 0), 0);
      setUsoTotals({ prof, pessoal });
    };
    loadUsoTotals();
  }, [intervaloData]);
  const formatarValor = (valor) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(valor);
  };
  const formatarPeriodo = () => {
    const inicio = format(intervaloData.inicio, "dd/MM/yyyy", { locale: ptBR });
    const fim = format(intervaloData.fim, "dd/MM/yyyy", { locale: ptBR });
    return `${inicio} a ${fim}`;
  };
  const exportarRelatorioCompleto = () => {
    const relatorio = {
      titulo: "Relatório Financeiro",
      periodo: formatarPeriodo(),
      dadosResumo: dadosRelatorio,
      dadosDetalhados: {
        lancamentos: dadosFiltrados.lancamentos,
        contasFixas: dadosFiltrados.contasFixas,
        agendamentos: dadosFiltrados.agendamentos
      },
      geradoEm: /* @__PURE__ */ new Date()
    };
    exportRelatorioJSON(relatorio);
    exportRelatorioCSV(relatorio);
    exportRelatorioPDF(relatorio, brand);
  };
  const exportarVendasPorProduto = async () => {
    const inicioISO = new Date(intervaloData.inicio.getTime()).toISOString().slice(0, 10);
    const fimISO = new Date(intervaloData.fim.getTime()).toISOString().slice(0, 10);
    const { data: vendas } = await supabase.from("vendas_produtos").select("id, valor_total, data_venda").gte("data_venda", inicioISO).lte("data_venda", fimISO);
    const ids = (vendas || []).map((v) => v.id);
    let itens = [];
    if (ids.length > 0) {
      const { data: itensData } = await supabase.from("itens_venda").select("venda_id, produto_id, quantidade, valor_total").in("venda_id", ids);
      itens = itensData || [];
    }
    const produtoIds = [...new Set(itens.map((i) => i.produto_id))];
    let produtos = [];
    if (produtoIds.length > 0) {
      const { data: prods } = await supabase.from("produtos").select("id,nome").in("id", produtoIds);
      produtos = prods || [];
    }
    const nomeMap = {};
    produtos.forEach((p) => {
      nomeMap[p.id] = p.nome;
    });
    const agregados = {};
    itens.forEach((i) => {
      const nome = nomeMap[i.produto_id] || "Produto";
      if (!agregados[i.produto_id]) {
        agregados[i.produto_id] = { produto: nome, quantidade: 0, valor_total: 0 };
      }
      agregados[i.produto_id].quantidade += Number(i.quantidade || 0);
      agregados[i.produto_id].valor_total += Number(i.valor_total || 0);
    });
    const rows = Object.values(agregados).sort((a, b) => b.valor_total - a.valor_total);
    exportVendasPorProdutoCSV(rows, `vendas-por-produto-${formatarPeriodo().replace(/\s+/g, "_")}.csv`);
    exportVendasPorProdutoPDF(rows, formatarPeriodo(), brand);
  };
  const exportarDespesasDeUso = async () => {
    const inicioISO = new Date(intervaloData.inicio.getTime()).toISOString().slice(0, 10);
    const fimISO = new Date(intervaloData.fim.getTime()).toISOString().slice(0, 10);
    const { data } = await supabase.from("lancamentos").select("data, categoria, valor, descricao").gte("data", inicioISO).lte("data", fimISO).in("categoria", ["Uso Profissional", "Uso Pessoal"]);
    const rows = (data || []).map((l) => ({
      data: new Date(l.data).toLocaleDateString("pt-BR"),
      categoria: l.categoria,
      valor: Number(l.valor),
      descricao: l.descricao
    }));
    exportDespesasUsoCSV(rows, `despesas-uso-${formatarPeriodo().replace(/\s+/g, "_")}.csv`);
    exportDespesasUsoPDF(rows, formatarPeriodo(), brand);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold tracking-tight", children: "Relatórios Financeiros" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground", children: [
          "Análise detalhada do período: ",
          formatarPeriodo()
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: exportarRelatorioCompleto, className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" }),
        "Exportar Relatório Completo"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: exportarVendasPorProduto, variant: "outline", className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" }),
        "Exportar Vendas por Produto"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: exportarDespesasDeUso, variant: "outline", className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" }),
        "Exportar Despesas de Uso"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-center gap-4 p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-xl bg-success", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-6 w-6 text-success-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-success", children: formatarValor(dadosRelatorio.totalEntradas) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Total de Entradas" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-center gap-4 p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-xl bg-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "h-6 w-6 text-destructive-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-destructive", children: formatarValor(dadosRelatorio.totalSaidas) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Total de Saídas" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-center gap-4 p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex h-12 w-12 items-center justify-center rounded-xl ${dadosRelatorio.lucroLiquido >= 0 ? "bg-info" : "bg-destructive"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-6 w-6 text-primary-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-2xl font-bold ${dadosRelatorio.lucroLiquido >= 0 ? "text-info" : "text-destructive"}`, children: formatarValor(dadosRelatorio.lucroLiquido) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: dadosRelatorio.lucroLiquido >= 0 ? "Lucro Líquido" : "Prejuízo" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-center gap-4 p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-xl bg-warning", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-6 w-6 text-warning-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-warning", children: formatarValor(dadosRelatorio.contasAPagar) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Contas a Pagar" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-center gap-4 p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-xl bg-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-6 w-6 text-primary-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-primary", children: formatarValor(usoTotals.prof) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Uso Profissional" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-center gap-4 p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-xl bg-secondary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-6 w-6 text-secondary-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-secondary", children: formatarValor(usoTotals.pessoal) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Uso Pessoal" })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Indicadores de Performance" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-4 bg-muted/50 rounded-lg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-lg font-semibold", children: [
            dadosRelatorio.lucroLiquido > 0 ? (dadosRelatorio.lucroLiquido / dadosRelatorio.totalEntradas * 100).toFixed(1) : "0.0",
            "%"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Margem de Lucro" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-4 bg-muted/50 rounded-lg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-semibold", children: dadosRelatorio.servicosMaisVendidos.length }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Serviços Ativos" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-4 bg-muted/50 rounded-lg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-semibold", children: formatarValor(dadosRelatorio.agendamentosAbertos) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Pendente Recebimento" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-4 bg-muted/50 rounded-lg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-semibold", children: dadosRelatorio.categoriasMaisLucrativas.length }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Categorias Ativas" })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "visao-geral", className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-full grid-cols-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "visao-geral", children: "Visão Geral" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "graficos", children: "Gráficos" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "detalhado", children: "Dados Detalhados" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "visao-geral", className: "space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          FiltrosRelatorio,
          {
            filtros,
            onFiltrosChange: setFiltros
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Top 5 Categorias Mais Lucrativas" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: dadosRelatorio.categoriasMaisLucrativas.slice(0, 5).map((categoria, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 bg-muted/30 rounded-lg", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-3 h-3 rounded-full bg-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: categoria.categoria })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `font-semibold ${categoria.lucro >= 0 ? "text-success" : "text-destructive"}`, children: formatarValor(categoria.lucro) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
                  categoria.percentual.toFixed(1),
                  "% do total"
                ] })
              ] })
            ] }, index)) }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Top 5 Serviços Mais Vendidos" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: dadosRelatorio.servicosMaisVendidos.slice(0, 5).map((servico, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 bg-muted/30 rounded-lg", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", children: [
                  servico.quantidade,
                  "x"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: servico.nome })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-success", children: formatarValor(servico.valorTotal) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
                  servico.percentual.toFixed(1),
                  "% do faturamento"
                ] })
              ] })
            ] }, index)) }) })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "graficos", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GraficosAvancados, { dados: dadosRelatorio }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "detalhado", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        TabelaDetalhada,
        {
          dados: dadosRelatorio,
          dadosDetalhados: dadosFiltrados
        }
      ) })
    ] })
  ] });
}

function AvisosVencimento({ contasFixas, onPagarConta }) {
  const getContasVencendo = () => {
    const hoje = /* @__PURE__ */ new Date();
    const proximosSeteDias = /* @__PURE__ */ new Date();
    proximosSeteDias.setDate(hoje.getDate() + 7);
    const mesAtual = hoje.getMonth() + 1;
    const anoAtual = hoje.getFullYear();
    return contasFixas.filter((conta) => {
      if (conta.status === "pago") return false;
      const dataVencimento = new Date(anoAtual, mesAtual - 1, conta.dataVencimento);
      if (dataVencimento < hoje) {
        dataVencimento.setMonth(dataVencimento.getMonth() + 1);
      }
      return dataVencimento <= proximosSeteDias;
    }).map((conta) => {
      const dataVencimento = new Date(anoAtual, mesAtual - 1, conta.dataVencimento);
      if (dataVencimento < hoje) {
        dataVencimento.setMonth(dataVencimento.getMonth() + 1);
      }
      const diasParaVencimento = Math.ceil((dataVencimento.getTime() - hoje.getTime()) / (1e3 * 60 * 60 * 24));
      return {
        ...conta,
        dataVencimento,
        diasParaVencimento,
        situacao: diasParaVencimento < 0 ? "vencido" : diasParaVencimento === 0 ? "venceHoje" : diasParaVencimento <= 3 ? "venceEmBreve" : "normal"
      };
    }).sort((a, b) => a.diasParaVencimento - b.diasParaVencimento);
  };
  const contasVencendo = getContasVencendo();
  const contasVencidas = contasVencendo.filter((c) => c.situacao === "vencido");
  const contasVenceHoje = contasVencendo.filter((c) => c.situacao === "venceHoje");
  const contasVenceEmBreve = contasVencendo.filter((c) => c.situacao === "venceEmBreve");
  reactExports.useEffect(() => {
    if (contasVencidas.length > 0 || contasVenceHoje.length > 0) {
      if (Notification.permission === "granted") {
        new Notification("Atenção: Contas Vencendo!", {
          body: `Você tem ${contasVencidas.length + contasVenceHoje.length} conta(s) que requer(em) atenção imediata.`,
          icon: "/icons/icon-192x192.png"
        });
      }
      try {
        const filename = "Mensagem de Texto 1.mp3";
        const audio = new Audio(`/sounds/${encodeURIComponent(filename)}`);
        audio.volume = 0.3;
        audio.play().catch(() => {
        });
      } catch (error) {
      }
    }
  }, [contasVencidas.length, contasVenceHoje.length]);
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(value);
  };
  const formatDate = (date) => {
    return date.toLocaleDateString("pt-BR");
  };
  const getSituacaoColor = (situacao) => {
    switch (situacao) {
      case "vencido":
        return "bg-destructive/10 text-destructive";
      case "venceHoje":
        return "bg-warning/10 text-warning";
      case "venceEmBreve":
        return "bg-warning/10 text-warning";
      default:
        return "bg-info/10 text-info";
    }
  };
  const getSituacaoTexto = (conta) => {
    switch (conta.situacao) {
      case "vencido":
        return `Venceu há ${Math.abs(conta.diasParaVencimento)} dia(s)`;
      case "venceHoje":
        return "Vence hoje";
      case "venceEmBreve":
        return `Vence em ${conta.diasParaVencimento} dia(s)`;
      default:
        return `Vence em ${conta.diasParaVencimento} dia(s)`;
    }
  };
  if (contasVencendo.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-success", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-5 w-5" }),
        "Avisos de Vencimento"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-12 w-12 text-success mx-auto mb-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-success font-medium", children: "Parabéns!" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Não há contas vencendo nos próximos 7 dias." })
      ] }) })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    (contasVencidas.length > 0 || contasVenceHoje.length > 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { className: "border-destructive/20 bg-destructive/10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-destructive" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDescription, { className: "text-destructive", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Atenção:" }),
        " Você tem ",
        contasVencidas.length + contasVenceHoje.length,
        " conta(s) que requer(em) pagamento imediato!"
      ] })
    ] }),
    contasVenceEmBreve.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { className: "border-warning/20 bg-warning/10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-4 w-4 text-warning" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDescription, { className: "text-warning", children: [
        "Você tem ",
        contasVenceEmBreve.length,
        " conta(s) vencendo nos próximos dias."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border/50 bg-card/50 backdrop-blur-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "p-4 pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-base sm:text-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-5 w-5" }),
        "Contas Vencendo"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: contasVencendo.map((conta) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 p-3 border border-border/50 rounded-lg bg-background/50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-medium truncate", children: conta.nome }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: conta.categoria || "Sem categoria" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: `flex-shrink-0 ${getSituacaoColor(conta.situacao)}`, children: getSituacaoTexto(conta) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between text-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3.5 w-3.5" }),
            formatDate(conta.dataVencimento)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 font-medium text-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-3.5 w-3.5" }),
            formatCurrency(conta.valor)
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: () => onPagarConta(conta.id),
            className: `w-full h-9 text-xs sm:text-sm btn-touch ${conta.situacao === "vencido" || conta.situacao === "venceHoje" ? "bg-destructive hover:bg-destructive/90" : "bg-success hover:bg-success/90"}`,
            children: "Pagar Agora"
          }
        )
      ] }, conta.id)) }) })
    ] })
  ] });
}

function MovimentacoesProdutos() {
  useBreakpoint();
  const { compras, loading: loadingCompras } = useSupabaseCompras();
  const { vendas, loading: loadingVendas } = useSupabaseVendas();
  const [filtroTipo, setFiltroTipo] = reactExports.useState("todos");
  const [busca, setBusca] = reactExports.useState("");
  const movimentacoes = reactExports.useMemo(() => {
    const movs = [];
    compras.forEach((compra) => {
      movs.push({
        id: compra.id,
        tipo: "compra",
        data: compra.data_compra,
        valor: compra.valor_total,
        descricao: `Compra ${compra.numero_nota ? `- Nota ${compra.numero_nota}` : ""}`,
        status: compra.status_pagamento || "pendente",
        itens: compra.itens_compra?.length || 0
      });
    });
    vendas.forEach((venda) => {
      movs.push({
        id: venda.id,
        tipo: "venda",
        data: venda.data_venda,
        valor: venda.valor_total,
        descricao: "Venda de produtos",
        status: venda.status_pagamento || "pago",
        itens: venda.itens_venda?.length || 0
      });
    });
    return movs.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  }, [compras, vendas]);
  const movimentacoesFiltradas = reactExports.useMemo(() => {
    return movimentacoes.filter((mov) => {
      const matchTipo = filtroTipo === "todos" || mov.tipo === filtroTipo;
      const matchBusca = mov.descricao.toLowerCase().includes(busca.toLowerCase());
      return matchTipo && matchBusca;
    });
  }, [movimentacoes, filtroTipo, busca]);
  const totais = reactExports.useMemo(() => {
    const totalCompras = movimentacoes.filter((m) => m.tipo === "compra").reduce((sum, m) => sum + m.valor, 0);
    const totalVendas = movimentacoes.filter((m) => m.tipo === "venda").reduce((sum, m) => sum + m.valor, 0);
    return {
      compras: totalCompras,
      vendas: totalVendas,
      lucro: totalVendas - totalCompras
    };
  }, [movimentacoes]);
  const formatarValor = (valor) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(valor);
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "pago":
        return "bg-success text-success-foreground";
      case "pendente":
        return "bg-warning text-warning-foreground";
      case "pago_parcial":
        return "bg-primary text-primary-foreground";
      case "vencido":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };
  const getStatusLabel = (status) => {
    switch (status) {
      case "pago":
        return "Pago";
      case "pendente":
        return "Pendente";
      case "pago_parcial":
        return "Parcial";
      case "vencido":
        return "Vencido";
      default:
        return status;
    }
  };
  if (loadingCompras || loadingVendas) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center p-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-responsive-lg", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid-responsive-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border/50 bg-card/50 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-center gap-4 p-responsive-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-xl bg-destructive flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "h-6 w-6 text-destructive-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-responsive-lg font-bold text-destructive truncate", children: formatarValor(totais.compras) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-responsive-sm text-muted-foreground", children: "Total em Compras" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border/50 bg-card/50 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-center gap-4 p-responsive-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-xl bg-success flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-6 w-6 text-success-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-responsive-lg font-bold text-success truncate", children: formatarValor(totais.vendas) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-responsive-sm text-muted-foreground", children: "Total em Vendas" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border/50 bg-card/50 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-center gap-4 p-responsive-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex h-12 w-12 items-center justify-center rounded-xl flex-shrink-0 ${totais.lucro >= 0 ? "bg-primary" : "bg-destructive"}`, children: totais.lucro >= 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-6 w-6 text-primary-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "h-6 w-6 text-destructive-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-responsive-lg font-bold truncate ${totais.lucro >= 0 ? "text-primary" : "text-destructive"}`, children: formatarValor(totais.lucro) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-responsive-sm text-muted-foreground", children: "Margem de Lucro" })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border/50 bg-card/50 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-responsive-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-responsive flex-responsive-row-sm gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "Buscar movimentação...",
            value: busca,
            onChange: (e) => setBusca(e.target.value),
            className: "pl-10 h-12"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: filtroTipo, onValueChange: (v) => setFiltroTipo(v), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectTrigger, { className: "w-full sm:w-[200px] h-12", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Filter, { className: "mr-2 h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "todos", children: "Todos" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "compra", children: "Compras" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "venda", children: "Vendas" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          className: "h-12 gap-2",
          onClick: () => exportMovimentacoesEstoqueCSV(movimentacoesFiltradas),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" }),
            " CSV"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          className: "h-12 gap-2",
          onClick: () => exportMovimentacoesEstoquePDF(movimentacoesFiltradas),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" }),
            " PDF"
          ]
        }
      )
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-responsive-md", children: movimentacoesFiltradas.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border/50 bg-card/50 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-responsive-lg text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Nenhuma movimentação encontrada" }) }) }) : movimentacoesFiltradas.map((mov) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-md transition-shadow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-responsive-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-start justify-between gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4 min-w-0 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex h-12 w-12 items-center justify-center rounded-xl flex-shrink-0 ${mov.tipo === "compra" ? "bg-destructive" : "bg-success"}`, children: mov.tipo === "compra" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "h-5 w-5 text-destructive-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-5 w-5 text-success-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1 space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground truncate", children: mov.descricao }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: format(new Date(mov.data), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: `font-bold text-lg whitespace-nowrap ${mov.tipo === "compra" ? "text-destructive" : "text-success"}`, children: [
            mov.tipo === "compra" ? "- " : "+ ",
            formatarValor(mov.valor)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "capitalize", children: mov.tipo === "compra" ? "Compra" : "Venda" }),
          mov.status && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: getStatusColor(mov.status), children: getStatusLabel(mov.status) }),
          mov.itens && mov.itens > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", children: [
            mov.itens,
            " ",
            mov.itens === 1 ? "item" : "itens"
          ] })
        ] })
      ] })
    ] }) }) }) }, mov.id)) })
  ] });
}

function Financeiro() {
  const { isMobile } = useBreakpoint();
  const [viewMode, setViewMode] = reactExports.useState("list");
  const [formType, setFormType] = reactExports.useState("lancamento");
  const [activeTab, setActiveTab] = reactExports.useState("lancamentos");
  const [lancamentoEditando, setLancamentoEditando] = reactExports.useState();
  const [contaEditando, setContaEditando] = reactExports.useState();
  const {
    lancamentos,
    resumoFinanceiro,
    categorias,
    filtros,
    setFiltros,
    adicionarLancamento,
    atualizarLancamento,
    removerLancamento
  } = useLancamentos();
  useSupabaseAgendamentos();
  const { todosAgendamentos: agendamentosEnriquecidos } = useAgendamentos();
  const agendamentos = reactExports.useMemo(() => agendamentosEnriquecidos || [], [agendamentosEnriquecidos]);
  const {
    contasFixas,
    categorias: categoriasContasFixas,
    criarContaFixa,
    atualizarContaFixa,
    removerContaFixa,
    pagarContaFixa,
    toggleAtiva,
    criarCategoria} = useContasFixas();
  const counts = reactExports.useMemo(() => {
    const hoje = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    return {
      lancamentosHoje: (lancamentos || []).filter((l) => {
        try {
          const dataStr = l.data instanceof Date ? l.data.toISOString().split("T")[0] : String(l.data).split("T")[0];
          return dataStr === hoje;
        } catch {
          return false;
        }
      }).length,
      contasPendentes: (contasFixas || []).filter((c) => c.status === "em_aberto" && c.ativa).length,
      contasVencidas: (contasFixas || []).filter((c) => {
        if (!c.ativa || c.status === "pago") return false;
        try {
          const venc = c.proximoVencimento ? new Date(c.proximoVencimento) : null;
          return venc && venc < /* @__PURE__ */ new Date();
        } catch {
          return false;
        }
      }).length,
      receberPendentes: (agendamentos || []).filter((a) => a.statusPagamento === "em_aberto" || a.statusPagamento === "parcial").length
    };
  }, [lancamentos, contasFixas, agendamentos]);
  const handleNovoLancamento = () => {
    setLancamentoEditando(void 0);
    setFormType("lancamento");
    setViewMode("form");
  };
  const handleNovaContaFixa = () => {
    setContaEditando(void 0);
    setFormType("conta_fixa");
    setViewMode("form");
  };
  const handleEditarLancamento = (lancamento) => {
    setLancamentoEditando(lancamento);
    setViewMode("form");
  };
  const handleSubmitLancamento = async (data) => {
    let sucesso = false;
    if (lancamentoEditando) {
      sucesso = await atualizarLancamento(lancamentoEditando.id, data);
    } else {
      sucesso = await adicionarLancamento(data);
    }
    if (sucesso) {
      setViewMode("list");
      setLancamentoEditando(void 0);
    }
    return sucesso;
  };
  const handleSubmitContaFixa = async (data) => {
    if (contaEditando) {
      await atualizarContaFixa(contaEditando.id, data);
    } else {
      await criarContaFixa(data);
    }
    setViewMode("list");
    setContaEditando(void 0);
  };
  const handleCancelarForm = () => {
    setViewMode("list");
    setLancamentoEditando(void 0);
    setContaEditando(void 0);
  };
  if (viewMode === "form") {
    if (formType === "lancamento") {
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        LancamentoForm,
        {
          lancamento: lancamentoEditando,
          categorias: categorias.map((c) => c.nome),
          onSubmit: handleSubmitLancamento,
          onCancel: handleCancelarForm
        }
      ) });
    } else {
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        ContaFixaForm,
        {
          conta: contaEditando,
          categorias: categoriasContasFixas,
          onSubmit: handleSubmitContaFixa,
          onCancel: handleCancelarForm,
          onCreateCategoria: async (nome, cor) => {
            await criarCategoria({ nome, tipo: "despesa", cor });
          }
        }
      ) });
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 sm:space-y-8 p-3 sm:p-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden sm:flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl sm:text-3xl font-bold text-foreground", children: "Financeiro" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs sm:text-base text-muted-foreground mt-1", children: "Controle completo das finanças do seu salão" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AvisosVencimento,
      {
        contasFixas,
        onPagarConta: (contaId) => pagarContaFixa(contaId)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ResumoFinanceiro, { resumo: resumoFinanceiro }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, className: "space-y-4 sm:space-y-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(ScrollArea, { className: "w-full whitespace-nowrap pb-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "inline-flex h-auto w-max min-w-full md:w-full md:grid md:grid-cols-7 gap-1 p-1.5 bg-muted/50 backdrop-blur-sm rounded-xl border border-border/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TabsTrigger,
            {
              value: "lancamentos",
              className: cn(
                "relative text-xs sm:text-sm min-h-[44px] px-3 sm:px-4 flex items-center gap-2 rounded-lg transition-all duration-200",
                "data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md"
              ),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { className: "h-3.5 w-3.5 sm:h-4 sm:w-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Lançamentos" }),
                counts.lancamentosHoje > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "ml-1 h-5 min-w-[20px] px-1 bg-primary/10 text-primary border-none text-[10px] animate-in zoom-in duration-300", children: counts.lancamentosHoje })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TabsTrigger,
            {
              value: "contas-fixas",
              className: cn(
                "relative text-xs sm:text-sm min-h-[44px] px-3 sm:px-4 flex items-center gap-2 rounded-lg transition-all duration-200",
                "data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md"
              ),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3.5 w-3.5 sm:h-4 sm:w-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Contas Fixas" }),
                counts.contasPendentes > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "destructive",
                    className: cn(
                      "ml-1 h-5 min-w-[20px] px-1 border-none text-[10px] animate-pulse",
                      counts.contasVencidas > 0 ? "bg-destructive text-destructive-foreground" : "bg-orange-500 text-white"
                    ),
                    children: counts.contasPendentes
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TabsTrigger,
            {
              value: "produtos",
              className: cn(
                "relative text-xs sm:text-sm min-h-[44px] px-3 sm:px-4 flex items-center gap-2 rounded-lg transition-all duration-200",
                "data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md"
              ),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-3.5 w-3.5 sm:h-4 sm:w-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Produtos" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TabsTrigger,
            {
              value: "contas-receber",
              className: cn(
                "relative text-xs sm:text-sm min-h-[44px] px-3 sm:px-4 flex items-center gap-2 rounded-lg transition-all duration-200",
                "data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md"
              ),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3.5 w-3.5 sm:h-4 sm:w-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "A Receber" }),
                counts.receberPendentes > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "ml-1 h-5 min-w-[20px] px-1 bg-green-500/10 text-green-600 border-none text-[10px]", children: counts.receberPendentes })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TabsTrigger,
            {
              value: "pagamentos",
              className: cn(
                "relative text-xs sm:text-sm min-h-[44px] px-3 sm:px-4 flex items-center gap-2 rounded-lg transition-all duration-200",
                "data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md"
              ),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeDollarSign, { className: "h-3.5 w-3.5 sm:h-4 sm:w-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Pagamentos" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TabsTrigger,
            {
              value: "graficos",
              className: cn(
                "relative text-xs sm:text-sm min-h-[44px] px-3 sm:px-4 flex items-center gap-2 rounded-lg transition-all duration-200",
                "data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md"
              ),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-3.5 w-3.5 sm:h-4 sm:w-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Gráficos" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TabsTrigger,
            {
              value: "relatorios",
              className: cn(
                "relative text-xs sm:text-sm min-h-[44px] px-3 sm:px-4 flex items-center gap-2 rounded-lg transition-all duration-200",
                "data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md"
              ),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-3.5 w-3.5 sm:h-4 sm:w-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Relatórios" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollBar, { orientation: "horizontal", className: "md:hidden" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "lancamentos", className: "space-y-4 animate-fade-in", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg sm:text-xl font-semibold", children: "Lançamentos Financeiros" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: handleNovoLancamento,
              className: "bg-gradient-to-r from-primary to-lilac-primary shadow-sm hover:shadow-md transition-all h-9 sm:h-10 text-xs sm:text-sm btn-touch",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Novo Lançamento" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sm:hidden", children: "Novo" })
              ]
            }
          )
        ] }),
        isMobile ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          LancamentosListMobile,
          {
            lancamentos,
            onEdit: handleEditarLancamento,
            onDelete: removerLancamento
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          LancamentosList,
          {
            lancamentos,
            filtros,
            categorias: categorias.map((c) => c.nome),
            onFiltrosChange: setFiltros,
            onEdit: handleEditarLancamento,
            onDelete: removerLancamento
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "contas-fixas", className: "space-responsive-lg animate-fade-in", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-responsive flex-responsive-row-sm items-start justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-responsive-xl font-semibold", children: "Contas Fixas Mensais" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: handleNovaContaFixa,
              className: "bg-gradient-to-r from-primary to-lilac-primary btn-touch flex-shrink-0 hover-scale",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Nova Conta Fixa" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sm:hidden", children: "Nova" })
              ]
            }
          )
        ] }),
        isMobile ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          ContasFixasListMobile,
          {
            contas: contasFixas,
            onEdit: (conta) => {
              setContaEditando(conta);
              setFormType("conta_fixa");
              setViewMode("form");
            },
            onDelete: removerContaFixa,
            onPagar: pagarContaFixa,
            onToggleAtiva: toggleAtiva
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          ContasFixasList,
          {
            contas: contasFixas,
            categorias: categoriasContasFixas,
            onEdit: (conta) => {
              setContaEditando(conta);
              setFormType("conta_fixa");
              setViewMode("form");
            },
            onDelete: removerContaFixa,
            onPagar: pagarContaFixa,
            onToggleAtiva: toggleAtiva
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "produtos", className: "space-responsive-lg animate-fade-in", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-responsive-xl font-semibold mb-4", children: "Movimentações de Produtos" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MovimentacoesProdutos, {})
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "contas-receber", className: "space-responsive-lg animate-fade-in", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-6 w-6 flex-shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-responsive-xl font-semibold", children: "Contas a Receber" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ContasReceber, { agendamentos })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "pagamentos", className: "space-responsive-lg animate-fade-in", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { className: "h-6 w-6 flex-shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-responsive-xl font-semibold", children: "Pagamentos dos Clientes" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabelaPagamentosClientes, { agendamentos })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "graficos", className: "space-responsive-lg animate-fade-in", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-6 w-6 flex-shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-responsive-xl font-semibold", children: "Gráficos e Análises" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(GraficoFinanceiro, { lancamentos })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "relatorios", className: "space-responsive-lg animate-fade-in", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RelatoriosAvancados, {}) })
    ] })
  ] });
}

export { Financeiro as default };
