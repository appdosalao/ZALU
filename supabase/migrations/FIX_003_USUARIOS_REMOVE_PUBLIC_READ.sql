-- ========================================================
-- FIX-003: Correção CRÍTICA de `usuarios`
-- Problema:
--   Policy "usuarios_public_read" SELECT USING true
--   Qualquer sessao autenticada ve dados PII de TODOS os donos (email, telefone, nome_completo, subscription_status)
-- Solucao:
--   - DROP da policy publica
--   - A policy "usuarios_access_policy" ALL (auth.uid() = id) ja cobre o owner de seus proprios dados
-- ========================================================

DROP POLICY IF EXISTS "usuarios_public_read" ON public.usuarios;
