import { r as reactExports, j as jsxRuntimeExports } from './react-vendor-BpXfDOw7.js';
import { C as Card, c as CardHeader, d as CardTitle, e as CardContent, j as Input, g as Button, k as AlertDialog, l as AlertDialogContent, m as AlertDialogHeader, n as AlertDialogTitle, o as AlertDialogDescription, p as AlertDialogFooter, q as AlertDialogCancel, r as AlertDialogAction, f as CardDescription } from './index-U74ij7JC.js';
import { u as useServicos } from './useServicos-B9TSefLo.js';
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from './select-Ce9M_rda.js';
import { am as Filter, an as Search, N as Scissors, ao as SquarePen, aq as Trash2, V as DollarSign, Q as Clock, aC as ArrowUpDown, aD as ArrowUp, aE as ArrowDown, as as ArrowLeft, ag as Plus } from './ui-libs-B5Rrhu1L.js';
import { u as useForm, o as object, s as string, n as number } from './form-libs-BJ_wtrcd.js';
import { a } from './zod-BCTNax0R.js';
import { T as Textarea } from './textarea-D9C69N9T.js';
import { F as Form, a as FormField, b as FormItem, c as FormLabel, d as FormControl, e as FormMessage } from './form-9btzSTa_.js';
import './chart-libs-Cdz70zdY.js';
import './index-BfAAoDv6.js';
import './index-Ls-C4DWD.js';
import './label-C0AJeojg.js';

function ServicosList({
  servicos,
  filtros,
  onFiltrosChange,
  onEdit,
  onDelete
}) {
  const [servicoParaExcluir, setServicoParaExcluir] = reactExports.useState(null);
  const formatarValor = (valor) => {
    return `R$ ${valor.toFixed(2).replace(".", ",")}`;
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
  const handleOrdenacaoChange = (campo) => {
    const novasDirecao = filtros.ordenacao === campo && filtros.direcao === "asc" ? "desc" : "asc";
    onFiltrosChange({
      ...filtros,
      ordenacao: campo,
      direcao: novasDirecao
    });
  };
  const getIconeOrdenacao = (campo) => {
    if (filtros.ordenacao !== campo) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpDown, { className: "h-4 w-4 text-muted-foreground" });
    }
    return filtros.direcao === "asc" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUp, { className: "h-4 w-4 text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDown, { className: "h-4 w-4 text-primary" });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border/50 bg-card/50 backdrop-blur-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Filter, { className: "h-5 w-5 text-primary" }),
        "Filtros e Ordenação"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-3 h-4 w-4 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: "Buscar serviço...",
                value: filtros.busca || "",
                onChange: (e) => onFiltrosChange({ ...filtros, busca: e.target.value }),
                className: "pl-10"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: `${filtros.ordenacao}-${filtros.direcao}`,
              onValueChange: (value) => {
                const [ordenacao, direcao] = value.split("-");
                onFiltrosChange({ ...filtros, ordenacao, direcao });
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Ordenar por" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "nome-asc", children: "Nome (A-Z)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "nome-desc", children: "Nome (Z-A)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "valor-asc", children: "Valor (Menor primeiro)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "valor-desc", children: "Valor (Maior primeiro)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "duracao-asc", children: "Duração (Menor primeiro)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "duracao-desc", children: "Duração (Maior primeiro)" })
                ] })
              ]
            }
          )
        ] }),
        filtros.busca && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => onFiltrosChange({ ...filtros, busca: "" }),
            children: "Limpar busca"
          }
        ) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: servicos.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border/50 bg-card/50 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex flex-col items-center justify-center py-12 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scissors, { className: "h-12 w-12 text-muted-foreground mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold mb-2", children: "Nenhum serviço encontrado" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: filtros.busca ? "Tente ajustar os filtros ou criar um novo serviço." : "Comece criando seu primeiro serviço." })
    ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border/50 bg-card/50 backdrop-blur-sm hidden md:block", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-5 gap-4 items-center font-semibold text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: "flex items-center gap-2 hover:text-foreground transition-colors text-left",
            onClick: () => handleOrdenacaoChange("nome"),
            children: [
              "Serviço",
              getIconeOrdenacao("nome")
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: "flex items-center gap-2 hover:text-foreground transition-colors",
            onClick: () => handleOrdenacaoChange("valor"),
            children: [
              "Valor",
              getIconeOrdenacao("valor")
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: "flex items-center gap-2 hover:text-foreground transition-colors",
            onClick: () => handleOrdenacaoChange("duracao"),
            children: [
              "Duração",
              getIconeOrdenacao("duracao")
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Descrição" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-right", children: "Ações" })
      ] }) }) }),
      servicos.map((servico) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        Card,
        {
          className: "border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-200",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:hidden space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-semibold text-foreground flex items-center gap-2 text-sm", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-lilac-light/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Scissors, { className: "h-3.5 w-3.5 text-primary" }) }),
                    servico.nome
                  ] }),
                  servico.descricao && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-2", children: servico.descricao })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "ghost",
                      size: "sm",
                      onClick: () => onEdit(servico),
                      className: "h-8 w-8 p-0",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "h-3.5 w-3.5" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "ghost",
                      size: "sm",
                      onClick: () => setServicoParaExcluir(servico),
                      className: "text-destructive hover:text-destructive h-8 w-8 p-0",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-t border-border/50 pt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-3.5 w-3.5 text-muted-foreground" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-primary text-sm", children: formatarValor(servico.valor) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3.5 w-3.5 text-muted-foreground" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: formatarDuracao(servico.duracao) })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:grid md:grid-cols-5 md:gap-4 md:items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-lilac-light/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Scissors, { className: "h-5 w-5 text-primary" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground", children: servico.nome }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-4 w-4 text-muted-foreground" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-primary", children: formatarValor(servico.valor) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 text-muted-foreground" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: formatarDuracao(servico.duracao) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: servico.descricao || "-" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "sm",
                    onClick: () => onEdit(servico),
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "h-4 w-4" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "sm",
                    onClick: () => setServicoParaExcluir(servico),
                    className: "text-destructive hover:text-destructive",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
                  }
                )
              ] })
            ] })
          ] })
        },
        servico.id
      ))
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: !!servicoParaExcluir, onOpenChange: () => setServicoParaExcluir(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Confirmar exclusão" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
          'Tem certeza que deseja excluir o serviço "',
          servicoParaExcluir?.nome,
          '"? Esta ação não pode ser desfeita e pode afetar agendamentos existentes.'
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancelar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AlertDialogAction,
          {
            onClick: () => {
              if (servicoParaExcluir) {
                onDelete(servicoParaExcluir.id);
                setServicoParaExcluir(null);
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

const servicoSchema = object({
  nome: string().min(1, "Nome do serviço é obrigatório").max(100, "Nome muito longo"),
  valor: number().min(0.01, "Valor deve ser maior que zero"),
  duracao: number().int().min(1, "Duração deve ser pelo menos 1 minuto"),
  descricao: string().optional(),
  observacoes: string().optional()
});
function ServicoForm({
  servico,
  onSubmit,
  onCancel
}) {
  const form = useForm({
    resolver: a(servicoSchema),
    defaultValues: {
      nome: servico?.nome || "",
      valor: servico?.valor || 0,
      duracao: servico?.duracao || 30,
      descricao: servico?.descricao || "",
      observacoes: servico?.observacoes || ""
    }
  });
  const handleSubmit = (data) => {
    onSubmit(data);
  };
  const isEdicao = !!servico;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: onCancel,
          className: "flex items-center gap-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
            "Voltar"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold text-foreground", children: isEdicao ? "Editar Serviço" : "Novo Serviço" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: isEdicao ? "Atualize as informações do serviço" : "Preencha os dados do novo serviço" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border/50 bg-card/50 backdrop-blur-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-lilac-light/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Scissors, { className: "h-5 w-5 text-primary" }) }),
          "Informações do Serviço"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Preencha todos os campos obrigatórios para cadastrar o serviço" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Form, { ...form, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: form.handleSubmit(handleSubmit), className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 md:grid-cols-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            FormField,
            {
              control: form.control,
              name: "nome",
              render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(FormLabel, { children: [
                  "Nome do Serviço ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    placeholder: "Ex: Corte Feminino",
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
                /* @__PURE__ */ jsxRuntimeExports.jsxs(FormLabel, { children: [
                  "Valor (R$) ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    type: "number",
                    step: "0.01",
                    min: "0.01",
                    placeholder: "0,00",
                    ...field,
                    onChange: (e) => field.onChange(parseFloat(e.target.value) || 0)
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
              ] })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 md:grid-cols-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            FormField,
            {
              control: form.control,
              name: "duracao",
              render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(FormLabel, { children: [
                  "Duração (minutos) ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    type: "number",
                    min: "1",
                    placeholder: "30",
                    ...field,
                    onChange: (e) => field.onChange(parseInt(e.target.value) || 0)
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", {})
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FormField,
          {
            control: form.control,
            name: "descricao",
            render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { children: "Descrição" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: "Breve descrição do serviço",
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
            name: "observacoes",
            render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { children: "Observações" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  placeholder: "Observações adicionais sobre o serviço (opcional)",
                  rows: 3,
                  ...field
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-4 sm:justify-end", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: onCancel,
              className: "sm:w-auto",
              children: "Cancelar"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "submit",
              className: "bg-gradient-to-r from-primary to-lilac-primary shadow-lg hover:shadow-xl transition-all duration-300 sm:w-auto",
              children: isEdicao ? "Atualizar Serviço" : "Criar Serviço"
            }
          )
        ] })
      ] }) }) })
    ] })
  ] });
}

function Servicos() {
  const {
    servicos,
    filtros,
    setFiltros,
    criarServico,
    atualizarServico,
    excluirServico
  } = useServicos();
  const [visualizacaoAtual, setVisualizacaoAtual] = reactExports.useState("lista");
  const [servicoSelecionado, setServicoSelecionado] = reactExports.useState(null);
  const handleNovoServico = () => {
    setServicoSelecionado(null);
    setVisualizacaoAtual("formulario");
  };
  const handleEditarServico = (servico) => {
    setServicoSelecionado(servico);
    setVisualizacaoAtual("formulario");
  };
  const handleSubmitFormulario = (data) => {
    const sucesso = servicoSelecionado ? atualizarServico(servicoSelecionado.id, data) : criarServico(data);
    if (sucesso) {
      setVisualizacaoAtual("lista");
      setServicoSelecionado(null);
    }
  };
  const handleVoltarParaLista = () => {
    setVisualizacaoAtual("lista");
    setServicoSelecionado(null);
  };
  if (visualizacaoAtual === "formulario") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      ServicoForm,
      {
        servico: servicoSelecionado || void 0,
        onSubmit: handleSubmitFormulario,
        onCancel: handleVoltarParaLista
      }
    ) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 sm:space-y-8 p-3 sm:p-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl sm:text-3xl font-bold text-foreground", children: "Serviços" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs sm:text-base text-muted-foreground", children: "Gerencie todos os serviços oferecidos pelo seu salão" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: handleNovoServico,
          className: "bg-gradient-to-r from-primary to-lilac-primary shadow-lg hover:shadow-xl transition-all duration-300 btn-touch",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
            "Novo Serviço"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border/50 bg-card/50 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-center gap-2 sm:gap-4 p-3 sm:p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br from-primary to-lilac-light", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Scissors, { className: "h-4 w-4 sm:h-6 sm:w-6 text-primary-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg sm:text-2xl font-bold", children: servicos.length }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] sm:text-sm text-muted-foreground", children: "Total" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border/50 bg-card/50 backdrop-blur-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-center gap-2 sm:gap-4 p-3 sm:p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br from-lilac-primary to-pink-accent", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Scissors, { className: "h-4 w-4 sm:h-6 sm:w-6 text-primary-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-lg sm:text-2xl font-bold", children: [
            "R$ ",
            servicos.length > 0 ? Math.min(...servicos.map((s) => s.valor)).toFixed(2) : "0,00"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] sm:text-sm text-muted-foreground", children: "Menor Valor" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border/50 bg-card/50 backdrop-blur-sm col-span-2 sm:col-span-2 lg:col-span-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-center gap-2 sm:gap-4 p-3 sm:p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br from-pink-accent to-lavender", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Scissors, { className: "h-4 w-4 sm:h-6 sm:w-6 text-primary-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-lg sm:text-2xl font-bold", children: [
            "R$ ",
            servicos.length > 0 ? Math.max(...servicos.map((s) => s.valor)).toFixed(2) : "0,00"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] sm:text-sm text-muted-foreground", children: "Maior Valor" })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ServicosList,
      {
        servicos,
        filtros,
        onFiltrosChange: setFiltros,
        onEdit: handleEditarServico,
        onDelete: excluirServico
      }
    )
  ] });
}

export { Servicos as default };
