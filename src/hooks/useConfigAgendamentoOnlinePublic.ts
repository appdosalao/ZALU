import { useEffect, useMemo, useState } from 'react';
import { supabasePublic } from '@/integrations/supabase/publicClient';
import type { ConfigAgendamentoOnline } from '@/hooks/useConfigAgendamentoOnline';
import { getPublicIdFromUrl, getOwnerUserIdFromUrl, resolveOwnerIdFromPublicId } from '@/lib/utils';

const defaultConfig: ConfigAgendamentoOnline = {
  ativo: true,
  nome_salao: 'Meu Salão',
  descricao: 'Bem-vindo ao nosso salão! Agende seu horário de forma rápida e fácil.',
  telefone: '',
  email: '',
  endereco: '',
  instagram: '',
  facebook: '',
  whatsapp: '',
  logo_url: '',
  banner_url: '',
  taxa_sinal_percentual: 0,
  tempo_minimo_antecedencia: 60,
  tempo_maximo_antecedencia: 4320,
  mensagem_boas_vindas: 'Olá! Estamos felizes em atendê-lo(a). Preencha os dados abaixo para agendar seu horário.',
  termos_condicoes: 'Ao agendar, você concorda em chegar no horário marcado. Em caso de atraso superior a 15 minutos, o agendamento poderá ser cancelado.',
  mensagem_confirmacao: 'Agendamento confirmado! Em breve você receberá uma confirmação no WhatsApp.',
  cor_primaria: '#8B5CF6',
  cor_texto_botao: '#FFFFFF',
  mostrar_precos: true,
  mostrar_duracao: true,
};

export function useConfigAgendamentoOnlinePublic(ownerUserId?: string | null) {
  const [config, setConfig] = useState<ConfigAgendamentoOnline>(defaultConfig);
  const [loading, setLoading] = useState(true);

  const cacheKey = useMemo(() => ownerUserId || 'default', [ownerUserId]);

  useEffect(() => {
    // Se ownerUserId === null, o componente pai ainda está resolvendo o ID.
    // Aguardamos a próxima renderização para evitar RPC duplicada de resolução.
    if (ownerUserId === null) return;

    let active = true;

    async function fetchConfig() {
      try {
        setLoading(true);

        let resolvedUserId = ownerUserId ?? undefined;

        if (!resolvedUserId) {
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

        const query = supabasePublic
          .from('configuracoes_agendamento_online' as any)
          .select('*');

        if (!resolvedUserId || resolvedUserId === 'demo') {
          if (active) {
            setConfig(defaultConfig);
            setLoading(false);
          }
          return;
        }

        const { data, error } = await query.eq('user_id', resolvedUserId).maybeSingle();

        if (!active) return;

        if (error) {
          console.error('Erro ao carregar config pública:', error);
          setConfig(defaultConfig);
        } else {
          setConfig((data as unknown as ConfigAgendamentoOnline) || defaultConfig);
        }
      } catch (error) {
        console.error('Erro ao carregar configuração pública:', error);
        setConfig(defaultConfig);
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchConfig();

    return () => {
      active = false;
    };
  }, [cacheKey, ownerUserId]);

  return { config, loading };
}



