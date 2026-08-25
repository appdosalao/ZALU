import { useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import type { Cliente } from '@/types/cliente';
import type { Servico } from '@/types/servico';
import type { Agendamento } from '@/types/agendamento';

export interface RankingServicoItem {
  clienteId: string;
  clienteNome: string;
  telefone: string;
  quantidade: number;
  totalGasto: number;
  ultimaVisita: string;
}

const normalizarTexto = (texto: string): string =>
  texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

export function useBuscaInteligenteAgenda() {
  const { user } = useSupabaseAuth();
  const [carregando, setCarregando] = useState(false);

  const encontrarClientes = useCallback((termo: string, clientes: Cliente[]): Cliente[] => {
    const termoNormalizado = normalizarTexto(termo);
    if (!termoNormalizado) return [];
    return clientes.filter((cliente) =>
      normalizarTexto(cliente.nome || cliente.nomeCompleto || '').includes(termoNormalizado)
    );
  }, []);

  const encontrarServicos = useCallback((termo: string, servicos: Servico[]): Servico[] => {
    const termoNormalizado = normalizarTexto(termo);
    if (!termoNormalizado) return [];
    return servicos.filter((servico) => normalizarTexto(servico.nome).includes(termoNormalizado));
  }, []);

  const carregarHistoricoCliente = useCallback(
    async (clienteId: string): Promise<Agendamento[]> => {
      if (!user || !clienteId) return [];
      setCarregando(true);
      try {
        const { data, error } = await supabase
          .from('agendamentos')
          .select('*')
          .eq('user_id', user.id)
          .eq('cliente_id', clienteId)
          .neq('status', 'excluido')
          .order('data', { ascending: false })
          .order('hora', { ascending: false })
          .limit(500);

        if (error) {
          console.error('Erro ao carregar histórico do cliente:', error);
          return [];
        }

        return (data || []).map((item) => ({
          id: item.id,
          clienteId: item.cliente_id,
          clienteNome: 'Cliente',
          servicoId: item.servico_id,
          servicoNome: 'Serviço',
          data: item.data,
          hora: item.hora,
          duracao: item.duracao,
          valor: Number(item.valor ?? 0),
          valorPago: Number(item.valor_pago ?? 0),
          valorDevido: Number(item.valor_devido ?? 0),
          formaPagamento: (item.forma_pagamento as Agendamento['formaPagamento']) || 'fiado',
          statusPagamento: (item.status_pagamento as Agendamento['statusPagamento']) || 'em_aberto',
          status: (item.status as Agendamento['status']) || 'agendado',
          origem: (item.origem as Agendamento['origem']) || 'manual',
          origem_cronograma: false,
          confirmado: item.confirmado ?? false,
          observacoes: item.observacoes || undefined,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        }));
      } catch (error) {
        console.error('Erro ao carregar histórico do cliente:', error);
        return [];
      } finally {
        setCarregando(false);
      }
    },
    [user]
  );

  const carregarRankingServico = useCallback(
    async (servicoId: string): Promise<RankingServicoItem[]> => {
      if (!user || !servicoId) return [];
      setCarregando(true);
      try {
        const { data, error } = await supabase
          .from('agendamentos')
          .select('cliente_id, data, valor')
          .eq('user_id', user.id)
          .eq('servico_id', servicoId)
          .neq('status', 'cancelado')
          .neq('status', 'excluido')
          .limit(1000);

        if (error) {
          console.error('Erro ao carregar ranking do serviço:', error);
          return [];
        }

        const agrupados = new Map<string, { quantidade: number; totalGasto: number; ultimaVisita: string }>();

        for (const item of data || []) {
          if (!item.cliente_id) continue;
          const atual = agrupados.get(item.cliente_id) || { quantidade: 0, totalGasto: 0, ultimaVisita: '' };
          atual.quantidade += 1;
          atual.totalGasto += Number(item.valor ?? 0);
          if (!atual.ultimaVisita || item.data > atual.ultimaVisita) {
            atual.ultimaVisita = item.data;
          }
          agrupados.set(item.cliente_id, atual);
        }

        return Array.from(agrupados.entries())
          .map(([clienteId, dados]) => ({
            clienteId,
            clienteNome: 'Cliente',
            telefone: '',
            ...dados,
          }))
          .sort((a, b) => b.quantidade - a.quantidade || b.totalGasto - a.totalGasto);
      } catch (error) {
        console.error('Erro ao carregar ranking do serviço:', error);
        return [];
      } finally {
        setCarregando(false);
      }
    },
    [user]
  );

  return {
    carregando,
    encontrarClientes,
    encontrarServicos,
    carregarHistoricoCliente,
    carregarRankingServico,
  };
}
