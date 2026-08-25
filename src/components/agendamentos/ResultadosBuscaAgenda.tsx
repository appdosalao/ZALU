import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { ReactNode } from 'react';
import {
  SearchX,
  X,
  History,
  Trophy,
  User,
  Scissors,
  Clock,
  Calendar,
  DollarSign,
  ChevronRight,
  Users,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Cliente } from '@/types/cliente';
import type { Servico } from '@/types/servico';
import type { Agendamento } from '@/types/agendamento';
import type { RankingServicoItem } from '@/hooks/useBuscaInteligenteAgenda';
import { formatarMoeda, formatarHora, formatarData } from '@/lib/format';
import { cn } from '@/lib/utils';

interface ResultadosBuscaAgendaProps {
  termo: string;
  pronto: boolean;
  clientesEncontrados: Cliente[];
  servicosEncontrados: Servico[];
  clienteSelecionado: Cliente | null;
  servicoSelecionado: Servico | null;
  historico: Agendamento[];
  ranking: RankingServicoItem[];
  carregando: boolean;
  onSelecionarCliente: (clienteId: string) => void;
  onSelecionarServico: (servicoId: string) => void;
  onVerDetalhes: (agendamento: Agendamento) => void;
  onLimparBusca: () => void;
}

const statusConfig: Record<Agendamento['status'], { label: string; classe: string }> = {
  agendado: { label: 'Agendado', classe: 'bg-info text-white' },
  concluido: { label: 'Concluído', classe: 'bg-success text-white' },
  cancelado: { label: 'Cancelado', classe: 'bg-destructive text-white' },
  excluido: { label: 'Excluído', classe: 'bg-muted-foreground text-white' },
};

const iniciais = (nome: string): string =>
  nome
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte.charAt(0).toUpperCase())
    .join('');

export default function ResultadosBuscaAgenda({
  termo,
  pronto,
  clientesEncontrados,
  servicosEncontrados,
  clienteSelecionado,
  servicoSelecionado,
  historico,
  ranking,
  carregando,
  onSelecionarCliente,
  onSelecionarServico,
  onVerDetalhes,
  onLimparBusca,
}: ResultadosBuscaAgendaProps) {
  const carregandoVisual = carregando || !pronto;
  const temClientes = clientesEncontrados.length > 0;
  const temServicos = servicosEncontrados.length > 0;
  const nenhumResultado = pronto && !carregando && !temClientes && !temServicos;

  const resumoCliente = calcularResumoCliente(historico);
  const totalAtendimentosRanking = ranking.reduce((soma, item) => soma + item.quantidade, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Cabeçalho da busca */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-lilac-light">
                <History className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="min-w-0">
                <h2 className="font-semibold text-foreground">Busca Inteligente</h2>
                <p className="text-xs text-muted-foreground truncate">
                  Resultados para{" "}
                  <span className="font-medium text-primary">“{termo}”</span>
                  {pronto && !carregando && (
                    <span className="ml-2">
                      · {temClientes ? `${clientesEncontrados.length} cliente${clientesEncontrados.length !== 1 ? 's' : ''}` : ''}
                      {temClientes && temServicos ? ' e ' : ''}
                      {temServicos ? `${servicosEncontrados.length} serviço${servicosEncontrados.length !== 1 ? 's' : ''}` : ''}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="md:ml-auto">
              <Button variant="outline" size="sm" onClick={onLimparBusca}>
                <X className="mr-2 h-4 w-4" />
                Limpar busca
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {carregandoVisual && (
        <div className="space-y-4">
          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-4 md:p-6 space-y-4">
              <div className="h-6 w-48 animate-pulse rounded-lg bg-muted" />
              <div className="h-4 w-full max-w-md animate-pulse rounded-lg bg-muted" />
              <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
                ))}
              </div>
              <div className="space-y-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-16 animate-pulse rounded-xl bg-muted" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {nenhumResultado && (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center text-center p-8 md:p-12">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mb-4">
              <SearchX className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-base md:text-lg font-semibold mb-2">Nenhum cliente ou serviço encontrado</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Não encontramos nenhum cliente ou serviço com o termo “<strong>{termo}</strong>”.
              Tente buscar por um nome ou sobrenome de cliente, ou pelo nome de um serviço.
            </p>
          </CardContent>
        </Card>
      )}

      {pronto && !carregando && temClientes && (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4 md:p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Clientes</h3>
            </div>

            {clientesEncontrados.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {clientesEncontrados.map((cliente) => {
                  const nome = cliente.nome || cliente.nomeCompleto || '';
                  const ativo = clienteSelecionado?.id === cliente.id;
                  return (
                    <button
                      key={cliente.id}
                      type="button"
                      onClick={() => onSelecionarCliente(cliente.id)}
                      className={cn(
                        'flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-all duration-200 touch-feedback',
                        ativo
                          ? 'border-primary bg-primary text-primary-foreground shadow-[0_4px_14px_-4px_hsl(var(--primary)_/_0.5)]'
                          : 'border-border/60 bg-background/60 text-foreground hover:border-primary/40 hover:bg-primary/5'
                      )}
                    >
                      <span
                        className={cn(
                          'flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold',
                          ativo ? 'bg-primary-foreground/20' : 'bg-primary/10 text-primary'
                        )}
                      >
                        {iniciais(nome)}
                      </span>
                      <span className="truncate max-w-[12rem]">{nome}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {clienteSelecionado && (
              <div className="space-y-4">
                {/* Resumo do histórico */}
                <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
                  <ResumoCard icone={<Calendar className="h-4 w-4" />} rotulo="Atendimentos" valor={String(resumoCliente.atendimentos)} />
                  <ResumoCard icone={<DollarSign className="h-4 w-4" />} rotulo="Total investido" valor={formatarMoeda(resumoCliente.totalInvestido)} />
                  <ResumoCard icone={<Clock className="h-4 w-4" />} rotulo="Em aberto" valor={formatarMoeda(resumoCliente.emAberto)} />
                  <ResumoCard
                    icone={<History className="h-4 w-4" />}
                    rotulo="Última visita"
                    valor={resumoCliente.ultimaVisita ? formatarData(resumoCliente.ultimaVisita) : '—'}
                  />
                </div>

                {/* Lista do histórico completo */}
                <div>
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Histórico completo de {clienteSelecionado.nome || clienteSelecionado.nomeCompleto}
                    </h4>
                    {historico.length > 0 && (
                      <span className="text-xs text-muted-foreground">{historico.length} registro{historico.length !== 1 ? 's' : ''}</span>
                    )}
                  </div>

                  {historico.length === 0 ? (
                    <div className="rounded-xl border border-border/50 bg-background/40 p-6 text-center">
                      <p className="text-sm text-muted-foreground">
                        Nenhum atendimento registrado para este cliente.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {historico.map((agendamento) => {
                        const dataReferencia = new Date(agendamento.data + 'T12:00:00');
                        const status = statusConfig[agendamento.status];
                        return (
                          <button
                            key={agendamento.id}
                            type="button"
                            onClick={() => onVerDetalhes(agendamento)}
                            className="w-full flex items-center gap-3 md:gap-4 rounded-xl border border-border/50 bg-background/40 p-3 text-left transition-all duration-200 hover:border-primary/40 hover:bg-primary/5 touch-feedback"
                          >
                            <div className="flex h-12 w-12 flex-shrink-0 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-lilac-light/10">
                              <span className="text-sm font-bold leading-none text-primary">
                                {format(dataReferencia, 'dd')}
                              </span>
                              <span className="text-[10px] uppercase text-muted-foreground mt-0.5">
                                {format(dataReferencia, 'MMM', { locale: ptBR })}
                              </span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-foreground">
                                {agendamento.servicoNome}
                              </p>
                              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3 flex-shrink-0" />
                                {formatarHora(agendamento.hora)}
                                {agendamento.origem === 'online' && (
                                  <span className="text-purple-500">· Online</span>
                                )}
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-1 flex-shrink-0">
                              <Badge className={cn('text-xs h-5', status.classe)}>{status.label}</Badge>
                              <span className="text-sm font-semibold text-foreground">
                                {formatarMoeda(agendamento.valor)}
                              </span>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground hidden md:block flex-shrink-0" />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {pronto && !carregando && temServicos && (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4 md:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Ranking de uso do serviço</h3>
              </div>
              <div className="text-xs text-muted-foreground">
                {servicoSelecionado?.nome} · {totalAtendimentosRanking} atendimento{totalAtendimentosRanking !== 1 ? 's' : ''}
              </div>
            </div>

            {servicosEncontrados.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {servicosEncontrados.map((servico) => {
                  const ativo = servicoSelecionado?.id === servico.id;
                  return (
                    <button
                      key={servico.id}
                      type="button"
                      onClick={() => onSelecionarServico(servico.id)}
                      className={cn(
                        'flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-all duration-200 touch-feedback',
                        ativo
                          ? 'border-primary bg-primary text-primary-foreground shadow-[0_4px_14px_-4px_hsl(var(--primary)_/_0.5)]'
                          : 'border-border/60 bg-background/60 text-foreground hover:border-primary/40 hover:bg-primary/5'
                      )}
                    >
                      <Scissors className="h-3.5 w-3.5" />
                      <span className="truncate max-w-[12rem]">{servico.nome}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {servicoSelecionado && ranking.length === 0 ? (
              <div className="rounded-xl border border-border/50 bg-background/40 p-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Nenhum atendimento concluído ou agendado para este serviço.
                </p>
              </div>
            ) : (
              servicoSelecionado && (
                <div className="overflow-x-auto rounded-xl border border-border/50">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="w-12">#</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead className="text-center">Atendimentos</TableHead>
                        <TableHead className="text-right">Total investido</TableHead>
                        <TableHead className="text-right">Última visita</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ranking.map((item, indice) => {
                        const posicao = indice + 1;
                        const selecionado = clienteSelecionado?.id === item.clienteId;
                        return (
                          <TableRow
                            key={item.clienteId}
                            onClick={() => onSelecionarCliente(item.clienteId)}
                            className={cn(
                              'cursor-pointer transition-colors',
                              selecionado && 'bg-primary/10 hover:bg-primary/10'
                            )}
                          >
                            <TableCell>
                              <span
                                className={cn(
                                  'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold',
                                  posicao === 1
                                    ? 'bg-yellow-400/20 text-yellow-600'
                                    : posicao === 2
                                    ? 'bg-gray-400/20 text-gray-500'
                                    : posicao === 3
                                    ? 'bg-amber-600/20 text-amber-700'
                                    : 'bg-muted text-muted-foreground'
                                )}
                              >
                                {posicao}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2.5">
                                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                                  {iniciais(item.clienteNome)}
                                </span>
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-medium text-foreground">{item.clienteNome}</p>
                                  {item.telefone && (
                                    <p className="truncate text-xs text-muted-foreground">{item.telefone}</p>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary min-w-8">
                                {item.quantidade}
                              </span>
                            </TableCell>
                            <TableCell className="text-right font-medium text-foreground whitespace-nowrap">
                              {formatarMoeda(item.totalGasto)}
                            </TableCell>
                            <TableCell className="text-right text-muted-foreground whitespace-nowrap">
                              {formatarData(item.ultimaVisita)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )
            )}

            {servicoSelecionado && ranking.length > 0 && (
              <p className="text-xs text-muted-foreground">
                <User className="mr-1 inline h-3 w-3" />
                Clique em um cliente do ranking para ver o histórico completo dele.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ResumoCard({ icone, rotulo, valor }: { icone: ReactNode; rotulo: string; valor: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-background/40 p-3">
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
        {icone}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground truncate">{rotulo}</p>
        <p className="text-sm font-semibold text-foreground truncate">{valor}</p>
      </div>
    </div>
  );
}

function calcularResumoCliente(historico: Agendamento[]) {
  const atendimentos = historico.length;
  const totalInvestido = historico.reduce((soma, agendamento) => soma + Number(agendamento.valor || 0), 0);
  const emAberto = historico
    .filter((agendamento) => agendamento.statusPagamento !== 'pago')
    .reduce((soma, agendamento) => soma + Number(agendamento.valorDevido || 0), 0);
  const ultimaVisita = atendimentos > 0 ? historico[0].data : '';

  return { atendimentos, totalInvestido, emAberto, ultimaVisita };
}
