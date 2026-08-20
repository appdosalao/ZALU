-- ========================================================
-- FIX-001: Correção CRÍTICA de `clientes`
-- Problema:
--   1. Policy "Owners can manage their clients" ALL USING true → cross-tenant total
--   2. Policy "Public can insert clients" INSERT WITH CHECK true → qualquer usuario cria cliente para outro tenant
-- Solucao:
--   - DROP das 2 policies ruins
--   - CREATE de 4 policies PERMISSIVE corretas (SELECT/INSERT/UPDATE/DELETE) escopadas a user_id = auth.uid()
--   - Mantem compatibilidade com agendamento online (quem insere via public precisa user_id da sala via salon_slug)
-- ========================================================

DROP POLICY IF EXISTS "Owners can manage their clients" ON public.clientes;
DROP POLICY IF EXISTS "Public can insert clients" ON public.clientes;

-- SELECT: Dono ve apenas seus proprios clientes
CREATE POLICY "clientes_select_own"
ON public.clientes
FOR SELECT
USING (user_id = auth.uid());

-- INSERT: Dono cria seus proprios clientes (com user_id = auth.uid())
CREATE POLICY "clientes_insert_own"
ON public.clientes
FOR INSERT
WITH CHECK (user_id = auth.uid());

-- UPDATE: Dono atualiza apenas seus proprios clientes (nao permite trocar user_id)
CREATE POLICY "clientes_update_own"
ON public.clientes
FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- DELETE: Dono remove apenas seus proprios clientes
CREATE POLICY "clientes_delete_own"
ON public.clientes
FOR DELETE
USING (user_id = auth.uid());

-- INSERT publico: Rota de agendamento online (salon_slug)
--   Aceita insert apenas se o user_id do cliente bater com o user_id do salao
--   correspondente ao public_id (salon_slug) enviado no JWT claim
CREATE POLICY "clientes_insert_public_booking"
ON public.clientes
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
