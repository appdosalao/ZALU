ALTER TABLE public.configuracoes_agendamento_online
  ADD COLUMN IF NOT EXISTS tema_formulario TEXT NOT NULL DEFAULT 'claro',
  ADD COLUMN IF NOT EXISTS estilo_card TEXT NOT NULL DEFAULT 'premium',
  ADD COLUMN IF NOT EXISTS estilo_botao TEXT NOT NULL DEFAULT 'gradiente',
  ADD COLUMN IF NOT EXISTS sombra_botao TEXT NOT NULL DEFAULT 'media';
