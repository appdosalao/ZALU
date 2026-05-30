import { r as reactExports, j as jsxRuntimeExports } from './react-vendor-BpXfDOw7.js';
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from './tabs-B30NruqW.js';
import { F as useToast, C as Card, c as CardHeader, d as CardTitle, e as CardContent, j as Input, g as Button, J as Jt, f as CardDescription, D as toast, k as AlertDialog, E as AlertDialogTrigger, l as AlertDialogContent, m as AlertDialogHeader, n as AlertDialogTitle, o as AlertDialogDescription, p as AlertDialogFooter, q as AlertDialogCancel, r as AlertDialogAction, B as Badge, G as Alert, H as AlertDescription } from './index-BxmTkSue.js';
import { D as Dialog, f as DialogTrigger, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription } from './dialog-B2cdB-ir.js';
import { u as useCronogramas, a as useRetornos } from './useCronogramas-iXvTUYul.js';
import { u as useSupabaseClientes } from './useSupabaseClientes-BZkRJk2t.js';
import { u as useServicos } from './useServicos-D2x3NEpY.js';
import { u as useSupabaseAgendamentos } from './useSupabaseAgendamentos-O5V4jZ47.js';
import { T as Textarea } from './textarea-CnhGhN_A.js';
import { L as Label } from './label-Bu_HJwHE.js';
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from './select-_FAVTGEW.js';
import { K as Calendar, Q as Clock, ag as Plus, aF as Play, ao as SquarePen, aq as Trash2, aG as CircleCheckBig, aH as Pause, am as Filter, a9 as User, aI as CircleX, aJ as Info } from './ui-libs-BJEWQG8b.js';
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from './table-C1_qONOv.js';
import { f as format } from './format-DsTNzci_.js';
import { p as ptBR } from './pt-BR-HlQT9LXk.js';
import './chart-libs-Cdz70zdY.js';
import './index-BfAAoDv6.js';
import './index-Ls-C4DWD.js';

function CronogramaForm({ cronograma, onSuccess, onCancel }) {
  const [formData, setFormData] = reactExports.useState({
    cliente_id: cronograma?.cliente_id || "",
    servico_id: cronograma?.servico_id || "",
    data_inicio: cronograma?.data_inicio || "",
    hora_inicio: cronograma?.hora_inicio || "09:00",
    recorrencia: cronograma?.recorrencia || "Semanal",
    intervalo_dias: cronograma?.intervalo_dias || void 0,
    observacoes: cronograma?.observacoes || "",
    status: cronograma?.status || "ativo"
  });
  const { createCronograma, updateCronograma, loading } = useCronogramas();
  const { clientes } = useSupabaseClientes();
  const { servicos } = useServicos();
  const { toast } = useToast();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.cliente_id || !formData.servico_id || !formData.data_inicio) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    const cliente = clientes.find((c) => c.id === formData.cliente_id);
    const servico = servicos.find((s) => s.id === formData.servico_id);
    if (!cliente || !servico) {
      toast({
        title: "Erro",
        description: "Cliente ou serviço não encontrado.",
        variant: "destructive"
      });
      return;
    }
    let intervalo_dias = formData.intervalo_dias;
    if (formData.recorrencia === "Semanal") intervalo_dias = 7;
    else if (formData.recorrencia === "Quinzenal") intervalo_dias = 14;
    else if (formData.recorrencia === "Mensal") intervalo_dias = 30;
    try {
      const cronogramaData = {
        cliente_id: formData.cliente_id,
        cliente_nome: cliente.nome,
        servico_id: formData.servico_id,
        tipo_servico: servico.nome,
        data_inicio: formData.data_inicio,
        hora_inicio: formData.hora_inicio,
        duracao_minutos: servico.duracao,
        recorrencia: formData.recorrencia,
        intervalo_dias,
        observacoes: formData.observacoes,
        status: formData.status
      };
      if (cronograma) {
        await updateCronograma(cronograma.id_cronograma, cronogramaData);
        toast({
          title: "Cronograma atualizado",
          description: "O cronograma foi atualizado com sucesso."
        });
      } else {
        await createCronograma(cronogramaData);
        toast({
          title: "Cronograma criado",
          description: "O cronograma foi criado com sucesso."
        });
      }
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o cronograma.",
        variant: "destructive"
      });
    }
  };
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: cronograma ? "Editar Cronograma" : "Novo Cronograma" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "cliente_id", children: "Cliente *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formData.cliente_id, onValueChange: (value) => handleChange("cliente_id", value), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione o cliente" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: clientes.filter((cliente) => cliente.id && cliente.id.trim() !== "").map((cliente) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: cliente.id, children: cliente.nome }, cliente.id)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "servico_id", children: "Serviço *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formData.servico_id, onValueChange: (value) => handleChange("servico_id", value), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione o serviço" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: servicos.filter((servico) => servico.id && servico.id.trim() !== "").map((servico) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: servico.id, children: [
              servico.nome,
              " - ",
              servico.duracao,
              "min - R$ ",
              servico.valor
            ] }, servico.id)) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "data_inicio", children: "Data de Início *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "data_inicio",
              type: "date",
              value: formData.data_inicio,
              onChange: (e) => handleChange("data_inicio", e.target.value),
              min: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "hora_inicio", children: "Horário de Início *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "hora_inicio",
              type: "time",
              value: formData.hora_inicio,
              onChange: (e) => handleChange("hora_inicio", e.target.value),
              required: true
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "recorrencia", children: "Recorrência *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formData.recorrencia, onValueChange: (value) => handleChange("recorrencia", value), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione a recorrência" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Semanal", children: "Semanal (7 dias)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Quinzenal", children: "Quinzenal (14 dias)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Mensal", children: "Mensal (30 dias)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Personalizada", children: "Personalizada" })
            ] })
          ] })
        ] }),
        formData.recorrencia === "Personalizada" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "intervalo_dias", children: "Intervalo (dias)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "intervalo_dias",
              type: "number",
              min: "1",
              max: "365",
              value: formData.intervalo_dias || "",
              onChange: (e) => handleChange("intervalo_dias", parseInt(e.target.value) || void 0),
              placeholder: "Ex: 21 dias",
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "status", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formData.status, onValueChange: (value) => handleChange("status", value), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "ativo", children: "Ativo" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "cancelado", children: "Cancelado" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "concluido", children: "Concluído" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "observacoes", children: "Observações" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            id: "observacoes",
            value: formData.observacoes,
            onChange: (e) => handleChange("observacoes", e.target.value),
            placeholder: "Observações sobre o cronograma...",
            rows: 3
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: loading, children: loading ? "Salvando..." : cronograma ? "Atualizar" : "Criar" }),
        onCancel && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: onCancel, children: "Cancelar" })
      ] })
    ] }) })
  ] });
}

const useIntegracaoCronograma = () => {
  const [loading, setLoading] = reactExports.useState(false);
  const encontrarHorarioDisponivel = reactExports.useCallback((data, duracaoMinutos, agendamentosExistentes, horaPreferida = "09:00") => {
    const agendamentosDoDia = agendamentosExistentes.filter(
      (ag) => ag.data === data && ag.status !== "cancelado"
    );
    const horarios = [];
    for (let h = 9; h < 18; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hora = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
        horarios.push(hora);
      }
    }
    for (const hora of horarios) {
      const inicioNovo = /* @__PURE__ */ new Date(`${data}T${hora}`);
      const fimNovo = new Date(inicioNovo.getTime() + duracaoMinutos * 6e4);
      const temConflito = agendamentosDoDia.some((ag) => {
        const inicio = /* @__PURE__ */ new Date(`${ag.data}T${ag.hora}`);
        const fim = new Date(inicio.getTime() + ag.duracao * 6e4);
        return inicioNovo < fim && fimNovo > inicio;
      });
      if (!temConflito) {
        return hora;
      }
    }
    return horaPreferida;
  }, []);
  const gerarAgendamentosCronograma = reactExports.useCallback((cronograma, dadosAgendamento, dataInicio, numeroSessoes, agendamentosExistentes) => {
    const agendamentosGerados = [];
    const dataBase = new Date(dataInicio);
    for (let i = 0; i < numeroSessoes; i++) {
      const dataAgendamento = new Date(dataBase);
      dataAgendamento.setDate(dataBase.getDate() + i * cronograma.intervalo_dias);
      const dataFormatada = dataAgendamento.toISOString().split("T")[0];
      const horario = encontrarHorarioDisponivel(
        dataFormatada,
        dadosAgendamento.duracao,
        [...agendamentosExistentes, ...agendamentosGerados]
      );
      const agendamento = {
        id: `cronograma_${cronograma.id_cronograma}_${i}_${Date.now()}`,
        clienteId: dadosAgendamento.clienteId,
        clienteNome: dadosAgendamento.clienteNome,
        servicoId: dadosAgendamento.servicoId,
        servicoNome: dadosAgendamento.servicoNome,
        data: dataFormatada,
        hora: horario,
        duracao: dadosAgendamento.duracao,
        valor: dadosAgendamento.valor,
        valorPago: 0,
        valorDevido: dadosAgendamento.valor,
        formaPagamento: "fiado",
        statusPagamento: "em_aberto",
        status: "agendado",
        observacoes: `Agendamento gerado automaticamente pelo cronograma: ${cronograma.tipo_servico}`,
        origem: "cronograma",
        origem_cronograma: true,
        cronogramaId: cronograma.id_cronograma,
        confirmado: false,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      agendamentosGerados.push(agendamento);
    }
    return agendamentosGerados;
  }, [encontrarHorarioDisponivel]);
  const processarConclusaoAgendamento = reactExports.useCallback((agendamento, onUpdateRetorno) => {
    if (agendamento.origem === "cronograma" && agendamento.cronogramaId) {
      Jt.success("Cronograma atualizado - O progresso do cronograma foi atualizado automaticamente.");
    }
  }, []);
  const processarCancelamentoAgendamento = reactExports.useCallback((agendamento, onUpdateRetorno) => {
    if (agendamento.origem === "cronograma" && agendamento.cronogramaId) {
      Jt.warning("Cronograma atualizado - O retorno foi cancelado no cronograma.");
    }
  }, []);
  return {
    loading,
    gerarAgendamentosCronograma,
    processarConclusaoAgendamento,
    processarCancelamentoAgendamento,
    encontrarHorarioDisponivel
  };
};

function CronogramaComAgendamentos({
  cronograma,
  clientes,
  servicos,
  agendamentosExistentes,
  onGerarAgendamentos,
  onSuccess,
  onCancel
}) {
  const [clienteId, setClienteId] = reactExports.useState("");
  const [servicoId, setServicoId] = reactExports.useState("");
  const [dataInicio, setDataInicio] = reactExports.useState("");
  const [numeroSessoes, setNumeroSessoes] = reactExports.useState(4);
  const [loading, setLoading] = reactExports.useState(false);
  const { gerarAgendamentosCronograma } = useIntegracaoCronograma();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cronograma || !clienteId || !servicoId || !dataInicio) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }
    const cliente = clientes.find((c) => c.id === clienteId);
    const servico = servicos.find((s) => s.id === servicoId);
    if (!cliente || !servico) {
      toast({
        title: "Erro",
        description: "Cliente ou serviço não encontrado.",
        variant: "destructive"
      });
      return;
    }
    setLoading(true);
    try {
      const dadosAgendamento = {
        clienteId: cliente.id,
        clienteNome: cliente.nome,
        servicoId: servico.id,
        servicoNome: servico.nome,
        data: dataInicio,
        duracao: servico.duracao,
        valor: servico.valor,
        cronogramaId: cronograma.id_cronograma
      };
      const agendamentosGerados = gerarAgendamentosCronograma(
        cronograma,
        dadosAgendamento,
        dataInicio,
        numeroSessoes,
        agendamentosExistentes
      );
      onGerarAgendamentos(agendamentosGerados);
      toast({
        title: "Cronograma ativado",
        description: `${agendamentosGerados.length} agendamentos foram criados automaticamente.`
      });
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao gerar agendamentos do cronograma.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "w-full max-w-2xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-5 w-5 text-primary" }),
        "Ativar Cronograma: ",
        cronograma?.tipo_servico
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Configure os detalhes para gerar agendamentos automáticos" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "cliente", children: "Cliente *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: clienteId, onValueChange: setClienteId, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione o cliente" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: clientes.map((cliente) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: cliente.id, children: cliente.nome }, cliente.id)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "servico", children: "Serviço *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: servicoId, onValueChange: setServicoId, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione o serviço" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: servicos.map((servico) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: servico.id, children: [
              servico.nome,
              " - ",
              servico.duracao,
              "min - R$ ",
              servico.valor
            ] }, servico.id)) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "dataInicio", children: "Data de Início *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "dataInicio",
              type: "date",
              value: dataInicio,
              onChange: (e) => setDataInicio(e.target.value),
              min: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "numeroSessoes", children: "Número de Sessões" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "numeroSessoes",
              type: "number",
              min: "1",
              max: "20",
              value: numeroSessoes,
              onChange: (e) => setNumeroSessoes(parseInt(e.target.value) || 1)
            }
          )
        ] })
      ] }),
      cronograma && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted p-4 rounded-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "font-medium mb-2 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4" }),
          "Resumo do Cronograma"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Intervalo:" }),
          " A cada ",
          cronograma.intervalo_dias,
          " dias"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Descrição:" }),
          " ",
          cronograma.observacoes || "Sem observações"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Sessões:" }),
          " ",
          numeroSessoes,
          " agendamentos serão criados"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: loading, className: "flex-1", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "mr-2 h-4 w-4 animate-spin" }),
          "Gerando..."
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
          "Gerar Agendamentos"
        ] }) }),
        onCancel && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: onCancel, children: "Cancelar" })
      ] })
    ] }) })
  ] });
}

function CronogramasList() {
  const [editingCronograma, setEditingCronograma] = reactExports.useState(null);
  const [showForm, setShowForm] = reactExports.useState(false);
  const [activatingCronograma, setActivatingCronograma] = reactExports.useState(null);
  const [showActivationDialog, setShowActivationDialog] = reactExports.useState(false);
  const { cronogramas, loading, deleteCronograma } = useCronogramas();
  const { clientes } = useSupabaseClientes();
  const { servicos } = useServicos();
  const { agendamentos, criarAgendamento } = useSupabaseAgendamentos();
  const { toast } = useToast();
  const handleDelete = async (id) => {
    try {
      await deleteCronograma(id);
      toast({
        title: "Cronograma removido",
        description: "O cronograma foi removido com sucesso."
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao remover cronograma.",
        variant: "destructive"
      });
    }
  };
  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingCronograma(null);
  };
  const handleFormCancel = () => {
    setShowForm(false);
    setEditingCronograma(null);
  };
  const handleAtivarCronograma = (cronograma) => {
    setActivatingCronograma(cronograma);
    setShowActivationDialog(true);
  };
  const handleGerarAgendamentos = async (agendamentos2) => {
    try {
      for (const agendamentoData of agendamentos2) {
        await criarAgendamento(agendamentoData);
      }
      setShowActivationDialog(false);
      setActivatingCronograma(null);
      toast({
        title: "Cronograma ativado",
        description: `${agendamentos2.length} agendamentos foram criados com sucesso.`
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao gerar agendamentos.",
        variant: "destructive"
      });
    }
  };
  const handleCancelAtivar = () => {
    setShowActivationDialog(false);
    setActivatingCronograma(null);
  };
  const getStatusBadge = (status) => {
    switch (status) {
      case "ativo":
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-green-100 text-green-800 hover:bg-green-100", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-3 h-3 mr-1" }),
          "Ativo"
        ] });
      case "cancelado":
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "destructive", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { className: "w-3 h-3 mr-1" }),
          "Cancelado"
        ] });
      case "concluido":
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-3 h-3 mr-1" }),
          "Concluído"
        ] });
      default:
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", children: status });
    }
  };
  const getRecorrenciaText = (cronograma) => {
    if (cronograma.recorrencia === "Personalizada" && cronograma.intervalo_dias) {
      return `A cada ${cronograma.intervalo_dias} dias`;
    }
    return cronograma.recorrencia;
  };
  const getProximoRetorno = (cronograma) => {
    const dataInicio = new Date(cronograma.data_inicio);
    const hoje = /* @__PURE__ */ new Date();
    let intervalo = 7;
    if (cronograma.recorrencia === "Quinzenal") intervalo = 14;
    else if (cronograma.recorrencia === "Mensal") intervalo = 30;
    else if (cronograma.recorrencia === "Personalizada" && cronograma.intervalo_dias) {
      intervalo = cronograma.intervalo_dias;
    }
    let proximaData = new Date(dataInicio);
    while (proximaData <= hoje) {
      proximaData.setDate(proximaData.getDate() + intervalo);
    }
    return proximaData.toLocaleDateString("pt-BR");
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Carregando cronogramas..." });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl sm:text-2xl font-bold tracking-tight", children: "Lista de Cronogramas" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm sm:text-base", children: "Gerencie cronogramas de retorno dos seus clientes" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: showForm, onOpenChange: setShowForm, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => setEditingCronograma(null), className: "w-full sm:w-auto", children: "Novo Cronograma" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-2xl max-h-[90vh] overflow-y-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: editingCronograma ? "Editar Cronograma" : "Novo Cronograma" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Configure os detalhes do cronograma de retorno" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            CronogramaForm,
            {
              cronograma: editingCronograma,
              onSuccess: handleFormSuccess,
              onCancel: handleFormCancel
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showActivationDialog, onOpenChange: setShowActivationDialog, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-3xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Ativar Cronograma" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Configure os agendamentos automáticos para este cronograma" })
      ] }),
      activatingCronograma && /* @__PURE__ */ jsxRuntimeExports.jsx(
        CronogramaComAgendamentos,
        {
          cronograma: activatingCronograma,
          clientes: clientes.map((c) => ({ id: c.id, nome: c.nome })),
          servicos,
          agendamentosExistentes: agendamentos,
          onGerarAgendamentos: handleGerarAgendamentos,
          onSuccess: () => setShowActivationDialog(false),
          onCancel: handleCancelAtivar
        }
      )
    ] }) }),
    cronogramas.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex flex-col items-center justify-center py-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-12 w-12 text-muted-foreground mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold mb-2", children: "Nenhum cronograma cadastrado" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-center mb-4", children: "Crie seu primeiro cronograma para automatizar retornos de clientes" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => setShowForm(true), children: "Criar Primeiro Cronograma" })
    ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3", children: cronogramas.map((cronograma) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "hover:shadow-md transition-shadow", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-lg truncate", children: cronograma.cliente_nome }),
          getStatusBadge(cronograma.status)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 flex-shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: cronograma.tipo_servico })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:justify-between gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Próximo retorno:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: getProximoRetorno(cronograma) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:justify-between gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Duração:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              cronograma.duracao_minutos,
              " min"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:justify-between gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Recorrência:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "break-words", children: getRecorrenciaText(cronograma) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:justify-between gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Horário:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: cronograma.hora_inicio })
          ] })
        ] }),
        cronograma.observacoes && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Obs:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground mt-1 break-words", children: cronograma.observacoes })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-2 pt-3", children: [
          cronograma.status === "ativo" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "default",
              size: "sm",
              onClick: () => handleAtivarCronograma(cronograma),
              className: "flex-1",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-4 w-4 mr-1" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Ativar" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sm:hidden", children: "Ativar" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => {
                  setEditingCronograma(cronograma);
                  setShowForm(true);
                },
                className: "flex-1 sm:flex-initial",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "h-4 w-4" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 sm:hidden", children: "Editar" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialog, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", className: "flex-1 sm:flex-initial", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 sm:hidden", children: "Excluir" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { className: "mx-4 max-w-sm sm:max-w-lg", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Confirmar exclusão" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "Tem certeza que deseja excluir este cronograma? Esta ação não pode ser desfeita." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { className: "flex-col sm:flex-row gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { className: "w-full sm:w-auto", children: "Cancelar" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    AlertDialogAction,
                    {
                      onClick: () => handleDelete(cronograma.id_cronograma),
                      className: "bg-destructive text-destructive-foreground hover:bg-destructive/90 w-full sm:w-auto",
                      children: "Excluir"
                    }
                  )
                ] })
              ] })
            ] })
          ] })
        ] })
      ] })
    ] }, cronograma.id_cronograma)) })
  ] });
}

const mockClientes = [
  { id_cliente: "1", nome_completo: "Maria Silva" },
  { id_cliente: "2", nome_completo: "Ana Santos" }
];
const mockCronogramasData = [
  { id_cronograma: "1", nome: "Hidratação Quinzenal" },
  { id_cronograma: "2", nome: "Cauterização Mensal" }
];
function RetornosList() {
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const [clienteFilter, setClienteFilter] = reactExports.useState("all");
  const { retornos, marcarRetornoRealizado, cancelarRetorno, loading } = useRetornos();
  const { toast } = useToast();
  const getClienteNome = (idCliente) => {
    return mockClientes.find((c) => c.id_cliente === idCliente)?.nome_completo || "Cliente não encontrado";
  };
  const getCronogramaNome = (idCronograma) => {
    return mockCronogramasData.find((c) => c.id_cronograma === idCronograma)?.nome || "Cronograma não encontrado";
  };
  const handleMarcarRealizado = async (idRetorno) => {
    try {
      await marcarRetornoRealizado(idRetorno);
      toast({
        title: "Retorno marcado como realizado",
        description: "O próximo retorno será automaticamente agendado."
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao marcar o retorno como realizado.",
        variant: "destructive"
      });
    }
  };
  const handleCancelarRetorno = async (idRetorno) => {
    try {
      await cancelarRetorno(idRetorno);
      toast({
        title: "Retorno cancelado",
        description: "O retorno foi cancelado com sucesso."
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao cancelar o retorno.",
        variant: "destructive"
      });
    }
  };
  const filteredRetornos = retornos.filter((retorno) => {
    const statusMatch = statusFilter === "all" || retorno.status === statusFilter;
    const clienteMatch = clienteFilter === "all" || retorno.id_cliente === clienteFilter;
    return statusMatch && clienteMatch;
  });
  const getStatusBadge = (status) => {
    switch (status) {
      case "Pendente":
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3 mr-1" }),
          "Pendente"
        ] });
      case "Realizado":
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "default", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-3 w-3 mr-1" }),
          "Realizado"
        ] });
      case "Cancelado":
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "destructive", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-3 w-3 mr-1" }),
          "Cancelado"
        ] });
      default:
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", children: status });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl sm:text-2xl font-bold", children: "Retornos dos Clientes" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm sm:text-base", children: "Acompanhe e gerencie os retornos programados" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 text-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Filter, { className: "h-5 w-5" }),
        "Filtros"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: statusFilter, onValueChange: setStatusFilter, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-full sm:w-40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Filtrar por status" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "Todos" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Pendente", children: "Pendente" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Realizado", children: "Realizado" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Cancelado", children: "Cancelado" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium", children: "Cliente" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: clienteFilter, onValueChange: setClienteFilter, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-full sm:w-48", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Filtrar por cliente" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "Todos os clientes" }),
              mockClientes.map((cliente) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: cliente.id_cliente, children: cliente.nome_completo }, cliente.id_cliente))
            ] })
          ] })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Lista de Retornos" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: filteredRetornos.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-12 w-12 text-muted-foreground mb-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold mb-2", children: "Nenhum retorno encontrado" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-center", children: "Não há retornos que correspondam aos filtros selecionados" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "min-w-[150px]", children: "Cliente" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "min-w-[120px] hidden sm:table-cell", children: "Cronograma" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "min-w-[120px]", children: "Data do Retorno" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "min-w-[100px]", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "min-w-[150px]", children: "Ações" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: filteredRetornos.map((retorno) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-4 w-4 text-muted-foreground flex-shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: getClienteNome(retorno.id_cliente) })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden sm:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: getCronogramaNome(retorno.id_cronograma) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm", children: format(new Date(retorno.data_retorno), "dd/MM/yyyy", { locale: ptBR }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: getStatusBadge(retorno.status) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col sm:flex-row gap-2", children: retorno.status === "Pendente" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                onClick: () => handleMarcarRealizado(retorno.id_retorno),
                disabled: loading,
                className: "w-full sm:w-auto text-xs",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4 mr-1" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Realizado" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sm:hidden", children: "OK" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                variant: "outline",
                onClick: () => handleCancelarRetorno(retorno.id_retorno),
                disabled: loading,
                className: "w-full sm:w-auto text-xs",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4 mr-1" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Cancelar" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sm:hidden", children: "X" })
                ]
              }
            )
          ] }) }) })
        ] }, retorno.id_retorno)) })
      ] }) }) })
    ] })
  ] });
}

function Cronogramas() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold text-foreground", children: "Cronogramas" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Gerencie cronogramas de retorno e integre automaticamente com agendamentos" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { className: "bg-purple-50 border-purple-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-4 w-4 text-purple-600" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDescription, { className: "text-purple-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Nova funcionalidade:" }),
        ' Agora você pode ativar cronogramas para gerar agendamentos automáticos! Clique em "Ativar" em qualquer cronograma para criar uma série de agendamentos automaticamente.'
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "cronogramas", className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-full grid-cols-2 max-w-full sm:max-w-md", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "cronogramas", className: "text-sm", children: "Cronogramas" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "retornos", className: "text-sm", children: "Retornos" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "cronogramas", className: "space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CronogramasList, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "retornos", className: "space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RetornosList, {}) })
    ] })
  ] });
}

export { Cronogramas as default };
