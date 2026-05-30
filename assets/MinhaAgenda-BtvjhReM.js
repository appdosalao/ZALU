import { j as jsxRuntimeExports, r as reactExports } from './react-vendor-BpXfDOw7.js';
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from './tabs-B30NruqW.js';
import { h as cn, i as buttonVariants, C as Card, c as CardHeader, d as CardTitle, e as CardContent, j as Input, g as Button, B as Badge, k as AlertDialog, l as AlertDialogContent, m as AlertDialogHeader, n as AlertDialogTitle, o as AlertDialogDescription, p as AlertDialogFooter, q as AlertDialogCancel, r as AlertDialogAction, s as supabase, J as Jt, b as useAuth, a as useNavigate, t as useConfigAgendamentoOnline, v as Separator, w as toISODate, x as timeToMinutes$1, y as overlaps, z as safeToDate, u as useSearchParams, D as toast } from './index-BxmTkSue.js';
import { u as useAgendamentos } from './useAgendamentos-CqqJ1YJQ.js';
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from './select-_FAVTGEW.js';
import { D as DropdownMenu, a as DropdownMenuTrigger, b as DropdownMenuContent, c as DropdownMenuItem } from './dropdown-menu-as8AjLis.js';
import { ak as ChevronLeft, al as ChevronRight, am as Filter, an as Search, X, K as Calendar, l as Check, a9 as User, N as Scissors, a7 as Ellipsis, ao as SquarePen, R as RefreshCw, ap as ArrowLeftRight, V as DollarSign, aq as Trash2, Q as Clock, k as CreditCard, ar as Save, as as ArrowLeft, at as FileText, au as ShoppingBag, av as Award, aw as MessageCircle, ax as Phone, ay as Mail, az as Tag, ag as Plus } from './ui-libs-BJEWQG8b.js';
import { t as toDate, f as format, s as startOfWeek } from './format-DsTNzci_.js';
import { p as ptBR } from './pt-BR-HlQT9LXk.js';
import { u as useForm, o as object, s as string, _ as _enum, n as number } from './form-libs-BJ_wtrcd.js';
import { a } from './zod-BCTNax0R.js';
import { T as Textarea } from './textarea-CnhGhN_A.js';
import { F as Form, a as FormField, b as FormItem, c as FormLabel, d as FormControl, e as FormMessage } from './form-ChGTXJpr.js';
import { L as Label } from './label-Bu_HJwHE.js';
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from './dialog-B2cdB-ir.js';
import { a as addWeeks, s as subDays, b as addDays, e as endOfWeek, i as isSameDay, c as startOfMonth, d as endOfMonth, f as isSameMonth, g as addMonths } from './subDays-C41zB5EI.js';
import { s as subMonths } from './subMonths-CGcExbdS.js';
import './chart-libs-Cdz70zdY.js';
import './useSupabaseAgendamentos-O5V4jZ47.js';
import './useServicos-D2x3NEpY.js';
import './useSupabaseClientes-BZkRJk2t.js';
import './index-BfAAoDv6.js';
import './index-Ls-C4DWD.js';

/**
 * The {@link eachDayOfInterval} function options.
 */

/**
 * @name eachDayOfInterval
 * @category Interval Helpers
 * @summary Return the array of dates within the specified time interval.
 *
 * @description
 * Return the array of dates within the specified time interval.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param interval - The interval.
 * @param options - An object with options.
 *
 * @returns The array with starts of days from the day of the interval start to the day of the interval end
 *
 * @example
 * // Each day between 6 October 2014 and 10 October 2014:
 * const result = eachDayOfInterval({
 *   start: new Date(2014, 9, 6),
 *   end: new Date(2014, 9, 10)
 * })
 * //=> [
 * //   Mon Oct 06 2014 00:00:00,
 * //   Tue Oct 07 2014 00:00:00,
 * //   Wed Oct 08 2014 00:00:00,
 * //   Thu Oct 09 2014 00:00:00,
 * //   Fri Oct 10 2014 00:00:00
 * // ]
 */
function eachDayOfInterval(interval, options) {
  const startDate = toDate(interval.start);
  const endDate = toDate(interval.end);

  let reversed = +startDate > +endDate;
  const endTime = reversed ? +startDate : +endDate;
  const currentDate = reversed ? endDate : startDate;
  currentDate.setHours(0, 0, 0, 0);

  let step = 1;

  const dates = [];

  while (+currentDate <= endTime) {
    dates.push(toDate(currentDate));
    currentDate.setDate(currentDate.getDate() + step);
    currentDate.setHours(0, 0, 0, 0);
  }

  return reversed ? dates.reverse() : dates;
}

/**
 * @name subWeeks
 * @category Week Helpers
 * @summary Subtract the specified number of weeks from the given date.
 *
 * @description
 * Subtract the specified number of weeks from the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to be changed
 * @param amount - The amount of weeks to be subtracted.
 *
 * @returns The new date with the weeks subtracted
 *
 * @example
 * // Subtract 4 weeks from 1 September 2014:
 * const result = subWeeks(new Date(2014, 8, 1), 4)
 * //=> Mon Aug 04 2014 00:00:00
 */
function subWeeks(date, amount) {
  return addWeeks(date, -1);
}

const Pagination = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "nav",
  {
    role: "navigation",
    "aria-label": "pagination",
    className: cn("mx-auto flex w-full justify-center", className),
    ...props
  }
);
Pagination.displayName = "Pagination";
const PaginationContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "ul",
  {
    ref,
    className: cn("flex flex-row items-center gap-1", className),
    ...props
  }
));
PaginationContent.displayName = "PaginationContent";
const PaginationItem = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { ref, className: cn("", className), ...props }));
PaginationItem.displayName = "PaginationItem";
const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  ...props
}) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "a",
  {
    "aria-current": isActive ? "page" : void 0,
    className: cn(
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size
      }),
      className
    ),
    ...props
  }
);
PaginationLink.displayName = "PaginationLink";
const PaginationPrevious = ({
  className,
  ...props
}) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  PaginationLink,
  {
    "aria-label": "Go to previous page",
    size: "default",
    className: cn("gap-1 pl-2.5", className),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Previous" })
    ]
  }
);
PaginationPrevious.displayName = "PaginationPrevious";
const PaginationNext = ({
  className,
  ...props
}) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  PaginationLink,
  {
    "aria-label": "Go to next page",
    size: "default",
    className: cn("gap-1 pr-2.5", className),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Next" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" })
    ]
  }
);
PaginationNext.displayName = "PaginationNext";

const statusConfig$1 = {
  agendado: { label: "Agendado", color: "bg-info", icon: Calendar },
  concluido: { label: "Concluído", color: "bg-success", icon: Check },
  cancelado: { label: "Cancelado", color: "bg-destructive", icon: X }
};
function AgendamentosList({
  agendamentos,
  filtros,
  onFiltrosChange,
  onEdit,
  onDelete,
  onCancel,
  onViewDetails,
  onReagendar,
  onTrocarHorario,
  onMarcarPagamento,
  clientes,
  paginaAtual,
  totalPaginas,
  onPaginaChange
}) {
  const [agendamentoParaExcluir, setAgendamentoParaExcluir] = reactExports.useState(null);
  const formatarData = (data) => {
    return format(/* @__PURE__ */ new Date(data + "T12:00:00"), "dd 'de' MMMM", { locale: ptBR });
  };
  const formatarHora = (hora) => {
    return hora.slice(0, 5);
  };
  const formatarDuracao = (duracao) => {
    const horas = Math.floor(duracao / 60);
    const minutos = duracao % 60;
    if (horas > 0 && minutos > 0) {
      return `${horas}h ${minutos}min`;
    } else if (horas > 0) {
      return `${horas}h`;
    } else {
      return `${minutos}min`;
    }
  };
  const formatarValor = (valor) => {
    return `R$ ${valor.toFixed(2).replace(".", ",")}`;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border/50 bg-card/50 backdrop-blur-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Filter, { className: "h-5 w-5 text-primary" }),
        "Filtros"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 sm:p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "month",
                value: filtros.mes || (/* @__PURE__ */ new Date()).toISOString().slice(0, 7),
                onChange: (e) => onFiltrosChange({ ...filtros, mes: e.target.value }),
                className: "h-10 sm:h-11 text-sm w-[180px]"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => onFiltrosChange({ ...filtros, mes: (/* @__PURE__ */ new Date()).toISOString().slice(0, 7) }),
                children: "Mês atual"
              }
            ),
            filtros.mes && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground ml-auto", children: format(/* @__PURE__ */ new Date(filtros.mes + "-01"), "MMMM yyyy", { locale: ptBR }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: "Buscar cliente ou serviço...",
                value: filtros.busca || "",
                onChange: (e) => onFiltrosChange({ ...filtros, busca: e.target.value }),
                className: "pl-10 pr-10 h-10 sm:h-11 text-sm"
              }
            ),
            filtros.busca && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "sm",
                onClick: () => onFiltrosChange({ ...filtros, busca: "" }),
                className: "absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 hover:bg-muted",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
              }
            )
          ] }),
          filtros.busca && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: agendamentos.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            'Nenhum agendamento encontrado para "',
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: filtros.busca }),
            '"'
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            agendamentos.length,
            " agendamento",
            agendamentos.length !== 1 ? "s" : "",
            " encontrado",
            agendamentos.length !== 1 ? "s" : ""
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "date",
                value: filtros.data || "",
                onChange: (e) => onFiltrosChange({ ...filtros, data: e.target.value }),
                placeholder: "Data",
                className: "h-10 sm:h-11 text-sm"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: filtros.status || "all",
                onValueChange: (value) => onFiltrosChange({ ...filtros, status: value === "all" ? void 0 : value }),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-10 sm:h-11 text-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Status" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "Todos" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "agendado", children: "Agendado" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "concluido", children: "Concluído" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "cancelado", children: "Cancelado" })
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: filtros.clienteId || "all",
                onValueChange: (value) => onFiltrosChange({ ...filtros, clienteId: value === "all" ? void 0 : value }),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-10 sm:h-11 text-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Cliente" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "Todos" }),
                    clientes.map((cliente) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: cliente.id, children: cliente.nome }, cliente.id))
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: filtros.statusPagamento || "all",
                onValueChange: (value) => onFiltrosChange({ ...filtros, statusPagamento: value === "all" ? void 0 : value }),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-10 sm:h-11 text-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Pagamento" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "Todos" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "pago", children: "✓ Pago" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "parcial", children: "⚠ Parcial" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "em_aberto", children: "⏳ Em aberto" })
                  ] })
                ]
              }
            )
          ] })
        ] }),
        (filtros.busca || filtros.data || filtros.status || filtros.clienteId || filtros.statusPagamento || filtros.mes) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 pt-4 border-t border-border/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => onFiltrosChange({ mes: (/* @__PURE__ */ new Date()).toISOString().slice(0, 7) }),
            className: "h-9 text-xs",
            children: "Limpar filtros"
          }
        ) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 animate-fade-in", children: agendamentos.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border/50 bg-card/50 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex flex-col items-center justify-center py-12 text-center p-4 sm:p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-12 w-12 text-muted-foreground mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base sm:text-lg font-semibold mb-2", children: "Nenhum agendamento encontrado" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-md", children: Object.keys(filtros).length > 0 ? "Tente ajustar os filtros ou criar um novo agendamento." : "Comece criando seu primeiro agendamento." })
    ] }) }) : agendamentos.map((agendamento, index) => {
      const StatusIcon = statusConfig$1[agendamento.status].icon;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        Card,
        {
          className: "agendamento-card animate-fade-in touch-feedback",
          style: { animationDelay: `${index * 50}ms` },
          onClick: () => onViewDetails(agendamento),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4 sm:p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-lilac-light/10 flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-4 w-4 sm:h-5 sm:w-5 text-primary" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-sm sm:text-base text-foreground truncate", children: agendamento.clienteNome }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs sm:text-sm text-muted-foreground flex items-center gap-1 mt-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Scissors, { className: "h-3 w-3 flex-shrink-0" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: agendamento.servicoNome })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, onClick: (e) => e.stopPropagation(), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", className: "h-8 w-8 p-0 sm:h-9 sm:w-9", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Ellipsis, { className: "h-4 w-4" }) }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "end", className: "w-48", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: (e) => {
                      e.stopPropagation();
                      onEdit(agendamento);
                    }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "h-4 w-4 mr-2" }),
                      "Editar"
                    ] }),
                    agendamento.status === "agendado" && onReagendar && /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: (e) => {
                      e.stopPropagation();
                      onReagendar(agendamento);
                    }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4 mr-2" }),
                      "Reagendar"
                    ] }),
                    agendamento.status === "agendado" && onTrocarHorario && /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: (e) => {
                      e.stopPropagation();
                      onTrocarHorario(agendamento);
                    }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeftRight, { className: "h-4 w-4 mr-2" }),
                      "Trocar Horário"
                    ] }),
                    agendamento.status === "agendado" && agendamento.statusPagamento !== "pago" && onMarcarPagamento && /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: (e) => {
                      e.stopPropagation();
                      onMarcarPagamento(agendamento);
                    }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-4 w-4 mr-2" }),
                      "Marcar Pagamento"
                    ] }),
                    agendamento.status === "agendado" && /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: (e) => {
                      e.stopPropagation();
                      onCancel(agendamento.id);
                    }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 mr-2" }),
                      "Cancelar"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      DropdownMenuItem,
                      {
                        onClick: (e) => {
                          e.stopPropagation();
                          setAgendamentoParaExcluir(agendamento.id);
                        },
                        className: "text-destructive",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 mr-2" }),
                          "Excluir"
                        ]
                      }
                    )
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Badge,
                  {
                    className: `${statusConfig$1[agendamento.status].color} text-white text-xs h-6`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(StatusIcon, { className: "h-3 w-3 mr-1" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: statusConfig$1[agendamento.status].label }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sm:hidden", children: statusConfig$1[agendamento.status].label.charAt(0) })
                    ]
                  }
                ),
                agendamento.origem === "online" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-purple-500 text-white text-xs h-6", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: "📱" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 hidden sm:inline", children: "Online" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Badge,
                  {
                    className: `${agendamento.statusPagamento === "pago" ? "bg-green-500" : agendamento.statusPagamento === "parcial" ? "bg-yellow-500" : "bg-red-500"} text-white text-xs h-6`,
                    children: [
                      agendamento.statusPagamento === "pago" ? "✓" : agendamento.statusPagamento === "parcial" ? "⚠" : "⏳",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 hidden sm:inline", children: agendamento.statusPagamento === "pago" ? "Pago" : agendamento.statusPagamento === "parcial" ? "Parcial" : "Em aberto" })
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 text-xs sm:text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4 flex-shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: formatarData(agendamento.data) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 flex-shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "truncate", children: [
                    formatarHora(agendamento.hora),
                    " (",
                    formatarDuracao(agendamento.duracao),
                    ")"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 p-3 bg-muted/30 rounded-lg", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-4 w-4 flex-shrink-0 text-muted-foreground mt-0.5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1 space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium text-foreground text-sm", children: [
                    "Total: ",
                    formatarValor(agendamento.valor)
                  ] }),
                  agendamento.valorPago > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-green-600 text-xs", children: [
                    "Pago: ",
                    formatarValor(agendamento.valorPago)
                  ] }),
                  agendamento.valorDevido > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-red-500 text-xs font-medium", children: [
                    "Pendente: ",
                    formatarValor(agendamento.valorDevido)
                  ] }),
                  agendamento.dataPrevistaPagamento && (agendamento.formaPagamento === "fiado" || agendamento.statusPagamento === "parcial" || agendamento.statusPagamento === "em_aberto") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-blue-600 text-xs", children: [
                    "Previsto: ",
                    formatarData(agendamento.dataPrevistaPagamento)
                  ] })
                ] })
              ] })
            ] })
          ] }) })
        },
        agendamento.id
      );
    }) }),
    totalPaginas > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pagination, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PaginationContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(PaginationItem, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        PaginationPrevious,
        {
          onClick: () => paginaAtual > 1 && onPaginaChange(paginaAtual - 1),
          className: paginaAtual <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
        }
      ) }),
      Array.from({ length: totalPaginas }, (_, i) => i + 1).map((pagina) => /* @__PURE__ */ jsxRuntimeExports.jsx(PaginationItem, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        PaginationLink,
        {
          onClick: () => onPaginaChange(pagina),
          isActive: pagina === paginaAtual,
          className: "cursor-pointer",
          children: pagina
        }
      ) }, pagina)),
      /* @__PURE__ */ jsxRuntimeExports.jsx(PaginationItem, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        PaginationNext,
        {
          onClick: () => paginaAtual < totalPaginas && onPaginaChange(paginaAtual + 1),
          className: paginaAtual >= totalPaginas ? "pointer-events-none opacity-50" : "cursor-pointer"
        }
      ) })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: !!agendamentoParaExcluir, onOpenChange: () => setAgendamentoParaExcluir(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Confirmar exclusão" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "Tem certeza que deseja excluir este agendamento? Esta ação não pode ser desfeita." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancelar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AlertDialogAction,
          {
            onClick: () => {
              if (agendamentoParaExcluir) {
                onDelete(agendamentoParaExcluir);
                setAgendamentoParaExcluir(null);
              }
            },
            className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
            children: "Excluir"
          }
        )
      ] })
    ] }) })
  ] });
}

const useHorariosTrabalho = (userId) => {
  const [configuracoes, setConfiguracoes] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    carregarConfiguracoes();
  }, [userId]);
  const carregarConfiguracoes = async () => {
    try {
      const resolvedUserId = userId || (await supabase.auth.getUser()).data.user?.id;
      if (!resolvedUserId) {
        setConfiguracoes([]);
        return;
      }
      let query = supabase.from("configuracoes_horarios").select("*").eq("ativo", true).order("dia_semana");
      query = query.eq("user_id", resolvedUserId);
      const { data, error } = await query;
      if (error) throw error;
      setConfiguracoes(data || []);
    } catch (error) {
      console.error("Erro ao carregar configurações de horário:", error);
      setConfiguracoes([]);
    } finally {
      setLoading(false);
    }
  };
  const isDiaAtivo = (diaSemana) => {
    const config = configuracoes.find((c) => c.dia_semana === diaSemana && c.ativo);
    return !!config;
  };
  const isHorarioValido = (diaSemana, horario) => {
    const config = configuracoes.find((c) => c.dia_semana === diaSemana && c.ativo);
    if (!config) return false;
    const horarioMinutos = timeToMinutes(horario);
    const aberturaMinutos = timeToMinutes(config.horario_abertura);
    const fechamentoMinutos = timeToMinutes(config.horario_fechamento);
    if (horarioMinutos < aberturaMinutos || horarioMinutos >= fechamentoMinutos) {
      return false;
    }
    if (config.intervalo_inicio && config.intervalo_fim) {
      const inicioAlmocoMinutos = timeToMinutes(config.intervalo_inicio);
      const fimAlmocoMinutos = timeToMinutes(config.intervalo_fim);
      if (horarioMinutos >= inicioAlmocoMinutos && horarioMinutos < fimAlmocoMinutos) {
        return false;
      }
    }
    return true;
  };
  const getHorariosDisponiveis = (diaSemana, duracaoServico = 60) => {
    const config = configuracoes.find((c) => c.dia_semana === diaSemana && c.ativo);
    if (!config) return [];
    const horarios = [];
    const aberturaMinutos = timeToMinutes(config.horario_abertura);
    const fechamentoMinutos = timeToMinutes(config.horario_fechamento);
    const inicioAlmocoMinutos = config.intervalo_inicio ? timeToMinutes(config.intervalo_inicio) : null;
    const fimAlmocoMinutos = config.intervalo_fim ? timeToMinutes(config.intervalo_fim) : null;
    for (let minutos = aberturaMinutos; minutos < fechamentoMinutos; minutos += 30) {
      const fimServicoMinutos = minutos + duracaoServico;
      if (fimServicoMinutos > fechamentoMinutos) continue;
      if (inicioAlmocoMinutos && fimAlmocoMinutos) {
        if (minutos >= inicioAlmocoMinutos && minutos < fimAlmocoMinutos || fimServicoMinutos > inicioAlmocoMinutos && fimServicoMinutos <= fimAlmocoMinutos || minutos < inicioAlmocoMinutos && fimServicoMinutos > fimAlmocoMinutos) {
          continue;
        }
      }
      horarios.push(minutesToTime(minutos));
    }
    return horarios;
  };
  const isAgendamentoValido = (data, horario, duracao = 60) => {
    console.log("Validando agendamento:", { data, horario, duracao });
    const dataSelecionada = /* @__PURE__ */ new Date(data + "T00:00:00");
    const diaSemana = dataSelecionada.getDay();
    console.log("Dia da semana:", diaSemana);
    if (!isDiaAtivo(diaSemana)) {
      console.log("Dia não está ativo");
      return false;
    }
    if (!isHorarioValido(diaSemana, horario)) {
      console.log("Horário não é válido");
      return false;
    }
    const config = configuracoes.find((c) => c.dia_semana === diaSemana && c.ativo);
    if (!config) {
      console.log("Nenhuma configuração encontrada");
      return false;
    }
    const horarioMinutos = timeToMinutes(horario);
    const fimServicoMinutos = horarioMinutos + duracao;
    const fechamentoMinutos = timeToMinutes(config.horario_fechamento);
    if (fimServicoMinutos > fechamentoMinutos) {
      console.log("Serviço terminaria após fechamento");
      return false;
    }
    if (config.intervalo_inicio && config.intervalo_fim) {
      const inicioAlmocoMinutos = timeToMinutes(config.intervalo_inicio);
      const fimAlmocoMinutos = timeToMinutes(config.intervalo_fim);
      if (horarioMinutos < fimAlmocoMinutos && fimServicoMinutos > inicioAlmocoMinutos) {
        console.log("Conflito com intervalo de almoço");
        return false;
      }
    }
    console.log("Agendamento é válido!");
    return true;
  };
  return {
    configuracoes,
    loading,
    isDiaAtivo,
    isHorarioValido,
    isAgendamentoValido,
    getHorariosDisponiveis,
    refetch: carregarConfiguracoes
  };
};
const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};
const minutesToTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
};

const useConfiguracoesRealTime = () => {
  const [lastUpdate, setLastUpdate] = reactExports.useState(Date.now());
  reactExports.useEffect(() => {
    const channel = supabase.channel("configuracoes_real_time").on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "configuracoes_horarios"
    }, (payload) => {
      console.log("Configuração de horário atualizada:", payload);
      setLastUpdate(Date.now());
    }).on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "intervalos_trabalho"
    }, (payload) => {
      console.log("Intervalo de trabalho atualizado:", payload);
      setLastUpdate(Date.now());
    }).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  return { lastUpdate };
};

const agendamentoSchema = object({
  clienteId: string().min(1, "Cliente é obrigatório"),
  servicoId: string().min(1, "Serviço é obrigatório"),
  data: string().min(1, "Data é obrigatória"),
  hora: string().min(1, "Hora é obrigatória"),
  duracao: number().min(1, "Duração deve ser maior que 0"),
  valor: number().min(0, "Valor deve ser positivo"),
  valorPago: number().min(0, "Valor pago deve ser positivo"),
  valorDevido: number().min(0, "Valor devido deve ser positivo"),
  formaPagamento: _enum(["dinheiro", "cartao", "pix", "fiado"]),
  statusPagamento: _enum(["pago", "parcial", "em_aberto"]),
  status: _enum(["agendado", "concluido", "cancelado"]),
  observacoes: string().optional(),
  dataPrevistaPagamento: string().optional()
});
function AgendamentoForm({
  agendamento,
  clientes,
  servicos,
  onSubmit,
  onCancel,
  verificarConflito,
  initial
}) {
  const { configuracoes, getHorariosDisponiveis, isDiaAtivo, isAgendamentoValido } = useHorariosTrabalho();
  const { lastUpdate } = useConfiguracoesRealTime();
  const [servicoSelecionado, setServicoSelecionado] = reactExports.useState(null);
  const [clienteSelecionado, setClienteSelecionado] = reactExports.useState(null);
  const [conflito, setConflito] = reactExports.useState(false);
  const [horariosDisponiveis, setHorariosDisponiveis] = reactExports.useState([]);
  const form = useForm({
    resolver: a(agendamentoSchema),
    defaultValues: {
      clienteId: agendamento?.clienteId || initial?.clienteId || "",
      servicoId: agendamento?.servicoId || initial?.servicoId || "",
      data: agendamento?.data || initial?.data || "",
      hora: agendamento?.hora || initial?.hora || "",
      duracao: agendamento?.duracao || initial?.duracao || 0,
      valor: agendamento?.valor || initial?.valor || 0,
      valorPago: agendamento?.valorPago || initial?.valorPago || 0,
      valorDevido: agendamento?.valorDevido || initial?.valorDevido || 0,
      formaPagamento: agendamento?.formaPagamento || initial?.formaPagamento || "dinheiro",
      statusPagamento: agendamento?.statusPagamento || initial?.statusPagamento || "em_aberto",
      status: agendamento?.status || initial?.status || "agendado",
      observacoes: agendamento?.observacoes || initial?.observacoes || "",
      dataPrevistaPagamento: agendamento?.dataPrevistaPagamento || initial?.dataPrevistaPagamento || ""
    }
  });
  const watchedValues = form.watch(["data", "hora", "duracao"]);
  reactExports.useEffect(() => {
    const [data, hora, duracao] = watchedValues;
    if (data && hora && duracao) {
      const temConflito = verificarConflito(
        { data, hora, duracao },
        agendamento?.id
      );
      setConflito(temConflito);
    }
  }, [watchedValues, verificarConflito, agendamento?.id]);
  reactExports.useEffect(() => {
    const servicoId = form.watch("servicoId");
    if (servicoId) {
      const servico = servicos.find((s) => s.id === servicoId);
      setServicoSelecionado(servico || null);
      if (servico) {
        form.setValue("duracao", servico.duracao);
        form.setValue("valor", servico.valor);
      }
    }
  }, [form.watch("servicoId"), servicos, form]);
  reactExports.useEffect(() => {
    const clienteId = form.watch("clienteId");
    if (clienteId) {
      const cliente = clientes.find((c) => c.id === clienteId);
      setClienteSelecionado(cliente || null);
    }
  }, [form.watch("clienteId"), clientes]);
  reactExports.useEffect(() => {
    const data = form.watch("data");
    if (data && configuracoes && configuracoes.length > 0) {
      const dataObj = /* @__PURE__ */ new Date(data + "T12:00:00");
      const diaSemana = dataObj.getDay();
      if (!isDiaAtivo(diaSemana)) {
        setHorariosDisponiveis([]);
        form.setValue("hora", "");
        return;
      }
      const duracaoServico = servicoSelecionado?.duracao || 60;
      const horarios = getHorariosDisponiveis(diaSemana, duracaoServico);
      setHorariosDisponiveis(horarios);
      const horarioAtual = form.watch("hora");
      if (horarioAtual && horarios.length > 0 && !horarios.includes(horarioAtual)) {
        form.setValue("hora", "");
      }
    } else if (data && (!configuracoes || configuracoes.length === 0)) {
      setHorariosDisponiveis([]);
    } else {
      setHorariosDisponiveis([]);
    }
  }, [form.watch("data"), configuracoes, servicoSelecionado, getHorariosDisponiveis, isDiaAtivo, form, lastUpdate]);
  const handleSubmit = (data) => {
    console.log("Dados do agendamento:", data);
    if (conflito) {
      console.log("Conflito detectado, cancelando submissão");
      return;
    }
    const agendamentoValido = isAgendamentoValido(data.data, data.hora, data.duracao);
    if (!agendamentoValido) {
      console.log("Agendamento fora do horário padrão, mas permitindo criação manual");
      Jt.info("Agendamento criado fora do horário de funcionamento padrão.");
    }
    const clienteNome = clientes.find((c) => c.id === data.clienteId)?.nomeCompleto || "";
    const servicoNome = servicos.find((s) => s.id === data.servicoId)?.nome || "";
    onSubmit({
      ...data,
      clienteNome,
      servicoNome
    });
  };
  const formatarDuracao = (duracao) => {
    const horas = Math.floor(duracao / 60);
    const minutos = duracao % 60;
    if (horas > 0 && minutos > 0) {
      return `${horas}h ${minutos}min`;
    } else if (horas > 0) {
      return `${horas}h`;
    } else {
      return `${minutos}min`;
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 sm:p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border/50 bg-card/50 backdrop-blur-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "p-4 sm:p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-lg sm:text-xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-5 w-5 text-primary flex-shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: agendamento ? "Editar Agendamento" : "Novo Agendamento" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4 sm:p-6 pt-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Form, { ...form, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: form.handleSubmit(handleSubmit), className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:gap-6 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FormField,
          {
            control: form.control,
            name: "clienteId",
            render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(FormLabel, { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-4 w-4" }),
                "Cliente"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { onValueChange: field.onChange, value: field.value, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione um cliente" }) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: clientes.map((cliente) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: cliente.id, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: cliente.nomeCompleto }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: cliente.telefone })
                ] }) }, cliente.id)) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FormField,
          {
            control: form.control,
            name: "servicoId",
            render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(FormLabel, { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Scissors, { className: "h-4 w-4" }),
                "Serviço"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { onValueChange: field.onChange, value: field.value, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione um serviço" }) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: servicos.map((servico) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: servico.id, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: servico.nome }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground", children: [
                    formatarDuracao(servico.duracao),
                    " - R$ ",
                    servico.valor.toFixed(2)
                  ] })
                ] }) }, servico.id)) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FormField,
          {
            control: form.control,
            name: "data",
            render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(FormLabel, { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4" }),
                "Data"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "date",
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
            name: "hora",
            render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(FormLabel, { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4" }),
                "Hora"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    type: "time",
                    ...field,
                    className: "flex-1"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Select,
                  {
                    onValueChange: field.onChange,
                    value: horariosDisponiveis.includes(field.value) ? field.value : "",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-[140px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Sugeridos" }) }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: horariosDisponiveis.length > 0 ? horariosDisponiveis.map((horario) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: horario, children: horario }, horario)) : /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "no-horarios", disabled: true, children: "Sem sugestões" }) })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {}),
              conflito && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive font-medium", children: "⚠️ Já existe um agendamento neste horário" })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FormField,
          {
            control: form.control,
            name: "duracao",
            render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { children: "Duração (minutos)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  min: "1",
                  ...field,
                  onChange: (e) => field.onChange(parseInt(e.target.value) || 0)
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {}),
              servicoSelecionado && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
                "Duração padrão: ",
                formatarDuracao(servicoSelecionado.duracao)
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FormField,
          {
            control: form.control,
            name: "valor",
            render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(FormLabel, { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-4 w-4" }),
                "Valor Total (R$)"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  min: "0",
                  step: "0.01",
                  ...field,
                  onChange: (e) => field.onChange(parseFloat(e.target.value) || 0)
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {}),
              servicoSelecionado && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
                "Valor padrão: R$ ",
                servicoSelecionado.valor.toFixed(2)
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FormField,
          {
            control: form.control,
            name: "formaPagamento",
            render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(FormLabel, { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "h-4 w-4" }),
                "Forma de Pagamento"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { onValueChange: field.onChange, value: field.value, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione a forma de pagamento" }) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "dinheiro", children: "💵 Dinheiro" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "cartao", children: "💳 Cartão" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "pix", children: "📱 PIX" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "fiado", children: "📝 Fiado" })
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
            name: "valorPago",
            render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(FormLabel, { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-4 w-4" }),
                "Valor Pago (R$)"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  min: "0",
                  step: "0.01",
                  ...field,
                  onChange: (e) => {
                    const valorPago = parseFloat(e.target.value) || 0;
                    const valorTotal = form.getValues("valor");
                    field.onChange(valorPago);
                    form.setValue("valorDevido", Math.max(0, valorTotal - valorPago));
                    if (valorPago === 0) {
                      form.setValue("statusPagamento", "em_aberto");
                    } else if (valorPago >= valorTotal) {
                      form.setValue("statusPagamento", "pago");
                    } else {
                      form.setValue("statusPagamento", "parcial");
                    }
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
            name: "valorDevido",
            render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(FormLabel, { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-4 w-4" }),
                "Valor Devido (R$)"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  min: "0",
                  step: "0.01",
                  ...field,
                  onChange: (e) => field.onChange(parseFloat(e.target.value) || 0),
                  readOnly: true,
                  className: "bg-muted"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
            ] })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        FormField,
        {
          control: form.control,
          name: "status",
          render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { onValueChange: field.onChange, value: field.value, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "agendado", children: "Agendado" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "concluido", children: "Concluído" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "cancelado", children: "Cancelado" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
          ] })
        }
      ),
      (form.watch("formaPagamento") === "fiado" || form.watch("statusPagamento") === "parcial" || form.watch("statusPagamento") === "em_aberto") && /* @__PURE__ */ jsxRuntimeExports.jsx(
        FormField,
        {
          control: form.control,
          name: "dataPrevistaPagamento",
          render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(FormLabel, { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4" }),
              "Data Prevista de Pagamento"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "date",
                ...field,
                min: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: form.watch("formaPagamento") === "fiado" ? "Quando o cliente disse que vai pagar" : "Data prevista para pagamento do valor restante" })
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        FormField,
        {
          control: form.control,
          name: "observacoes",
          render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { children: "Observações" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                placeholder: "Observações sobre o agendamento...",
                ...field
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "action-buttons pt-4 border-t border-border/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "submit",
            disabled: conflito,
            className: "action-button bg-gradient-to-r from-primary to-lilac-primary shadow-lg hover:shadow-xl transition-all duration-300 touch-feedback",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4 mr-2 flex-shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "truncate", children: [
                agendamento ? "Atualizar" : "Criar",
                " Agendamento"
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            variant: "outline",
            onClick: onCancel,
            className: "action-button touch-feedback",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 mr-2 flex-shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: "Cancelar" })
            ]
          }
        )
      ] })
    ] }) }) })
  ] }) });
}

function printAgendamentoRecibo(params) {
  const { agendamento, cliente, servico, salonName, logoUrl } = params;
  const dataBR = /* @__PURE__ */ new Date(`${agendamento.data}T${agendamento.hora}`);
  const dataStr = dataBR.toLocaleDateString("pt-BR");
  const horaStr = agendamento.hora.slice(0, 5);
  const valor = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(agendamento.valor);
  const valorPago = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(agendamento.valorPago || 0);
  const valorDevido = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(agendamento.valorDevido || 0);
  agendamento.formaPagamento === "cartao" ? "Cartão" : agendamento.formaPagamento === "pix" ? "PIX" : agendamento.formaPagamento === "dinheiro" ? "Dinheiro" : "Fiado";
  const statusPagamento = agendamento.statusPagamento === "pago" ? "Pago" : agendamento.statusPagamento === "parcial" ? "Parcial" : "Em aberto";
  const produtoAgendamentoOnline = (() => {
    if (!agendamento.observacoes || !agendamento.observacoes.includes("Compra de produto:")) return null;
    try {
      const jsonStr = agendamento.observacoes.split("Compra de produto:")[1].trim();
      return JSON.parse(jsonStr);
    } catch {
      return null;
    }
  })();
  const win = window.open("", "_blank");
  if (!win) return;
  const style = `
    * { box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; color: #1a1a1a; line-height: 1.4; }
    .container { max-width: 400px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { display: flex; flex-direction: column; align-items: center; gap: 8px; margin-bottom: 20px; text-align: center; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px; }
    .logo { width: 70px; height: 70px; border-radius: 20px; object-fit: cover; border: 3px solid #e9d5ff; margin-bottom: 5px; }
    .title { font-size: 20px; font-weight: 800; color: #7e22ce; letter-spacing: -0.5px; }
    .subtitle { font-size: 11px; color: #94a3b8; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
    .section { margin-top: 20px; }
    .section h3 { font-size: 12px; margin: 0 0 10px 0; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 800; }
    .row { display: flex; justify-content: space-between; font-size: 13px; padding: 8px 0; border-bottom: 1px solid #f8fafc; }
    .row.total { border-top: 2px solid #f0f0f0; border-bottom: none; margin-top: 10px; padding-top: 12px; font-weight: 800; font-size: 16px; color: #7e22ce; }
    .row.detail { font-size: 11px; color: #64748b; border-bottom: none; padding: 2px 0; }
    .product-box { background: #fdf4ff; border: 1px solid #fae8ff; border-radius: 12px; padding: 12px; margin-top: 10px; }
    .product-title { font-size: 13px; font-weight: 700; color: #a21caf; margin-bottom: 4px; display: flex; justify-content: space-between; }
    .product-info { font-size: 11px; color: #c026d3; font-weight: 600; }
    .footer { margin-top: 25px; font-size: 10px; color: #94a3b8; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 15px; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 10px; font-weight: 700; text-transform: uppercase; }
    .badge-success { background: #dcfce7; color: #166534; }
    .badge-pending { background: #fee2e2; color: #991b1b; }
    @media print { body { padding: 0; } .container { box-shadow: none; border: none; } }
  `;
  const html = `
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Recibo - ${salonName || "Salão de Bolso"}</title>
        <style>${style}</style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            ${logoUrl ? `<img class="logo" src="${logoUrl}" alt="Logo" />` : ""}
            <div>
              <div class="title">${salonName || "Salão de Bolso"}</div>
              <div class="subtitle">Comprovante de Atendimento</div>
            </div>
          </div>

          <div class="section">
            <h3>Cliente</h3>
            <div class="row"><div>Nome</div><div>${cliente.nome}</div></div>
            <div class="row"><div>Telefone</div><div>${cliente.telefone}</div></div>
          </div>

          <div class="section">
            <h3>Detalhes do Serviço</h3>
            <div class="row"><div>Procedimento</div><div>${servico.nome}</div></div>
            <div class="row"><div>Data e Hora</div><div>${dataStr} às ${horaStr}</div></div>
          </div>

          ${produtoAgendamentoOnline ? `
          <div class="section">
            <h3>Produtos Adquiridos</h3>
            <div class="product-box">
              <div class="product-title">
                <span>${produtoAgendamentoOnline.produto_nome}</span>
                <span>${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(produtoAgendamentoOnline.valor_total || 0)}</span>
              </div>
              <div class="product-info">Quantidade: ${produtoAgendamentoOnline.quantidade}x • Pagamento: ${produtoAgendamentoOnline.forma_pagamento_produto}</div>
            </div>
          </div>
          ` : ""}

          <div class="section">
            <h3>Resumo Financeiro</h3>
            ${produtoAgendamentoOnline ? `
              <div class="row detail"><div>Valor do Serviço</div><div>${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(agendamento.valor - (produtoAgendamentoOnline.valor_total || 0))}</div></div>
              <div class="row detail"><div>Valor dos Produtos</div><div>+ ${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(produtoAgendamentoOnline.valor_total || 0)}</div></div>
            ` : ""}
            <div class="row total"><div>Total Geral</div><div>${valor}</div></div>
            <div class="row"><div>Valor Pago</div><div>${valorPago}</div></div>
            <div class="row"><div>Pendente</div><div style="color: ${agendamento.valorDevido > 0 ? "#ef4444" : "#22c55e"}">${valorDevido}</div></div>
            <div class="row">
              <div>Status</div>
              <div><span class="badge ${agendamento.statusPagamento === "pago" ? "badge-success" : "badge-pending"}">${statusPagamento}</span></div>
            </div>
          </div>

          <div class="footer">
            Obrigado pela preferência! ✨<br>
            Documento gerado em ${(/* @__PURE__ */ new Date()).toLocaleString("pt-BR")}<br>
            ${window.location.origin}
          </div>
        </div>
        <script>
          window.onload = () => {
            setTimeout(() => {
              window.print();
              setTimeout(() => window.close(), 500);
            }, 500);
          };
        <\/script>
      </body>
    </html>
  `;
  win.document.open();
  win.document.write(html);
  win.document.close();
}

const statusConfig = {
  agendado: {
    label: "Agendado",
    color: "bg-info text-info-foreground",
    icon: Calendar,
    description: "Agendamento confirmado"
  },
  concluido: {
    label: "Concluído",
    color: "bg-success text-success-foreground",
    icon: Check,
    description: "Serviço realizado com sucesso"
  },
  cancelado: {
    label: "Cancelado",
    color: "bg-destructive text-destructive-foreground",
    icon: X,
    description: "Agendamento cancelado"
  }
};
function AgendamentoDetalhes({
  agendamento,
  cliente,
  servico,
  onEdit,
  onBack,
  onCancel,
  onMarcarPagamento
}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { config } = useConfigAgendamentoOnline();
  const [pontos, setPontos] = reactExports.useState(null);
  const [pontosPotenciais, setPontosPotenciais] = reactExports.useState(null);
  const [venda, setVenda] = reactExports.useState(null);
  const [itens, setItens] = reactExports.useState([]);
  const [produtosMap, setProdutosMap] = reactExports.useState({});
  const [vendaForma, setVendaForma] = reactExports.useState("pix");
  reactExports.useEffect(() => {
    const carregarPontos = async () => {
      if (!user) return;
      try {
        const { data: creditos } = await supabase.from("pontos_fidelidade").select("pontos").eq("user_id", user.id).eq("origem", "agendamento").eq("origem_id", agendamento.id);
        if (creditos && creditos.length > 0) {
          const total = creditos.reduce((s, r) => s + Number(r.pontos || 0), 0);
          setPontos(total);
        } else {
          const { data: programa } = await supabase.from("programas_fidelidade").select("*").eq("user_id", user.id).eq("ativo", true).limit(1).single();
          if (programa) {
            const parseValor = (v) => {
              if (typeof v === "number") return v;
              if (typeof v === "string") {
                const s = v.replace(/\./g, "").replace(",", ".");
                const n = Number(s);
                return isNaN(n) ? 0 : n;
              }
              return 0;
            };
            const base = parseValor(agendamento.valorPago) > 0 ? parseValor(agendamento.valorPago) : parseValor(agendamento.valor);
            const ppr = Number(programa.pontos_por_real || 1);
            setPontosPotenciais(Math.floor(base * (isNaN(ppr) ? 1 : ppr)));
          }
        }
      } catch {
      }
    };
    carregarPontos();
  }, [agendamento.id, agendamento.valor, agendamento.valorPago, user]);
  const formatarData = (data) => {
    const [year, month, day] = data.split("-").map(Number);
    const localDate = new Date(year, month - 1, day);
    return format(localDate, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };
  const formatarHora = (hora) => {
    return hora.slice(0, 5);
  };
  const formatarDuracao = (duracao) => {
    const horas = Math.floor(duracao / 60);
    const minutos = duracao % 60;
    if (horas > 0 && minutos > 0) {
      return `${horas}h ${minutos}min`;
    } else if (horas > 0) {
      return `${horas}h`;
    } else {
      return `${minutos}min`;
    }
  };
  const formatarValor = (valor) => {
    return `R$ ${valor.toFixed(2).replace(".", ",")}`;
  };
  const formatarDataHora = (data) => {
    return format(new Date(data), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };
  const calcularHoraFim = () => {
    const inicio = /* @__PURE__ */ new Date(`${agendamento.data}T${agendamento.hora}`);
    const fim = new Date(inicio.getTime() + agendamento.duracao * 6e4);
    return fim.toTimeString().slice(0, 5);
  };
  const StatusIcon = statusConfig[agendamento.status].icon;
  const produtoAgendamentoOnline = (() => {
    if (!agendamento.observacoes || !agendamento.observacoes.includes("Compra de produto:")) return null;
    try {
      const jsonStr = agendamento.observacoes.split("Compra de produto:")[1].trim();
      return JSON.parse(jsonStr);
    } catch {
      return null;
    }
  })();
  reactExports.useEffect(() => {
    const carregarVenda = async () => {
      if (!user) return;
      const { data: v } = await supabase.from("vendas_produtos").select("*").eq("agendamento_id", agendamento.id).limit(1).maybeSingle();
      setVenda(v || null);
      if (v) {
        setVendaForma(v.forma_pagamento || "pix");
        const { data: iv } = await supabase.from("itens_venda").select("*").eq("venda_id", v.id);
        setItens(iv || []);
        const ids = (iv || []).map((i) => i.produto_id);
        if (ids.length > 0) {
          const { data: prods } = await supabase.from("produtos").select("id,nome,preco_venda").in("id", ids);
          const map = {};
          (prods || []).forEach((p) => {
            map[p.id] = p;
          });
          setProdutosMap(map);
        }
      }
    };
    carregarVenda();
  }, [agendamento.id, user]);
  const marcarVendaPaga = async () => {
    if (!venda) return;
    const { error } = await supabase.from("vendas_produtos").update({ status_pagamento: "pago", forma_pagamento: vendaForma }).eq("id", venda.id);
    if (!error) {
      Jt.success("Venda marcada como paga");
      const vAtual = { ...venda, status_pagamento: "pago", forma_pagamento: vendaForma };
      setVenda(vAtual);
    } else {
      Jt.error("Falha ao marcar venda como paga");
    }
  };
  const enviarResumoWhatsApp = () => {
    const numero = cliente.telefone.replace(/\D/g, "");
    const itensTxt = itens.map((i) => {
      const nome = produtosMap[i.produto_id]?.nome || "Produto";
      const qtd = i.quantidade;
      const total = i.valor_total;
      return `• ${nome} x${qtd} — R$ ${Number(total).toFixed(2)}`;
    }).join("\n");
    const msg = `Resumo do atendimento
Cliente: ${cliente.nome}
Serviço: ${servico.nome}
Data: ${agendamento.data}
Hora: ${formatarHora(agendamento.hora)}
${itens.length ? `Produtos:
${itensTxt}` : ""}
Total serviço: R$ ${Number(agendamento.valor).toFixed(2)}${venda ? `
Total produtos: R$ ${Number(venda.valor_total || 0).toFixed(2)}` : ""}`;
    const url = `https://wa.me/55${numero}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };
  const enviarResumoEmail = () => {
    if (!cliente.email) return;
    const itensTxt = itens.map((i) => {
      const nome = produtosMap[i.produto_id]?.nome || "Produto";
      const qtd = i.quantidade;
      const total = i.valor_total;
      return `• ${nome} x${qtd} — R$ ${Number(total).toFixed(2)}`;
    }).join("%0D%0A");
    const assunto = `Resumo do atendimento`;
    const corpo = `Cliente: ${cliente.nome}%0D%0AServiço: ${servico.nome}%0D%0AData: ${agendamento.data}%0D%0AHora: ${formatarHora(agendamento.hora)}%0D%0A${itens.length ? `Produtos:%0D%0A${itensTxt}%0D%0A` : ""}Total serviço: R$ ${Number(agendamento.valor).toFixed(2)}${venda ? `%0D%0ATotal produtos: R$ ${Number(venda.valor_total || 0).toFixed(2)}` : ""}`;
    window.location.href = `mailto:${cliente.email}?subject=${encodeURIComponent(assunto)}&body=${corpo}`;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", onClick: onBack, className: "gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
        "Voltar para lista"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            onClick: () => printAgendamentoRecibo({
              agendamento,
              cliente,
              servico,
              salonName: config.nome_salao,
              logoUrl: config.logo_url || void 0
            }),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4 mr-2" }),
              "Imprimir Recibo"
            ]
          }
        ),
        agendamento.status === "agendado" && agendamento.statusPagamento !== "pago" && onMarcarPagamento && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "default",
            onClick: onMarcarPagamento,
            className: "bg-success hover:bg-success/90",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-4 w-4 mr-2" }),
              "Marcar Pagamento"
            ]
          }
        ),
        agendamento.status === "agendado" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: onCancel, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 mr-2" }),
          "Cancelar"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: onEdit, className: "bg-gradient-to-r from-primary to-lilac-primary", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "h-4 w-4 mr-2" }),
          "Editar"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border/50 bg-card/50 backdrop-blur-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-2xl", children: "Detalhes do Agendamento" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: statusConfig[agendamento.status].color, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusIcon, { className: "h-4 w-4 mr-2" }),
            statusConfig[agendamento.status].label
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: statusConfig[agendamento.status].description })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 md:grid-cols-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-semibold flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-5 w-5 text-primary" }),
              "Data e Hora"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pl-7", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-muted-foreground", children: "Data" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg capitalize", children: formatarData(agendamento.data) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-muted-foreground", children: "Horário" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-lg", children: [
                  formatarHora(agendamento.hora),
                  " às ",
                  calcularHoraFim()
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-muted-foreground", children: "Duração" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg", children: formatarDuracao(agendamento.duracao) })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-semibold flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-5 w-5 text-primary" }),
              "Informações de Pagamento"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pl-7 space-y-4", children: [
              produtoAgendamentoOnline && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-primary/5 p-4 rounded-2xl border-2 border-primary/10 space-y-3 mb-2 animate-in fade-in slide-in-from-left-4 duration-500", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-primary", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-4 w-4" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-black uppercase tracking-widest", children: "Produto Solicitado Online" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-primary text-white text-[10px] uppercase font-black", children: "Pedido Realizado" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-base font-bold text-foreground", children: [
                    produtoAgendamentoOnline.produto_nome,
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground text-xs font-medium ml-1", children: [
                      "x",
                      produtoAgendamentoOnline.quantidade
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base font-black text-primary", children: formatarValor(produtoAgendamentoOnline.valor_total || 0) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-primary/10" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1 text-[11px] font-bold text-muted-foreground/70 uppercase tracking-tight", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Valor do Serviço" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatarValor(agendamento.valor - (produtoAgendamentoOnline.valor_total || 0)) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-primary/60", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Valor do Produto" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "+ ",
                      formatarValor(produtoAgendamentoOnline.valor_total || 0)
                    ] })
                  ] })
                ] })
              ] }),
              !produtoAgendamentoOnline && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-muted-foreground/40 mb-2 border border-dashed border-muted-foreground/20 p-3 rounded-xl bg-muted/5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-4 w-4 opacity-50" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold uppercase tracking-widest", children: "Nenhum produto solicitado no agendamento" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-end bg-primary/5 p-4 rounded-2xl border-2 border-primary/5 shadow-inner", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] font-black uppercase tracking-widest text-muted-foreground", children: "Valor Total Combinado" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-black text-primary tracking-tighter", children: formatarValor(agendamento.valor) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] font-black uppercase tracking-widest text-muted-foreground", children: "Status" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      className: `block w-fit ml-auto ${agendamento.statusPagamento === "pago" ? "bg-success text-success-foreground" : agendamento.statusPagamento === "parcial" ? "bg-warning text-warning-foreground" : "bg-destructive text-destructive-foreground"}`,
                      children: agendamento.statusPagamento === "pago" ? "TOTAL PAGO" : agendamento.statusPagamento === "parcial" ? "PAGAMENTO PARCIAL" : "PENDENTE"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-success/5 p-3 rounded-xl border border-success/10", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] font-black uppercase tracking-widest text-success/70", children: "Valor Já Pago" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-black text-success tracking-tight", children: formatarValor(agendamento.valorPago) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `p-3 rounded-xl border ${agendamento.valorDevido > 0 ? "bg-destructive/5 border-destructive/10" : "bg-success/5 border-success/10"}`, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] font-black uppercase tracking-widest text-muted-foreground", children: "Valor a Receber" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-lg font-black tracking-tight ${agendamento.valorDevido > 0 ? "text-destructive" : "text-success"}`, children: formatarValor(agendamento.valorDevido) })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-muted/30 p-3 rounded-xl border border-muted-foreground/10 flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] font-black uppercase tracking-widest text-muted-foreground", children: "Método de Pagamento" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "h-4 w-4 text-primary/70" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-sm uppercase tracking-tight", children: agendamento.formaPagamento === "cartao" ? "Cartão" : agendamento.formaPagamento === "pix" ? "PIX" : agendamento.formaPagamento === "dinheiro" ? "Dinheiro" : "Fiado" })
                ] })
              ] }) }) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-semibold flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "h-5 w-5 text-primary" }),
            "Fidelidade"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pl-7 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-muted-foreground", children: "Pontos deste atendimento" }),
              pontos !== null ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-primary/10 text-primary", children: [
                "+",
                pontos,
                " pontos"
              ] }) : pontosPotenciais !== null ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "bg-accent/50", children: [
                "Estimado: +",
                pontosPotenciais,
                " pontos"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Sem pontos registrados" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => navigate("/marketing"), className: "gap-2", children: "Abrir Marketing" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
        venda && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-semibold flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-5 w-5 text-primary" }),
              "Produtos vinculados"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pl-7 space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: itens.map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  produtosMap[i.produto_id]?.nome || "Produto",
                  " x",
                  i.quantidade
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "R$ ",
                  Number(i.valor_total).toFixed(2)
                ] })
              ] }, i.id)) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-muted-foreground", children: "Total produtos" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-lg font-semibold", children: [
                  "R$ ",
                  Number(venda.valor_total || 0).toFixed(2)
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-muted-foreground", children: "Forma de pagamento" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: vendaForma, onValueChange: setVendaForma, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "pix", children: "PIX" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "cartao", children: "Cartão" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "dinheiro", children: "Dinheiro" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "fiado", children: "Fiado" })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2 flex items-end gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: marcarVendaPaga, className: "bg-success hover:bg-success/90", children: "Marcar venda como paga" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: enviarResumoWhatsApp, className: "gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-4 w-4" }),
                    "WhatsApp"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: enviarResumoEmail, children: "E-mail" })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {})
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-semibold flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-5 w-5 text-primary" }),
            "Cliente"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-2 pl-7", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-muted-foreground", children: "Nome" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-medium", children: cliente.nome })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-muted-foreground", children: "Telefone" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-lg flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-4 w-4" }),
                cliente.telefone
              ] })
            ] }),
            cliente.email && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-muted-foreground", children: "E-mail" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-lg flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-4 w-4" }),
                cliente.email
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-semibold flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Scissors, { className: "h-5 w-5 text-primary" }),
            "Serviço"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pl-7 space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-muted-foreground", children: "Nome do serviço" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-medium", children: servico.nome })
            ] }),
            servico.descricao && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-muted-foreground", children: "Descrição" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base", children: servico.descricao })
            ] })
          ] })
        ] }),
        agendamento.observacoes && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-semibold flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-5 w-5 text-primary" }),
              "Observações"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pl-7", children: agendamento.observacoes.includes("Compra de produto:") ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
              agendamento.observacoes.split("Compra de produto:")[0].trim() && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base leading-relaxed bg-muted/50 p-4 rounded-lg mb-2", children: agendamento.observacoes.split("Compra de produto:")[0].trim() }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-primary/5 border-2 border-primary/10 p-6 rounded-[1.5rem] shadow-sm animate-in fade-in zoom-in duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white p-3 rounded-2xl shadow-sm border border-primary/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-6 w-6 text-primary" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-black uppercase tracking-widest text-primary/70 mb-1", children: "Produto Adquirido" }),
                  (() => {
                    try {
                      const jsonStr = agendamento.observacoes.split("Compra de produto:")[1].trim();
                      const compra = JSON.parse(jsonStr);
                      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold text-foreground", children: compra.produto_nome }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-4 text-sm font-medium text-muted-foreground", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-primary/5", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary font-black", children: [
                              compra.quantidade,
                              "x"
                            ] }),
                            " unidades"
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-primary/5 uppercase tracking-tight", children: [
                            "Pagamento: ",
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-bold", children: compra.forma_pagamento_produto })
                          ] }),
                          compra.valor_total && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/10", children: [
                            "Total: ",
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold", children: [
                              "R$ ",
                              compra.valor_total.toFixed(2).replace(".", ",")
                            ] })
                          ] })
                        ] })
                      ] });
                    } catch (e) {
                      return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-red-500", children: "Erro ao processar dados do produto." });
                    }
                  })()
                ] })
              ] }) })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base leading-relaxed bg-muted/50 p-4 rounded-lg", children: agendamento.observacoes }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-2 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "font-medium", children: "Criado em" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: formatarDataHora(agendamento.createdAt) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "font-medium", children: "Última atualização" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: formatarDataHora(agendamento.updatedAt) })
          ] })
        ] })
      ] })
    ] })
  ] });
}

function ReagendamentoDialog({
  open,
  onOpenChange,
  agendamento,
  onReagendar,
  verificarConflito
}) {
  const [novaData, setNovaData] = reactExports.useState("");
  const [novaHora, setNovaHora] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  if (!agendamento) return null;
  const formatarData = (data) => {
    return format(/* @__PURE__ */ new Date(data + "T12:00:00"), "dd 'de' MMMM", { locale: ptBR });
  };
  const formatarHora = (hora) => {
    return hora.slice(0, 5);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!novaData || !novaHora) {
      Jt.error("Preencha a nova data e horário");
      return;
    }
    if (novaData === agendamento.data && novaHora === agendamento.hora) {
      Jt.error("A nova data e horário devem ser diferentes do atual");
      return;
    }
    const agendamentoTeste = {
      data: novaData,
      hora: novaHora,
      duracao: agendamento.duracao
    };
    if (verificarConflito(agendamentoTeste, agendamento.id)) {
      Jt.error("Já existe um agendamento neste horário");
      return;
    }
    setLoading(true);
    try {
      const sucesso = await onReagendar(agendamento.id, novaData, novaHora);
      if (sucesso) {
        Jt.success("Agendamento reagendado com sucesso!");
        onOpenChange(false);
        setNovaData("");
        setNovaHora("");
      } else {
        Jt.error("Erro ao reagendar agendamento");
      }
    } catch (error) {
      Jt.error("Erro ao reagendar agendamento");
    } finally {
      setLoading(false);
    }
  };
  const handleCancel = () => {
    setNovaData("");
    setNovaHora("");
    onOpenChange(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-[500px]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-5 w-5 text-primary" }),
        "Reagendar Agendamento"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Altere a data e horário do agendamento selecionado" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-muted/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-medium text-foreground", children: agendamento.clienteNome }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-info text-info-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3 w-3 mr-1" }),
            "Agendado"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatarData(agendamento.data) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatarHora(agendamento.hora) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "Serviço:" }),
          " ",
          agendamento.servicoNome
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "nova-data", className: "text-sm font-medium", children: "Nova Data" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "nova-data",
              type: "date",
              value: novaData,
              onChange: (e) => setNovaData(e.target.value),
              min: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "nova-hora", className: "text-sm font-medium", children: "Nova Hora" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "nova-hora",
              type: "time",
              value: novaHora,
              onChange: (e) => setNovaHora(e.target.value),
              step: "300",
              required: true
            }
          )
        ] })
      ] }),
      novaData && novaHora && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-success/10 border-success/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-success", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "Novo agendamento:" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 grid grid-cols-2 gap-4 text-sm text-success", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatarData(novaData) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatarHora(novaHora) })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            onClick: handleCancel,
            disabled: loading,
            children: "Cancelar"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "submit",
            disabled: loading || !novaData || !novaHora,
            className: "bg-gradient-to-r from-primary to-lilac-primary",
            children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "mr-2 h-4 w-4 animate-spin" }),
              "Reagendando..."
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "mr-2 h-4 w-4" }),
              "Reagendar"
            ] })
          }
        )
      ] })
    ] })
  ] }) });
}

function TrocaHorarioDialog({
  open,
  onOpenChange,
  agendamento,
  agendamentosDisponiveis,
  onTrocarHorarios
}) {
  const [agendamentoSelecionado, setAgendamentoSelecionado] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  if (!agendamento) return null;
  const formatarData = (data) => {
    return format(/* @__PURE__ */ new Date(data + "T12:00:00"), "dd 'de' MMMM", { locale: ptBR });
  };
  const formatarHora = (hora) => {
    return hora.slice(0, 5);
  };
  const formatarDuracao = (duracao) => {
    const horas = Math.floor(duracao / 60);
    const minutos = duracao % 60;
    if (horas > 0 && minutos > 0) {
      return `${horas}h ${minutos}min`;
    } else if (horas > 0) {
      return `${horas}h`;
    } else {
      return `${minutos}min`;
    }
  };
  const agendamentosParaTroca = agendamentosDisponiveis.filter(
    (ag) => ag.id !== agendamento.id && ag.status === "agendado"
  );
  const agendamentoParaTrocar = agendamentosParaTroca.find(
    (ag) => ag.id === agendamentoSelecionado
  );
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agendamentoSelecionado) {
      Jt.error("Selecione um agendamento para trocar");
      return;
    }
    setLoading(true);
    try {
      const sucesso = await onTrocarHorarios(agendamento.id, agendamentoSelecionado);
      if (sucesso) {
        Jt.success("Horários trocados com sucesso!");
        onOpenChange(false);
        setAgendamentoSelecionado("");
      } else {
        Jt.error("Erro ao trocar horários");
      }
    } catch (error) {
      Jt.error("Erro ao trocar horários");
    } finally {
      setLoading(false);
    }
  };
  const handleCancel = () => {
    setAgendamentoSelecionado("");
    onOpenChange(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-[600px]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeftRight, { className: "h-5 w-5 text-primary" }),
        "Trocar Horários"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Selecione outro agendamento para trocar os horários" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium", children: "Agendamento atual:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-muted/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-lilac-light/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-4 w-4 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-medium text-foreground", children: agendamento.clienteNome }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-sm text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Scissors, { className: "h-3 w-3" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: agendamento.servicoNome })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatarData(agendamento.data) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                formatarHora(agendamento.hora),
                " - ",
                formatarDuracao(agendamento.duracao)
              ] })
            ] })
          ] })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "agendamento-troca", className: "text-sm font-medium", children: "Trocar com:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: agendamentoSelecionado,
            onValueChange: setAgendamentoSelecionado,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione um agendamento" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: agendamentosParaTroca.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 text-center text-muted-foreground", children: "Nenhum agendamento disponível para troca" }) : agendamentosParaTroca.map((ag) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: ag.id, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between w-full", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: ag.clienteNome }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "-" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm", children: [
                    formatarData(ag.data),
                    " ",
                    formatarHora(ag.hora)
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: formatarDuracao(ag.duracao) })
              ] }) }, ag.id)) })
            ]
          }
        )
      ] }),
      agendamentoParaTrocar && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeftRight, { className: "h-6 w-6 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-green-50 border-green-200", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-medium text-green-700 text-center", children: "Preview da troca" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-medium text-green-600", children: [
                agendamento.clienteNome,
                " vai para:"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-green-700", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatarData(agendamentoParaTrocar.data) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    formatarHora(agendamentoParaTrocar.hora),
                    " - ",
                    formatarDuracao(agendamentoParaTrocar.duracao)
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-medium text-green-600", children: [
                agendamentoParaTrocar.clienteNome,
                " vai para:"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-green-700", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatarData(agendamento.data) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    formatarHora(agendamento.hora),
                    " - ",
                    formatarDuracao(agendamento.duracao)
                  ] })
                ] })
              ] })
            ] })
          ] })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            onClick: handleCancel,
            disabled: loading,
            children: "Cancelar"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "submit",
            disabled: loading || !agendamentoSelecionado,
            className: "bg-gradient-to-r from-primary to-lilac-primary",
            children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeftRight, { className: "mr-2 h-4 w-4 animate-spin" }),
              "Trocando..."
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeftRight, { className: "mr-2 h-4 w-4" }),
              "Trocar Horários"
            ] })
          }
        )
      ] })
    ] })
  ] }) });
}

function PagamentoDialog({
  open,
  onOpenChange,
  agendamento,
  onConfirmar
}) {
  const [valorPago, setValorPago] = reactExports.useState("");
  const [formaPagamento, setFormaPagamento] = reactExports.useState("dinheiro");
  const [processando, setProcessando] = reactExports.useState(false);
  const valorDevido = agendamento?.valorDevido || 0;
  const valorTotal = agendamento?.valor || 0;
  const handleConfirmar = async (pagarCompleto) => {
    if (!agendamento) return;
    setProcessando(true);
    const valor = pagarCompleto ? valorDevido : parseFloat(valorPago.replace(",", ".")) || 0;
    const sucesso = await onConfirmar(agendamento.id, valor, formaPagamento);
    if (sucesso) {
      onOpenChange(false);
      setValorPago("");
      setFormaPagamento("dinheiro");
    }
    setProcessando(false);
  };
  const formatarValor = (valor) => {
    return `R$ ${valor.toFixed(2).replace(".", ",")}`;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-5 w-5 text-primary" }),
        "Registrar Pagamento"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
        "Registre o pagamento do agendamento de ",
        agendamento?.clienteNome
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 p-4 bg-muted/30 rounded-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Valor Total:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: formatarValor(valorTotal) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Já Pago:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-success", children: formatarValor(agendamento?.valorPago || 0) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm pt-2 border-t border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-medium", children: "Valor Devido:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-destructive", children: formatarValor(valorDevido) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "forma-pagamento", children: "Forma de Pagamento" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formaPagamento, onValueChange: setFormaPagamento, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { id: "forma-pagamento", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "dinheiro", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "💵" }),
              "Dinheiro"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "cartao", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "h-4 w-4" }),
              "Cartão"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "pix", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "📱" }),
              "PIX"
            ] }) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "valor-pago", children: "Valor Pago (parcial)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground", children: "R$" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "valor-pago",
              type: "text",
              placeholder: "0,00",
              value: valorPago,
              onChange: (e) => {
                const value = e.target.value.replace(/[^\d,]/g, "");
                setValorPago(value);
              },
              className: "pl-10"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Deixe em branco para pagar o valor completo" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "flex-col sm:flex-row gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          onClick: () => onOpenChange(false),
          disabled: processando,
          className: "w-full sm:w-auto",
          children: "Cancelar"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          onClick: () => handleConfirmar(false),
          disabled: processando || !valorPago,
          className: "w-full sm:w-auto",
          children: "Pagar Parcial"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: () => handleConfirmar(true),
          disabled: processando,
          className: "w-full sm:w-auto bg-gradient-to-r from-primary to-lilac-primary",
          children: processando ? "Processando..." : "Pagar Completo"
        }
      )
    ] })
  ] }) });
}

function getOrigemBadge(origem) {
  switch (origem) {
    case "online":
      return { label: "Online", emoji: "🌐", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-0" };
    case "cronograma":
      return { label: "Cronograma", emoji: "🔄", className: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-0" };
    case "manual":
      return { label: "Manual", emoji: "✏️", className: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300 border-0" };
    default:
      return null;
  }
}
function getStatusBadgeClass(status) {
  switch (status) {
    case "agendado":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
    case "concluido":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
    case "cancelado":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
    case "reagendado":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300";
  }
}

function AgendaDiaria({ buscaTexto = "", onSlotClick }) {
  const [dataSelecionada, setDataSelecionada] = reactExports.useState(/* @__PURE__ */ new Date());
  const {
    todosAgendamentos,
    loading,
    converterAgendamentoOnlineParaRegular,
    cancelarAgendamento} = useAgendamentos();
  const { getHorariosDisponiveis, isAgendamentoValido } = useHorariosTrabalho();
  const [detalheAberto, setDetalheAberto] = reactExports.useState(false);
  const [agendamentoSelecionado, setAgendamentoSelecionado] = reactExports.useState(null);
  const termo = buscaTexto.trim().toLowerCase();
  const dataSelecionadaStr = toISODate(dataSelecionada);
  const agendamentosDoDia = reactExports.useMemo(() => {
    return todosAgendamentos.filter((ag) => toISODate(ag.data) === dataSelecionadaStr).filter((ag) => {
      if (!termo) return true;
      const campos = [
        ag.clienteNome,
        ag.servicoNome,
        ag.status,
        ag.origem,
        ag.hora,
        ag.observacoes || ""
      ].map((v) => String(v || "").toLowerCase());
      return campos.some((c) => c.includes(termo));
    }).sort((a, b) => a.hora.localeCompare(b.hora));
  }, [todosAgendamentos, dataSelecionadaStr, termo]);
  const agora = /* @__PURE__ */ new Date();
  const hojeStr = toISODate(agora);
  const agoraString = `${agora.getHours().toString().padStart(2, "0")}:${agora.getMinutes().toString().padStart(2, "0")}`;
  const agoraMinutos = timeToMinutes$1(agoraString);
  const proximoAgendamento = reactExports.useMemo(() => {
    return agendamentosDoDia.find(
      (ag) => toISODate(ag.data) === hojeStr && timeToMinutes$1(ag.hora) >= agoraMinutos && ag.status === "agendado"
    );
  }, [agendamentosDoDia, hojeStr, agoraMinutos]);
  const estatisticasDia = reactExports.useMemo(() => ({
    agendados: agendamentosDoDia.filter((ag) => ag.status === "agendado").length,
    concluidos: agendamentosDoDia.filter((ag) => ag.status === "concluido").length,
    cancelados: agendamentosDoDia.filter((ag) => ag.status === "cancelado").length,
    valorTotal: agendamentosDoDia.reduce((total, ag) => total + Number(ag.valor ?? 0), 0),
    valorRecebido: agendamentosDoDia.filter((ag) => ag.status === "concluido").reduce((total, ag) => total + Number(ag.valorPago ?? ag.valor ?? 0), 0),
    tempoTotalAtendimento: agendamentosDoDia.reduce((total, ag) => total + (ag.duracao || 0), 0)
  }), [agendamentosDoDia]);
  const horariosDisponiveis = reactExports.useMemo(() => {
    const diaSemana = (/* @__PURE__ */ new Date(dataSelecionadaStr + "T00:00:00")).getDay();
    const slots = getHorariosDisponiveis?.(diaSemana, 60) || [];
    return slots.filter((slot) => {
      const start = timeToMinutes$1(slot);
      const end = start + 60;
      const conflita = agendamentosDoDia.some((ag) => {
        const aStart = timeToMinutes$1(ag.hora);
        const aEnd = aStart + (ag.duracao || 60);
        return overlaps(start, end, aStart, aEnd);
      });
      return !conflita;
    });
  }, [getHorariosDisponiveis, dataSelecionadaStr, agendamentosDoDia]);
  const anteriorDia = () => setDataSelecionada((prev) => subDays(prev, 1));
  const proximoDia = () => setDataSelecionada((prev) => addDays(prev, 1));
  const hoje = () => setDataSelecionada(/* @__PURE__ */ new Date());
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-32 bg-muted animate-pulse rounded-lg" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-96 bg-muted animate-pulse rounded-lg" })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-accent/10 to-primary/10 border border-border/50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: anteriorDia,
            className: "h-9 w-9 p-0 rounded-full transition-all hover:scale-110 hover:shadow-md",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center min-w-[200px] lg:min-w-[250px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg lg:text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent", children: format(dataSelecionada, "EEEE, dd 'de' MMMM", { locale: ptBR }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-medium", children: format(dataSelecionada, "yyyy", { locale: ptBR }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: proximoDia,
            className: "h-9 w-9 p-0 rounded-full transition-all hover:scale-110 hover:shadow-md",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "default",
          size: "sm",
          onClick: hoje,
          className: "w-full sm:w-auto transition-all hover:scale-105 shadow-md",
          children: "Hoje"
        }
      )
    ] }),
    proximoAgendamento && new Date(dataSelecionada).toDateString() === (/* @__PURE__ */ new Date()).toDateString() && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-0 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 shadow-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col lg:flex-row lg:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-full bg-primary/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-4 w-4 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-primary", children: "Próximo Cliente" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold", children: proximoAgendamento.clienteNome }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: proximoAgendamento.servicoNome }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3" }),
              proximoAgendamento.hora,
              " (",
              proximoAgendamento.duracao,
              "min)"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-3 w-3" }),
              "R$ ",
              Number(proximoAgendamento.valor ?? 0).toFixed(2)
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center lg:text-right", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-primary", children: proximoAgendamento.hora }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Horário previsto" })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-5 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "group border-0 bg-gradient-to-br from-info/10 to-info/5 dark:from-info/10 dark:to-info/5 transition-all hover:shadow-lg hover:scale-105", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-full bg-info/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-5 w-5 text-info" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl lg:text-2xl font-bold text-info", children: estatisticasDia.agendados }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs lg:text-sm text-info/70 font-medium", children: "Agendados" })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "group border-0 bg-gradient-to-br from-success/10 to-success/5 dark:from-success/10 dark:to-success/5 transition-all hover:shadow-lg hover:scale-105", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-full bg-success/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-5 w-5 text-success" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl lg:text-2xl font-bold text-success", children: estatisticasDia.concluidos }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs lg:text-sm text-success/70 font-medium", children: "Concluídos" })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "group border-0 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/20 transition-all hover:shadow-lg hover:scale-105", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-5 w-5 text-purple-600 dark:text-purple-400" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-lg lg:text-xl font-bold text-purple-700 dark:text-purple-300", children: [
          "R$ ",
          estatisticasDia.valorTotal.toFixed(2)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs lg:text-sm text-purple-600/70 dark:text-purple-400/70 font-medium", children: "Valor Total" })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "group border-0 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/20 dark:to-emerald-900/20 transition-all hover:shadow-lg hover:scale-105", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-5 w-5 text-emerald-600 dark:text-emerald-400" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-lg lg:text-xl font-bold text-emerald-700 dark:text-emerald-300", children: [
          "R$ ",
          estatisticasDia.valorRecebido.toFixed(2)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs lg:text-sm text-emerald-600/70 dark:text-emerald-400/70 font-medium", children: "Recebido" })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "group border-0 bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/20 dark:to-orange-900/20 transition-all hover:shadow-lg hover:scale-105", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-5 w-5 text-orange-600 dark:text-orange-400" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-lg lg:text-xl font-bold text-orange-700 dark:text-orange-300", children: [
          Math.floor(estatisticasDia.tempoTotalAtendimento / 60),
          "h",
          estatisticasDia.tempoTotalAtendimento % 60,
          "m"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs lg:text-sm text-orange-600/70 dark:text-orange-400/70 font-medium", children: "Tempo Total" })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar", role: "region", "aria-label": "Timeline de agendamentos do dia", children: [
      horariosDisponiveis.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-0 bg-gradient-to-br from-primary/5 to-accent/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: horariosDisponiveis.map((h) => {
        const baseCls = "px-3 py-1 rounded-full text-xs font-medium border";
        const cls = onSlotClick ? `${baseCls} cursor-pointer bg-primary/10 text-primary border-primary/30 hover:bg-primary/20 transition-colors` : `${baseCls} bg-muted text-muted-foreground border-border/50`;
        return onSlotClick ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: cls,
            onClick: () => onSlotClick(dataSelecionadaStr, h),
            children: h
          },
          h
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cls, children: h }, h);
      }) }) }) }),
      agendamentosDoDia.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-12 rounded-xl bg-gradient-to-br from-muted/30 to-muted/10 border border-dashed border-muted-foreground/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-16 w-16 items-center justify-center mx-auto mb-4 rounded-full bg-muted/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-8 w-8 text-muted-foreground/50" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-muted-foreground mb-2", children: "Dia livre" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground/70", children: "Nenhum agendamento para este dia" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", role: "list", "aria-live": "polite", "aria-busy": false, children: agendamentosDoDia.map((agendamento, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          className: cn(
            "group relative overflow-hidden border-0 bg-card/80 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer",
            agendamento.origem === "cronograma" && "bg-gradient-to-r from-purple-50/80 to-purple-100/30 dark:from-purple-950/30 dark:to-purple-900/20",
            agendamento.status === "concluido" && "bg-gradient-to-r from-green-50/80 to-green-100/30 dark:from-green-950/30 dark:to-green-900/20",
            agendamento.status === "cancelado" && "bg-gradient-to-r from-red-50/80 to-red-100/30 dark:from-red-950/30 dark:to-red-900/20"
          ),
          role: "listitem",
          onClick: () => {
            setAgendamentoSelecionado(agendamento);
            setDetalheAberto(true);
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-white/5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "relative p-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col lg:flex-row lg:items-center justify-between gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 dark:bg-primary/20", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 text-primary" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm font-semibold text-primary", children: agendamento.hora })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-4 w-4 text-muted-foreground" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: agendamento.clienteNome })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "h-4 w-4 text-muted-foreground" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: agendamento.servicoNome })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
                    (() => {
                      const origem = getOrigemBadge(agendamento.origem);
                      if (!origem) return null;
                      return /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: origem.className, children: [
                        origem.emoji,
                        " ",
                        origem.label
                      ] });
                    })(),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Badge,
                      {
                        variant: "outline",
                        className: cn(
                          "border-0 font-medium",
                          getStatusBadgeClass(agendamento.status)
                        ),
                        children: agendamento.status
                      }
                    ),
                    !isAgendamentoValido(toISODate(agendamento.data), agendamento.hora, agendamento.duracao) && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "destructive", className: "bg-amber-100 text-amber-800 border-0", children: "Fora do horário" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-bold text-green-700 dark:text-green-300", children: [
                      "R$ ",
                      Number(agendamento.valor ?? 0).toFixed(2)
                    ] }) })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-4 text-xs text-muted-foreground", children: [
                  agendamento.clienteTelefone && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                    "📞 ",
                    agendamento.clienteTelefone
                  ] }),
                  agendamento.clienteEmail && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                    "✉️ ",
                    agendamento.clienteEmail
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                    "⏱️ Duração: ",
                    agendamento.duracao,
                    "min"
                  ] }),
                  agendamento.valorPago > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-green-600", children: [
                    "💰 Pago: R$ ",
                    agendamento.valorPago.toFixed(2)
                  ] })
                ] })
              ] }),
              String(agendamento.id).startsWith("online_") && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  onClick: async () => {
                    const ok = await converterAgendamentoOnlineParaRegular?.(String(agendamento.id).replace("online_", ""));
                    if (ok) {
                      Jt.success("Agendamento online convertido com sucesso");
                    } else {
                      Jt.error("Falha ao converter agendamento online");
                    }
                  },
                  children: "Converter para regular"
                }
              ) }),
              agendamento.observacoes && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 pt-3 border-t border-border/50", children: agendamento.observacoes.includes("Compra de produto:") ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                agendamento.observacoes.split("Compra de produto:")[0].trim() && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground italic mb-1", children: [
                  '"',
                  agendamento.observacoes.split("Compra de produto:")[0].trim(),
                  '"'
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-primary/5 p-2.5 rounded-xl border border-primary/10 animate-in fade-in zoom-in duration-300", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white p-1.5 rounded-lg shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-3.5 w-3.5 text-primary" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 min-w-0", children: (() => {
                    try {
                      const jsonStr = agendamento.observacoes.split("Compra de produto:")[1].trim();
                      const compra = JSON.parse(jsonStr);
                      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-bold text-foreground truncate", children: [
                          compra.produto_nome,
                          " ",
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground font-medium ml-1", children: [
                            "x",
                            compra.quantidade
                          ] })
                        ] }),
                        compra.valor_total && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-black text-primary bg-primary/10 px-1.5 py-0.5 rounded-full", children: [
                          "+ R$ ",
                          compra.valor_total.toFixed(2).replace(".", ",")
                        ] })
                      ] });
                    } catch (e) {
                      return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-red-500", children: "Erro nos dados do produto" });
                    }
                  })() })
                ] })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground italic", children: [
                '"',
                agendamento.observacoes,
                '"'
              ] }) })
            ] })
          ]
        },
        agendamento.id
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: detalheAberto, onOpenChange: setDetalheAberto, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "sr-only", children: "Detalhes do agendamento" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "sr-only", children: "Informações do agendamento" })
      ] }),
      agendamentoSelecionado && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: agendamentoSelecionado.clienteNome }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-info/20 text-info border-0 capitalize", children: agendamentoSelecionado.status })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: format(/* @__PURE__ */ new Date(agendamentoSelecionado.data + "T12:00:00"), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: "Horário" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium", children: [
              agendamentoSelecionado.hora,
              " (",
              agendamentoSelecionado.duracao,
              "min)"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: "Serviço" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: agendamentoSelecionado.servicoNome })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: "Valor" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium", children: [
              "R$ ",
              Number(agendamentoSelecionado.valor ?? 0).toFixed(2)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: "Origem" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium capitalize", children: agendamentoSelecionado.origem || "manual" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm space-y-1", children: [
          agendamentoSelecionado.clienteTelefone && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "📞" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: agendamentoSelecionado.clienteTelefone })
          ] }),
          agendamentoSelecionado.clienteEmail && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "✉️" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: agendamentoSelecionado.clienteEmail })
          ] }),
          agendamentoSelecionado.observacoes && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 p-3 rounded-xl bg-muted/40 border border-border/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-black uppercase tracking-widest text-muted-foreground mb-2", children: "Observações e Pedidos" }),
            agendamentoSelecionado.observacoes.includes("Compra de produto:") ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
              agendamentoSelecionado.observacoes.split("Compra de produto:")[0].trim() && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm italic text-foreground/80 mb-2", children: [
                '"',
                agendamentoSelecionado.observacoes.split("Compra de produto:")[0].trim(),
                '"'
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-primary/5 p-3 rounded-xl border-2 border-primary/10 flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white p-2 rounded-lg shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-4 w-4 text-primary" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1", children: (() => {
                  try {
                    const jsonStr = agendamentoSelecionado.observacoes.split("Compra de produto:")[1].trim();
                    const compra = JSON.parse(jsonStr);
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-foreground", children: compra.produto_nome }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-0.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-black bg-primary/10 text-primary px-1.5 py-0.5 rounded-full", children: [
                          "x",
                          compra.quantidade,
                          " unidades"
                        ] }),
                        compra.valor_total && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-black text-muted-foreground uppercase tracking-tighter", children: [
                          "Total: R$ ",
                          compra.valor_total.toFixed(2).replace(".", ",")
                        ] })
                      ] })
                    ] });
                  } catch (e) {
                    return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-red-500", children: "Erro nos dados do produto" });
                  }
                })() })
              ] })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "italic text-sm", children: [
              '"',
              agendamentoSelecionado.observacoes,
              '"'
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => {
                setDetalheAberto(false);
                onSlotClick?.(agendamentoSelecionado.data, agendamentoSelecionado.hora);
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "h-4 w-4 mr-2" }),
                "Editar"
              ]
            }
          ),
          agendamentoSelecionado && agendamentoSelecionado.status === "agendado" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "destructive",
              size: "sm",
              onClick: async () => {
                const ok = await cancelarAgendamento?.(agendamentoSelecionado.id);
                if (ok) {
                  Jt.success("Agendamento cancelado com sucesso");
                  setDetalheAberto(false);
                }
              },
              children: "Cancelar Agendamento"
            }
          ),
          agendamentoSelecionado && String(agendamentoSelecionado.id).startsWith("online_") && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: async () => {
                const ok = await converterAgendamentoOnlineParaRegular?.(String(agendamentoSelecionado.id).replace("online_", ""));
                if (ok) {
                  Jt.success("Agendamento online convertido com sucesso");
                } else {
                  Jt.error("Falha ao converter agendamento online");
                }
              },
              children: "Converter para regular"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setDetalheAberto(false), autoFocus: true, children: "Fechar" })
        ] })
      ] })
    ] }) })
  ] });
}

function AgendaSemanal({ buscaTexto = "", onSlotClick }) {
  const [semanaAtual, setSemanaAtual] = reactExports.useState(/* @__PURE__ */ new Date());
  const {
    todosAgendamentos,
    loading,
    converterAgendamentoOnlineParaRegular,
    cancelarAgendamento} = useAgendamentos();
  const { getHorariosDisponiveis } = useHorariosTrabalho();
  const [detalheAberto, setDetalheAberto] = reactExports.useState(false);
  const [agendamentoSelecionado, setAgendamentoSelecionado] = reactExports.useState(null);
  const [diaDialogAberto, setDiaDialogAberto] = reactExports.useState(false);
  const [diaSelecionado, setDiaSelecionado] = reactExports.useState(null);
  const inicioSemana = startOfWeek(semanaAtual, { weekStartsOn: 0 });
  const fimSemana = endOfWeek(semanaAtual, { weekStartsOn: 0 });
  const diasDaSemana = reactExports.useMemo(
    () => eachDayOfInterval({ start: inicioSemana, end: fimSemana }),
    [inicioSemana, fimSemana]
  );
  const termo = buscaTexto.trim().toLowerCase();
  const getAgendamentosDoDia = (dia) => {
    return todosAgendamentos.filter((ag) => isSameDay(safeToDate(ag.data), dia)).filter((ag) => {
      if (!termo) return true;
      const campos = [
        ag.clienteNome,
        ag.servicoNome,
        ag.status,
        ag.origem,
        ag.hora,
        ag.observacoes || ""
      ].map((v) => String(v || "").toLowerCase());
      return campos.some((c) => c.includes(termo));
    }).sort((a, b) => a.hora.localeCompare(b.hora));
  };
  const semanaAnterior = () => setSemanaAtual((prev) => subWeeks(prev));
  const proximaSemana = () => setSemanaAtual((prev) => addWeeks(prev, 1));
  const semanaAtualBtn = () => setSemanaAtual(/* @__PURE__ */ new Date());
  const agendamentosSemana = reactExports.useMemo(() => diasDaSemana.reduce((agendamentos, dia) => [...agendamentos, ...getAgendamentosDoDia(dia)], []), [diasDaSemana, todosAgendamentos, termo]);
  const agendadosSemana = reactExports.useMemo(() => agendamentosSemana.filter((ag) => ag.status === "agendado"), [agendamentosSemana]);
  const concluidosSemana = reactExports.useMemo(() => agendamentosSemana.filter((ag) => ag.status === "concluido"), [agendamentosSemana]);
  const valorTotalAReceber = reactExports.useMemo(() => agendadosSemana.reduce((total, ag) => total + Number(ag.valor ?? 0), 0), [agendadosSemana]);
  const getHorariosDisponiveisDoDia = (dia) => {
    const diaSemana = dia.getDay();
    const slots = getHorariosDisponiveis?.(diaSemana, 60) || [];
    const ags = getAgendamentosDoDia(dia);
    return slots.filter((slot) => {
      const start = timeToMinutes$1(slot);
      const end = start + 60;
      const conflita = ags.some((ag) => {
        const aStart = timeToMinutes$1(ag.hora);
        const aEnd = aStart + (ag.duracao || 60);
        return overlaps(start, end, aStart, aEnd);
      });
      return !conflita;
    });
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-32 bg-muted animate-pulse rounded-lg" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-96 bg-muted animate-pulse rounded-lg" })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-accent/10 to-primary/10 border border-border/50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: semanaAnterior,
            className: "h-9 w-9 p-0 rounded-full transition-all hover:scale-110 hover:shadow-md",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center min-w-[280px] lg:min-w-[350px]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg lg:text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent", children: [
          format(inicioSemana, "dd 'de' MMM", { locale: ptBR }),
          " - ",
          format(fimSemana, "dd 'de' MMM 'de' yyyy", { locale: ptBR })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: proximaSemana,
            className: "h-9 w-9 p-0 rounded-full transition-all hover:scale-110 hover:shadow-md",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "default",
          size: "sm",
          onClick: semanaAtualBtn,
          className: "w-full sm:w-auto transition-all hover:scale-105 shadow-md",
          children: "Semana Atual"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-0 bg-gradient-to-br from-info/10 to-info/5 dark:from-info/10 dark:to-info/5 shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center space-x-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-full bg-info/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-6 w-6 text-info" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold text-info", children: agendadosSemana.length }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-info/70 font-medium", children: "Agendados" })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-0 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/20 shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center space-x-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-6 w-6 text-purple-600 dark:text-purple-400" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-3xl font-bold text-purple-700 dark:text-purple-300", children: [
            "R$ ",
            valorTotalAReceber.toFixed(2)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-purple-600/70 dark:text-purple-400/70 font-medium", children: "A Receber" })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-0 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/20 shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center space-x-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-6 w-6 text-green-600 dark:text-green-400" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold text-green-700 dark:text-green-300", children: concluidosSemana.length }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-green-600/70 dark:text-green-400/70 font-medium", children: "Concluídos" })
        ] })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2", role: "list", "aria-label": "Dias da semana", children: diasDaSemana.map((dia) => {
      const ags = getAgendamentosDoDia(dia);
      const disponiveis = getHorariosDisponiveisDoDia(dia);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-0 bg-card/60", role: "listitem", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-3 space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: "flex items-center justify-between w-full text-left",
            onClick: () => {
              setDiaSelecionado(dia);
              setDiaDialogAberto(true);
            },
            "aria-label": `Ver todos os horários de ${format(dia, "EEEE, dd 'de' MMM", { locale: ptBR })}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-sm sm:text-base capitalize", children: format(dia, "EEEE, dd 'de' MMM", { locale: ptBR }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "border-0 bg-info/20 text-info text-xs", children: [
                ags.length,
                " agend."
              ] })
            ]
          }
        ),
        ags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2 text-xs text-muted-foreground", role: "list", "aria-label": "Horários do dia", children: [
          ags.slice(0, 6).map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                setAgendamentoSelecionado(a);
                setDetalheAberto(true);
              },
              className: "px-2 py-1.5 rounded-md bg-muted hover:bg-muted/80 transition-colors text-center truncate",
              "aria-label": `Ver detalhes de ${a.clienteNome} às ${a.hora}`,
              role: "listitem",
              children: a.hora
            },
            a.id
          )),
          ags.length > 6 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "px-2 py-1.5 rounded-md bg-muted text-center flex items-center justify-center", children: [
            "+",
            ags.length - 6
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-medium mb-2 text-muted-foreground", children: "Horários disponíveis" }),
          disponiveis.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Sem horários disponíveis" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 sm:grid-cols-5 gap-2", children: [
            disponiveis.slice(0, 10).map((h) => {
              const baseCls = "px-1 py-1.5 rounded-md text-xs border text-center transition-colors";
              const cls = onSlotClick ? `${baseCls} cursor-pointer bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200/60 hover:bg-emerald-200` : `${baseCls} bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200/60`;
              return onSlotClick ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  className: cls,
                  onClick: () => onSlotClick?.(String(dia.toISOString()).slice(0, 10), h),
                  children: h
                },
                h
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cls, children: h }, h);
            }),
            disponiveis.length > 10 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "px-1 py-1.5 rounded-md text-xs bg-muted text-center flex items-center justify-center", children: [
              "+",
              disponiveis.length - 10
            ] })
          ] })
        ] })
      ] }) }, dia.toISOString());
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: detalheAberto, onOpenChange: setDetalheAberto, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "sr-only", children: "Detalhes do agendamento" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "sr-only", children: "Informações do agendamento" })
      ] }),
      agendamentoSelecionado && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: agendamentoSelecionado.clienteNome }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-info/20 text-info border-0 capitalize", children: agendamentoSelecionado.status })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: format(safeToDate(String(agendamentoSelecionado.data)), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: "Horário" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium", children: [
              agendamentoSelecionado.hora,
              " (",
              agendamentoSelecionado.duracao,
              "min)"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: "Serviço" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: agendamentoSelecionado.servicoNome })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: "Valor" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium", children: [
              "R$ ",
              Number(agendamentoSelecionado.valor ?? 0).toFixed(2)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: "Origem" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium capitalize", children: agendamentoSelecionado.origem || "manual" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm space-y-1", children: [
          agendamentoSelecionado.clienteTelefone && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "📞" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: agendamentoSelecionado.clienteTelefone })
          ] }),
          agendamentoSelecionado.clienteEmail && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "✉️" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: agendamentoSelecionado.clienteEmail })
          ] }),
          agendamentoSelecionado.observacoes && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 p-3 rounded-md bg-muted/60", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground mb-1", children: "Observações" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "italic", children: [
              '"',
              agendamentoSelecionado.observacoes,
              '"'
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => {
                setDetalheAberto(false);
                onSlotClick?.(agendamentoSelecionado.data, agendamentoSelecionado.hora);
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "h-4 w-4 mr-2" }),
                "Editar"
              ]
            }
          ),
          agendamentoSelecionado && agendamentoSelecionado.status === "agendado" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "destructive",
              size: "sm",
              onClick: async () => {
                const ok = await cancelarAgendamento?.(agendamentoSelecionado.id);
                if (ok) {
                  Jt.success("Agendamento cancelado com sucesso");
                  setDetalheAberto(false);
                }
              },
              children: "Cancelar Agendamento"
            }
          ),
          agendamentoSelecionado && String(agendamentoSelecionado.id).startsWith("online_") && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: async () => {
                const ok = await converterAgendamentoOnlineParaRegular?.(String(agendamentoSelecionado.id).replace("online_", ""));
                if (ok) {
                  Jt.success("Agendamento online convertido com sucesso");
                } else {
                  Jt.error("Falha ao converter agendamento online");
                }
              },
              children: "Converter para regular"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setDetalheAberto(false), autoFocus: true, children: "Fechar" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: diaDialogAberto, onOpenChange: setDiaDialogAberto, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-2xl max-h-[80vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: diaSelecionado ? format(diaSelecionado, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : "Detalhes do Dia" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Todos os horários agendados e disponíveis para o dia." })
      ] }),
      diaSelecionado && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        (() => {
          const ags = getAgendamentosDoDia(diaSelecionado);
          const disponiveis = getHorariosDisponiveisDoDia(diaSelecionado);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-0 bg-card/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-medium", children: [
                "Agendados (",
                ags.length,
                ")"
              ] }),
              ags.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Nenhum agendamento" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 max-h-64 overflow-y-auto pr-1", role: "list", "aria-label": "Agendados do dia", children: ags.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setAgendamentoSelecionado(a);
                    setDetalheAberto(true);
                  },
                  className: "px-2 py-1 rounded-md bg-muted hover:bg-muted/80 text-xs transition-colors",
                  role: "listitem",
                  children: a.hora
                },
                a.id
              )) })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-0 bg-card/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-medium", children: [
                "Horários disponíveis (",
                disponiveis.length,
                ")"
              ] }),
              disponiveis.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Sem horários disponíveis" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 max-h-64 overflow-y-auto pr-1", role: "list", "aria-label": "Horários disponíveis do dia", children: disponiveis.map((h) => {
                const baseCls = "px-2 py-1 rounded-full text-xs border";
                const cls = onSlotClick ? `${baseCls} cursor-pointer bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200/60 hover:bg-emerald-200` : `${baseCls} bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200/60`;
                return onSlotClick ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    className: cls,
                    role: "listitem",
                    onClick: () => onSlotClick?.(String(diaSelecionado?.toISOString() || "").slice(0, 10), h),
                    children: h
                  },
                  h
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cls, role: "listitem", children: h }, h);
              }) })
            ] }) })
          ] });
        })(),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setDiaDialogAberto(false), autoFocus: true, children: "Fechar" }) })
      ] })
    ] }) })
  ] });
}

function AgendaMensal({ buscaTexto = "" }) {
  const [mesAtual, setMesAtual] = reactExports.useState(/* @__PURE__ */ new Date());
  const { todosAgendamentos, loading, verificarConflito, atualizarAgendamento, cancelarAgendamento, converterAgendamentoOnlineParaRegular } = useAgendamentos();
  const { user } = useAuth();
  const [diaSelecionado, setDiaSelecionado] = reactExports.useState(null);
  const [detalheAberto, setDetalheAberto] = reactExports.useState(false);
  const [reagendarAberto, setReagendarAberto] = reactExports.useState(false);
  const [agendamentoSelecionado, setAgendamentoSelecionado] = reactExports.useState(null);
  const [detalhesAgendamentoAberto, setDetalhesAgendamentoAberto] = reactExports.useState(false);
  startOfMonth(mesAtual);
  endOfMonth(mesAtual);
  const mesAnterior = () => setMesAtual((prev) => subMonths(prev, 1));
  const proximoMes = () => setMesAtual((prev) => addMonths(prev, 1));
  const mesAtualBtn = () => setMesAtual(/* @__PURE__ */ new Date());
  const termo = buscaTexto.trim().toLowerCase();
  const agendamentosDoMes = reactExports.useMemo(() => {
    const mesChave = toISODate(mesAtual).slice(0, 7);
    return todosAgendamentos.filter((ag) => toISODate(ag.data).slice(0, 7) === mesChave).filter((ag) => {
      if (!termo) return true;
      const campos = [
        ag.clienteNome,
        ag.servicoNome,
        ag.status,
        ag.origem,
        ag.hora,
        ag.observacoes || ""
      ].map((v) => String(v || "").toLowerCase());
      return campos.some((c) => c.includes(termo));
    });
  }, [todosAgendamentos, mesAtual, termo]);
  const agendadosMes = reactExports.useMemo(() => agendamentosDoMes.filter((ag) => ag.status === "agendado"), [agendamentosDoMes]);
  const concluidosMes = reactExports.useMemo(() => agendamentosDoMes.filter((ag) => ag.status === "concluido"), [agendamentosDoMes]);
  const valorTotalAReceber = reactExports.useMemo(() => agendadosMes.reduce((total, ag) => total + Number(ag.valor ?? 0), 0), [agendadosMes]);
  const diasVisiveis = reactExports.useMemo(() => {
    const inicio = startOfWeek(startOfMonth(mesAtual), { weekStartsOn: 0 });
    const fim = endOfWeek(endOfMonth(mesAtual), { weekStartsOn: 0 });
    return eachDayOfInterval({ start: inicio, end: fim });
  }, [mesAtual]);
  const [contagemPorDia, setContagemPorDia] = reactExports.useState(/* @__PURE__ */ new Map());
  reactExports.useEffect(() => {
    let cancelado = false;
    const carregar = async () => {
      try {
        if (!user) return;
        const { data, error } = await supabase.rpc("contagem_agendamentos_por_dia", {
          p_user_id: user.id,
          p_mes: toISODate(mesAtual)
        });
        if (error || !Array.isArray(data)) {
          const mapa2 = /* @__PURE__ */ new Map();
          for (const ag of agendamentosDoMes) {
            const chave = toISODate(ag.data);
            mapa2.set(chave, (mapa2.get(chave) || 0) + 1);
          }
          if (!cancelado) setContagemPorDia(mapa2);
          return;
        }
        const mapa = /* @__PURE__ */ new Map();
        for (const row of data) {
          const chave = toISODate(row.dia);
          mapa.set(chave, Number(row.total || 0));
        }
        if (!cancelado) setContagemPorDia(mapa);
      } catch {
        const mapa = /* @__PURE__ */ new Map();
        for (const ag of agendamentosDoMes) {
          const chave = toISODate(ag.data);
          mapa.set(chave, (mapa.get(chave) || 0) + 1);
        }
        if (!cancelado) setContagemPorDia(mapa);
      }
    };
    carregar();
    return () => {
      cancelado = true;
    };
  }, [user, mesAtual, agendamentosDoMes]);
  const getAgendamentosDoDia = reactExports.useCallback((dia) => {
    const chaveDia = toISODate(dia);
    return agendamentosDoMes.filter((ag) => toISODate(ag.data) === chaveDia).sort((a, b) => a.hora.localeCompare(b.hora));
  }, [agendamentosDoMes]);
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 lg:space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-32 bg-muted animate-pulse rounded-lg" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-96 bg-muted animate-pulse rounded-lg" })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 lg:space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-accent/10 to-primary/10 border border-border/50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: mesAnterior,
            className: "h-9 w-9 p-0 rounded-full transition-all hover:scale-110 hover:shadow-md",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center min-w-[220px] lg:min-w-[280px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg lg:text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent", children: format(mesAtual, "MMMM 'de' yyyy", { locale: ptBR }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: proximoMes,
            className: "h-9 w-9 p-0 rounded-full transition-all hover:scale-110 hover:shadow-md",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "default",
          size: "sm",
          onClick: mesAtualBtn,
          className: "w-full sm:w-auto transition-all hover:scale-105 shadow-md",
          children: "Mês Atual"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "group border-0 bg-gradient-to-br from-info/10 to-info/5 dark:from-info/10 dark:to-info/5 transition-all hover:shadow-lg hover:scale-105", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-6 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl lg:text-4xl font-bold text-info", children: agendadosMes.length }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-info/70 font-medium", children: "Agendados" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "group border-0 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/20 transition-all hover:shadow-lg hover:scale-105", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-6 w-6 text-purple-600 dark:text-purple-400" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-3xl lg:text-4xl font-bold text-purple-600 dark:text-purple-400", children: [
          "R$ ",
          valorTotalAReceber.toFixed(2)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-purple-600/70 dark:text-purple-400/70 font-medium", children: "A Receber" })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "group border-0 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/20 transition-all hover:shadow-lg hover:scale-105", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-6 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl lg:text-4xl font-bold text-green-600 dark:text-green-400", children: concluidosMes.length }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-green-600/70 dark:text-green-400/70 font-medium", children: "Concluídos" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-0 bg-card/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-7 gap-2 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center font-medium", children: "Dom" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center font-medium", children: "Seg" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center font-medium", children: "Ter" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center font-medium", children: "Qua" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center font-medium", children: "Qui" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center font-medium", children: "Sex" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center font-medium", children: "Sáb" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-7 gap-2", role: "grid", "aria-label": "Calendário mensal", children: diasVisiveis.map((dia) => {
        const dentroDoMes = isSameMonth(dia, mesAtual);
        const chave = toISODate(dia);
        const count = contagemPorDia.get(chave) || 0;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => {
              setDiaSelecionado(dia);
              setDetalheAberto(true);
            },
            className: `relative p-2 rounded-lg text-left border transition-colors ${dentroDoMes ? "bg-background hover:bg-muted border-border/60" : "bg-muted/40 text-muted-foreground/70 border-transparent"}`,
            "aria-label": `${format(dia, "dd 'de' MMMM", { locale: ptBR })} - ${count} agendamentos`,
            role: "gridcell",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-sm font-medium ${dentroDoMes ? "text-foreground" : "text-muted-foreground/70"}`, children: format(dia, "d", { locale: ptBR }) }),
              count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-info/20 text-info border-0", "aria-label": `${count} agendamentos`, children: count })
            ] })
          },
          chave
        );
      }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: detalheAberto, onOpenChange: setDetalheAberto, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-2xl max-h-[80vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "sr-only", children: "Detalhes do dia" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "sr-only", children: "Agendamentos do dia" })
      ] }),
      diaSelecionado && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: format(diaSelecionado, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Agendamentos do dia" })
        ] }),
        (() => {
          const ags = getAgendamentosDoDia(diaSelecionado);
          return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: ags.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Nenhum agendamento" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", role: "list", "aria-label": "Agendamentos do dia", children: ags.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 rounded-md bg-muted", role: "listitem", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-semibold", children: a.hora }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium", children: a.clienteNome }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: a.servicoNome })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-semibold whitespace-nowrap", children: [
                "R$ ",
                Number(a.valor ?? 0).toFixed(2)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-wrap gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  onClick: () => {
                    setAgendamentoSelecionado(a);
                    setDetalhesAgendamentoAberto(true);
                  },
                  children: "Detalhes"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  onClick: () => {
                    setAgendamentoSelecionado(a);
                    setReagendarAberto(true);
                  },
                  children: "Reagendar"
                }
              ),
              a.status !== "concluido" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "default",
                  size: "sm",
                  onClick: async () => {
                    await atualizarAgendamento?.(a.id, { status: "concluido" });
                  },
                  children: "Marcar concluído"
                }
              ),
              a.status !== "cancelado" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "destructive",
                  size: "sm",
                  onClick: async () => {
                    await cancelarAgendamento?.(a.id);
                  },
                  children: "Cancelar"
                }
              ),
              String(a.id).startsWith("online_") && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  onClick: async () => {
                    const ok = await converterAgendamentoOnlineParaRegular?.(String(a.id).replace("online_", ""));
                    if (ok) {
                      Jt.success("Agendamento online convertido com sucesso");
                    } else {
                      Jt.error("Falha ao converter agendamento online");
                    }
                  },
                  children: "Converter para regular"
                }
              )
            ] })
          ] }, a.id)) }) });
        })(),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setDetalheAberto(false), autoFocus: true, children: "Fechar" }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ReagendamentoDialog,
      {
        open: reagendarAberto,
        onOpenChange: setReagendarAberto,
        agendamento: agendamentoSelecionado,
        onReagendar: async (id, novaData, novaHora) => {
          const ok = await atualizarAgendamento?.(id, { data: novaData, hora: novaHora });
          return !!ok;
        },
        verificarConflito
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: detalhesAgendamentoAberto, onOpenChange: setDetalhesAgendamentoAberto, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: agendamentoSelecionado ? agendamentoSelecionado.clienteNome : "Detalhes do Agendamento" }),
          agendamentoSelecionado && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-info/20 text-info border-0 capitalize", children: agendamentoSelecionado.status })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: agendamentoSelecionado ? `${agendamentoSelecionado.hora} - ${agendamentoSelecionado.servicoNome}` : "Informações do agendamento selecionado." })
      ] }),
      agendamentoSelecionado && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: "Horário" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium", children: [
              agendamentoSelecionado.hora,
              " (",
              agendamentoSelecionado.duracao,
              "min)"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: "Serviço" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: agendamentoSelecionado.servicoNome })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: "Valor" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium", children: [
              "R$ ",
              Number(agendamentoSelecionado.valor ?? 0).toFixed(2)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground", children: "Origem" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium capitalize", children: agendamentoSelecionado.origem || "manual" })
          ] })
        ] }),
        agendamentoSelecionado.observacoes && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 p-3 rounded-md bg-muted/60 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground mb-1", children: "Observações" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "italic", children: [
            '"',
            agendamentoSelecionado.observacoes,
            '"'
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setDetalhesAgendamentoAberto(false), autoFocus: true, children: "Fechar" }) })
      ] })
    ] }) })
  ] });
}

function MinhaAgenda() {
  const [params, setParams] = useSearchParams();
  const tabParam = params.get("tab") || "semana";
  const [tab, setTab] = reactExports.useState(tabParam);
  const {
    agendamentos,
    agendamentosFiltrados,
    filtros,
    setFiltros,
    paginaAtual,
    setPaginaAtual,
    totalPaginas,
    clientes,
    servicos,
    criarAgendamento,
    atualizarAgendamento,
    excluirAgendamento,
    cancelarAgendamento,
    verificarConflito,
    todosAgendamentos
  } = useAgendamentos();
  const [buscaTexto, setBuscaTexto] = reactExports.useState("");
  const [visualizacaoAtual, setVisualizacaoAtual] = reactExports.useState("lista");
  const [agendamentoSelecionado, setAgendamentoSelecionado] = reactExports.useState(null);
  const [dialogReagendamentoOpen, setDialogReagendamentoOpen] = reactExports.useState(false);
  const [agendamentoParaReagendar, setAgendamentoParaReagendar] = reactExports.useState(null);
  const [dialogTrocaHorarioOpen, setDialogTrocaHorarioOpen] = reactExports.useState(false);
  const [agendamentoParaTrocar, setAgendamentoParaTrocar] = reactExports.useState(null);
  const [dialogPagamentoOpen, setDialogPagamentoOpen] = reactExports.useState(false);
  const [agendamentoParaPagar, setAgendamentoParaPagar] = reactExports.useState(null);
  const [initialForm, setInitialForm] = reactExports.useState(null);
  reactExports.useEffect(() => {
    setParams((prev) => {
      const p = new URLSearchParams(prev);
      p.set("tab", tab);
      return p;
    }, { replace: true });
    try {
      localStorage.setItem("minhaAgenda.tab", tab);
    } catch {
    }
  }, [tab, setParams]);
  reactExports.useEffect(() => {
    if (!params.get("tab")) {
      try {
        const saved = localStorage.getItem("minhaAgenda.tab");
        if (saved) setTab(saved);
      } catch {
      }
    }
  }, []);
  const hoje = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const amanha = new Date(Date.now() + 24 * 60 * 60 * 1e3).toISOString().split("T")[0];
  const inicioSemana = /* @__PURE__ */ new Date();
  inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay());
  const fimSemana = new Date(inicioSemana);
  fimSemana.setDate(fimSemana.getDate() + 6);
  const agendamentosHoje = reactExports.useMemo(
    () => agendamentosFiltrados.filter((ag) => ag.data === hoje && ag.status !== "cancelado").length,
    [agendamentosFiltrados, hoje]
  );
  const agendamentosAmanha = reactExports.useMemo(
    () => agendamentosFiltrados.filter((ag) => ag.data === amanha && ag.status !== "cancelado").length,
    [agendamentosFiltrados, amanha]
  );
  const agendamentosEstaSemana = reactExports.useMemo(() => {
    return agendamentosFiltrados.filter((ag) => {
      const data = new Date(ag.data);
      return data >= inicioSemana && data <= fimSemana && ag.status !== "cancelado";
    }).length;
  }, [agendamentosFiltrados]);
  const handleNovoAgendamento = () => {
    setAgendamentoSelecionado(null);
    setVisualizacaoAtual("formulario");
    setTab("lista");
  };
  const handleEditarAgendamento = (agendamento) => {
    setAgendamentoSelecionado(agendamento);
    setVisualizacaoAtual("formulario");
    setTab("lista");
  };
  const handleVerDetalhes = (agendamento) => {
    setAgendamentoSelecionado(agendamento);
    setVisualizacaoAtual("detalhes");
    setTab("lista");
  };
  const handleSubmitFormulario = async (data) => {
    const sucesso = agendamentoSelecionado ? await atualizarAgendamento(agendamentoSelecionado.id, data) : await criarAgendamento({ ...data, origem: "manual" });
    if (sucesso) {
      setVisualizacaoAtual("lista");
      setAgendamentoSelecionado(null);
    }
  };
  const handleVoltarParaLista = () => {
    setVisualizacaoAtual("lista");
    setAgendamentoSelecionado(null);
  };
  const handleCancelarAgendamento = () => {
    if (agendamentoSelecionado) {
      cancelarAgendamento(agendamentoSelecionado.id);
      setVisualizacaoAtual("lista");
      setAgendamentoSelecionado(null);
    }
  };
  const handleReagendar = (agendamento) => {
    setAgendamentoParaReagendar(agendamento);
    setDialogReagendamentoOpen(true);
  };
  const handleConfirmarReagendamento = async (agendamentoId, novaData, novaHora) => {
    const sucesso = await atualizarAgendamento(agendamentoId, { data: novaData, hora: novaHora });
    if (sucesso) {
      setDialogReagendamentoOpen(false);
      setAgendamentoParaReagendar(null);
    }
    return sucesso;
  };
  const handleTrocarHorario = (agendamento) => {
    setAgendamentoParaTrocar(agendamento);
    setDialogTrocaHorarioOpen(true);
  };
  const handleConfirmarTrocaHorario = async (agendamento1Id, agendamento2Id) => {
    try {
      const agendamento1 = todosAgendamentos.find((ag) => ag.id === agendamento1Id);
      const agendamento2 = todosAgendamentos.find((ag) => ag.id === agendamento2Id);
      if (!agendamento1 || !agendamento2) return false;
      const conflito1 = verificarConflito({ data: agendamento2.data, hora: agendamento2.hora, duracao: agendamento1.duracao }, agendamento2Id);
      if (conflito1) {
        toast({ title: "Conflito de horário", description: "O primeiro agendamento não cabe no novo horário.", variant: "destructive" });
        return false;
      }
      const conflito2 = verificarConflito({ data: agendamento1.data, hora: agendamento1.hora, duracao: agendamento2.duracao }, agendamento1Id);
      if (conflito2) {
        toast({ title: "Conflito de horário", description: "O segundo agendamento não cabe no novo horário.", variant: "destructive" });
        return false;
      }
      const s1 = await atualizarAgendamento(agendamento1Id, { data: agendamento2.data, hora: agendamento2.hora });
      const s2 = await atualizarAgendamento(agendamento2Id, { data: agendamento1.data, hora: agendamento1.hora });
      if (s1 && s2) {
        toast({ title: "Horários trocados", description: "Troca realizada com sucesso!" });
      }
      return s1 && s2;
    } catch {
      toast({ title: "Erro ao trocar horários", description: "Tente novamente.", variant: "destructive" });
      return false;
    }
  };
  const handleMarcarPagamento = (agendamento) => {
    setAgendamentoParaPagar(agendamento);
    setDialogPagamentoOpen(true);
  };
  const handleConfirmarPagamento = async (agendamentoId, valorPago, formaPagamento) => {
    const agendamento = todosAgendamentos.find((ag) => ag.id === agendamentoId);
    if (!agendamento) return false;
    const novoValorPago = agendamento.valorPago + valorPago;
    const novoValorDevido = agendamento.valor - novoValorPago;
    let novoStatusPagamento;
    let novoStatus = agendamento.status;
    if (novoValorDevido <= 0) {
      novoStatusPagamento = "pago";
      novoStatus = "concluido";
    } else if (novoValorPago > 0) {
      novoStatusPagamento = "parcial";
    } else {
      novoStatusPagamento = "em_aberto";
    }
    const sucesso = await atualizarAgendamento(agendamentoId, {
      valorPago: novoValorPago,
      valorDevido: Math.max(0, novoValorDevido),
      statusPagamento: novoStatusPagamento,
      status: novoStatus,
      formaPagamento
    });
    if (sucesso) {
      toast({
        title: "Pagamento registrado",
        description: novoStatusPagamento === "pago" ? "Pagamento completo registrado com sucesso!" : `Pagamento parcial de R$ ${valorPago.toFixed(2)} registrado.`
      });
      setDialogPagamentoOpen(false);
      setAgendamentoParaPagar(null);
      setTab("lista");
      setVisualizacaoAtual("lista");
    }
    return sucesso;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 p-4 sm:p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl sm:text-3xl font-bold text-foreground", children: "Minha Agenda" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm sm:text-base text-muted-foreground", children: "Organize, visualize e gerencie seus atendimentos" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 lg:gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: "Buscar por cliente, serviço ou observação",
              className: "pl-9 w-[260px]",
              value: buscaTexto,
              onChange: (e) => setBuscaTexto(e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleNovoAgendamento, className: "bg-gradient-to-r from-primary to-lilac-primary", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
          "Novo Agendamento"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border/50 bg-card/50 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-center gap-3 p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-lilac-light", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-5 w-5 text-primary-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold text-foreground", children: agendamentosHoje }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Hoje" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border/50 bg-card/50 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-center gap-3 p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-lilac-primary to-pink-accent", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-5 w-5 text-primary-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold text-foreground", children: agendamentosAmanha }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Amanhã" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border/50 bg-card/50 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-center gap-3 p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-accent to-lavender", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-5 w-5 text-primary-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold text-foreground", children: agendamentosEstaSemana }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Esta Semana" })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { value: tab, onValueChange: (v) => setTab(v), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid grid-cols-4 w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "lista", children: "Lista" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "dia", children: "Dia" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "semana", children: "Semana" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "mes", children: "Mês" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "lista", className: "space-y-6", children: visualizacaoAtual === "formulario" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        AgendamentoForm,
        {
          agendamento: agendamentoSelecionado || void 0,
          clientes,
          servicos,
          onSubmit: handleSubmitFormulario,
          onCancel: handleVoltarParaLista,
          verificarConflito,
          initial: initialForm || void 0
        }
      ) : visualizacaoAtual === "detalhes" && agendamentoSelecionado ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        AgendamentoDetalhes,
        {
          agendamento: agendamentoSelecionado,
          cliente: { nome: agendamentoSelecionado.clienteNome, telefone: "", email: "" },
          servico: { nome: agendamentoSelecionado.servicoNome },
          onEdit: () => setVisualizacaoAtual("formulario"),
          onBack: handleVoltarParaLista,
          onCancel: handleCancelarAgendamento,
          onMarcarPagamento: () => agendamentoSelecionado && handleMarcarPagamento(agendamentoSelecionado)
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        AgendamentosList,
        {
          agendamentos,
          filtros: { ...filtros, busca: buscaTexto || filtros.busca },
          onFiltrosChange: setFiltros,
          onEdit: handleEditarAgendamento,
          onDelete: excluirAgendamento,
          onCancel: cancelarAgendamento,
          onViewDetails: handleVerDetalhes,
          onReagendar: handleReagendar,
          onTrocarHorario: handleTrocarHorario,
          onMarcarPagamento: handleMarcarPagamento,
          clientes: clientes.map((c) => ({ id: c.id, nome: c.nomeCompleto })),
          paginaAtual,
          totalPaginas,
          onPaginaChange: setPaginaAtual
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "dia", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AgendaDiaria, { buscaTexto, onSlotClick: (dataISO, hora) => {
        setInitialForm({ data: dataISO, hora, status: "agendado", statusPagamento: "em_aberto", formaPagamento: "dinheiro" });
        setTab("lista");
        setVisualizacaoAtual("formulario");
      } }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "semana", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AgendaSemanal, { onSlotClick: (dataISO, hora) => {
        setInitialForm({ data: dataISO, hora, status: "agendado", statusPagamento: "em_aberto", formaPagamento: "dinheiro" });
        setTab("lista");
        setVisualizacaoAtual("formulario");
      } }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "mes", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AgendaMensal, {}) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ReagendamentoDialog,
      {
        open: dialogReagendamentoOpen,
        onOpenChange: setDialogReagendamentoOpen,
        agendamento: agendamentoParaReagendar,
        onReagendar: handleConfirmarReagendamento,
        verificarConflito
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      TrocaHorarioDialog,
      {
        open: dialogTrocaHorarioOpen,
        onOpenChange: setDialogTrocaHorarioOpen,
        agendamento: agendamentoParaTrocar,
        agendamentosDisponiveis: todosAgendamentos,
        onTrocarHorarios: handleConfirmarTrocaHorario
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PagamentoDialog,
      {
        open: dialogPagamentoOpen,
        onOpenChange: setDialogPagamentoOpen,
        agendamento: agendamentoParaPagar,
        onConfirmar: handleConfirmarPagamento
      }
    )
  ] });
}

export { MinhaAgenda as default };
