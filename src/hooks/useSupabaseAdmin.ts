import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { toast } from 'sonner';
import type { Usuario } from '@/types/usuario';
import { normalizeUsuario } from '@/contexts/AuthContext';

// Tipos para as tabelas relacionadas
type Servico = Database['public']['Tables']['servicos']['Row'];
type Cliente = Database['public']['Tables']['clientes']['Row'];
type Agendamento = Database['public']['Tables']['agendamentos']['Row'];

// Hook para acesso irrestrito aos dados do painel admin
export function useSupabaseAdmin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  // Carregar todos os usuários
  const loadAllUsuarios = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: queryError } = await supabase
        .from('usuarios')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (queryError) throw queryError;
      
      // Mapear para o tipo Usuario usando o normalizeUsuario padrão
      const mappedUsuarios = (data || []).map(u => {
        const usuario = normalizeUsuario(u as Database['public']['Tables']['usuarios']['Row']);
        return {
          ...usuario,
          isAdmin: usuario.email === 'resellr7@gmail.com'
        };
      });
      
      setUsuarios(mappedUsuarios);
      return mappedUsuarios;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar usuários';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Erro ao carregar usuários:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar serviços de um usuário específico
  const loadUserServicos = useCallback(async (userId: string): Promise<Servico[]> => {
    try {
      const { data, error: queryError } = await supabase
        .from('servicos')
        .select('*')
        .eq('user_id', userId);
      
      if (queryError) throw queryError;
      
      return data || [];
    } catch (err) {
      console.error('Erro ao carregar serviços do usuário:', err);
      return [];
    }
  }, []);

  // Carregar clientes de um usuário específico
  const loadUserClientes = useCallback(async (userId: string): Promise<Cliente[]> => {
    try {
      const { data, error: queryError } = await supabase
        .from('clientes')
        .select('*')
        .eq('user_id', userId);
      
      if (queryError) throw queryError;
      
      return data || [];
    } catch (err) {
      console.error('Erro ao carregar clientes do usuário:', err);
      return [];
    }
  }, []);

  // Carregar agendamentos de um usuário específico
  const loadUserAgendamentos = useCallback(async (userId: string): Promise<Agendamento[]> => {
    try {
      const { data, error: queryError } = await supabase
        .from('agendamentos')
        .select('*')
        .eq('user_id', userId);
      
      if (queryError) throw queryError;
      
      return data || [];
    } catch (err) {
      console.error('Erro ao carregar agendamentos do usuário:', err);
      return [];
    }
  }, []);

  // Atualizar um usuário
  const updateUsuario = useCallback(async (id: string, updates: Database['public']['Tables']['usuarios']['Update']) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('usuarios')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Usuário atualizado com sucesso!');
      await loadAllUsuarios();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar usuário';
      toast.error(errorMessage);
      console.error('Erro ao atualizar usuário:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [loadAllUsuarios]);

  // Setup realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('admin-usuarios-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'usuarios' }, 
        () => loadAllUsuarios()
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadAllUsuarios]);

  return {
    loading,
    error,
    usuarios,
    loadAllUsuarios,
    loadUserServicos,
    loadUserClientes,
    loadUserAgendamentos,
    updateUsuario
  };
}
