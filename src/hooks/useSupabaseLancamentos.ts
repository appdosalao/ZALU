import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Lancamento, NovoLancamento, LancamentoFiltros, ResumoFinanceiro } from '@/types/lancamento';
import { lancamentoFromSupabase, lancamentoToSupabase } from '@/lib/mappers';

export const useSupabaseLancamentos = () => {
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar lançamentos
  const loadLancamentos = async (dataInicioParam?: string, dataFimParam?: string) => {
    try {
      setLoading(true);
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      let query = supabase
        .from('lancamentos')
        .select('*')
        .eq('user_id', user.user.id);

      if (dataInicioParam) {
        query = query.gte('data', dataInicioParam);
      } else {
        // Por padrão, carregar apenas os últimos 90 dias para performance
        const noventaDiasAtras = new Date();
        noventaDiasAtras.setDate(noventaDiasAtras.getDate() - 90);
        const dataFiltro = noventaDiasAtras.toISOString().split('T')[0];
        query = query.gte('data', dataFiltro);
      }

      if (dataFimParam) {
        query = query.lte('data', dataFimParam);
      }

      const { data, error } = await query
        .order('data', { ascending: false });

      if (error) throw error;

      const formattedLancamentos: Lancamento[] = (data || []).map(item => lancamentoFromSupabase(item));

      setLancamentos(formattedLancamentos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar lançamentos');
    } finally {
      setLoading(false);
    }
  };

  // Criar lançamento
  const createLancamento = async (lancamento: NovoLancamento) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Usuário não autenticado');

      const insertPayload = {
        user_id: user.user.id,
        ...lancamentoToSupabase(lancamento)
      };
      const { data, error } = await supabase
        .from('lancamentos')
        .insert(insertPayload as any)
        .select()
        .single();

      if (error) throw error;
      await loadLancamentos();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar lançamento');
      return false;
    }
  };

  // Atualizar lançamento
  const updateLancamento = async (id: string, updates: Partial<Lancamento>) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Usuário não autenticado');

      const updateData = lancamentoToSupabase(updates);

      const { error } = await supabase
        .from('lancamentos')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.user.id);

      if (error) throw error;
      await loadLancamentos();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar lançamento');
      return false;
    }
  };

  // Deletar lançamento
  const deleteLancamento = async (id: string) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('lancamentos')
        .delete()
        .eq('id', id)
        .eq('user_id', user.user.id);

      if (error) throw error;
      await loadLancamentos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar lançamento');
      throw err;
    }
  };

  // Criar lançamento a partir de um agendamento
  const createLancamentoFromAgendamento = async (agendamento: any) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('lancamentos')
        .insert({
          user_id: user.user.id,
          tipo: 'entrada',
          valor: agendamento.valorPago || agendamento.valor,
          data: agendamento.data,
          descricao: `Agendamento: ${agendamento.clienteNome || 'Cliente'} - ${agendamento.servicoNome || 'Serviço'}`,
          categoria: 'Serviços',
          origem_id: agendamento.id,
          origem_tipo: 'agendamento',
          cliente_id: agendamento.clienteId,
        })
        .select()
        .single();

      if (error) throw error;
      await loadLancamentos();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar lançamento de agendamento');
      throw err;
    }
  };

  // Criar lançamento a partir de uma conta fixa
  const createLancamentoFromContaFixa = async (contaFixa: any, valorPago: number, dataPagamento: Date) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('lancamentos')
        .insert({
          user_id: user.user.id,
          tipo: 'saida',
          valor: valorPago,
          data: dataPagamento.toISOString().split('T')[0],
          descricao: `Pagamento: ${contaFixa.nome}`,
          categoria: contaFixa.categoria,
          origem_id: contaFixa.id,
          origem_tipo: 'conta_fixa',
        })
        .select()
        .single();

      if (error) throw error;
      await loadLancamentos();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar lançamento de conta fixa');
      throw err;
    }
  };

  // Filtrar lançamentos
  const filterLancamentos = (filtros: LancamentoFiltros) => {
    return lancamentos.filter(lancamento => {
      if (filtros.tipo && filtros.tipo !== 'todos' && lancamento.tipo !== filtros.tipo) {
        return false;
      }
      
      if (filtros.categoria && lancamento.categoria !== filtros.categoria) {
        return false;
      }
      
      if (filtros.dataInicio && lancamento.data < filtros.dataInicio) {
        return false;
      }
      
      if (filtros.dataFim && lancamento.data > filtros.dataFim) {
        return false;
      }
      
      if (filtros.mes !== undefined && filtros.ano !== undefined) {
        const lancamentoMes = lancamento.data.getMonth();
        const lancamentoAno = lancamento.data.getFullYear();
        if (lancamentoMes !== filtros.mes || lancamentoAno !== filtros.ano) {
          return false;
        }
      }
      
      return true;
    });
  };

  // Calcular resumo financeiro
  const calculateResumoFinanceiro = (): ResumoFinanceiro => {
    const agora = new Date();
    const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);
    const fimMes = new Date(agora.getFullYear(), agora.getMonth() + 1, 0);
    
    // Filtrar lançamentos do mês atual
    const lancamentosMesAtual = lancamentos.filter(l => {
      const dataLancamento = new Date(l.data);
      return dataLancamento >= inicioMes && dataLancamento <= fimMes;
    });
    
    const totalEntradas = lancamentosMesAtual
      .filter(l => l.tipo === 'entrada')
      .reduce((sum, l) => sum + l.valor, 0);
    
    const totalSaidas = lancamentosMesAtual
      .filter(l => l.tipo === 'saida')
      .reduce((sum, l) => sum + l.valor, 0);
    
    return {
      totalEntradas,
      totalSaidas,
      lucro: totalEntradas - totalSaidas,
      valorEmAberto: 0, // Seria calculado com base em agendamentos não pagos
      contasAPagar: 0, // Seria calculado com base em contas fixas em aberto
    };
  };

  useEffect(() => {
    loadLancamentos();

    // Setup real-time subscriptions
    const channel = supabase
      .channel('lancamentos-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'lancamentos'
        },
        () => {
          loadLancamentos();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    lancamentos,
    loading,
    error,
    createLancamento,
    updateLancamento,
    deleteLancamento,
    filterLancamentos,
    calculateResumoFinanceiro,
    createLancamentoFromAgendamento,
    createLancamentoFromContaFixa,
    loadLancamentos,
  };
};
