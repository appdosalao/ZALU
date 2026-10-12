
import { useCallback, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { Cronograma, Retorno } from '@/types/cronograma';
import { cronogramaFromSupabase, cronogramaToSupabase, retornoFromSupabase, retornoToSupabase } from '@/lib/mappers';
import { getNextCronogramaDate } from '@/lib/cronograma-utils';
import type { TablesInsert } from '@/integrations/supabase/types';
import { syncCronogramaReturnAfterAppointment } from '@/lib/cronograma-appointments';

// Interface estendida para cronogramas com dados relacionados
export interface CronogramaCompleto extends Cronograma {
  cliente_nome_real?: string;
  cliente_telefone?: string;
  cliente_email?: string;
  servico_nome_real?: string;
  servico_valor?: number;
  servico_duracao?: number;
  total_retornos: number;
  retornos_pendentes: number;
  retornos_realizados: number;
  proximo_retorno?: string;
}

// Interface estendida para retornos com dados relacionados
export interface RetornoCompleto extends Retorno {
  cliente_nome?: string;
  cliente_telefone?: string;
  tipo_servico?: string;
  hora_inicio?: string;
  recorrencia?: string;
  agendamento_data?: string;
  agendamento_hora?: string;
  agendamento_status?: string;
}

export const useSupabaseCronogramas = () => {
  const { user } = useSupabaseAuth();
  const [cronogramas, setCronogramas] = useState<CronogramaCompleto[]>([]);
  const [retornos, setRetornos] = useState<RetornoCompleto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar cronogramas com dados relacionados
  const loadCronogramas = useCallback(async () => {
    if (!user?.id) {
      setCronogramas([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cronogramas_completos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedCronogramas: CronogramaCompleto[] = (data || []).map(item => ({
        ...cronogramaFromSupabase(item),
        cliente_nome_real: item.cliente_nome_real,
        cliente_telefone: item.cliente_telefone,
        cliente_email: item.cliente_email,
        servico_nome_real: item.servico_nome_real,
        servico_valor: item.servico_valor,
        servico_duracao: item.servico_duracao,
        total_retornos: item.total_retornos || 0,
        retornos_pendentes: item.retornos_pendentes || 0,
        retornos_realizados: item.retornos_realizados || 0,
        proximo_retorno: item.proximo_retorno,
      }));

      setCronogramas(formattedCronogramas);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar cronogramas');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Carregar retornos com dados relacionados
  const loadRetornos = useCallback(async () => {
    if (!user?.id) {
      setRetornos([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('retornos_completos')
        .select('*')
        .eq('user_id', user.id)
        .order('data_retorno', { ascending: true });

      if (error) throw error;

      const formattedRetornos: RetornoCompleto[] = (data || []).map(item => ({
        ...retornoFromSupabase(item),
        cliente_nome: item.cliente_nome,
        cliente_telefone: item.cliente_telefone,
        tipo_servico: item.tipo_servico,
        hora_inicio: item.hora_inicio,
        recorrencia: item.recorrencia,
        agendamento_data: item.agendamento_data,
        agendamento_hora: item.agendamento_hora,
        agendamento_status: item.agendamento_status,
      }));

      setRetornos(formattedRetornos);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar retornos');
    }
  }, [user?.id]);

  const criarProximoRetorno = async (cronograma: Cronograma, depoisDe: string) => {
    if (!user?.id || cronograma.status !== 'ativo') return;

    const { data: existente, error: existenteError } = await supabase
      .from('retornos_novos')
      .select('id_retorno')
      .eq('user_id', user.id)
      .eq('id_cronograma', cronograma.id_cronograma)
      .eq('status', 'Pendente')
      .limit(1)
      .maybeSingle();

    if (existenteError) throw existenteError;
    if (existente) return;

    const retorno: TablesInsert<'retornos_novos'> = {
      user_id: user.id,
      id_cliente: cronograma.cliente_id,
      id_cronograma: cronograma.id_cronograma,
      data_retorno: getNextCronogramaDate(cronograma, depoisDe),
      status: 'Pendente',
    };
    const { error } = await supabase.from('retornos_novos').insert(retorno);
    if (error) throw error;
  };

  const criarRetornoInicial = async (cronograma: Cronograma) => {
    if (!user?.id || cronograma.status !== 'ativo') return;

    const { data: existente, error: existenteError } = await supabase
      .from('retornos_novos')
      .select('id_retorno')
      .eq('user_id', user.id)
      .eq('id_cronograma', cronograma.id_cronograma)
      .eq('status', 'Pendente')
      .limit(1)
      .maybeSingle();

    if (existenteError) throw existenteError;
    if (existente) return;

    const retorno: TablesInsert<'retornos_novos'> = {
      user_id: user.id,
      id_cliente: cronograma.cliente_id,
      id_cronograma: cronograma.id_cronograma,
      data_retorno: cronograma.data_inicio,
      status: 'Pendente',
    };
    const { error } = await supabase.from('retornos_novos').insert(retorno);
    if (error) throw error;
  };

  // Criar cronograma
  const createCronograma = async (cronograma: Omit<Cronograma, 'id_cronograma' | 'created_at' | 'updated_at'>) => {
    try {
      if (!user?.id) throw new Error('Usuário não autenticado');

      const insertPayload = {
        user_id: user.id,
        ...cronogramaToSupabase(cronograma)
      };
      const { data, error } = await supabase
        .from('cronogramas_novos')
        .insert(insertPayload as TablesInsert<'cronogramas_novos'>)
        .select()
        .single();

      if (error) throw error;
      if (data.status === 'ativo') {
        const retorno: TablesInsert<'retornos_novos'> = {
          user_id: user.id,
          id_cliente: data.cliente_id,
          id_cronograma: data.id_cronograma,
          data_retorno: data.data_inicio,
          status: 'Pendente',
        };
        const { error: retornoError } = await supabase.from('retornos_novos').insert(retorno);

        if (retornoError) {
          const { error: rollbackError } = await supabase
            .from('cronogramas_novos')
            .delete()
            .eq('id_cronograma', data.id_cronograma)
            .eq('user_id', user.id);

          if (rollbackError) {
            throw new Error(`O cronograma foi criado, mas o retorno inicial falhou e a reversão também falhou: ${rollbackError.message}`);
          }
          throw new Error(`Não foi possível criar o retorno inicial: ${retornoError.message}`);
        }
      }
      await loadCronogramas();
      await loadRetornos();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar cronograma');
      throw err;
    }
  };

  // Atualizar cronograma
  const updateCronograma = async (id: string, updates: Partial<Cronograma>) => {
    try {
      if (!user?.id) throw new Error('Usuário não autenticado');
      const updateData = cronogramaToSupabase(updates);
      const { error } = await supabase
        .from('cronogramas_novos')
        .update(updateData)
        .eq('id_cronograma', id)
        .eq('user_id', user.id);

      if (error) throw error;

      if (updates.status === 'ativo' || updates.data_inicio || updates.recorrencia || updates.intervalo_dias) {
        const { data: cronograma, error: cronogramaError } = await supabase
          .from('cronogramas_novos')
          .select('*')
          .eq('id_cronograma', id)
          .eq('user_id', user.id)
          .single();
        if (cronogramaError) throw cronogramaError;

        const { data: retornoPendente, error: retornoError } = await supabase
          .from('retornos_novos')
          .select('id_retorno, id_agendamento_retorno')
          .eq('id_cronograma', id)
          .eq('user_id', user.id)
          .eq('status', 'Pendente')
          .limit(1)
          .maybeSingle();
        if (retornoError) throw retornoError;

        const recurrenceChanged = Boolean(updates.data_inicio || updates.recorrencia || updates.intervalo_dias);
        if (
          cronograma.status === 'ativo'
          && retornoPendente
          && recurrenceChanged
          && !retornoPendente.id_agendamento_retorno
        ) {
          const { error: scheduleError } = await supabase
            .from('retornos_novos')
            .update({ data_retorno: cronograma.data_inicio })
            .eq('id_retorno', retornoPendente.id_retorno)
            .eq('user_id', user.id);
          if (scheduleError) throw scheduleError;
        } else if (cronograma.status === 'ativo' && !retornoPendente) {
          const mappedCronograma = cronogramaFromSupabase(cronograma);
          const { data: ultimoRetorno, error: ultimoError } = await supabase
            .from('retornos_novos')
            .select('data_retorno')
            .eq('id_cronograma', id)
            .eq('user_id', user.id)
            .order('data_retorno', { ascending: false })
            .limit(1)
            .maybeSingle();
          if (ultimoError) throw ultimoError;

          if (ultimoRetorno) {
            await criarProximoRetorno(mappedCronograma, ultimoRetorno.data_retorno);
          } else {
            await criarRetornoInicial(mappedCronograma);
          }
        }
      }
      await loadCronogramas();
      await loadRetornos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar cronograma');
      throw err;
    }
  };

  // Deletar cronograma
  const deleteCronograma = async (id: string) => {
    try {
      if (!user?.id) throw new Error('Usuário não autenticado');
      const { error } = await supabase
        .from('cronogramas_novos')
        .delete()
        .eq('id_cronograma', id)
        .eq('user_id', user.id);

      if (error) throw error;
      await loadCronogramas();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar cronograma');
      throw err;
    }
  };

  // Criar retorno
  const createRetorno = async (retorno: Omit<Retorno, 'id_retorno' | 'created_at' | 'updated_at'>) => {
    try {
      if (!user?.id) throw new Error('Usuário não autenticado');

      const insertPayload = {
        user_id: user.id,
        ...retornoToSupabase(retorno)
      };
      const { data, error } = await supabase
        .from('retornos_novos')
        .insert(insertPayload as TablesInsert<'retornos_novos'>)
        .select()
        .single();

      if (error) throw error;
      await loadRetornos();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar retorno');
      throw err;
    }
  };

  // Atualizar retorno
  const updateRetorno = async (id: string, updates: Partial<Retorno>) => {
    try {
      if (!user?.id) throw new Error('Usuário não autenticado');
      const { data: retorno, error: retornoError } = await supabase
        .from('retornos_novos')
        .select('id_cronograma, data_retorno, status')
        .eq('id_retorno', id)
        .eq('user_id', user.id)
        .single();

      if (retornoError) throw retornoError;
      const updateData = retornoToSupabase(updates);
      const { error } = await supabase
        .from('retornos_novos')
        .update(updateData)
        .eq('id_retorno', id)
        .eq('user_id', user.id);

      if (error) throw error;
      if (updates.status === 'Realizado' || updates.status === 'Cancelado') {
        const { data: cronograma, error: cronogramaError } = await supabase
          .from('cronogramas_novos')
          .select('*')
          .eq('id_cronograma', retorno.id_cronograma)
          .eq('user_id', user.id)
          .maybeSingle();

        if (cronogramaError) throw cronogramaError;
        if (cronograma) {
          const mappedCronograma = cronogramaFromSupabase(cronograma);
          await criarProximoRetorno(mappedCronograma, retorno.data_retorno);
        }
      }
      await loadRetornos();
      await loadCronogramas();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar retorno');
      throw err;
    }
  };

  // Função para criar agendamento a partir de retorno
  const criarAgendamentoDeRetorno = async (retornoId: string, dataAgendamento: string, horaAgendamento: string) => {
    try {
      if (!user?.id) throw new Error('Usuário não autenticado');

      const { data: retorno, error: retornoError } = await supabase
        .from('retornos_novos')
        .select('*')
        .eq('id_retorno', retornoId)
        .eq('user_id', user.id)
        .eq('status', 'Pendente')
        .is('id_agendamento_retorno', null)
        .single();

      if (retornoError) throw retornoError;

      // Buscar dados do cronograma para criar o agendamento
      const { data: cronogramaData, error: cronogramaError } = await supabase
        .from('cronogramas_novos')
        .select('*, servicos(*)')
        .eq('id_cronograma', retorno.id_cronograma)
        .eq('user_id', user.id)
        .single();

      if (cronogramaError) throw cronogramaError;

      const { data: conflitos, error: conflitoError } = await supabase
        .from('agendamentos')
        .select('id, data, hora, duracao')
        .eq('user_id', user.id)
        .eq('data', dataAgendamento)
        .eq('status', 'agendado');
      if (conflitoError) throw conflitoError;

      const inicio = new Date(`1970-01-01T${horaAgendamento.slice(0, 5)}:00`).getTime();
      const fim = inicio + cronogramaData.duracao_minutos * 60_000;
      const conflito = (conflitos || []).some((agendamento) => {
        const outroInicio = new Date(`1970-01-01T${agendamento.hora.slice(0, 5)}:00`).getTime();
        const outroFim = outroInicio + agendamento.duracao * 60_000;
        return inicio < outroFim && outroInicio < fim;
      });
      if (conflito) throw new Error('Esse horário conflita com outro agendamento.');

      // Criar agendamento
      const { data: agendamento, error: agendamentoError } = await supabase
        .from('agendamentos')
        .insert({
          user_id: user.id,
          cliente_id: retorno.id_cliente,
          servico_id: cronogramaData.servico_id,
          data: dataAgendamento,
          hora: horaAgendamento,
          duracao: cronogramaData.duracao_minutos,
          valor: cronogramaData.servicos?.valor || 0,
          valor_pago: 0,
          valor_devido: cronogramaData.servicos?.valor || 0,
          forma_pagamento: 'fiado',
          status_pagamento: 'em_aberto',
          status: 'agendado',
          origem: 'cronograma',
          confirmado: true,
          observacoes: `Retorno do cronograma: ${cronogramaData.tipo_servico}`,
        })
        .select()
        .single();

      if (agendamentoError) throw agendamentoError;

      const { data: vinculo, error: vinculoError } = await supabase
        .from('retornos_novos')
        .update({ id_agendamento_retorno: agendamento.id })
        .eq('id_retorno', retornoId)
        .eq('user_id', user.id)
        .eq('status', 'Pendente')
        .is('id_agendamento_retorno', null)
        .select('id_retorno')
        .maybeSingle();

      if (vinculoError || !vinculo) {
        const { error: rollbackError } = await supabase
          .from('agendamentos')
          .delete()
          .eq('id', agendamento.id)
          .eq('user_id', user.id);

        if (rollbackError) {
          throw new Error(`O agendamento foi criado, mas não foi possível vinculá-lo ao retorno nem removê-lo: ${rollbackError.message}`);
        }
        if (vinculoError) throw vinculoError;
        throw new Error('Este retorno já foi agendado em outro lugar. Atualize a lista.');
      }

      await loadRetornos();
      await loadCronogramas();
      return agendamento;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar agendamento de retorno');
      throw err;
    }
  };

  const cancelarAgendamentoDeRetorno = async (retornoId: string) => {
    try {
      if (!user?.id) throw new Error('Usuário não autenticado');
      const retorno = retornos.find((item) => item.id_retorno === retornoId);
      if (!retorno) throw new Error('Retorno não encontrado');

      if (retorno.id_agendamento_retorno) {
        const { data: cancelado, error } = await supabase
          .from('agendamentos')
          .update({ status: 'cancelado' })
          .eq('id', retorno.id_agendamento_retorno)
          .eq('user_id', user.id)
          .eq('status', 'agendado')
          .select('id')
          .maybeSingle();
        if (error) throw error;
        if (!cancelado) throw new Error('O agendamento já foi alterado. Atualize a lista e tente novamente.');

        await syncCronogramaReturnAfterAppointment(user.id, retorno.id_agendamento_retorno, { status: 'cancelado' });
      } else {
        await updateRetorno(retornoId, { status: 'Cancelado' });
      }

      await loadRetornos();
      await loadCronogramas();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao cancelar retorno');
      throw err;
    }
  };

  useEffect(() => {
    if (!user?.id) {
      setCronogramas([]);
      setRetornos([]);
      setLoading(false);
      return;
    }

    loadCronogramas();
    loadRetornos();

    // Setup real-time subscriptions para atualizações em tempo real
    const channel = supabase
      .channel('cronogramas-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cronogramas_novos',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          loadCronogramas();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'retornos_novos',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          loadRetornos();
          loadCronogramas(); // Recarregar cronogramas para atualizar contadores
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'clientes',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          loadCronogramas(); // Recarregar para atualizar dados de clientes
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'servicos',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          loadCronogramas(); // Recarregar para atualizar dados de serviços
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'agendamentos',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          loadRetornos(); // Recarregar para atualizar dados de agendamentos
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, loadCronogramas, loadRetornos]);

  return {
    cronogramas,
    retornos,
    loading,
    error,
    createCronograma,
    updateCronograma,
    deleteCronograma,
    createRetorno,
    updateRetorno,
    criarAgendamentoDeRetorno,
    cancelarAgendamentoDeRetorno,
    loadCronogramas,
    loadRetornos,
  };
};
