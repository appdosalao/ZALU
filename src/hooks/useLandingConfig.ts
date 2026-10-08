import { useEffect, useState } from 'react';
import { supabasePublic } from '@/integrations/supabase/publicClient';
import { defaultLandingConfig, normalizeLandingConfig, type LandingConfig } from '@/types/landing';
import type { ConfigAgendamentoOnline } from '@/hooks/useConfigAgendamentoOnline';

export function useLandingConfig(slug?: string) {
  const [config, setConfig] = useState<ConfigAgendamentoOnline | null>(null);
  const [landing, setLanding] = useState<LandingConfig>(defaultLandingConfig);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) { setLoading(false); return; }
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const { data } = await (supabasePublic as any)
          .from('configuracoes_agendamento_online')
          .select('*')
          .eq('public_id', slug)
          .eq('ativo', true)
          .maybeSingle();
        if (!active) return;
        if (data) {
          setConfig(data as ConfigAgendamentoOnline);
          const raw = (data as any).landing_config;
          setLanding(normalizeLandingConfig(raw && typeof raw === 'object' ? raw : null));
          try { (supabasePublic as any).from('landing_views').insert({ public_id: slug }); } catch {}
        }
      } finally { if (active) setLoading(false); }
    })();
    return () => { active = false; };
  }, [slug]);

  return { config, landing, loading };
}
