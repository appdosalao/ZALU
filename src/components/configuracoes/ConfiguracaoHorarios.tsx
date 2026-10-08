import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Calendar, Plus, Trash2, Save, CheckCircle2, TimerReset, BriefcaseBusiness } from 'lucide-react';
import { useSupabaseConfiguracoes } from '@/hooks/useSupabaseConfiguracoes';
import { useIntervalosTrabalho } from '@/hooks/useIntervalosTrabalho';
import { ConfiguracaoIntervalos } from '@/components/configuracoes/ConfiguracaoIntervalos';
import { toast } from 'sonner';

const DIAS_SEMANA = [
  { id: 0, nome: 'Domingo', abrev: 'DOM' },
  { id: 1, nome: 'Segunda-feira', abrev: 'SEG' },
  { id: 2, nome: 'Terça-feira', abrev: 'TER' },
  { id: 3, nome: 'Quarta-feira', abrev: 'QUA' },
  { id: 4, nome: 'Quinta-feira', abrev: 'QUI' },
  { id: 5, nome: 'Sexta-feira', abrev: 'SEX' },
  { id: 6, nome: 'Sábado', abrev: 'SAB' },
];

interface HorarioFormData {
  dia_semana: number;
  ativo: boolean;
  horario_abertura: string;
  horario_fechamento: string;
  intervalo_inicio?: string;
  intervalo_fim?: string;
  permite_agendamento_fora_horario?: boolean;
  tempo_minimo_antecedencia?: number;
  tempo_maximo_antecedencia?: number;
}

export function ConfiguracaoHorarios() {
  const { configuracaoHorarios, loading, salvarHorario, deletarHorario } = useSupabaseConfiguracoes();
  const { intervalos } = useIntervalosTrabalho();
  const [horariosForm, setHorariosForm] = useState<HorarioFormData[]>([]);

  // Inicializar formulário com dados existentes ou padrões
  useEffect(() => {
    const horariosCompletos = DIAS_SEMANA.map(dia => {
      const existente = configuracaoHorarios.find(h => h.dia_semana === dia.id);

      if (existente) {
        return {
          dia_semana: existente.dia_semana,
          ativo: existente.ativo,
          horario_abertura: existente.horario_abertura,
          horario_fechamento: existente.horario_fechamento,
          intervalo_inicio: existente.intervalo_inicio,
          intervalo_fim: existente.intervalo_fim,
          permite_agendamento_fora_horario: existente.permite_agendamento_fora_horario || false,
          tempo_minimo_antecedencia: existente.tempo_minimo_antecedencia || 60,
          tempo_maximo_antecedencia: existente.tempo_maximo_antecedencia || 4320,
        };
      }

      return {
        dia_semana: dia.id,
        ativo: dia.id >= 1 && dia.id <= 5, // Segunda a sexta ativo por padrão
        horario_abertura: '08:00',
        horario_fechamento: '18:00',
        intervalo_inicio: '12:00',
        intervalo_fim: '13:00',
        permite_agendamento_fora_horario: false,
        tempo_minimo_antecedencia: 60,
        tempo_maximo_antecedencia: 4320,
      };
    });

    setHorariosForm(horariosCompletos);
  }, [configuracaoHorarios]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Carregando configurações...</div>
        </CardContent>
      </Card>
    );
  }

  const handleDiaToggle = (diaSemana: number, ativo: boolean) => {
    setHorariosForm(prev => 
      prev.map(h => 
        h.dia_semana === diaSemana ? { ...h, ativo } : h
      )
    );
  };

  const handleHorarioChange = (diaSemana: number, campo: string, valor: string | boolean | number) => {
    setHorariosForm(prev => 
      prev.map(h => 
        h.dia_semana === diaSemana ? { ...h, [campo]: valor } : h
      )
    );
  };

  const salvarConfiguracao = async (diaSemana: number) => {
    const horario = horariosForm.find(h => h.dia_semana === diaSemana);
    if (!horario) return;

    try {
      if (horario.ativo && horario.horario_abertura >= horario.horario_fechamento) {
        toast.error('Horário de abertura deve ser menor que o de fechamento');
        return;
      }

      if (horario.intervalo_inicio && horario.intervalo_fim && 
          horario.intervalo_inicio >= horario.intervalo_fim) {
        toast.error('Horário de início do intervalo deve ser menor que o de fim');
        return;
      }

      await salvarHorario(horario);
    } catch (error) {
      console.error('Erro ao salvar horário:', error);
    }
  };

  const salvarTodasConfiguracoes = async () => {
    try {
      for (const horario of horariosForm) {
        if (horario.ativo && horario.horario_abertura >= horario.horario_fechamento) {
          toast.error(`O horário de abertura de ${DIAS_SEMANA[horario.dia_semana].nome} deve ser menor que o de fechamento`);
          return;
        }

        if (horario.intervalo_inicio && horario.intervalo_fim && horario.intervalo_inicio >= horario.intervalo_fim) {
          toast.error(`O início do intervalo de ${DIAS_SEMANA[horario.dia_semana].nome} deve ser menor que o fim`);
          return;
        }
      }

      for (const horario of horariosForm) {
        await salvarHorario(horario);
      }
      toast.success('Todas as configurações foram salvas!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast.error('Erro ao salvar algumas configurações');
    }
  };

  const getHorarioAtual = (diaSemana: number) => {
    return horariosForm.find(h => h.dia_semana === diaSemana);
  };

  return (
    <Tabs defaultValue="horarios-basicos" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2 rounded-2xl bg-slate-100/80 p-1 shadow-sm dark:bg-slate-900/70">
        <TabsTrigger value="horarios-basicos" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-slate-900 dark:data-[state=active]:bg-slate-800 dark:data-[state=active]:text-slate-50">
          Horários Básicos
        </TabsTrigger>
        <TabsTrigger value="intervalos-personalizados" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-slate-900 dark:data-[state=active]:bg-slate-800 dark:data-[state=active]:text-slate-50">
          Intervalos Personalizados
        </TabsTrigger>
      </TabsList>

      <TabsContent value="horarios-basicos" className="space-y-6">
        <Card className="border-0 bg-gradient-to-br from-slate-50 via-white to-violet-50 shadow-[0_20px_45px_-30px_rgba(15,23,42,0.45)] dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Calendar className="h-5 w-5 text-violet-600" />
                  Resumo dos Dias de Atendimento
                </CardTitle>
                <CardDescription className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Visão geral dos dias em que você atenderá clientes
                </CardDescription>
              </div>
              <Button onClick={salvarTodasConfiguracoes} className="w-full sm:w-auto rounded-xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-violet-600 dark:hover:bg-violet-500">
                <Save className="h-4 w-4 mr-2" />
                Salvar tudo
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {DIAS_SEMANA.map((dia) => {
                const horario = getHorarioAtual(dia.id);
                const isAtivo = horario?.ativo || false;
                const atendimentos = isAtivo && horario ? `${horario.horario_abertura} - ${horario.horario_fechamento}` : 'Fechado';

                return (
                  <div
                    key={dia.id}
                    className={`rounded-2xl border p-3 transition-all ${
                      isAtivo
                        ? 'border-violet-200 bg-violet-50/80 shadow-sm dark:border-violet-900 dark:bg-violet-950/30'
                        : 'border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant={isAtivo ? 'default' : 'secondary'} className="rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-[0.18em] uppercase">
                        {dia.abrev}
                      </Badge>
                      <span className={`inline-flex h-2.5 w-2.5 rounded-full ${isAtivo ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    </div>
                    <p className="mt-3 text-sm font-medium text-slate-900 dark:text-slate-100">{dia.nome}</p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">{atendimentos}</p>
                  </div>
                );
              })}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                  <BriefcaseBusiness className="h-4 w-4 text-violet-600" />
                  Dias ativos
                </div>
                <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-slate-50">
                  {DIAS_SEMANA.filter((dia) => getHorarioAtual(dia.id)?.ativo).length}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                  <Clock className="h-4 w-4 text-violet-600" />
                  Média de atendimento
                </div>
                <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-slate-50">
                  {(() => {
                    const ativos = DIAS_SEMANA
                      .map((dia) => getHorarioAtual(dia.id))
                      .filter((item): item is HorarioFormData => Boolean(item?.ativo));
                    if (!ativos.length) return '0h';
                    const total = ativos.reduce((sum, item) => {
                      const abertura = Number(item.horario_abertura.split(':')[0]) + Number(item.horario_abertura.split(':')[1]) / 60;
                      const fechamento = Number(item.horario_fechamento.split(':')[0]) + Number(item.horario_fechamento.split(':')[1]) / 60;
                      return sum + (fechamento - abertura);
                    }, 0);
                    const media = total / ativos.length;
                    return `${media.toFixed(1).replace('.0', '')}h`;
                  })()}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-violet-600" />
                  Regras em vigor
                </div>
                <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-slate-50">
                {DIAS_SEMANA.filter((dia) => {
                  const horario = getHorarioAtual(dia.id);
                  return horario?.ativo && (horario.permite_agendamento_fora_horario || (!!horario.intervalo_inicio && !!horario.intervalo_fim));
                }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {DIAS_SEMANA.map((dia) => {
          const horario = getHorarioAtual(dia.id);
          if (!horario) return null;

          return (
            <Card key={dia.id} className="overflow-hidden border-0 shadow-[0_20px_45px_-30px_rgba(15,23,42,0.5)] dark:bg-slate-900/80">
              <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-violet-50/70 px-5 py-4 dark:border-slate-700 dark:from-slate-900 dark:to-slate-900">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-200">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{dia.nome}</CardTitle>
                      {horario.ativo && (
                        <CardDescription className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                          Configure os horários de funcionamento da {dia.nome.toLowerCase()}
                        </CardDescription>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm dark:border-slate-700 dark:bg-slate-950/70">
                    <Switch
                      checked={horario.ativo}
                      onCheckedChange={(checked) => handleDiaToggle(dia.id, checked)}
                    />
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-200">Ativo</Label>
                  </div>
                </div>
              </CardHeader>

              {horario.ativo && (
                <CardContent className="space-y-5 p-5">
                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                      <Label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Horário de Funcionamento</Label>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <Label htmlFor={`abertura-${dia.id}`} className="mb-1.5 block text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Abertura</Label>
                          <Input
                            id={`abertura-${dia.id}`}
                            type="time"
                            value={horario.horario_abertura}
                            onChange={(e) => handleHorarioChange(dia.id, 'horario_abertura', e.target.value)}
                            className="h-11 rounded-xl border-slate-200 bg-white dark:border-slate-600 dark:bg-slate-900"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`fechamento-${dia.id}`} className="mb-1.5 block text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Fechamento</Label>
                          <Input
                            id={`fechamento-${dia.id}`}
                            type="time"
                            value={horario.horario_fechamento}
                            onChange={(e) => handleHorarioChange(dia.id, 'horario_fechamento', e.target.value)}
                            className="h-11 rounded-xl border-slate-200 bg-white dark:border-slate-600 dark:bg-slate-900"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                      <Label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Intervalo de Almoço</Label>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <Label htmlFor={`intervalo-inicio-${dia.id}`} className="mb-1.5 block text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Início</Label>
                          <Input
                            id={`intervalo-inicio-${dia.id}`}
                            type="time"
                            value={horario.intervalo_inicio || ''}
                            onChange={(e) => handleHorarioChange(dia.id, 'intervalo_inicio', e.target.value)}
                            placeholder="Ex: 12:00"
                            className="h-11 rounded-xl border-slate-200 bg-white dark:border-slate-600 dark:bg-slate-900"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`intervalo-fim-${dia.id}`} className="mb-1.5 block text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Fim</Label>
                          <Input
                            id={`intervalo-fim-${dia.id}`}
                            type="time"
                            value={horario.intervalo_fim || ''}
                            onChange={(e) => handleHorarioChange(dia.id, 'intervalo_fim', e.target.value)}
                            placeholder="Ex: 13:00"
                            className="h-11 rounded-xl border-slate-200 bg-white dark:border-slate-600 dark:bg-slate-900"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
                    <Label className="mb-3 block text-sm font-medium text-slate-700 dark:text-slate-200">Configurações Avançadas</Label>
                    <div className="grid gap-4 lg:grid-cols-2">
                      <div>
                        <Label htmlFor={`tempo-min-${dia.id}`} className="mb-1.5 block text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Antecedência mínima</Label>
                        <Input
                          id={`tempo-min-${dia.id}`}
                          type="number"
                          min="0"
                          value={horario.tempo_minimo_antecedencia || 60}
                          onChange={(e) => handleHorarioChange(dia.id, 'tempo_minimo_antecedencia', Number(e.target.value))}
                          placeholder="60"
                          className="h-11 rounded-xl border-slate-200 bg-white dark:border-slate-600 dark:bg-slate-900"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`tempo-max-${dia.id}`} className="mb-1.5 block text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Antecedência máxima</Label>
                        <Input
                          id={`tempo-max-${dia.id}`}
                          type="number"
                          min="0"
                          value={horario.tempo_maximo_antecedencia || 4320}
                          onChange={(e) => handleHorarioChange(dia.id, 'tempo_maximo_antecedencia', Number(e.target.value))}
                          placeholder="4320"
                          className="h-11 rounded-xl border-slate-200 bg-white dark:border-slate-600 dark:bg-slate-900"
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/60">
                      <div>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Permitir agendamento fora do horário comercial</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Ative apenas se quiser receber solicitações fora do expediente.</p>
                      </div>
                      <Switch
                        id={`permite-fora-horario-${dia.id}`}
                        checked={horario.permite_agendamento_fora_horario || false}
                        onCheckedChange={(checked) => handleHorarioChange(dia.id, 'permite_agendamento_fora_horario', checked)}
                      />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-violet-200 bg-violet-50/80 p-4 dark:border-violet-900 dark:bg-violet-950/20">
                    <div className="flex items-center gap-2 text-sm font-medium text-violet-800 dark:text-violet-200">
                      <TimerReset className="h-4 w-4" />
                      Resumo do dia
                    </div>
                    <div className="mt-3 space-y-2 text-sm text-violet-900/90 dark:text-violet-100/90">
                      <p>
                        <strong>Funcionamento:</strong> {horario.horario_abertura} às {horario.horario_fechamento}
                        {horario.intervalo_inicio && horario.intervalo_fim && (
                          <span> · Almoço: {horario.intervalo_inicio} às {horario.intervalo_fim}</span>
                        )}
                      </p>
                      <p>
                        <strong>Antecedência:</strong> {horario.tempo_minimo_antecedencia || 60} min a {Math.floor((horario.tempo_maximo_antecedencia || 4320) / 60)} horas
                      </p>
                      {intervalos.filter(i => i.dia_semana === dia.id && i.ativo).length > 0 && (
                        <p>
                          <strong>Intervalos personalizados:</strong> {intervalos.filter(i => i.dia_semana === dia.id && i.ativo).length} configurado{intervalos.filter(i => i.dia_semana === dia.id && i.ativo).length !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={() => salvarConfiguracao(dia.id)}
                    className="w-full rounded-xl bg-violet-600 text-white hover:bg-violet-500 dark:bg-violet-500 dark:hover:bg-violet-400"
                    variant="outline"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Salvar {dia.nome}
                  </Button>
                </CardContent>
              )}
            </Card>
          );
        })}

        <Card className="border-violet-200 bg-gradient-to-r from-blue-50 via-violet-50 to-indigo-50 dark:border-violet-900 dark:from-slate-900 dark:via-violet-950/20 dark:to-slate-900">
          <CardContent className="p-4">
            <h3 className="mb-3 font-semibold text-slate-900 dark:text-slate-100">
              💡 Dicas de configuração profissional
            </h3>
            <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <li>• Os horários configurados serão respeitados nos formulários de agendamento.</li>
              <li>• O intervalo de almoço bloqueia automaticamente os horários disponíveis para novos agendamentos.</li>
              <li>• Você pode definir regras diferentes para cada dia da semana.</li>
              <li>• Dias inativos não aparecem como opção para agendamentos.</li>
              <li>• A antecedência mínima ajuda a evitar agendamentos de última hora.</li>
              <li>• A antecedência máxima limita o tempo de antecipação do cliente.</li>
            </ul>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="intervalos-personalizados">
        <ConfiguracaoIntervalos />
      </TabsContent>
    </Tabs>
  );
}