import { r as reactExports, j as jsxRuntimeExports, R as React } from './react-vendor-BpXfDOw7.js';
import { u as useAgendamentos } from './useAgendamentos-CqqJ1YJQ.js';
import { u as useServicos } from './useServicos-D2x3NEpY.js';
import { u as useLancamentos } from './useLancamentos-Bnp6CUC4.js';
import { u as useCronogramas, a as useRetornos } from './useCronogramas-iXvTUYul.js';
import { b as useAuth, s as supabase, J as Jt, C as Card, h as cn, c as CardHeader, d as CardTitle, e as CardContent, a as useNavigate, f as CardDescription, B as Badge, g as Button, j as Input, G as Alert, H as AlertDescription, F as useToast, T as AlertTitle } from './index-BxmTkSue.js';
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from './tabs-B30NruqW.js';
import { P as Progress } from './progress-DvecILDX.js';
import { aG as CircleCheckBig, ac as TriangleAlert, aI as CircleX, at as FileText, ae as TrendingUp, aK as TrendingDown, K as Calendar, Z as Zap, b8 as ArrowRight, Q as Clock, V as DollarSign, U as Users, an as Search, am as Filter, a1 as ExternalLink, l as Check, _ as Package, R as RefreshCw, b9 as ChartColumn, ba as Lightbulb, D as Download, a0 as Settings } from './ui-libs-BJEWQG8b.js';
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from './table-C1_qONOv.js';
import { D as DropdownMenu, a as DropdownMenuTrigger, b as DropdownMenuContent, d as DropdownMenuCheckboxItem } from './dropdown-menu-as8AjLis.js';
import { C as Checkbox } from './checkbox-DhCBsqD0.js';
import './useSupabaseAgendamentos-O5V4jZ47.js';
import './useSupabaseClientes-BZkRJk2t.js';
import './chart-libs-Cdz70zdY.js';
import './index-Ls-C4DWD.js';

function useAuditoria() {
  const { agendamentosFiltrados: agendamentos, clientes} = useAgendamentos();
  const { todosServicos } = useServicos();
  const { lancamentos } = useLancamentos();
  const { cronogramas } = useCronogramas();
  const { retornos } = useRetornos();
  const { user } = useAuth();
  const [salvando, setSalvando] = reactExports.useState(false);
  const [relatoriosHistorico, setRelatoriosHistorico] = reactExports.useState([]);
  const [relatorioBackend, setRelatorioBackend] = reactExports.useState(null);
  const [carregandoBackend, setCarregandoBackend] = reactExports.useState(false);
  const [useBackend] = reactExports.useState(true);
  reactExports.useEffect(() => {
    const carregarAuditoriaBackend = async () => {
      if (!user || !useBackend) return;
      try {
        setCarregandoBackend(true);
        console.log("Calling backend audit function...");
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.error("No active session found");
          Jt.error("Sessão expirada. Faça login novamente.");
          return;
        }
        console.log("Session valid, calling audit function");
        const { data, error } = await supabase.functions.invoke("auditoria-sistema", {
          method: "POST"
        });
        if (error) {
          console.error("Backend audit error:", error);
          Jt.error("Erro ao executar auditoria no servidor");
          return;
        }
        console.log("Backend audit completed:", data);
        setRelatorioBackend(data);
      } catch (error) {
        console.error("Error invoking backend audit:", error);
        Jt.error("Erro ao conectar com servidor de auditoria");
      } finally {
        setCarregandoBackend(false);
      }
    };
    carregarAuditoriaBackend();
  }, [user, useBackend]);
  const executarAgora = reactExports.useCallback(async () => {
    if (!user) return false;
    try {
      setCarregandoBackend(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        Jt.error("Sessão expirada. Faça login novamente.");
        return false;
      }
      const { data, error } = await supabase.functions.invoke("auditoria-sistema", {
        method: "POST"
      });
      if (error) {
        Jt.error("Erro ao executar auditoria no servidor. Usando modo local.");
        setRelatorioBackend(null);
        return false;
      }
      setRelatorioBackend(data);
      Jt.success("Auditoria executada com sucesso");
      return true;
    } catch (err) {
      setRelatorioBackend(null);
      return false;
    } finally {
      setCarregandoBackend(false);
    }
  }, [user]);
  const relatorioAuditoria = reactExports.useMemo(() => {
    const problemas = [];
    let proximoId = 1;
    const adicionarProblema = (problema) => {
      problemas.push({ ...problema, id: (proximoId++).toString() });
    };
    clientes.forEach((cliente) => {
      if (!cliente.nomeCompleto || cliente.nomeCompleto.trim() === "") {
        adicionarProblema({
          categoria: "critico",
          tipo: "dados_incompletos",
          descricao: "Cliente sem nome",
          entidade: "cliente",
          entidadeId: cliente.id,
          campo: "nome",
          valorAtual: cliente.nomeCompleto,
          valorEsperado: "Nome válido",
          sugestao: "Adicionar nome ao cliente"
        });
      }
      if (!cliente.telefone || cliente.telefone.trim() === "") {
        adicionarProblema({
          categoria: "critico",
          tipo: "dados_incompletos",
          descricao: "Cliente sem telefone",
          entidade: "cliente",
          entidadeId: cliente.id,
          campo: "telefone",
          valorAtual: cliente.telefone,
          valorEsperado: "Telefone válido",
          sugestao: "Adicionar telefone ao cliente"
        });
      }
    });
    todosServicos.forEach((servico) => {
      if (!servico.nome || servico.nome.trim() === "") {
        adicionarProblema({
          categoria: "critico",
          tipo: "dados_incompletos",
          descricao: "Serviço sem nome",
          entidade: "servico",
          entidadeId: servico.id,
          campo: "nome",
          valorAtual: servico.nome,
          valorEsperado: "Nome válido",
          sugestao: "Adicionar nome ao serviço"
        });
      }
      if (servico.valor <= 0) {
        adicionarProblema({
          categoria: "critico",
          tipo: "dados_inconsistentes",
          descricao: "Serviço com valor inválido",
          entidade: "servico",
          entidadeId: servico.id,
          campo: "valor",
          valorAtual: servico.valor,
          valorEsperado: "Valor > 0",
          sugestao: "Definir valor válido para o serviço"
        });
      }
      if (servico.duracao <= 0) {
        adicionarProblema({
          categoria: "critico",
          tipo: "dados_inconsistentes",
          descricao: "Serviço com duração inválida",
          entidade: "servico",
          entidadeId: servico.id,
          campo: "duracao",
          valorAtual: servico.duracao,
          valorEsperado: "Duração > 0",
          sugestao: "Definir duração válida para o serviço"
        });
      }
    });
    agendamentos.forEach((agendamento) => {
      if (!agendamento.clienteId) {
        adicionarProblema({
          categoria: "critico",
          tipo: "dados_incompletos",
          descricao: "Agendamento sem cliente",
          entidade: "agendamento",
          entidadeId: agendamento.id,
          campo: "clienteId",
          valorAtual: agendamento.clienteId,
          valorEsperado: "ID de cliente válido",
          sugestao: "Associar cliente ao agendamento"
        });
      }
      if (!agendamento.servicoId) {
        adicionarProblema({
          categoria: "critico",
          tipo: "dados_incompletos",
          descricao: "Agendamento sem serviço",
          entidade: "agendamento",
          entidadeId: agendamento.id,
          campo: "servicoId",
          valorAtual: agendamento.servicoId,
          valorEsperado: "ID de serviço válido",
          sugestao: "Associar serviço ao agendamento"
        });
      }
      if (!agendamento.data) {
        adicionarProblema({
          categoria: "critico",
          tipo: "dados_incompletos",
          descricao: "Agendamento sem data",
          entidade: "agendamento",
          entidadeId: agendamento.id,
          campo: "data",
          valorAtual: agendamento.data,
          valorEsperado: "Data válida",
          sugestao: "Definir data para o agendamento"
        });
      }
      if (!agendamento.hora) {
        adicionarProblema({
          categoria: "critico",
          tipo: "dados_incompletos",
          descricao: "Agendamento sem horário",
          entidade: "agendamento",
          entidadeId: agendamento.id,
          campo: "hora",
          valorAtual: agendamento.hora,
          valorEsperado: "Horário válido",
          sugestao: "Definir horário para o agendamento"
        });
      }
      const clienteExiste = clientes.find((c) => c.id === agendamento.clienteId);
      if (agendamento.clienteId && !clienteExiste) {
        adicionarProblema({
          categoria: "alto",
          tipo: "referencia_invalida",
          descricao: "Agendamento com cliente inexistente",
          entidade: "agendamento",
          entidadeId: agendamento.id,
          campo: "clienteId",
          valorAtual: agendamento.clienteId,
          valorEsperado: "Cliente existente",
          sugestao: "Verificar se cliente foi deletado ou corrigir referência"
        });
      }
      const servicoExiste = todosServicos.find((s) => s.id === agendamento.servicoId);
      if (agendamento.servicoId && !servicoExiste) {
        adicionarProblema({
          categoria: "alto",
          tipo: "referencia_invalida",
          descricao: "Agendamento com serviço inexistente",
          entidade: "agendamento",
          entidadeId: agendamento.id,
          campo: "servicoId",
          valorAtual: agendamento.servicoId,
          valorEsperado: "Serviço existente",
          sugestao: "Verificar se serviço foi deletado ou corrigir referência"
        });
      }
      if (agendamento.valorPago > agendamento.valor) {
        adicionarProblema({
          categoria: "alto",
          tipo: "dados_inconsistentes",
          descricao: "Valor pago maior que valor total",
          entidade: "agendamento",
          entidadeId: agendamento.id,
          campo: "valorPago",
          valorAtual: agendamento.valorPago,
          valorEsperado: `<= ${agendamento.valor}`,
          sugestao: "Corrigir valores de pagamento"
        });
      }
      if (agendamento.valorDevido !== agendamento.valor - agendamento.valorPago) {
        adicionarProblema({
          categoria: "medio",
          tipo: "dados_inconsistentes",
          descricao: "Valor devido não confere com cálculo",
          entidade: "agendamento",
          entidadeId: agendamento.id,
          campo: "valorDevido",
          valorAtual: agendamento.valorDevido,
          valorEsperado: agendamento.valor - agendamento.valorPago,
          sugestao: "Recalcular valor devido"
        });
      }
      if (agendamento.valorPago === 0 && agendamento.statusPagamento !== "em_aberto") {
        adicionarProblema({
          categoria: "medio",
          tipo: "dados_inconsistentes",
          descricao: "Status de pagamento inconsistente (valor zerado)",
          entidade: "agendamento",
          entidadeId: agendamento.id,
          campo: "statusPagamento",
          valorAtual: agendamento.statusPagamento,
          valorEsperado: "em_aberto",
          sugestao: "Corrigir status de pagamento"
        });
      }
      if (agendamento.valorPago === agendamento.valor && agendamento.statusPagamento !== "pago") {
        adicionarProblema({
          categoria: "medio",
          tipo: "dados_inconsistentes",
          descricao: "Status de pagamento inconsistente (valor total pago)",
          entidade: "agendamento",
          entidadeId: agendamento.id,
          campo: "statusPagamento",
          valorAtual: agendamento.statusPagamento,
          valorEsperado: "pago",
          sugestao: "Corrigir status de pagamento"
        });
      }
      if (agendamento.valorPago > 0 && agendamento.valorPago < agendamento.valor && agendamento.statusPagamento !== "parcial") {
        adicionarProblema({
          categoria: "medio",
          tipo: "dados_inconsistentes",
          descricao: "Status de pagamento inconsistente (pagamento parcial)",
          entidade: "agendamento",
          entidadeId: agendamento.id,
          campo: "statusPagamento",
          valorAtual: agendamento.statusPagamento,
          valorEsperado: "parcial",
          sugestao: "Corrigir status de pagamento"
        });
      }
    });
    const agendamentosAtivos = agendamentos.filter((ag) => ag.status !== "cancelado");
    for (let i = 0; i < agendamentosAtivos.length; i++) {
      for (let j = i + 1; j < agendamentosAtivos.length; j++) {
        const ag1 = agendamentosAtivos[i];
        const ag2 = agendamentosAtivos[j];
        if (ag1.data === ag2.data) {
          const inicio1 = /* @__PURE__ */ new Date(`${ag1.data}T${ag1.hora}`);
          const fim1 = new Date(inicio1.getTime() + ag1.duracao * 6e4);
          const inicio2 = /* @__PURE__ */ new Date(`${ag2.data}T${ag2.hora}`);
          const fim2 = new Date(inicio2.getTime() + ag2.duracao * 6e4);
          if (inicio1 < fim2 && fim1 > inicio2) {
            adicionarProblema({
              categoria: "critico",
              tipo: "conflito_agendamento",
              descricao: `Conflito de horário entre agendamentos`,
              entidade: "agendamento",
              entidadeId: ag1.id,
              campo: "horario",
              valorAtual: `${ag1.data} ${ag1.hora}`,
              valorEsperado: "Horário livre",
              sugestao: `Conflito com agendamento ${ag2.id} (${ag2.clienteNome} - ${ag2.data} ${ag2.hora})`
            });
          }
        }
      }
    }
    lancamentos.forEach((lancamento) => {
      if (!lancamento.descricao || lancamento.descricao.trim() === "") {
        adicionarProblema({
          categoria: "medio",
          tipo: "dados_incompletos",
          descricao: "Lançamento sem descrição",
          entidade: "lancamento",
          entidadeId: lancamento.id,
          campo: "descricao",
          valorAtual: lancamento.descricao,
          valorEsperado: "Descrição válida",
          sugestao: "Adicionar descrição ao lançamento"
        });
      }
      if (!lancamento.categoria || lancamento.categoria.trim() === "") {
        adicionarProblema({
          categoria: "baixo",
          tipo: "dados_incompletos",
          descricao: "Lançamento sem categoria",
          entidade: "lancamento",
          entidadeId: lancamento.id,
          campo: "categoria",
          valorAtual: lancamento.categoria,
          valorEsperado: "Categoria válida",
          sugestao: "Adicionar categoria ao lançamento"
        });
      }
      if (lancamento.valor <= 0) {
        adicionarProblema({
          categoria: "alto",
          tipo: "dados_inconsistentes",
          descricao: "Lançamento com valor inválido",
          entidade: "lancamento",
          entidadeId: lancamento.id,
          campo: "valor",
          valorAtual: lancamento.valor,
          valorEsperado: "Valor > 0",
          sugestao: "Corrigir valor do lançamento"
        });
      }
    });
    const agendamentosConcluidos = agendamentos.filter((ag) => ag.status === "concluido");
    agendamentosConcluidos.forEach((agendamento) => {
      const lancamentoCorrespondente = lancamentos.find(
        (l) => l.tipo === "entrada" && l.valor === agendamento.valorPago && l.descricao.includes(agendamento.clienteNome)
      );
      if (!lancamentoCorrespondente && agendamento.valorPago > 0) {
        adicionarProblema({
          categoria: "alto",
          tipo: "regra_negocio",
          descricao: "Agendamento concluído sem lançamento financeiro",
          entidade: "agendamento",
          entidadeId: agendamento.id,
          campo: "status",
          valorAtual: "concluido",
          valorEsperado: "Lançamento financeiro correspondente",
          sugestao: "Criar lançamento financeiro para este agendamento"
        });
      }
    });
    const retornosPendentes = retornos.filter((r) => r.status === "Pendente");
    const hoje = /* @__PURE__ */ new Date();
    retornosPendentes.forEach((retorno) => {
      const dataRetorno = new Date(retorno.data_retorno);
      const diasAtraso = Math.floor((hoje.getTime() - dataRetorno.getTime()) / (1e3 * 60 * 60 * 24));
      if (diasAtraso > 7) {
        adicionarProblema({
          categoria: "medio",
          tipo: "retorno_atrasado",
          descricao: `Retorno pendente há ${diasAtraso} dias`,
          entidade: "retorno",
          entidadeId: retorno.id_retorno,
          campo: "data_retorno",
          valorAtual: retorno.data_retorno,
          valorEsperado: "Data atual ou futura",
          sugestao: "Remarcar retorno ou marcar como realizado/cancelado"
        });
      }
    });
    const agendamentosAgendados = agendamentos.filter((ag) => ag.status === "agendado");
    const agendamentosConcludos = agendamentos.filter((ag) => ag.status === "concluido");
    const agendamentosCancelados = agendamentos.filter((ag) => ag.status === "cancelado");
    const valorTotalReceitas = lancamentos.filter((l) => l.tipo === "entrada").reduce((total, l) => total + l.valor, 0);
    const valorTotalDespesas = lancamentos.filter((l) => l.tipo === "saida").reduce((total, l) => total + l.valor, 0);
    const servicosUsados = new Set(agendamentos.map((ag) => ag.servicoId));
    const servicosNuncaUsados = todosServicos.filter((s) => !servicosUsados.has(s.id));
    const clientesAtivos = /* @__PURE__ */ new Set();
    const dataLimite = /* @__PURE__ */ new Date();
    dataLimite.setDate(dataLimite.getDate() - 30);
    agendamentos.forEach((ag) => {
      const dataAgendamento = new Date(ag.data);
      if (dataAgendamento >= dataLimite) {
        clientesAtivos.add(ag.clienteId);
      }
    });
    const clientesInativos = clientes.length - clientesAtivos.size;
    const sugestoesMelhorias = [];
    if (servicosNuncaUsados.length > 0) {
      sugestoesMelhorias.push(`${servicosNuncaUsados.length} serviços nunca foram agendados. Considere promovê-los ou removê-los.`);
    }
    if (clientesInativos > 0) {
      sugestoesMelhorias.push(`${clientesInativos} clientes não têm agendamentos recentes. Considere uma campanha de reativação.`);
    }
    const agendamentosEmAberto = agendamentos.filter((ag) => ag.statusPagamento === "em_aberto").length;
    if (agendamentosEmAberto > 0) {
      sugestoesMelhorias.push(`${agendamentosEmAberto} agendamentos com pagamento em aberto. Revisar política de cobrança.`);
    }
    const retornosAtrasados = retornosPendentes.filter((r) => {
      const dataRetorno = new Date(r.data_retorno);
      return dataRetorno < hoje;
    }).length;
    if (retornosAtrasados > 0) {
      sugestoesMelhorias.push(`${retornosAtrasados} retornos em atraso. Entrar em contato com clientes.`);
    }
    const servicosComVariacao = todosServicos.map((servico) => {
      const agendamentosDoServico = agendamentos.filter((ag) => ag.servicoId === servico.id);
      if (agendamentosDoServico.length > 0) {
        const duracaoMedia = agendamentosDoServico.reduce((sum, ag) => sum + ag.duracao, 0) / agendamentosDoServico.length;
        const diferenca = Math.abs(duracaoMedia - servico.duracao);
        if (diferenca > 15) {
          return { servico: servico.nome, duracaoPrograma: servico.duracao, duracaoMedia, diferenca };
        }
      }
      return null;
    }).filter(Boolean);
    if (servicosComVariacao.length > 0) {
      sugestoesMelhorias.push(`${servicosComVariacao.length} serviços têm duração programada muito diferente da duração real. Revisar tempos.`);
    }
    const estatisticas = {
      totalClientes: clientes.length,
      totalServicos: todosServicos.length,
      totalAgendamentos: agendamentos.length,
      totalLancamentos: lancamentos.length,
      totalCronogramas: cronogramas.length,
      totalRetornos: retornos.length,
      agendamentosAtivos: agendamentosAgendados.length,
      agendamentosConcluidos: agendamentosConcludos.length,
      agendamentosCancelados: agendamentosCancelados.length,
      valorTotalReceitas,
      valorTotalDespesas,
      servicosNuncaUsados: servicosNuncaUsados.length,
      clientesInativos
    };
    return {
      dataExecucao: (/* @__PURE__ */ new Date()).toISOString(),
      totalProblemas: problemas.length,
      problemasCriticos: problemas.filter((p) => p.categoria === "critico").length,
      problemasAltos: problemas.filter((p) => p.categoria === "alto").length,
      problemasMedios: problemas.filter((p) => p.categoria === "medio").length,
      problemasBaixos: problemas.filter((p) => p.categoria === "baixo").length,
      problemas,
      estatisticas,
      sugestoesMelhorias
    };
  }, [agendamentos, clientes, todosServicos, lancamentos, cronogramas, retornos]);
  const exportarRelatorio = (formato) => {
    if (formato === "json") {
      const blob = new Blob([JSON.stringify(relatorioAuditoria, null, 2)], {
        type: "application/json"
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `auditoria-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (formato === "csv") {
      const headers = ["ID", "Categoria", "Tipo", "Descrição", "Entidade", "ID Entidade", "Campo", "Valor Atual", "Valor Esperado", "Sugestão"];
      const rows = relatorioAuditoria.problemas.map((p) => [
        p.id,
        p.categoria,
        p.tipo,
        p.descricao,
        p.entidade,
        p.entidadeId,
        p.campo || "",
        p.valorAtual || "",
        p.valorEsperado || "",
        p.sugestao || ""
      ]);
      const csvContent = [headers, ...rows].map((row) => row.map((field) => `"${field}"`).join(",")).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `auditoria-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };
  const salvarRelatorio = reactExports.useCallback(async () => {
    if (!user || salvando) return null;
    setSalvando(true);
    try {
      const { data: relatorio, error: relatorioError } = await supabase.from("relatorios_auditoria").insert({
        user_id: user.id,
        data_execucao: (/* @__PURE__ */ new Date()).toISOString(),
        total_problemas: relatorioAuditoria.totalProblemas,
        problemas_criticos: relatorioAuditoria.problemasCriticos,
        problemas_altos: relatorioAuditoria.problemasAltos,
        problemas_medios: relatorioAuditoria.problemasMedios,
        problemas_baixos: relatorioAuditoria.problemasBaixos,
        estatisticas: relatorioAuditoria.estatisticas,
        sugestoes_melhorias: relatorioAuditoria.sugestoesMelhorias
      }).select().single();
      if (relatorioError) throw relatorioError;
      if (relatorioAuditoria.problemas.length > 0) {
        const problemas = relatorioAuditoria.problemas.map((p) => ({
          relatorio_id: relatorio.id,
          user_id: user.id,
          categoria: p.categoria,
          tipo: p.tipo,
          descricao: p.descricao,
          entidade: p.entidade,
          entidade_id: p.entidadeId,
          campo: p.campo || null,
          valor_atual: p.valorAtual || null,
          valor_esperado: p.valorEsperado || null,
          sugestao: p.sugestao || null
        }));
        const { error: problemasError } = await supabase.from("problemas_auditoria").insert(problemas);
        if (problemasError) throw problemasError;
      }
      Jt.success("Relatório de auditoria salvo com sucesso!");
      await carregarHistorico();
      return relatorio;
    } catch (error) {
      console.error("Erro ao salvar relatório:", error);
      Jt.error("Erro ao salvar relatório de auditoria");
      return null;
    } finally {
      setSalvando(false);
    }
  }, [user, relatorioAuditoria, salvando]);
  const carregarHistorico = reactExports.useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase.from("relatorios_auditoria").select("*").eq("user_id", user.id).order("data_execucao", { ascending: false }).limit(10);
      if (error) throw error;
      setRelatoriosHistorico(data || []);
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
    }
  }, [user]);
  const resolverProblemasSelecionados = reactExports.useCallback(async (selecionados) => {
    if (!user) return false;
    if (selecionados.length === 0) return true;
    try {
      let atualizados = 0;
      for (const p of selecionados) {
        const { error } = await supabase.from("problemas_auditoria").update({
          resolvido: true,
          data_resolucao: (/* @__PURE__ */ new Date()).toISOString()
        }).eq("user_id", user.id).eq("resolvido", false).eq("tipo", p.tipo).eq("entidade", p.entidade).eq("entidade_id", p.entidadeId);
        if (!error) atualizados++;
      }
      if (atualizados > 0) {
        Jt.success(`${atualizados} problema(s) marcados como resolvidos`);
        carregarHistorico();
      } else {
        Jt.info("Nenhum problema correspondente encontrado no histórico");
      }
      return true;
    } catch (e) {
      Jt.error("Erro ao resolver problemas selecionados");
      return false;
    }
  }, [user, carregarHistorico]);
  const reabrirProblemasSelecionados = reactExports.useCallback(async (selecionados) => {
    if (!user) return false;
    if (selecionados.length === 0) return true;
    try {
      let atualizados = 0;
      for (const p of selecionados) {
        const { error } = await supabase.from("problemas_auditoria").update({
          resolvido: false,
          data_resolucao: null
        }).eq("user_id", user.id).eq("resolvido", true).eq("tipo", p.tipo).eq("entidade", p.entidade).eq("entidade_id", p.entidadeId);
        if (!error) atualizados++;
      }
      if (atualizados > 0) {
        Jt.success(`${atualizados} problema(s) reabertos`);
        carregarHistorico();
      } else {
        Jt.info("Nenhum problema reaberto");
      }
      return true;
    } catch (e) {
      Jt.error("Erro ao reabrir problemas selecionados");
      return false;
    }
  }, [user, carregarHistorico]);
  reactExports.useEffect(() => {
    if (!user) return;
    const channel = supabase.channel("auditoria-realtime").on(
      "postgres_changes",
      { event: "*", schema: "public", table: "relatorios_auditoria", filter: `user_id=eq.${user.id}` },
      () => {
        carregarHistorico();
      }
    ).on(
      "postgres_changes",
      { event: "*", schema: "public", table: "problemas_auditoria", filter: `user_id=eq.${user.id}` },
      () => {
        carregarHistorico();
      }
    ).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, carregarHistorico]);
  return {
    relatorioAuditoria: relatorioBackend || relatorioAuditoria,
    exportarRelatorio,
    salvarRelatorio,
    salvando,
    carregarHistorico,
    relatoriosHistorico,
    carregandoBackend,
    executarAgora,
    origemRelatorio: relatorioBackend ? "backend" : "local",
    resolverProblemasSelecionados,
    reabrirProblemasSelecionados,
    useBackendAudit: useBackend
  };
}

function AuditoriaSummaryCards({
  porcentagemSaude,
  totalProblemas,
  problemasCriticos,
  problemasAltos,
  valorTotalReceitas,
  valorTotalDespesas,
  totalAgendamentos,
  agendamentosAtivos,
  agendamentosConcluidos
}) {
  const lucro = valorTotalReceitas - valorTotalDespesas;
  valorTotalReceitas > 0 ? (lucro / valorTotalReceitas * 100).toFixed(1) : "0";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: cn(
      "border-l-4",
      porcentagemSaude > 80 ? "border-l-green-500" : porcentagemSaude > 60 ? "border-l-yellow-500" : "border-l-red-500"
    ), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium", children: "Saúde do Sistema" }),
        porcentagemSaude > 80 ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4 text-green-500" }) : porcentagemSaude > 60 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-yellow-500" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4 text-red-500" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-2xl font-bold", children: [
          porcentagemSaude.toFixed(0),
          "%"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Progress,
          {
            value: porcentagemSaude,
            className: cn(
              "mt-2 h-2",
              porcentagemSaude > 80 ? "[&>div]:bg-green-500" : porcentagemSaude > 60 ? "[&>div]:bg-yellow-500" : "[&>div]:bg-red-500"
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-2", children: porcentagemSaude > 80 ? "Sistema saudável" : porcentagemSaude > 60 ? "Atenção necessária" : "Ação imediata requerida" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: cn(
      "border-l-4",
      totalProblemas === 0 ? "border-l-green-500" : problemasCriticos > 0 ? "border-l-red-500" : "border-l-yellow-500"
    ), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium", children: "Problemas Detectados" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4 text-muted-foreground" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold", children: totalProblemas }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-2", children: [
          problemasCriticos > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300", children: [
            problemasCriticos,
            " críticos"
          ] }),
          problemasAltos > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300", children: [
            problemasAltos,
            " altos"
          ] })
        ] }),
        totalProblemas === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-green-600 dark:text-green-400 mt-2", children: "✓ Nenhum problema encontrado" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: cn(
      "border-l-4",
      lucro >= 0 ? "border-l-green-500" : "border-l-red-500"
    ), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium", children: "Resultado Financeiro" }),
        lucro >= 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-4 w-4 text-green-500" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "h-4 w-4 text-red-500" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn(
          "text-2xl font-bold",
          lucro >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
        ), children: [
          "R$ ",
          lucro.toLocaleString("pt-BR", { minimumFractionDigits: 2 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1 mt-2 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Receitas:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-green-600 dark:text-green-400", children: [
              "R$ ",
              valorTotalReceitas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Despesas:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-red-600 dark:text-red-400", children: [
              "R$ ",
              valorTotalDespesas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-l-4 border-l-primary", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium", children: "Agendamentos" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4 text-muted-foreground" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold", children: totalAgendamentos }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1 mt-2 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Ativos:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-medium", children: agendamentosAtivos })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Concluídos:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-600 dark:text-green-400", children: agendamentosConcluidos })
          ] })
        ] })
      ] })
    ] })
  ] });
}

function AuditoriaAcoesRapidas({
  retornosAtrasados,
  clientesInativos,
  agendamentosEmAberto,
  problemasCriticos
}) {
  const navigate = useNavigate();
  const acoes = [
    ...retornosAtrasados > 0 ? [{
      id: "retornos",
      titulo: "Resolver Retornos",
      descricao: `${retornosAtrasados} retorno(s) pendente(s) aguardando ação`,
      icone: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-5 w-5 text-orange-500" }),
      prioridade: "alta",
      acao: () => navigate("/cronogramas"),
      badge: `${retornosAtrasados} pendentes`
    }] : [],
    ...problemasCriticos > 0 ? [{
      id: "criticos",
      titulo: "Problemas Críticos",
      descricao: `${problemasCriticos} problema(s) crítico(s) requerem atenção imediata`,
      icone: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-5 w-5 text-red-500" }),
      prioridade: "alta",
      acao: () => document.getElementById("tab-problemas")?.click(),
      badge: `${problemasCriticos} críticos`
    }] : [],
    ...agendamentosEmAberto > 0 ? [{
      id: "pagamentos",
      titulo: "Cobrar Pagamentos",
      descricao: `${agendamentosEmAberto} agendamento(s) com pagamento pendente`,
      icone: /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-5 w-5 text-yellow-500" }),
      prioridade: "media",
      acao: () => navigate("/financeiro"),
      badge: `R$ pendente`
    }] : [],
    ...clientesInativos > 0 ? [{
      id: "clientes",
      titulo: "Reativar Clientes",
      descricao: `${clientesInativos} cliente(s) sem agendamento há mais de 30 dias`,
      icone: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-5 w-5 text-blue-500" }),
      prioridade: "baixa",
      acao: () => navigate("/clientes"),
      badge: `${clientesInativos} inativos`
    }] : []
  ];
  if (acoes.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-green-200 bg-green-50/50 dark:bg-green-950/20 dark:border-green-900", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-center gap-4 py-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-6 w-6 text-green-600 dark:text-green-400" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-green-900 dark:text-green-100", children: "Nenhuma ação pendente!" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-green-700 dark:text-green-300", children: "Todos os dados estão em dia. Continue acompanhando regularmente." })
      ] })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-5 w-5 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-lg", children: "Ações Rápidas" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Tarefas prioritárias que requerem sua atenção" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 md:grid-cols-2", children: acoes.map((acao) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: acao.acao,
        className: "flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent transition-colors text-left group",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0", children: acao.icone }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-sm truncate", children: acao.titulo }),
              acao.badge && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: acao.prioridade === "alta" ? "destructive" : acao.prioridade === "media" ? "secondary" : "outline",
                  className: "text-xs",
                  children: acao.badge
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-2", children: acao.descricao })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" })
        ]
      },
      acao.id
    )) }) })
  ] });
}

const categoriaCores = {
  critico: "destructive",
  alto: "secondary",
  medio: "outline",
  baixo: "default"
};
const categoriaIcones = {
  critico: CircleX,
  alto: TriangleAlert,
  medio: TriangleAlert,
  baixo: CircleCheckBig
};
const entidadeRoutes = {
  cliente: "/clientes",
  servico: "/servicos",
  agendamento: "/agendamentos",
  lancamento: "/financeiro",
  retorno: "/cronogramas",
  cronograma: "/cronogramas"
};
function AuditoriaProblemasTable({ problemas, onResolverLote, unresolvedKeys }) {
  const navigate = useNavigate();
  const [busca, setBusca] = reactExports.useState("");
  const [filtrosCategorias, setFiltrosCategorias] = reactExports.useState([]);
  const [filtrosEntidades, setFiltrosEntidades] = reactExports.useState([]);
  const [selecionados, setSelecionados] = reactExports.useState(/* @__PURE__ */ new Set());
  const [apenasNaoResolvidos, setApenasNaoResolvidos] = reactExports.useState(false);
  const [pagina, setPagina] = reactExports.useState(1);
  const [porPagina] = reactExports.useState(20);
  reactExports.useMemo(() => [...new Set(problemas.map((p) => p.categoria))], [problemas]);
  const entidadesDisponiveis = reactExports.useMemo(() => [...new Set(problemas.map((p) => p.entidade))], [problemas]);
  const problemasFiltrados = reactExports.useMemo(() => {
    return problemas.filter((problema) => {
      const textoBusca = busca.toLowerCase();
      const matchBusca = busca === "" || problema.descricao.toLowerCase().includes(textoBusca) || problema.tipo.toLowerCase().includes(textoBusca) || problema.entidade.toLowerCase().includes(textoBusca) || problema.sugestao?.toLowerCase().includes(textoBusca);
      const matchCategoria = filtrosCategorias.length === 0 || filtrosCategorias.includes(problema.categoria);
      const matchEntidade = filtrosEntidades.length === 0 || filtrosEntidades.includes(problema.entidade);
      const key = `${problema.tipo}|${problema.entidade}|${problema.entidadeId}`;
      const matchNaoResolvido = !apenasNaoResolvidos || (unresolvedKeys ? unresolvedKeys.has(key) : true);
      return matchBusca && matchCategoria && matchEntidade && matchNaoResolvido;
    });
  }, [problemas, busca, filtrosCategorias, filtrosEntidades, apenasNaoResolvidos, unresolvedKeys]);
  const totalPaginas = Math.max(1, Math.ceil(problemasFiltrados.length / porPagina));
  const inicio = (pagina - 1) * porPagina;
  const fim = inicio + porPagina;
  const paginaProblemas = problemasFiltrados.slice(inicio, fim);
  const irParaPagina = (p) => setPagina(Math.min(Math.max(1, p), totalPaginas));
  const toggleSelecionado = (id) => {
    setSelecionados((prev) => {
      const novo = new Set(prev);
      if (novo.has(id)) novo.delete(id);
      else novo.add(id);
      return novo;
    });
  };
  const toggleSelecionarTodos = () => {
    setSelecionados((prev) => {
      if (prev.size === problemasFiltrados.length) return /* @__PURE__ */ new Set();
      return new Set(problemasFiltrados.map((p) => p.id));
    });
  };
  const contagemPorCategoria = reactExports.useMemo(
    () => ({
      critico: problemas.filter((p) => p.categoria === "critico").length,
      alto: problemas.filter((p) => p.categoria === "alto").length,
      medio: problemas.filter((p) => p.categoria === "medio").length,
      baixo: problemas.filter((p) => p.categoria === "baixo").length
    }),
    [problemas]
  );
  const toggleFiltroCategoria = (categoria) => {
    setFiltrosCategorias((prev) => prev.includes(categoria) ? prev.filter((c) => c !== categoria) : [...prev, categoria]);
  };
  const toggleFiltroEntidade = (entidade) => {
    setFiltrosEntidades((prev) => prev.includes(entidade) ? prev.filter((e) => e !== entidade) : [...prev, entidade]);
  };
  const irParaEntidade = (entidade) => {
    const route = entidadeRoutes[entidade];
    if (route) navigate(route);
  };
  if (problemas.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex flex-col items-center justify-center py-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-16 w-16 text-green-500 mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-semibold", children: "Sistema 100% Saudável!" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-center mt-2 max-w-md", children: "Nenhum problema foi detectado." })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Problemas Detectados" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { children: [
            problemasFiltrados.length,
            " de ",
            problemas.length,
            " problemas"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
          contagemPorCategoria.critico > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: filtrosCategorias.includes("critico") ? "default" : "outline",
              size: "sm",
              onClick: () => toggleFiltroCategoria("critico"),
              className: "gap-1",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-3 w-3" }),
                "Críticos (",
                contagemPorCategoria.critico,
                ")"
              ]
            }
          ),
          contagemPorCategoria.alto > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: filtrosCategorias.includes("alto") ? "secondary" : "outline",
              size: "sm",
              onClick: () => toggleFiltroCategoria("alto"),
              className: "gap-1",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3 w-3" }),
                "Altos (",
                contagemPorCategoria.alto,
                ")"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: "Buscar problemas...",
              value: busca,
              onChange: (e) => setBusca(e.target.value),
              className: "pl-9"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Filter, { className: "h-4 w-4" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "end", className: "w-48", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-2 py-1.5 text-sm font-semibold", children: "Entidades" }),
            entidadesDisponiveis.map((entidade) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              DropdownMenuCheckboxItem,
              {
                checked: filtrosEntidades.includes(entidade),
                onCheckedChange: () => toggleFiltroEntidade(entidade),
                className: "capitalize",
                children: entidade
              },
              entidade
            ))
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Checkbox,
            {
              checked: selecionados.size === problemasFiltrados.length && problemasFiltrados.length > 0,
              onCheckedChange: toggleSelecionarTodos
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground", children: [
            "Selecionados ",
            selecionados.size,
            "/",
            problemasFiltrados.length
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          unresolvedKeys && /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, { checked: apenasNaoResolvidos, onCheckedChange: (v) => setApenasNaoResolvidos(Boolean(v)) }),
            "Somente não resolvidos"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              disabled: !onResolverLote || selecionados.size === 0,
              onClick: async () => {
                const ok = window.confirm(`Marcar ${selecionados.size} problema(s) como resolvidos?`);
                if (!ok) return;
                if (!onResolverLote) return;
                const items = problemasFiltrados.filter((p) => selecionados.has(p.id));
                await onResolverLote(items);
                setSelecionados(/* @__PURE__ */ new Set());
              },
              children: "Marcar como resolvidos"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md border overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-muted/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-[36px]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-[100px]", children: "Prioridade" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Tipo" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "hidden md:table-cell", children: "Descrição" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Entidade" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "hidden lg:table-cell", children: "Sugestão" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-[84px]" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: paginaProblemas.map((problema) => {
          const IconeCategoria = categoriaIcones[problema.categoria];
          const key = `${problema.tipo}|${problema.entidade}|${problema.entidadeId}`;
          const resolvido = unresolvedKeys ? !unresolvedKeys.has(key) : false;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "group hover:bg-muted/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Checkbox,
              {
                checked: selecionados.has(problema.id),
                onCheckedChange: () => toggleSelecionado(problema.id)
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: categoriaCores[problema.categoria], className: "flex items-center gap-1 w-fit", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(IconeCategoria, { className: "h-3 w-3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: problema.categoria.toUpperCase() })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium text-sm", children: problema.tipo.replace(/_/g, " ") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden md:table-cell text-sm text-muted-foreground max-w-xs truncate", children: problema.descricao }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "capitalize text-sm font-medium", children: problema.entidade }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground font-mono", children: [
                problema.entidadeId.slice(0, 8),
                "..."
              ] }),
              resolvido && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] text-muted-foreground mt-1", children: "Resolvido" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden lg:table-cell text-sm text-muted-foreground max-w-xs truncate", children: problema.sugestao }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "flex gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  onClick: () => irParaEntidade(problema.entidade),
                  className: "opacity-0 group-hover:opacity-100 transition-opacity",
                  title: "Ir para a entidade",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-4 w-4" })
                }
              ),
              onResolverLote && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  onClick: async () => {
                    await onResolverLote([problema]);
                    setSelecionados((prev) => {
                      const novo = new Set(prev);
                      novo.delete(problema.id);
                      return novo;
                    });
                  },
                  className: "opacity-0 group-hover:opacity-100 transition-opacity",
                  title: "Marcar resolvido",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" })
                }
              )
            ] })
          ] }, problema.id);
        }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-3 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-muted-foreground", children: [
          "Exibindo ",
          problemasFiltrados.length === 0 ? 0 : inicio + 1,
          "-",
          Math.min(fim, problemasFiltrados.length),
          " de",
          " ",
          problemasFiltrados.length
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: () => irParaPagina(pagina - 1), disabled: pagina <= 1, children: "Anterior" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
            "Página ",
            pagina,
            " de ",
            totalPaginas
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => irParaPagina(pagina + 1),
              disabled: pagina >= totalPaginas,
              children: "Próxima"
            }
          )
        ] })
      ] }),
      problemasFiltrados.length === 0 && problemas.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8 text-muted-foreground", children: [
        "Nenhum problema encontrado com os filtros atuais.",
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "link",
            onClick: () => {
              setBusca("");
              setFiltrosCategorias([]);
              setFiltrosEntidades([]);
            },
            children: "Limpar filtros"
          }
        )
      ] })
    ] })
  ] });
}

function AuditoriaEstatisticas({ estatisticas }) {
  const taxaCancelamento = estatisticas.totalAgendamentos > 0 ? estatisticas.agendamentosCancelados / estatisticas.totalAgendamentos * 100 : 0;
  const taxaConclusao = estatisticas.totalAgendamentos > 0 ? estatisticas.agendamentosConcluidos / estatisticas.totalAgendamentos * 100 : 0;
  const lucro = estatisticas.valorTotalReceitas - estatisticas.valorTotalDespesas;
  const margemLucro = estatisticas.valorTotalReceitas > 0 ? lucro / estatisticas.valorTotalReceitas * 100 : 0;
  const taxaServicosUsados = estatisticas.totalServicos > 0 ? (estatisticas.totalServicos - estatisticas.servicosNuncaUsados) / estatisticas.totalServicos * 100 : 0;
  const taxaClientesAtivos = estatisticas.totalClientes > 0 ? (estatisticas.totalClientes - estatisticas.clientesInativos) / estatisticas.totalClientes * 100 : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium text-muted-foreground", children: "Taxa de Conclusão" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4 text-green-500" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-2xl font-bold text-green-600 dark:text-green-400", children: [
            taxaConclusao.toFixed(1),
            "%"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Progress,
            {
              value: taxaConclusao,
              className: "mt-2 h-2 [&>div]:bg-green-500"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-2", children: [
            estatisticas.agendamentosConcluidos,
            " de ",
            estatisticas.totalAgendamentos,
            " agendamentos"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium text-muted-foreground", children: "Taxa de Cancelamento" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4 text-red-500" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn(
            "text-2xl font-bold",
            taxaCancelamento > 20 ? "text-red-600 dark:text-red-400" : taxaCancelamento > 10 ? "text-yellow-600 dark:text-yellow-400" : "text-green-600 dark:text-green-400"
          ), children: [
            taxaCancelamento.toFixed(1),
            "%"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Progress,
            {
              value: taxaCancelamento,
              className: cn(
                "mt-2 h-2",
                taxaCancelamento > 20 ? "[&>div]:bg-red-500" : taxaCancelamento > 10 ? "[&>div]:bg-yellow-500" : "[&>div]:bg-green-500"
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-2", children: [
            estatisticas.agendamentosCancelados,
            " cancelamentos"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium text-muted-foreground", children: "Margem de Lucro" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-4 w-4 text-primary" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn(
            "text-2xl font-bold",
            margemLucro >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
          ), children: [
            margemLucro.toFixed(1),
            "%"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Progress,
            {
              value: Math.abs(margemLucro),
              className: cn(
                "mt-2 h-2",
                margemLucro >= 0 ? "[&>div]:bg-green-500" : "[&>div]:bg-red-500"
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-2", children: [
            "Lucro: R$ ",
            lucro.toLocaleString("pt-BR", { minimumFractionDigits: 2 })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium text-muted-foreground", children: "Clientes Ativos" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4 text-blue-500" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn(
            "text-2xl font-bold",
            taxaClientesAtivos >= 70 ? "text-green-600 dark:text-green-400" : taxaClientesAtivos >= 50 ? "text-yellow-600 dark:text-yellow-400" : "text-red-600 dark:text-red-400"
          ), children: [
            taxaClientesAtivos.toFixed(1),
            "%"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Progress,
            {
              value: taxaClientesAtivos,
              className: cn(
                "mt-2 h-2",
                taxaClientesAtivos >= 70 ? "[&>div]:bg-green-500" : taxaClientesAtivos >= 50 ? "[&>div]:bg-yellow-500" : "[&>div]:bg-red-500"
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-2", children: [
            estatisticas.totalClientes - estatisticas.clientesInativos,
            " ativos de ",
            estatisticas.totalClientes
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium", children: "Clientes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold", children: estatisticas.totalClientes }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Ativos (últimos 30 dias)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-green-600 dark:text-green-400", children: estatisticas.totalClientes - estatisticas.clientesInativos })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Inativos" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-orange-600 dark:text-orange-400", children: estatisticas.clientesInativos })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium", children: "Serviços" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold", children: estatisticas.totalServicos }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Utilizados" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-green-600 dark:text-green-400", children: estatisticas.totalServicos - estatisticas.servicosNuncaUsados })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Nunca usados" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-orange-600 dark:text-orange-400", children: estatisticas.servicosNuncaUsados })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Progress,
            {
              value: taxaServicosUsados,
              className: "mt-3 h-1.5"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium", children: "Agendamentos" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold", children: estatisticas.totalAgendamentos }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Ativos" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-blue-600 dark:text-blue-400", children: estatisticas.agendamentosAtivos })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Concluídos" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-green-600 dark:text-green-400", children: estatisticas.agendamentosConcluidos })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Cancelados" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-red-600 dark:text-red-400", children: estatisticas.agendamentosCancelados })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium", children: "Financeiro" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold", children: estatisticas.totalLancamentos }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-4", children: "lançamentos" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Receitas" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium text-green-600 dark:text-green-400", children: [
                "R$ ",
                estatisticas.valorTotalReceitas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Despesas" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium text-red-600 dark:text-red-400", children: [
                "R$ ",
                estatisticas.valorTotalDespesas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium", children: "Cronogramas" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold", children: estatisticas.totalCronogramas }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-4", children: "cronogramas ativos" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Retornos cadastrados" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: estatisticas.totalRetornos })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-medium", children: "Resumo" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-4 w-4 text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn(
            "text-3xl font-bold",
            lucro >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
          ), children: [
            "R$ ",
            lucro.toLocaleString("pt-BR", { minimumFractionDigits: 2 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-4", children: "resultado financeiro" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 text-sm", children: lucro >= 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-4 w-4 text-green-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-600 dark:text-green-400", children: "Lucro positivo" })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-red-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-600 dark:text-red-400", children: "Prejuízo" })
          ] }) })
        ] })
      ] })
    ] })
  ] });
}

const categorizarSugestao = (sugestao) => {
  if (sugestao.includes("cliente")) {
    return {
      icone: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-5 w-5" }),
      categoria: "Clientes",
      cor: "text-blue-500",
      rota: "/clientes"
    };
  }
  if (sugestao.includes("serviço") || sugestao.includes("servico")) {
    return {
      icone: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-5 w-5" }),
      categoria: "Serviços",
      cor: "text-purple-500",
      rota: "/servicos"
    };
  }
  if (sugestao.includes("pagamento") || sugestao.includes("financeiro") || sugestao.includes("cobrança")) {
    return {
      icone: /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-5 w-5" }),
      categoria: "Financeiro",
      cor: "text-green-500",
      rota: "/financeiro"
    };
  }
  if (sugestao.includes("retorno") || sugestao.includes("atraso")) {
    return {
      icone: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-5 w-5" }),
      categoria: "Retornos",
      cor: "text-orange-500",
      rota: "/cronogramas"
    };
  }
  if (sugestao.includes("agendamento") || sugestao.includes("duração") || sugestao.includes("tempo")) {
    return {
      icone: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-5 w-5" }),
      categoria: "Agendamentos",
      cor: "text-pink-500",
      rota: "/agendamentos"
    };
  }
  return {
    icone: /* @__PURE__ */ jsxRuntimeExports.jsx(Lightbulb, { className: "h-5 w-5" }),
    categoria: "Geral",
    cor: "text-yellow-500",
    rota: "/dashboard"
  };
};
function AuditoriaSugestoes({ sugestoes, estatisticas }) {
  const navigate = useNavigate();
  const taxaCancelamento = estatisticas.totalAgendamentos > 0 ? estatisticas.agendamentosCancelados / estatisticas.totalAgendamentos * 100 : 0;
  if (sugestoes.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-green-200 bg-green-50/50 dark:bg-green-950/20 dark:border-green-900", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex flex-col items-center justify-center py-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-8 w-8 text-green-600 dark:text-green-400" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-semibold text-green-900 dark:text-green-100", children: "Sistema Otimizado!" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-center mt-2 max-w-md", children: "Não há sugestões de melhorias no momento. Continue monitorando regularmente para manter o alto desempenho." })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-3", children: [
      estatisticas.clientesInativos > 5 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-blue-200 dark:border-blue-900", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-medium flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4 text-blue-500" }),
          "Oportunidade de Reativação"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            "Você tem ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
              estatisticas.clientesInativos,
              " clientes inativos"
            ] }),
            ". Uma campanha de reativação pode recuperar até 30% deles."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "link",
              className: "px-0 mt-2",
              onClick: () => navigate("/clientes"),
              children: [
                "Ver clientes inativos ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3 w-3 ml-1" })
              ]
            }
          )
        ] })
      ] }),
      taxaCancelamento > 15 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-red-200 dark:border-red-900", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-medium flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4 text-red-500" }),
          "Alta Taxa de Cancelamento"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            "Taxa de cancelamento de ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
              taxaCancelamento.toFixed(1),
              "%"
            ] }),
            ". Considere implementar confirmação por WhatsApp."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "link",
              className: "px-0 mt-2",
              onClick: () => navigate("/configuracoes"),
              children: [
                "Configurar lembretes ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3 w-3 ml-1" })
              ]
            }
          )
        ] })
      ] }),
      estatisticas.servicosNuncaUsados > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-purple-200 dark:border-purple-900", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-medium flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-4 w-4 text-purple-500" }),
          "Serviços Não Utilizados"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
              estatisticas.servicosNuncaUsados,
              " serviços"
            ] }),
            " nunca foram agendados. Considere promovê-los ou removê-los."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "link",
              className: "px-0 mt-2",
              onClick: () => navigate("/servicos"),
              children: [
                "Gerenciar serviços ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3 w-3 ml-1" })
              ]
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Lightbulb, { className: "h-5 w-5 text-yellow-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Sugestões de Melhorias" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Recomendações baseadas na análise dos seus dados" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: sugestoes.map((sugestao, index) => {
        const { icone, categoria, cor, rota } = categorizarSugestao(sugestao);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors group",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("flex-shrink-0 mt-0.5", cor), children: icone }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mb-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wide", children: categoria }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: sugestao })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "ghost",
                  size: "sm",
                  onClick: () => navigate(rota),
                  className: "opacity-0 group-hover:opacity-100 transition-opacity",
                  children: [
                    "Resolver",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3 w-3 ml-1" })
                  ]
                }
              )
            ]
          },
          index
        );
      }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { className: "border-primary/20 bg-primary/5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-4 w-4 text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDescription, { className: "text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Dica Pro:" }),
        " Execute auditorias regularmente (semanalmente) para identificar problemas antes que se tornem críticos. Salve os relatórios para acompanhar a evolução do sistema ao longo do tempo."
      ] })
    ] })
  ] });
}

function AuditoriaHistorico({ relatorios, onCarregar, unresolvedCounts }) {
  const [filtro, setFiltro] = React.useState("todos");
  const listaFiltrada = React.useMemo(() => {
    if (!unresolvedCounts) return relatorios;
    if (filtro === "todos") return relatorios;
    if (filtro === "abertos") return relatorios.filter((r) => (unresolvedCounts[r.id] || 0) > 0);
    return relatorios.filter((r) => (unresolvedCounts[r.id] || 0) === 0);
  }, [relatorios, unresolvedCounts, filtro]);
  const calcularSaude = (rel) => {
    return Math.max(0, 100 - (rel.problemas_criticos * 10 + rel.problemas_altos * 5));
  };
  const calcularTendencia = (index) => {
    if (index >= relatorios.length - 1) return null;
    const atual = calcularSaude(relatorios[index]);
    const anterior = calcularSaude(relatorios[index + 1]);
    if (atual > anterior) return "melhorou";
    if (atual < anterior) return "piorou";
    return "estavel";
  };
  if (relatorios.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex flex-col items-center justify-center py-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-8 w-8 text-muted-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-semibold", children: "Nenhum Relatório Salvo" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-center mt-2 max-w-md", children: 'Clique em "Salvar Relatório" para começar a criar um histórico de auditorias. Isso permite acompanhar a evolução da saúde do sistema ao longo do tempo.' })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Histórico de Auditorias" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { children: [
          "Últimos ",
          relatorios.length,
          " relatórios salvos • Acompanhe a evolução do sistema"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
        unresolvedCounts && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: `px-3 py-1.5 rounded-md border text-sm ${filtro === "todos" ? "bg-accent" : ""}`,
              onClick: () => setFiltro("todos"),
              children: "Todos"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: `px-3 py-1.5 rounded-md border text-sm ${filtro === "abertos" ? "bg-accent" : ""}`,
              onClick: () => setFiltro("abertos"),
              children: "Com abertos"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: `px-3 py-1.5 rounded-md border text-sm ${filtro === "resolvidos" ? "bg-accent" : ""}`,
              onClick: () => setFiltro("resolvidos"),
              children: "Todos resolvidos"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: listaFiltrada.map((rel, index) => {
          const saude = calcularSaude(rel);
          const tendencia = calcularTendencia(index);
          const data = new Date(rel.data_execucao);
          const abertos = unresolvedCounts ? unresolvedCounts[rel.id] || 0 : null;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: cn(
                "flex items-center gap-4 p-4 rounded-lg border transition-colors",
                index === 0 ? "bg-accent/50 border-primary/20" : "hover:bg-accent/30"
              ),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-shrink-0 text-center min-w-[80px]", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold", children: data.getDate().toString().padStart(2, "0") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground uppercase", children: data.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn(
                  "w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold",
                  saude > 80 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" : saude > 60 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                ), children: [
                  saude,
                  "%"
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
                    index === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs", children: "Mais recente" }),
                    abertos !== null && (abertos > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "destructive", className: "text-xs", children: [
                      abertos,
                      " abertos"
                    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: "Todos resolvidos" })),
                    tendencia && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: cn(
                      "flex items-center gap-1 text-xs",
                      tendencia === "melhorou" ? "text-green-600 dark:text-green-400" : tendencia === "piorou" ? "text-red-600 dark:text-red-400" : "text-muted-foreground"
                    ), children: [
                      tendencia === "melhorou" && /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-3 w-3" }),
                      tendencia === "piorou" && /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "h-3 w-3" }),
                      tendencia === "melhorou" ? "Melhorou" : tendencia === "piorou" ? "Piorou" : "Estável"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-medium", children: [
                      rel.total_problemas,
                      " problemas"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "•" }),
                    rel.problemas_criticos > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "destructive", className: "text-xs", children: [
                      rel.problemas_criticos,
                      " críticos"
                    ] }),
                    rel.problemas_altos > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "text-xs", children: [
                      rel.problemas_altos,
                      " altos"
                    ] }),
                    rel.problemas_medios > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-xs", children: [
                      rel.problemas_medios,
                      " médios"
                    ] }),
                    rel.problemas_baixos > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "default", className: "text-xs bg-muted text-muted-foreground", children: [
                      rel.problemas_baixos,
                      " baixos"
                    ] })
                  ] })
                ] })
              ]
            },
            rel.id
          );
        }) })
      ] })
    ] }),
    relatorios.length >= 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-primary/20 bg-primary/5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-medium flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-4 w-4 text-primary" }),
        "Análise de Tendência"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: (() => {
        const primeiro = calcularSaude(relatorios[relatorios.length - 1]);
        const ultimo = calcularSaude(relatorios[0]);
        const diferenca = ultimo - primeiro;
        if (diferenca > 10) {
          return `A saúde do sistema melhorou ${diferenca.toFixed(0)}% desde a primeira auditoria. Continue com o bom trabalho!`;
        } else if (diferenca < -10) {
          return `A saúde do sistema caiu ${Math.abs(diferenca).toFixed(0)}% desde a primeira auditoria. Revise os problemas críticos.`;
        } else {
          return `A saúde do sistema permanece estável. Continue monitorando regularmente.`;
        }
      })() }) })
    ] })
  ] });
}

function ResolverRetornos() {
  const { retornos, marcarRetornoRealizado, cancelarRetorno } = useRetornos();
  const { clientes } = useAgendamentos();
  const { toast } = useToast();
  const retornosAtrasados = retornos.filter((retorno) => {
    if (retorno.status !== "Pendente") return false;
    const dataRetorno = new Date(retorno.data_retorno);
    const hoje = /* @__PURE__ */ new Date();
    return dataRetorno < hoje;
  });
  const calcularDiasAtraso = (dataRetorno) => {
    const data = new Date(dataRetorno);
    const hoje = /* @__PURE__ */ new Date();
    return Math.floor((hoje.getTime() - data.getTime()) / (1e3 * 60 * 60 * 24));
  };
  const handleMarcarRealizado = async (idRetorno) => {
    try {
      await marcarRetornoRealizado(idRetorno);
      toast({
        title: "Retorno marcado como realizado",
        description: "O retorno foi atualizado com sucesso."
      });
    } catch (error) {
      toast({
        title: "Erro ao marcar retorno",
        description: "Não foi possível atualizar o retorno.",
        variant: "destructive"
      });
    }
  };
  const handleCancelar = async (idRetorno) => {
    try {
      await cancelarRetorno(idRetorno);
      toast({
        title: "Retorno cancelado",
        description: "O retorno foi cancelado com sucesso."
      });
    } catch (error) {
      toast({
        title: "Erro ao cancelar retorno",
        description: "Não foi possível cancelar o retorno.",
        variant: "destructive"
      });
    }
  };
  const getClienteNome = (idCliente) => {
    const cliente = clientes.find((c) => c.id === idCliente);
    return cliente?.nomeCompleto || "Cliente não encontrado";
  };
  if (retornosAtrasados.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-5 w-5 text-green-500" }),
        "Retornos em Dia"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Não há retornos atrasados no sistema." })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-5 w-5 text-orange-500" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold", children: "Resolver Retornos Atrasados" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", children: [
        retornosAtrasados.length,
        " pendentes"
      ] })
    ] }),
    retornosAtrasados.map((retorno) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-lg", children: getClienteNome(retorno.id_cliente) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { children: [
          "Data prevista: ",
          new Date(retorno.data_retorno).toLocaleDateString("pt-BR"),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "destructive", className: "ml-2", children: [
            calcularDiasAtraso(retorno.data_retorno),
            " dias de atraso"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => handleMarcarRealizado(retorno.id_retorno),
            className: "flex items-center gap-1",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4" }),
              "Marcar como Realizado"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => handleCancelar(retorno.id_retorno),
            className: "flex items-center gap-1",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4" }),
              "Cancelar"
            ]
          }
        )
      ] })
    ] }) }) }, retorno.id_retorno))
  ] });
}

function Auditoria() {
  const {
    relatorioAuditoria,
    exportarRelatorio,
    salvarRelatorio,
    salvando,
    carregarHistorico,
    relatoriosHistorico,
    carregandoBackend,
    executarAgora,
    origemRelatorio,
    resolverProblemasSelecionados,
    reabrirProblemasSelecionados
  } = useAuditoria();
  const { retornos } = useRetornos();
  const [activeTab, setActiveTab] = reactExports.useState("visao-geral");
  const [unresolvedKeys, setUnresolvedKeys] = reactExports.useState(/* @__PURE__ */ new Set());
  const [unresolvedCounts, setUnresolvedCounts] = reactExports.useState({});
  const retornosAtrasados = reactExports.useMemo(() => {
    const hoje = /* @__PURE__ */ new Date();
    return retornos.filter((r) => {
      if (r.status !== "Pendente") return false;
      const dataRetorno = new Date(r.data_retorno);
      return dataRetorno < hoje;
    }).length;
  }, [retornos]);
  const agendamentosEmAberto = reactExports.useMemo(() => {
    return relatorioAuditoria.problemas.filter(
      (p) => p.tipo === "dados_inconsistentes" && p.campo === "statusPagamento"
    ).length;
  }, [relatorioAuditoria.problemas]);
  const porcentagemSaude = Math.max(0, 100 - (relatorioAuditoria.problemasCriticos * 10 + relatorioAuditoria.problemasAltos * 5));
  reactExports.useEffect(() => {
    carregarHistorico();
  }, [carregarHistorico]);
  reactExports.useEffect(() => {
    const carregarNaoResolvidos = async () => {
      const { data } = await supabase.from("problemas_auditoria").select("tipo,entidade,entidade_id").eq("resolvido", false);
      const set = /* @__PURE__ */ new Set();
      (data || []).forEach((r) => {
        set.add(`${r.tipo}|${r.entidade}|${r.entidade_id}`);
      });
      setUnresolvedKeys(set);
    };
    carregarNaoResolvidos();
  }, []);
  reactExports.useEffect(() => {
    const calcularCounts = async () => {
      if (!relatoriosHistorico || relatoriosHistorico.length === 0) {
        setUnresolvedCounts({});
        return;
      }
      const ids = relatoriosHistorico.map((r) => r.id);
      const { data } = await supabase.from("problemas_auditoria").select("relatorio_id").in("relatorio_id", ids).eq("resolvido", false);
      const counts = {};
      (data || []).forEach((r) => {
        counts[r.relatorio_id] = (counts[r.relatorio_id] || 0) + 1;
      });
      setUnresolvedCounts(counts);
    };
    calcularCounts();
  }, [relatoriosHistorico]);
  reactExports.useEffect(() => {
    const carregarNaoResolvidos = async () => {
      const { data } = await supabase.from("problemas_auditoria").select("tipo,entidade,entidade_id").eq("resolvido", false);
      const set = /* @__PURE__ */ new Set();
      (data || []).forEach((r) => {
        set.add(`${r.tipo}|${r.entidade}|${r.entidade_id}`);
      });
      setUnresolvedKeys(set);
    };
    carregarNaoResolvidos();
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    carregandoBackend && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-blue-200 bg-blue-50 dark:bg-blue-950/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-5 w-5 text-blue-600 animate-spin" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-blue-900 dark:text-blue-100", children: "Executando Auditoria" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-blue-700 dark:text-blue-300", children: "Analisando dados e verificando inconsistências..." })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold tracking-tight", children: "Auditoria do Sistema" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground", children: [
          "Última análise: ",
          new Date(relatorioAuditoria.dataExecucao).toLocaleString("pt-BR")
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            onClick: executarAgora,
            disabled: carregandoBackend,
            className: "gap-2",
            title: origemRelatorio === "backend" ? "Relatório do servidor" : "Relatório local",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: `h-4 w-4 ${carregandoBackend ? "animate-spin" : ""}` }),
              carregandoBackend ? "Executando..." : "Executar Auditoria"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "default",
            onClick: salvarRelatorio,
            disabled: salvando,
            className: "gap-2",
            children: salvando ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4 animate-spin" }),
              "Salvando..."
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" }),
              "Salvar Relatório"
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            size: "icon",
            onClick: () => exportarRelatorio("csv"),
            title: "Exportar CSV",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            size: "icon",
            onClick: () => exportarRelatorio("json"),
            title: "Exportar JSON",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" })
          }
        )
      ] })
    ] }),
    relatorioAuditoria.problemasCriticos > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { variant: "destructive", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertTitle, { children: "Atenção: Problemas Críticos Detectados!" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDescription, { children: [
        "Foram encontrados ",
        relatorioAuditoria.problemasCriticos,
        ' problemas críticos que precisam de atenção imediata. Verifique a aba "Problemas" para mais detalhes e tome as ações necessárias.'
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AuditoriaSummaryCards,
      {
        porcentagemSaude,
        totalProblemas: relatorioAuditoria.totalProblemas,
        problemasCriticos: relatorioAuditoria.problemasCriticos,
        problemasAltos: relatorioAuditoria.problemasAltos,
        valorTotalReceitas: relatorioAuditoria.estatisticas.valorTotalReceitas,
        valorTotalDespesas: relatorioAuditoria.estatisticas.valorTotalDespesas,
        totalAgendamentos: relatorioAuditoria.estatisticas.totalAgendamentos,
        agendamentosAtivos: relatorioAuditoria.estatisticas.agendamentosAtivos,
        agendamentosConcluidos: relatorioAuditoria.estatisticas.agendamentosConcluidos
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AuditoriaAcoesRapidas,
      {
        retornosAtrasados,
        clientesInativos: relatorioAuditoria.estatisticas.clientesInativos,
        agendamentosEmAberto,
        problemasCriticos: relatorioAuditoria.problemasCriticos
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, className: "w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-full grid-cols-5 lg:w-auto lg:inline-flex", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "visao-geral", className: "gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-4 w-4 hidden sm:inline" }),
          "Visão Geral"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "problemas", id: "tab-problemas", className: "gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 hidden sm:inline" }),
          "Problemas",
          relatorioAuditoria.totalProblemas > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full", children: relatorioAuditoria.totalProblemas })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "resolver", className: "gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-4 w-4 hidden sm:inline" }),
          "Resolver"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "sugestoes", className: "gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Lightbulb, { className: "h-4 w-4 hidden sm:inline" }),
          "Sugestões"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "historico", className: "gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 hidden sm:inline" }),
          "Histórico"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "visao-geral", className: "space-y-4 mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AuditoriaEstatisticas, { estatisticas: relatorioAuditoria.estatisticas }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "problemas", className: "space-y-4 mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        AuditoriaProblemasTable,
        {
          problemas: relatorioAuditoria.problemas,
          onResolverLote: async (items) => {
            const ok = await resolverProblemasSelecionados(items);
            if (ok) {
              Jt.success("Problemas resolvidos", {
                action: {
                  label: "Desfazer",
                  onClick: async () => {
                    await reabrirProblemasSelecionados(items);
                  }
                }
              });
            }
            const { data } = await supabase.from("problemas_auditoria").select("tipo,entidade,entidade_id").eq("resolvido", false);
            const set = /* @__PURE__ */ new Set();
            (data || []).forEach((r) => {
              set.add(`${r.tipo}|${r.entidade}|${r.entidade_id}`);
            });
            setUnresolvedKeys(set);
          },
          unresolvedKeys
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "resolver", className: "space-y-4 mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-5 w-5" }),
          "Ferramentas de Resolução"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResolverRetornos, {}) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "sugestoes", className: "space-y-4 mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        AuditoriaSugestoes,
        {
          sugestoes: relatorioAuditoria.sugestoesMelhorias,
          estatisticas: {
            clientesInativos: relatorioAuditoria.estatisticas.clientesInativos,
            servicosNuncaUsados: relatorioAuditoria.estatisticas.servicosNuncaUsados,
            totalAgendamentos: relatorioAuditoria.estatisticas.totalAgendamentos,
            agendamentosCancelados: relatorioAuditoria.estatisticas.agendamentosCancelados
          }
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "historico", className: "space-y-4 mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        AuditoriaHistorico,
        {
          relatorios: relatoriosHistorico,
          onCarregar: carregarHistorico,
          unresolvedCounts
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-muted/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Dados analisados:" }),
        " ",
        relatorioAuditoria.estatisticas.totalClientes,
        " clientes •",
        relatorioAuditoria.estatisticas.totalServicos,
        " serviços •",
        relatorioAuditoria.estatisticas.totalAgendamentos,
        " agendamentos •",
        relatorioAuditoria.estatisticas.totalLancamentos,
        " lançamentos"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", children: "Auditoria executada automaticamente ao acessar a página" })
    ] }) }) })
  ] });
}

export { Auditoria as default };
