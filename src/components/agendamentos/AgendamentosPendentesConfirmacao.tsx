import { useCallback, useEffect, useRef, useState } from 'react';
import { CalendarClock, CheckCircle2, Clock3, DollarSign, UserRound, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { syncCronogramaReturnAfterAppointment } from '@/lib/cronograma-appointments';
import { formatBRL } from '@/lib/formatters';
import { toast } from 'sonner';

interface AgendamentoPendente {
  id: string;
  cliente_id: string;
  servico_id: string;
  data: string;
  hora: string;
  duracao: number;
  valor: number;
  valor_pago: number;
  valor_devido: number;
  status_pagamento: 'pago' | 'parcial' | 'em_aberto';
  cliente_nome: string;
  servico_nome: string;
}

interface AgendamentoBanco {
  id: string;
  cliente_id: string;
  servico_id: string;
  data: string;
  hora: string;
  duracao: number;
  valor: number | string;
  valor_pago: number | string | null;
  valor_devido: number | string | null;
  status_pagamento: 'pago' | 'parcial' | 'em_aberto' | null;
}

const dataLocalISO = (data: Date) => {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
};

const agendamentoJaTerminou = (agendamento: AgendamentoBanco, agora: Date) => {
  const [ano, mes, dia] = agendamento.data.slice(0, 10).split('-').map(Number);
  const [hora, minuto] = agendamento.hora.split(':').map(Number);
  const inicio = new Date(ano, mes - 1, dia, hora, minuto);
  const fim = new Date(inicio.getTime() + Number(agendamento.duracao || 0) * 60_000);
  return Number.isFinite(fim.getTime()) && fim <= agora;
};

export function AgendamentosPendentesConfirmacao() {
  const { user } = useSupabaseAuth();
  const [pendentes, setPendentes] = useState<AgendamentoPendente[]>([]);
  const [salvando, setSalvando] = useState(false);
  const ignoradosNaSessao = useRef(new Set<string>());
  const carregandoRef = useRef(false);
  const pendentesRef = useRef<AgendamentoPendente[]>([]);

  const carregarPendentes = useCallback(async () => {
    if (!user?.id || carregandoRef.current || pendentesRef.current.length > 0) return;

    carregandoRef.current = true;
    try {
      const agora = new Date();
      const { data, error } = await supabase
        .from('agendamentos')
        .select('id, cliente_id, servico_id, data, hora, duracao, valor, valor_pago, valor_devido, status_pagamento')
        .eq('user_id', user.id)
        .eq('status', 'agendado')
        .lte('data', dataLocalISO(agora))
        .order('data')
        .order('hora');

      if (error) throw error;

      const vencidos = ((data || []) as AgendamentoBanco[])
        .filter(item => !ignoradosNaSessao.current.has(item.id) && agendamentoJaTerminou(item, agora));
      if (!vencidos.length) {
        pendentesRef.current = [];
        setPendentes([]);
        return;
      }

      const clienteIds = [...new Set(vencidos.map(item => item.cliente_id).filter(Boolean))];
      const servicoIds = [...new Set(vencidos.map(item => item.servico_id).filter(Boolean))];
      const [clientesResult, servicosResult] = await Promise.all([
        clienteIds.length
          ? supabase.from('clientes').select('id, nome').eq('user_id', user.id).in('id', clienteIds)
          : Promise.resolve({ data: [], error: null }),
        servicoIds.length
          ? supabase.from('servicos').select('id, nome').eq('user_id', user.id).in('id', servicoIds)
          : Promise.resolve({ data: [], error: null }),
      ]);

      if (clientesResult.error) throw clientesResult.error;
      if (servicosResult.error) throw servicosResult.error;

      const nomesClientes = new Map((clientesResult.data || []).map(cliente => [cliente.id, cliente.nome]));
      const nomesServicos = new Map((servicosResult.data || []).map(servico => [servico.id, servico.nome]));

      const atendimentos = vencidos.map(item => ({
        id: item.id,
        cliente_id: item.cliente_id,
        servico_id: item.servico_id,
        data: item.data,
        hora: item.hora,
        duracao: Number(item.duracao || 0),
        valor: Number(item.valor || 0),
        valor_pago: Number(item.valor_pago || 0),
        valor_devido: Number(item.valor_devido || 0),
        status_pagamento: item.status_pagamento || 'em_aberto',
        cliente_nome: nomesClientes.get(item.cliente_id) || 'Cliente',
        servico_nome: nomesServicos.get(item.servico_id) || 'Serviço',
      }));
      pendentesRef.current = atendimentos;
      setPendentes(atendimentos);
    } catch (error) {
      console.error('Erro ao carregar atendimentos pendentes de confirmação:', error);
      toast.error('Não foi possível carregar os atendimentos que precisam de confirmação.');
    } finally {
      carregandoRef.current = false;
    }
  }, [user?.id]);

  useEffect(() => {
    void carregarPendentes();
  }, [carregarPendentes]);

  useEffect(() => {
    const aoRetornarAoSistema = () => {
      if (document.visibilityState === 'visible') void carregarPendentes();
    };
    window.addEventListener('focus', aoRetornarAoSistema);
    document.addEventListener('visibilitychange', aoRetornarAoSistema);
    return () => {
      window.removeEventListener('focus', aoRetornarAoSistema);
      document.removeEventListener('visibilitychange', aoRetornarAoSistema);
    };
  }, [carregarPendentes]);

  const adiarAtual = () => {
    const atual = pendentes[0];
    if (!atual) return;
    ignoradosNaSessao.current.add(atual.id);
    const proximos = pendentes.slice(1);
    pendentesRef.current = proximos;
    setPendentes(proximos);
  };

  const registrarResultado = async (resultado: 'pago' | 'pendente' | 'nao_compareceu') => {
    const atual = pendentes[0];
    if (!atual || !user?.id) return;

    setSalvando(true);
    try {
      const valorPago = resultado === 'pago' ? atual.valor : atual.valor_pago;
      const valorDevido = resultado === 'pago' ? 0 : Math.max(atual.valor - valorPago, 0);
      const statusPagamento = valorDevido === 0
        ? 'pago'
        : valorPago > 0
          ? 'parcial'
          : 'em_aberto';
      const atualizacao = resultado === 'nao_compareceu'
        ? { status: 'nao_compareceu' }
        : {
            status: 'concluido',
            valor_pago: valorPago,
            valor_devido: valorDevido,
            status_pagamento: statusPagamento,
          };

      const { data, error } = await supabase
        .from('agendamentos')
        .update(atualizacao)
        .eq('id', atual.id)
        .eq('user_id', user.id)
        .eq('status', 'agendado')
        .select('id')
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        toast.error('Este agendamento foi alterado em outro lugar. Atualize a página e confira a agenda.');
        return;
      }
      await syncCronogramaReturnAfterAppointment(user.id, atual.id, {
        status: resultado === 'nao_compareceu' ? 'nao_compareceu' : 'concluido',
        data: atual.data,
      });

      ignoradosNaSessao.current.add(atual.id);
      const proximos = pendentes.slice(1);
      pendentesRef.current = proximos;
      setPendentes(proximos);

      if (resultado === 'nao_compareceu') {
        toast.success(atual.valor_pago > 0
          ? 'Não comparecimento registrado. O valor já recebido permanece no financeiro.'
          : 'Não comparecimento registrado; nenhum valor foi lançado como receita.');
      } else {
        toast.success(resultado === 'pago'
          ? 'Atendimento concluído e pagamento registrado.'
          : 'Atendimento concluído; o saldo permanece em aberto no financeiro.');
      }
    } catch (error) {
      console.error('Erro ao registrar resultado do atendimento:', error);
      toast.error('Não foi possível atualizar o agendamento. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  const atual = pendentes[0];
  const dataFormatada = atual
    ? new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full' }).format(
        new Date(`${atual.data.slice(0, 10)}T00:00:00`)
      )
    : '';

  return (
    <Dialog open={Boolean(atual)} onOpenChange={(open) => { if (!open && !salvando) adiarAtual(); }}>
      <DialogContent
        className="max-h-[90vh] overflow-y-auto rounded-3xl sm:max-w-lg"
        onEscapeKeyDown={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
      >
        {atual && (
          <>
            <DialogHeader>
              <Badge variant="secondary" className="mb-2 w-fit rounded-full px-3">
                <CalendarClock className="mr-1.5 h-3.5 w-3.5" />
                Confirmação de atendimento
              </Badge>
              <DialogTitle className="text-xl">Como foi este agendamento?</DialogTitle>
              <DialogDescription>
                Confirme o resultado para manter a agenda e o financeiro atualizados.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="rounded-2xl border bg-muted/30 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <UserRound className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{atual.cliente_nome}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{atual.servico_nome}</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 border-t pt-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Data e horário</p>
                    <p className="mt-1 flex items-center gap-1.5 font-medium">
                      <Clock3 className="h-3.5 w-3.5 text-muted-foreground" />
                      {dataFormatada}, {atual.hora.slice(0, 5)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Valor do serviço</p>
                    <p className="mt-1 flex items-center gap-1.5 font-semibold">
                      <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                      {formatBRL(atual.valor)}
                    </p>
                  </div>
                </div>
                {pendentes.length > 1 && (
                  <p className="mt-3 text-xs text-muted-foreground">
                    {pendentes.length} atendimentos aguardam confirmação. Um de cada vez.
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Button
                  disabled={salvando}
                  onClick={() => void registrarResultado('pago')}
                  className="h-auto min-h-12 justify-start rounded-xl bg-emerald-600 py-3 text-left text-white hover:bg-emerald-700"
                >
                  <CheckCircle2 className="mr-3 h-5 w-5 shrink-0" />
                  <span>
                    <span className="block font-semibold">Compareceu e pagou</span>
                    <span className="block text-xs font-normal text-emerald-50">Concluir e registrar o valor total como recebido</span>
                  </span>
                </Button>
                <Button
                  disabled={salvando}
                  onClick={() => void registrarResultado('pendente')}
                  variant="outline"
                  className="h-auto min-h-12 justify-start rounded-xl py-3 text-left"
                >
                  <Clock3 className="mr-3 h-5 w-5 shrink-0 text-amber-600" />
                  <span>
                    <span className="block font-semibold">Compareceu, pagamento pendente</span>
                    <span className="block text-xs font-normal text-muted-foreground">Concluir e manter o saldo em aberto</span>
                  </span>
                </Button>
                <Button
                  disabled={salvando}
                  onClick={() => void registrarResultado('nao_compareceu')}
                  variant="outline"
                  className="h-auto min-h-12 justify-start rounded-xl border-rose-200 py-3 text-left text-rose-700 hover:bg-rose-50 hover:text-rose-800 dark:border-rose-900 dark:text-rose-300 dark:hover:bg-rose-950/30"
                >
                  <XCircle className="mr-3 h-5 w-5 shrink-0" />
                  <span>
                    <span className="block font-semibold">Não compareceu</span>
                    <span className="block text-xs font-normal text-muted-foreground">Registrar falta; valores já recebidos ficam no financeiro</span>
                  </span>
                </Button>
              </div>

              <Button
                type="button"
                variant="ghost"
                disabled={salvando}
                onClick={adiarAtual}
                className="w-full rounded-xl text-muted-foreground"
              >
                Lembrar mais tarde
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
