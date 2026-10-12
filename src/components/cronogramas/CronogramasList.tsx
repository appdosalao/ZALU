/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Edit, Trash2, Play, Pause, CheckCircle } from "lucide-react";
import { useCronogramas } from "@/hooks/useCronogramas";
import { toast } from "sonner";
import CronogramaForm from "./CronogramaForm";

export default function CronogramasList() {
  const [editingCronograma, setEditingCronograma] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const { cronogramas, loading, deleteCronograma, updateCronograma } = useCronogramas();

  const handleDelete = async (id: string) => {
    try {
      await deleteCronograma(id);
      toast("Cronograma removido", {
        description: "O cronograma foi removido com sucesso.",
      });
    } catch (error) {
      toast.error("Erro", {
        description: "Erro ao remover cronograma.",
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

  const handleAlterarStatus = async (cronograma: any) => {
    const novoStatus = cronograma.status === "ativo" ? "cancelado" : "ativo";
    try {
      await updateCronograma(cronograma.id_cronograma, { status: novoStatus });
      toast.success(novoStatus === "ativo" ? "Cronograma reativado" : "Cronograma pausado", {
        description: novoStatus === "ativo"
          ? "O próximo retorno previsto está disponível na lista de retornos."
          : "Nenhuma nova ocorrência será criada enquanto o cronograma estiver pausado.",
      });
    } catch (error) {
      toast.error("Não foi possível alterar o cronograma", {
        description: error instanceof Error ? error.message : "Tente novamente.",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativo':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle className="w-3 h-3 mr-1" />Ativo</Badge>;
      case 'cancelado':
        return <Badge variant="destructive"><Pause className="w-3 h-3 mr-1" />Cancelado</Badge>;
      case 'concluido':
        return <Badge variant="secondary"><CheckCircle className="w-3 h-3 mr-1" />Concluído</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRecorrenciaText = (cronograma: any) => {
    if (cronograma.recorrencia === 'Personalizada' && cronograma.intervalo_dias) {
      return `A cada ${cronograma.intervalo_dias} dias`;
    }
    return cronograma.recorrencia;
  };

  const getProximoRetorno = (cronograma: any) => {
    const data = cronograma.proximo_retorno || cronograma.data_inicio;
    const parsed = parseISO(data);
    return Number.isNaN(parsed.getTime()) ? "Não definido" : format(parsed, "dd/MM/yyyy", { locale: ptBR });
  };

  if (loading) {
    return <div>Carregando cronogramas...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Lista de Cronogramas</h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Gerencie cronogramas de retorno dos seus clientes
          </p>
        </div>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingCronograma(null)} className="w-full sm:w-auto">
              Novo Cronograma
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCronograma ? 'Editar Cronograma' : 'Novo Cronograma'}
              </DialogTitle>
              <DialogDescription>
                Configure os detalhes do cronograma de retorno
              </DialogDescription>
            </DialogHeader>
            <CronogramaForm
              cronograma={editingCronograma}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          </DialogContent>
        </Dialog>
      </div>

      {cronogramas.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum cronograma cadastrado</h3>
            <p className="text-muted-foreground text-center mb-4">
              Crie um cronograma para acompanhar os próximos retornos dos clientes
            </p>
            <Button onClick={() => setShowForm(true)}>
              Criar Primeiro Cronograma
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {cronogramas.map((cronograma) => (
            <Card key={cronograma.id_cronograma} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <CardTitle className="text-lg truncate">{cronograma.cliente_nome}</CardTitle>
                  {getStatusBadge(cronograma.status)}
                </div>
                <CardDescription className="flex items-center gap-2">
                  <Clock className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{cronograma.tipo_servico}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <span className="text-muted-foreground">Próximo retorno:</span>
                    <span className="font-medium">{getProximoRetorno(cronograma)}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <span className="text-muted-foreground">Duração:</span>
                    <span>{cronograma.duracao_minutos} min</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <span className="text-muted-foreground">Recorrência:</span>
                    <span className="break-words">{getRecorrenciaText(cronograma)}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <span className="text-muted-foreground">Horário:</span>
                    <span>{cronograma.hora_inicio}</span>
                  </div>
                </div>

                {cronograma.observacoes && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Obs:</span>
                    <p className="text-foreground mt-1 break-words">{cronograma.observacoes}</p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-2 pt-3">
                  {cronograma.status !== 'concluido' && (
                    <Button
                      variant={cronograma.status === "ativo" ? "outline" : "default"}
                      size="sm"
                      onClick={() => handleAlterarStatus(cronograma)}
                      className="flex-1"
                    >
                      {cronograma.status === "ativo"
                        ? <><Pause className="mr-1 h-4 w-4" />Pausar</>
                        : <><Play className="mr-1 h-4 w-4" />Reativar</>}
                    </Button>
                  )}
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingCronograma(cronograma);
                        setShowForm(true);
                      }}
                      className="flex-1 sm:flex-initial"
                    >
                      <Edit className="h-4 w-4" />
                      <span className="ml-1 sm:hidden">Editar</span>
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1 sm:flex-initial">
                          <Trash2 className="h-4 w-4" />
                          <span className="ml-1 sm:hidden">Excluir</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="mx-4 max-w-sm sm:max-w-lg">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir este cronograma? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                          <AlertDialogCancel className="w-full sm:w-auto">Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(cronograma.id_cronograma)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 w-full sm:w-auto"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}