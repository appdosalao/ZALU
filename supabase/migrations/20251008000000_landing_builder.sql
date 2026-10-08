-- Landing builder: tema + blocos por salão
-- Compatível: mantém colunas legadas, adiciona landing_config jsonb

ALTER TABLE public.configuracoes_agendamento_online
ADD COLUMN IF NOT EXISTS landing_config jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS landing_version int DEFAULT 1;

-- Garantir SELECT anon para landing_config (já existe, mas reforça)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='configuracoes_agendamento_online' AND policyname='Public can view online configs'
  ) THEN
    CREATE POLICY "Public can view online configs" ON public.configuracoes_agendamento_online FOR SELECT TO anon USING (true);
  END IF;
END $$;

-- Views count opcional (analytics leve)
CREATE TABLE IF NOT EXISTS public.landing_views(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id text NOT NULL,
  viewed_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_landing_views_public_id ON public.landing_views(public_id, viewed_at);
ALTER TABLE public.landing_views ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "allow insert views" ON public.landing_views;
CREATE POLICY "allow insert views" ON public.landing_views FOR INSERT TO anon, authenticated WITH CHECK (true);
GRANT INSERT, SELECT ON public.landing_views TO anon, authenticated;
