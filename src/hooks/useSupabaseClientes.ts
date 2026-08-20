import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { Cliente, ClienteFormData } from '@/types/cliente';
import { toast } from 'sonner';
import { validateUniqueName } from '@/lib/validators';
import { clienteFromSupabase, clienteToSupabase } from '@/lib/mappers';

export function useSupabaseClientes() {
  const { user } = useSupabaseAuth();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);

  // Função utilitária para parsing de valores numéricos
  const parseValor = (v: any): number => {
    if (typeof v === 'number') return v;
    if (typeof v === 'string') {
      const s = v.replace(/\./g, '').replace(',', '.');
      const n = Number(s);
      return isNaN(n) ? 0 : n;
    }
    return 0;
  };

  // Carregar estatísticas de um cliente específico de forma lazy
  const carregarEstatisticasCliente = useCallback(async (clienteId: string) => {
    if (!user) return null;

    try {
      // Carregar agendamentos e serviços apenas para este cliente
      const [agsResult, servsResult] = await Promise.all([
        supabase
          .from('agendamentos')
          .select('id, cliente_id, servico_id, data, hora, valor, valor_pago, status, status_pagamento')
          .eq('user_id', user.id)
          .eq('cliente_id', clienteId)
          .neq('status', 'cancelado'),
        supabase
          .from('servicos')
          .select('id, nome')
          .eq('user_id', user.id)
      ]);

      if (agsResult.error) throw agsResult.error;
      if (servsResult.error) throw servsResult.error;

      const ags = agsResult.data || [];
      const servs = servsResult.data || [];
      const servicoNomeMap = new Map(servs.map(s => [s.id, s.nome]));
      const hojeStr = new Date().toISOString().split('T')[0];

      const historico = ags
        .map(a => ({
          id: a.id,
          data: new Date(`${a.data}T${(a as any).hora || '00:00'}`),
          servico: servicoNomeMap.get(a.servico_id) || 'Serviço',
          valor: (() => {
            const vp = parseValor((a as any).valor_pago);
            const vt = parseValor((a as any).valor);
            return vp > 0 ? vp : vt;
          })()
        }))
        .sort((x, y) => y.data.getTime() - x.data.getTime());

      let servicoFrequente;
      if (ags.length > 0) {
        const freq = new Map<string, number>();
        ags.forEach(a => {
          const key = servicoNomeMap.get(a.servico_id) || 'Serviço';
          freq.set(key, (freq.get(key) || 0) + 1);
        });
        let max = 0;
        for (const [k, v] of freq.entries()) {
          if (v > max) {
            max = v;
            servicoFrequente = k;
          }
        }
      }

      const ultimaElegivel = ags
        .filter(a => a.data <= hojeStr)
        .map(a => new Date(`${a.data}T${(a as any).hora || '00:00'}`))
        .sort((a, b) => b.getTime() - a.getTime())[0];
      
      const ultimaVisita = ultimaElegivel ? ultimaElegivel.toISOString() : (historico[0]?.data?.toISOString() || undefined);

      const stats = {
        historicoServicos: historico,
        servicoFrequente,
        ultimaVisita
      };

      // Atualizar o estado local do cliente com as novas estatísticas
      setClientes(prev => prev.map(c => 
        c.id === clienteId ? { ...c, ...stats } : c
      ));

      return stats;
    } catch (error) {
      console.error('Erro ao carregar estatísticas do cliente:', error);
      return null;
    }
  }, [user]);

  // Carregar clientes do Supabase
  const carregarClientes = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Primeiro, associar clientes de agendamentos online ao usuário
      await supabase.rpc('associar_clientes_agendamento_online', {
        p_user_id: user.id
      });

      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('user_id', user.id)
        .order('nome');

      if (error) {
        console.error('Erro ao carregar clientes:', error);
        toast.error('Erro ao carregar clientes');
        return;
      }

      const clientesBase: Cliente[] = (data || []).map(item => clienteFromSupabase(item));

      setClientes(clientesBase);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      toast.error('Erro ao carregar clientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarClientes();
  }, [user]);

  const criarCliente = async (clienteData: any) => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return false;
    }

    // Validações básicas
    const nome = clienteData.nome || clienteData.nomeCompleto;
    if (!nome?.trim()) {
      toast.error('Nome do cliente é obrigatório');
      return false;
    }

    if (!clienteData.telefone?.trim()) {
      toast.error('Telefone do cliente é obrigatório');
      return false;
    }

    if (!validateUniqueName(clientes, nome, 'Cliente')) {
      return false;
    }

    setLoading(true);
    try {
      const insertPayload = {
        user_id: user.id,
        historico_servicos: [],
        ...clienteToSupabase({ ...clienteData, nome })
      };
      const { data, error } = await supabase
        .from('clientes')
        .insert(insertPayload as any)
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar cliente:', error);
        toast.error('Erro ao criar cliente');
        return false;
      }

      const novoCliente = clienteFromSupabase(data);

      setClientes(prev => [...prev, novoCliente]);
      toast.success('Cliente criado com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      toast.error('Erro ao criar cliente');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const atualizarCliente = async (id: string, updates: any) => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return false;
    }

    const nome = updates.nome !== undefined ? updates.nome : updates.nomeCompleto;
    if (nome !== undefined && nome !== null && nome.trim() !== '') {
      if (!validateUniqueName(clientes, nome, 'Cliente', id)) {
        return false;
      }
    }

    setLoading(true);
    try {
      const updateData = clienteToSupabase(updates);
      if (updates.nomeCompleto !== undefined && updates.nome === undefined) {
        updateData.nome = updates.nomeCompleto;
      }

      const { data, error } = await supabase
        .from('clientes')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar cliente:', error);
        toast.error('Erro ao atualizar cliente');
        return false;
      }

      const clienteAtualizado = clienteFromSupabase(data);

      setClientes(prev => prev.map((c: any) => c.id === id ? clienteAtualizado : c));
      toast.success('Cliente atualizado com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      toast.error('Erro ao atualizar cliente');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const excluirCliente = async (id: string) => {
    console.log('🔄 Iniciando exclusão do cliente:', id);
    
    if (!user) {
      console.error('❌ Usuário não autenticado');
      toast.error('Usuário não autenticado');
      return false;
    }

    console.log('✅ Usuário autenticado:', user.id);

    setLoading(true);
    try {
      console.log('🗑️ Executando delete no Supabase...');
      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('❌ Erro do Supabase ao excluir cliente:', error);
        toast.error('Erro ao excluir cliente: ' + error.message);
        return false;
      }

      console.log('✅ Cliente excluído com sucesso no banco');
      
      // Atualizar lista local
      setClientes(prev => {
        const novaLista = prev.filter((c: any) => c.id !== id);
        console.log('📝 Lista atualizada:', novaLista.length, 'clientes');
        return novaLista;
      });
      
      toast.success('Cliente excluído com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      toast.error('Erro ao excluir cliente');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const obterClienteComEstatisticas = (id: string) => {
    return clientes.find((c: any) => c.id === id);
  };

  return {
    loading,
    clientes,
    criarCliente,
    atualizarCliente,
    excluirCliente,
    obterClienteComEstatisticas,
    recarregar: carregarClientes,
    carregarEstatisticasCliente
  };
}
