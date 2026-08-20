-- ========================================================
-- FIX-008: `intervalos_trabalho` — completa falta de policies + ajusta public select
-- Problema 1 (grave, mas funcional):
--   NENHUMA INSERT/UPDATE/DELETE policy → UI trava ao tentar salvar novo intervalo
--   (default deny, usuario autenticado nao consegue escrever).
-- Problema 2 (leak leve):
--   SELECT policy "Public can view work intervals USING true" → ve intervalos de
--   TODOS os tenants, nao apenas do salao agendado.
-- Solucao:
--   - DROP do SELECT public global
--   - CREATE SELECT public escopado por salon_slug (user_id do configuracoes_agendamento_online)
--   - CREATE 4 policies owner-only (SELECT, INSERT, UPDATE, DELETE all user_id=auth.uid())
-- ========================================================

DROP POLICY IF EXISTS "Public can view work intervals" ON public.intervalos_trabalho;

-- SELECT public (agendamento online, escopo ao salao do public_id)
CREATE POLICY "intervalos_trabalho_select_public_booking"
ON public.intervalos_trabalho
FOR SELECT
USING (
  user_id = (
    SELECT configuracoes_agendamento_online.user_id
    FROM configuracoes_agendamento_online
    WHERE configuracoes_agendamento_online.public_id = (
      (current_setting('request.jwt.claims'::text, true))::json ->> 'salon_slug'::text
    )
    LIMIT 1
  )
);

-- Owner-only policies
CREATE POLICY "intervalos_trabalho_select_own"
ON public.intervalos_trabalho
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "intervalos_trabalho_insert_own"
ON public.intervalos_trabalho
FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "intervalos_trabalho_update_own"
ON public.intervalos_trabalho
FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "intervalos_trabalho_delete_own"
ON public.intervalos_trabalho
FOR DELETE
USING (user_id = auth.uid());
