-- ========================================================
-- FIX-004: Hardening INSERT public em `agendamentos_online`
-- Problema:
--   Policy "Public can insert online appointments" INSERT WITH CHECK true
--   Qualquer usuario anonimo/ autenticado insere linha com user_id aleatorio,
--   criando spam/flood na agenda de QUALQUER salao (ate competidores).
-- Solucao:
--   - DROP policy WITH CHECK true
--   - Recria policy WITH CHECK obrigando que user_id do agendamento
--     corresponda ao user_id dono do public_id (salon_slug) enviado no JWT
--   - Mantem policy ALL "Owners can manage their online appointments"
--     e a policy "Public can view availability" (ja existentes e seguras)
-- ========================================================

DROP POLICY IF EXISTS "Public can insert online appointments" ON public.agendamentos_online;

CREATE POLICY "agendamentos_online_insert_public_booking"
ON public.agendamentos_online
FOR INSERT
WITH CHECK (
  (user_id IS NOT NULL)
  AND
  (user_id = (
    SELECT configuracoes_agendamento_online.user_id
    FROM configuracoes_agendamento_online
    WHERE configuracoes_agendamento_online.public_id = (
      (current_setting('request.jwt.claims'::text, true))::json ->> 'salon_slug'::text
    )
    LIMIT 1
  ))
);
