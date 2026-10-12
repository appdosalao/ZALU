import { useMemo, useState } from "react";
import { format, isBefore, parseISO, startOfDay, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Calendar,
  CheckCircle,
  Clock,
  Filter,
  Search,
  User,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRetornos } from "@/hooks/useCronogramas";
import type { RetornoCompleto } from "@/hooks/useSupabaseCronogramas";

const formatDate = (date: string) => {
  const parsedDate = parseISO(date);
  return Number.isNaN(parsedDate.getTime())
    ? "Data inválida"
    : format(parsedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
};

export default function RetornosList() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [clienteFilter, setClienteFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedRetorno, setSelectedRetorno] = useState<RetornoCompleto | null>(null);
  const [dataAgendamento, setDataAgendamento] = useState("");
  const [horaAgendamento, setHoraAgendamento] = useState("");
  const [saving, setSaving] = useState(false);

  const {
    retornos,
    cronogramas,
    marcarRetornoRealizado,
    cancelarRetorno,
    criarAgendamentoDeRetorno,
    loading,
    error,
  } = useRetornos();
  const hoje = startOfDay(new Date());

  const clientes = useMemo(() => {
    const unique = new Map<string, string>();
    retornos.forEach((retorno) => {
      if (retorno.cliente_nome) unique.set(retorno.id_cliente, retorno.cliente_nome);
    });
    return [...unique.entries()].sort((a, b) => a[1].localeCompare(b[1], "pt-BR"));
  }, [retornos]);

  const filteredRetornos = useMemo(() => retornos.filter((retorno) => {
    const date = parseISO(retorno.data_retorno);
    const name = retorno.cliente_nome || "";
    const service = retorno.tipo_servico || "";
    const searchMatch = `${name} ${service}`.toLocaleLowerCase("pt-BR").includes(search.toLocaleLowerCase("pt-BR"));
    const statusMatch = statusFilter === "all" || retorno.status === statusFilter;
    const clienteMatch = clienteFilter === "all" || retorno.id_cliente === clienteFilter;
    const periodMatch = periodFilter === "all"
      || (periodFilter === "atrasados" && retorno.status === "Pendente" && isBefore(date, hoje))
      || (periodFilter === "7dias" && !isBefore(date, hoje) && isBefore(date, addDays(hoje, 8)));

    return searchMatch && statusMatch && clienteMatch && periodMatch;
  }), [retornos, search, statusFilter, clienteFilter, periodFilter, hoje]);

  const counts = useMemo(() => ({
    pendentes: retornos.filter((retorno) => retorno.status === "Pendente").length,
    agendados: retornos.filter((retorno) => retorno.status === "Pendente" && retorno.id_agendamento_retorno).length,
    atrasados: retornos.filter((retorno) => retorno.status === "Pendente" && isBefore(parseISO(retorno.data_retorno), hoje)).length,
  }), [retornos, hoje]);

  const getStatusBadge = (retorno: RetornoCompleto) => {
    if (retorno.status === "Pendente" && retorno.id_agendamento_retorno) {
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Agendado</Badge>;
    }
    if (retorno.status === "Pendente") {
      return <Badge variant="secondary"><Clock className="mr-1 h-3 w-3" />Pendente</Badge>;
    }
    if (retorno.status === "Realizado") {
      return <Badge variant="default"><CheckCircle className="mr-1 h-3 w-3" />Realizado</Badge>;
    }
    return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" />Cancelado</Badge>;
  };

  const abrirAgendamento = (retorno: RetornoCompleto) => {
    const cronograma = cronogramas.find((item) => item.id_cronograma === retorno.id_cronograma);
    setSelectedRetorno(retorno);
    setDataAgendamento(retorno.data_retorno);
    setHoraAgendamento((cronograma?.hora_inicio || retorno.hora_inicio || "09:00").slice(0, 5));
  };

  const handleAgendar = async () => {
    if (!selectedRetorno || !dataAgendamento || !horaAgendamento) {
      toast.error("Informe a data e o horário do agendamento.");
      return;
    }

    setSaving(true);
    try {
      await criarAgendamentoDeRetorno(selectedRetorno.id_retorno, dataAgendamento, horaAgendamento);
      toast.success("Retorno agendado", {
        description: "O retorno continuará pendente até que o atendimento seja concluído.",
      });
      setSelectedRetorno(null);
    } catch (error) {
      toast.error("Não foi possível agendar o retorno", {
        description: error instanceof Error ? error.message : "Tente novamente.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleConcluir = async (retorno: RetornoCompleto) => {
    try {
      await marcarRetornoRealizado(retorno.id_retorno);
      toast.success("Retorno concluído", {
        description: "O próximo retorno previsto foi criado automaticamente.",
      });
    } catch (error) {
      toast.error("Não foi possível concluir o retorno", {
        description: error instanceof Error ? error.message : "Tente novamente.",
      });
    }
  };

  const handleCancelar = async (retorno: RetornoCompleto) => {
    try {
      await cancelarRetorno(retorno.id_retorno);
      toast.success(retorno.id_agendamento_retorno ? "Agendamento cancelado" : "Retorno cancelado", {
        description: retorno.id_agendamento_retorno
          ? "O retorno permanece pendente e pode ser agendado novamente."
          : "A ocorrência foi cancelada e o próximo retorno foi criado.",
      });
    } catch (error) {
      toast.error("Não foi possível cancelar", {
        description: error instanceof Error ? error.message : "Tente novamente.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">Retornos dos clientes</h2>
        <p className="text-sm text-muted-foreground sm:text-base">
          Acompanhe cada ocorrência e escolha quando transformá-la em um agendamento.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div><p className="text-sm text-muted-foreground">Pendentes</p><p className="text-2xl font-semibold">{counts.pendentes}</p></div>
            <Clock className="h-5 w-5 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div><p className="text-sm text-muted-foreground">Agendados</p><p className="text-2xl font-semibold">{counts.agendados}</p></div>
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div><p className="text-sm text-muted-foreground">Atrasados</p><p className="text-2xl font-semibold">{counts.atrasados}</p></div>
            <XCircle className="h-5 w-5 text-muted-foreground" />
          </CardContent>
        </Card>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>Erro ao atualizar os retornos: {error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base"><Filter className="h-4 w-4" />Filtros</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar cliente ou serviço" className="pl-9" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="Pendente">Pendente</SelectItem>
              <SelectItem value="Realizado">Realizado</SelectItem>
              <SelectItem value="Cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
          <Select value={clienteFilter} onValueChange={setClienteFilter}>
            <SelectTrigger><SelectValue placeholder="Cliente" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os clientes</SelectItem>
              {clientes.map(([id, nome]) => <SelectItem key={id} value={id}>{nome}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={periodFilter} onValueChange={setPeriodFilter}>
            <SelectTrigger><SelectValue placeholder="Período" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os períodos</SelectItem>
              <SelectItem value="atrasados">Atrasados</SelectItem>
              <SelectItem value="7dias">Próximos 7 dias</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {loading ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">Carregando retornos...</CardContent></Card>
      ) : filteredRetornos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-12 text-center">
            <Calendar className="mb-4 h-10 w-10 text-muted-foreground" />
            <h3 className="font-semibold">Nenhum retorno encontrado</h3>
            <p className="mt-1 text-sm text-muted-foreground">Ajuste os filtros ou crie um cronograma para começar.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {filteredRetornos.map((retorno) => (
            <Card key={retorno.id_retorno}>
              <CardContent className="space-y-4 p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <h3 className="truncate font-semibold">{retorno.cliente_nome || "Cliente sem nome"}</h3>
                    </div>
                    <p className="mt-1 truncate pl-6 text-sm text-muted-foreground">
                      {retorno.tipo_servico || "Serviço"}{retorno.recorrencia ? ` · ${retorno.recorrencia}` : ""}
                    </p>
                  </div>
                  {getStatusBadge(retorno)}
                </div>

                <div className="grid gap-2 text-sm sm:grid-cols-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4 shrink-0" />
                    <span>{formatDate(retorno.data_retorno)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4 shrink-0" />
                    <span>{retorno.agendamento_hora?.slice(0, 5) || retorno.hora_inicio?.slice(0, 5) || "Horário a definir"}</span>
                  </div>
                </div>

                {retorno.status === "Pendente" && (
                  <div className="flex flex-wrap justify-end gap-2 border-t pt-3">
                    {!retorno.id_agendamento_retorno && (
                      <>
                        <Button size="sm" onClick={() => abrirAgendamento(retorno)}>
                          <Calendar className="mr-2 h-4 w-4" />Agendar
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleConcluir(retorno)}>
                          <CheckCircle className="mr-2 h-4 w-4" />Concluir sem agendar
                        </Button>
                      </>
                    )}
                    {retorno.id_agendamento_retorno && retorno.agendamento_status === "concluido" && (
                      <Button size="sm" onClick={() => handleConcluir(retorno)}>
                        <CheckCircle className="mr-2 h-4 w-4" />Sincronizar conclusão
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => handleCancelar(retorno)}>
                      <XCircle className="mr-2 h-4 w-4" />
                      {retorno.id_agendamento_retorno ? "Cancelar agendamento" : "Cancelar retorno"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selectedRetorno} onOpenChange={(open) => !open && setSelectedRetorno(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agendar retorno</DialogTitle>
            <DialogDescription>
              {selectedRetorno?.cliente_nome || "Cliente"} · {selectedRetorno?.tipo_servico || "Serviço"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-medium">
              Data
              <Input type="date" value={dataAgendamento} onChange={(event) => setDataAgendamento(event.target.value)} />
            </label>
            <label className="space-y-2 text-sm font-medium">
              Horário
              <Input type="time" value={horaAgendamento} onChange={(event) => setHoraAgendamento(event.target.value)} />
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedRetorno(null)}>Cancelar</Button>
            <Button onClick={handleAgendar} disabled={saving}>{saving ? "Agendando..." : "Confirmar agendamento"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
