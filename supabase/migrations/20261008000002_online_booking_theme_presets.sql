ALTER TABLE public.configuracoes_agendamento_online
  ADD COLUMN IF NOT EXISTS tema_preset TEXT NOT NULL DEFAULT 'salao-feminino';
