-- ========================================================
-- FIX-006: Protecao de horarios publicos em `configuracoes_horarios`
-- Problema:
--   2 politicas SELECT publicas "Public can view schedules USING true" + 
--   "Public view config hours USING true" → 
--   Usuario autenticado A ve HORARIOS DE TODOS os saloes (leve, 
--   dias_semana, horario_inicio, horario_fim, intervalos).
-- Solucao:
--   - DROP das 2 policies USING true (redundantes
--   - Recria SELECT public APENAS para quem passa salon_slug (igual servicos)
--   - Mantem as 4 policies owner-only que ja existiam (INSERT/UPDATE/DELETE/SELECT owner)
-- ========================================================

DROP POLICY IF EXISTS "Public can view schedules" ON public.configuracoes_horarios;
DROP POLICY IF EXISTS "Public view config hours" ON public.configuracoes_horarios;

-- SELECT public (agendamento online: horario apenas do salao dono do public_id (salon_slug)
CREATE POLICY "configuracoes_horarios_select_public_booking"
ON public.configuracoes_horarios
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
