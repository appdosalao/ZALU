/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Scissors, Plus, Sparkles, DollarSign, Clock3, Layers3 } from "lucide-react";
import { useServicos } from "@/hooks/useServicos";
import ServicosList from "@/components/servicos/ServicosList";
import ServicoForm from "@/components/servicos/ServicoForm";
import { Servico } from "@/types/servico";

type VisualizacaoAtual = 'lista' | 'formulario';

export default function Servicos() {
  const {
    servicos,
    todosServicos,
    filtros,
    setFiltros,
    criarServico,
    atualizarServico,
    excluirServico,
  } = useServicos();

  const [visualizacaoAtual, setVisualizacaoAtual] = useState<VisualizacaoAtual>('lista');
  const [servicoSelecionado, setServicoSelecionado] = useState<Servico | null>(null);

  const handleNovoServico = () => {
    setServicoSelecionado(null);
    setVisualizacaoAtual('formulario');
  };

  const handleEditarServico = (servico: Servico) => {
    setServicoSelecionado(servico);
    setVisualizacaoAtual('formulario');
  };

  const handleSubmitFormulario = (data: any) => {
    const sucesso = servicoSelecionado
      ? atualizarServico(servicoSelecionado.id, data)
      : criarServico(data);

    if (sucesso) {
      setVisualizacaoAtual('lista');
      setServicoSelecionado(null);
    }
  };

  const handleVoltarParaLista = () => {
    setVisualizacaoAtual('lista');
    setServicoSelecionado(null);
  };

  if (visualizacaoAtual === 'formulario') {
    return (
      <div className="space-y-6 p-3 sm:p-0">
        <ServicoForm
          servico={servicoSelecionado || undefined}
          onSubmit={handleSubmitFormulario}
          onCancel={handleVoltarParaLista}
        />
      </div>
    );
  }

  return (
    <div className="space-y-5 p-3 sm:space-y-7 sm:p-0">
      <div className="overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-card via-card to-primary/[0.07] shadow-sm">
        <div className="flex flex-col gap-5 p-5 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <Badge variant="secondary" className="mb-3 rounded-full px-3 py-1">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              Catálogo e preços
            </Badge>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Serviços</h1>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Organize os serviços oferecidos, defina valores e duração para facilitar seus agendamentos.
            </p>
          </div>
          <Button
            onClick={handleNovoServico}
            className="h-11 w-full rounded-xl bg-gradient-to-r from-primary to-lilac-primary shadow-md transition-all hover:shadow-lg sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo serviço
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <Card className="rounded-2xl border-border/60 shadow-sm">
          <CardContent className="flex items-center gap-4 p-4 sm:p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Layers3 className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-bold tracking-tight">{todosServicos.length}</p>
              <p className="text-sm text-muted-foreground">Serviços cadastrados</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl border-border/60 shadow-sm">
          <CardContent className="flex items-center gap-4 p-4 sm:p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <DollarSign className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-bold tracking-tight">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                  todosServicos.length
                    ? todosServicos.reduce((total, servico) => total + Number(servico.valor || 0), 0) / todosServicos.length
                    : 0
                )}
              </p>
              <p className="text-sm text-muted-foreground">Valor médio</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl border-border/60 shadow-sm sm:col-span-2 xl:col-span-1">
          <CardContent className="flex items-center gap-4 p-4 sm:p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
              <Clock3 className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-bold tracking-tight">
                {todosServicos.length
                  ? `${Math.round(todosServicos.reduce((total, servico) => total + Number(servico.duracao || 0), 0) / todosServicos.length)} min`
                  : '0 min'}
              </p>
              <p className="text-sm text-muted-foreground">Duração média</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Serviços */}
      <ServicosList
        servicos={servicos}
        filtros={filtros}
        onFiltrosChange={setFiltros}
        onEdit={handleEditarServico}
        onDelete={excluirServico}
      />
    </div>
  );
}