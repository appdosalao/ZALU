ALTER TABLE public.configuracoes_agendamento_online
  ADD COLUMN IF NOT EXISTS cor_secundaria TEXT NOT NULL DEFAULT '#F5D0FE',
  ADD COLUMN IF NOT EXISTS fonte_personalizada TEXT NOT NULL DEFAULT 'Inter, Segoe UI, sans-serif',
  ADD COLUMN IF NOT EXISTS card_background TEXT NOT NULL DEFAULT '#FFFFFF',
  ADD COLUMN IF NOT EXISTS raio_botoes INTEGER NOT NULL DEFAULT 22,
  ADD COLUMN IF NOT EXISTS animacao_botao TEXT NOT NULL DEFAULT 'lift';
