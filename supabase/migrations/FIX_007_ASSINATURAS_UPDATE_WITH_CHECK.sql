-- ========================================================
-- FIX-007: Hardening `assinaturas` UPDATE — bloqueia takeover
-- Problema:
--   Policy "assinaturas_update_own" UPDATE USING (auth.uid() = usuario_id)
--   MAS SEM WITH CHECK → permite:
--     UPDATE assinaturas SET usuario_id = '<uuid-outro-usuario>'
--     WHERE id = '<minha-assinatura';
--   Com isso: usuario A "doa" sua assinatura pro usuario B (perda de receita
--   (plano premium para outro usuario via workaround)
-- Solucao:
--   - DROP + RECREATE policy adicionando WITH CHECK (usuario_id = auth.uid())
--     NÃO permite mudar o owner na edição
-- ========================================================

DROP POLICY IF EXISTS "assinaturas_update_own" ON public.assinaturas;

CREATE POLICY "assinaturas_update_own"
ON public.assinaturas
FOR UPDATE
USING (auth.uid() = usuario_id)
WITH CHECK (auth.uid() = usuario_id);
