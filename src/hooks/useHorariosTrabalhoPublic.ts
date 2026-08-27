import { useEffect, useState, useCallback } from 'react';
import { supabasePublic } from '@/integrations/supabase/publicClient';
import { getPublicIdFromUrl, getOwnerUserIdFromUrl, resolveOwnerIdFromPublicId } from '@/lib/utils';

interface ConfiguracaoHorarioPublica {
  id: string;
  dia_semana: number;
  ativo: boolean;
  horario_abertura: string;
  horario_fechamento: string;
  intervalo_inicio?: string;
  intervalo_fim?: string;
}

export const useHorariosTrabalhoPublic = (userId?: string) => {
  const [configuracoes, setConfiguracoes] = useState<ConfiguracaoHorarioPublica[]>([]);
  const [loading, setLoading] = useState(true);

  const carregarConfiguracoes = useCallback(async () => {
    try {
      let resolvedUserId = userId;

      if (!resolvedUserId) {
        // Tenta resolver pela URL apenas se não há userId ainda
        const directUid = getOwnerUserIdFromUrl();
        if (directUid && directUid !== 'demo') {
          resolvedUserId = directUid;
        } else {
          const publicId = getPublicIdFromUrl();
          if (publicId) {
            resolvedUserId = (await resolveOwnerIdFromPublicId(supabasePublic as any, publicId)) || undefined;
          }
        }
      }

      if (!resolvedUserId || resolvedUserId === 'demo') {
        setConfiguracoes([]);
        return;
      }

      const { data, error } = await supabasePublic
        .from('configuracoes_horarios' as any)
        .select('*')
        .eq('ativo', true)
        .eq('user_id', resolvedUserId)
        .order('dia_semana');

      if (error) throw error;
      setConfiguracoes((data as any[]) || []);
    } catch {
      setConfiguracoes([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    // Se o userId ainda não foi resolvido pelo componente pai (null vs undefined),
    // aguarda a próxima renderização com o valor real para evitar RPC duplicada.
    // undefined = não foi passado (resolve pela URL); null = passado mas ainda carregando.
    if (userId === null) return;
    carregarConfiguracoes();
  }, [carregarConfiguracoes, userId]);

  const isDiaAtivo = useCallback((diaSemana: number): boolean => {
    const config = configuracoes.find(c => c.dia_semana === diaSemana && c.ativo);
    return !!config;
  }, [configuracoes]);

  return {
    configuracoes,
    loading,
    isDiaAtivo,
    refetch: carregarConfiguracoes,
  };
};

