import { supabase } from '@/integrations/supabase/client';
import { getNextCronogramaDate } from '@/lib/cronograma-utils';
import type { Cronograma } from '@/types/cronograma';
import type { TablesInsert } from '@/integrations/supabase/types';

const isRecurrence = (value: string): value is Cronograma['recorrencia'] =>
  value === 'Semanal'
  || value === 'Quinzenal'
  || value === 'Mensal'
  || value === 'Personalizada';

export async function syncCronogramaReturnAfterAppointment(
  userId: string,
  appointmentId: string,
  updates: { status?: string; data?: string },
) {
  const { data: retorno, error: retornoError } = await supabase
    .from('retornos_novos')
    .select('id_retorno, id_cronograma, data_retorno, status')
    .eq('user_id', userId)
    .eq('id_agendamento_retorno', appointmentId)
    .maybeSingle();

  if (retornoError) throw retornoError;
  if (!retorno || retorno.status !== 'Pendente') return;

  if (updates.status === 'cancelado' || updates.status === 'excluido' || updates.status === 'nao_compareceu') {
    const { error } = await supabase
      .from('retornos_novos')
      .update({ id_agendamento_retorno: null })
      .eq('id_retorno', retorno.id_retorno)
      .eq('user_id', userId)
      .eq('status', 'Pendente');

    if (error) throw error;
    return;
  }

  const occurrenceDate = updates.data || retorno.data_retorno;
  if (updates.data && updates.data !== retorno.data_retorno) {
    const { error } = await supabase
      .from('retornos_novos')
      .update({ data_retorno: updates.data })
      .eq('id_retorno', retorno.id_retorno)
      .eq('user_id', userId)
      .eq('status', 'Pendente');

    if (error) throw error;
  }

  if (updates.status !== 'concluido') return;

  const { error: completeError } = await supabase
    .from('retornos_novos')
    .update({ status: 'Realizado' })
    .eq('id_retorno', retorno.id_retorno)
    .eq('user_id', userId)
    .eq('status', 'Pendente');

  if (completeError) throw completeError;

  const { data: cronograma, error: cronogramaError } = await supabase
    .from('cronogramas_novos')
    .select('id_cronograma, cliente_id, data_inicio, recorrencia, intervalo_dias, status')
    .eq('id_cronograma', retorno.id_cronograma)
    .eq('user_id', userId)
    .maybeSingle();

  if (cronogramaError) throw cronogramaError;
  if (!cronograma || cronograma.status !== 'ativo') return;

  const { data: proximoRetorno, error: proximoError } = await supabase
    .from('retornos_novos')
    .select('id_retorno')
    .eq('user_id', userId)
    .eq('id_cronograma', cronograma.id_cronograma)
    .eq('status', 'Pendente')
    .limit(1)
    .maybeSingle();

  if (proximoError) throw proximoError;
  if (proximoRetorno) return;

  if (!isRecurrence(cronograma.recorrencia)) {
    throw new Error('O cronograma vinculado possui uma recorrência inválida.');
  }

  const nextReturn: TablesInsert<'retornos_novos'> = {
    user_id: userId,
    id_cliente: cronograma.cliente_id,
    id_cronograma: cronograma.id_cronograma,
    data_retorno: getNextCronogramaDate({
      data_inicio: cronograma.data_inicio,
      recorrencia: cronograma.recorrencia,
      intervalo_dias: cronograma.intervalo_dias,
    }, occurrenceDate),
    status: 'Pendente',
  };
  const { error: createNextError } = await supabase.from('retornos_novos').insert(nextReturn);

  if (createNextError) throw createNextError;
}
