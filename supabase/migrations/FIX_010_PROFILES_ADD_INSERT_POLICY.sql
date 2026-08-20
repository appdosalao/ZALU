-- ========================================================
-- FIX-010: `profiles` — adiciona INSERT policy
-- Problema:
--   SELECT / UPDATE existem, mas INSERT policy NAO.
--   No primeiro login (novo usuario), a UI cria trigger/auth de perfil novo,
--   mas a policy default deny bloqueia a criacao → erro 403 ao finalizar cadastro inicial.
-- Solucao:
--   - Cria INSERT policy WITH CHECK (id = auth.uid()) — apenas cria seu proprio perfil.
-- ========================================================

CREATE POLICY "profiles_insert_own"
ON public.profiles
FOR INSERT
WITH CHECK (id = auth.uid());
