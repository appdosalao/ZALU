import { useState, useEffect, useMemo } from 'react';
import { ServicoFiltros, NovoServico, Servico } from '@/types/servico';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { toast } from 'sonner';
import { validateUniqueName } from '@/lib/validators';
import { servicoFromSupabase, servicoToSupabase } from '@/lib/mappers';

export function useServicos() {
  const { user } = useSupabaseAuth();
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [filtros, setFiltros] = useState<ServicoFiltros>({
    ordenacao: 'nome',
    direcao: 'asc'
  });

  // Carregar serviços do Supabase
  const carregarServicos = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('servicos')
        .select('*')
        .eq('user_id', user.id)
        .order('nome');

      if (error) {
        console.error('Erro ao carregar serviços:', error);
        toast.error('Erro ao carregar serviços');
        return;
      }

      const servicosFormatados = (data || []).map(item => servicoFromSupabase(item));

      setServicos(servicosFormatados);
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
      toast.error('Erro ao carregar serviços');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarServicos();
  }, [user]);

  // Filtrar e ordenar serviços
  const servicosFiltrados = useMemo(() => {
    let resultado = [...servicos];

    // Aplicar busca
    if (filtros.busca) {
      const busca = filtros.busca.toLowerCase();
      resultado = resultado.filter(servico => 
        servico.nome.toLowerCase().includes(busca) ||
        servico.descricao?.toLowerCase().includes(busca)
      );
    }

    // Aplicar ordenação
    if (filtros.ordenacao) {
      resultado.sort((a, b) => {
        const campo = filtros.ordenacao!;
        let valorA: any = a[campo];
        let valorB: any = b[campo];

        if (typeof valorA === 'string') {
          valorA = valorA.toLowerCase();
          valorB = valorB.toLowerCase();
        }

        if (filtros.direcao === 'desc') {
          return valorB > valorA ? 1 : valorB < valorA ? -1 : 0;
        }
        return valorA > valorB ? 1 : valorA < valorB ? -1 : 0;
      });
    }

    return resultado;
  }, [servicos, filtros]);

  // CRUD operations usando Supabase
  const criarServico = async (novoServico: NovoServico) => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return false;
    }

    // Validações
    if (!novoServico.nome.trim()) {
      toast.error('Nome do serviço é obrigatório');
      return false;
    }

    if (novoServico.valor <= 0 || novoServico.duracao <= 0) {
      toast.error('Valor e duração devem ser maiores que zero');
      return false;
    }

    if (!validateUniqueName(servicos, novoServico.nome, 'Serviço')) {
      return false;
    }

    setLoading(true);
    try {
      const insertPayload = {
        user_id: user.id,
        ...servicoToSupabase(novoServico)
      };
      const { data, error } = await supabase
        .from('servicos')
        .insert(insertPayload as any)
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar serviço:', error);
        toast.error('Erro ao criar serviço');
        return false;
      }

      const novoServicoFormatado = servicoFromSupabase(data);

      setServicos(prev => [...prev, novoServicoFormatado]);
      toast.success('Serviço criado com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro ao criar serviço:', error);
      toast.error('Erro ao criar serviço');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const atualizarServico = async (id: string, dadosAtualizados: Partial<NovoServico>) => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return false;
    }

    const nome = dadosAtualizados.nome;
    if (nome !== undefined && nome !== null && nome.trim() !== '') {
      if (!validateUniqueName(servicos, nome, 'Serviço', id)) {
        return false;
      }
    }

    // Validações básicas
    if (dadosAtualizados.nome !== undefined && !dadosAtualizados.nome.trim()) {
      toast.error('Nome do serviço é obrigatório');
      return false;
    }

    if (dadosAtualizados.valor !== undefined && dadosAtualizados.valor <= 0) {
      toast.error('Valor deve ser maior que zero');
      return false;
    }

    if (dadosAtualizados.duracao !== undefined && dadosAtualizados.duracao <= 0) {
      toast.error('Duração deve ser maior que zero');
      return false;
    }

    setLoading(true);
    try {
      const updates = servicoToSupabase(dadosAtualizados);

      const { data, error } = await supabase
        .from('servicos')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar serviço:', error);
        toast.error('Erro ao atualizar serviço');
        return false;
      }

      const servicoAtualizado = servicoFromSupabase(data);

      setServicos(prev => prev.map(s => s.id === id ? servicoAtualizado : s));
      toast.success('Serviço atualizado com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro ao atualizar serviço:', error);
      toast.error('Erro ao atualizar serviço');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const excluirServico = async (id: string) => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return false;
    }

    setLoading(true);
    try {
      console.log('🗑️ Iniciando exclusão de serviço:', id, 'Usuário:', user.id);
      
      // Primeiro, verificar permissões usando nossa função de diagnóstico
      const { data: permissionCheck, error: permError } = await supabase
        .rpc('test_delete_permissions', { 
          table_name: 'servicos', 
          record_id: id 
        });

      if (permError) {
        console.error('❌ Erro ao verificar permissões:', permError);
      } else {
        console.log('🔍 Verificação de permissões:', permissionCheck);
        
        // Garantir que temos uma resposta válida e fazer o cast para o tipo esperado
        const checkResult = permissionCheck as any;
        if (checkResult && typeof checkResult === 'object') {
          if (!checkResult.can_delete) {
            if (!checkResult.record_exists) {
              toast.error('Serviço não encontrado');
              return false;
            }
            if (!checkResult.user_owns_record) {
              toast.error('Você não tem permissão para excluir este serviço');
              return false;
            }
          }
        }
      }
      
      // Verificar se há agendamentos online usando este serviço
      const { data: agendamentosOnline, error: checkError } = await supabase
        .from('agendamentos_online')
        .select('id, nome_completo')
        .eq('servico_id', id);

      if (checkError) {
        console.error('❌ Erro ao verificar agendamentos online:', checkError);
      }

      // Executar a exclusão
      const { error } = await supabase
        .from('servicos')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('❌ Erro do Supabase ao excluir serviço:', error);
        toast.error('Erro ao excluir serviço: ' + error.message);
        return false;
      }

      console.log('✅ Serviço excluído com sucesso no banco');
      
      // Informar sobre agendamentos online afetados
      if (agendamentosOnline && agendamentosOnline.length > 0) {
        toast.success(`Serviço excluído com sucesso! ${agendamentosOnline.length} agendamento(s) online foram atualizados.`);
      } else {
        toast.success('Serviço excluído com sucesso!');
      }
      
      // Atualizar lista local
      setServicos(prev => {
        const novaLista = prev.filter(s => s.id !== id);
        console.log('📝 Lista de serviços atualizada:', novaLista.length, 'serviços');
        return novaLista;
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao excluir serviço:', error);
      toast.error('Erro ao excluir serviço');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const obterServicoPorId = (id: string) => {
    return servicos.find(s => s.id === id);
  };

  return {
    loading,
    servicos: servicosFiltrados,
    todosServicos: servicos,
    filtros,
    setFiltros,
    criarServico,
    atualizarServico,
    excluirServico,
    obterServicoPorId,
    recarregar: carregarServicos,
  };
}
