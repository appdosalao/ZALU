-- ========================================================
-- FIX-002: Correção CRÍTICA de `servicos`
-- Problema:
--   Policy "Owners can manage their services" ALL USING true → cross-tenant total
--   Usuário A autenticado via PostgREST vê/edita/apaga serviços do usuário B
-- Solucao:
--   - DROP policy ALL USING true
--   - Mantem a policy segura "Public can view active services" (ja existe, escopo salon_slug)
--   - Cria 4 policies PERMISSIVE owner-only escopadas a user_id=auth.uid()
-- ========================================================

DROP POLICY IF EXISTS "Owners can manage their services" ON public.servicos;

-- SELECT owner (dono ve seus proprios servicos inclusive os inativos)
CREATE POLICY "servicos_select_own"
ON public.servicos
FOR SELECT
USING (user_id = auth.uid());

-- INSERT owner
CREATE POLICY "servicos_insert_own"
ON public.servicos
FOR INSERT
WITH CHECK (user_id = auth.uid());

-- UPDATE owner (nao permite trocar user_id)
CREATE POLICY "servicos_update_own"
ON public.servicos
FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- DELETE owner
CREATE POLICY "servicos_delete_own"
ON public.servicos
FOR DELETE
USING (user_id = auth.uid());
