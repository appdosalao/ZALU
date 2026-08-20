-- ========================================================
-- FIX-012 a FIX-015: Lote de correcoes MENORES (prioridade baixa/media)
--
-- FIX-012: `loyalty_transactions` — apenas SELECT existia. Falta INSERT/UPDATE/DELETE.
-- FIX-013: `campaign_logs` — apenas SELECT existia. Falta INSERT/UPDATE/DELETE.
-- FIX-014: `referrals` — apenas SELECT existia. Falta INSERT/UPDATE/DELETE.
-- FIX-015a: Remove policies DUPLICADAS em cronogramas_novos (2x INSERT identicas, 2x UPDATE identicas)
-- FIX-015b: Remove policies DUPLICADAS em retornos_novos (mesmo problema)
--
-- Obs: Para `message_templates` — é tabela SEM user_id, a priori de referência global.
--      Mantemos apenas leitura publica. Sem write por enquanto (evita bagunca).
-- ========================================================

-- =========================
-- FIX-012: loyalty_transactions WRITE policies (estrategia EXISTS por cliente → user_id)
-- =========================
CREATE POLICY "Users can insert their own loyalty transactions"
ON public.loyalty_transactions
FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1
  FROM clientes
  WHERE clientes.id = loyalty_transactions.client_id
    AND clientes.user_id = auth.uid()
));

CREATE POLICY "Users can update their own loyalty transactions"
ON public.loyalty_transactions
FOR UPDATE
USING (EXISTS (
  SELECT 1
  FROM clientes
  WHERE clientes.id = loyalty_transactions.client_id
    AND clientes.user_id = auth.uid()
))
WITH CHECK (EXISTS (
  SELECT 1
  FROM clientes
  WHERE clientes.id = loyalty_transactions.client_id
    AND clientes.user_id = auth.uid()
));

CREATE POLICY "Users can delete their own loyalty transactions"
ON public.loyalty_transactions
FOR DELETE
USING (EXISTS (
  SELECT 1
  FROM clientes
  WHERE clientes.id = loyalty_transactions.client_id
    AND clientes.user_id = auth.uid()
));

-- =========================
-- FIX-013: campaign_logs WRITE policies (EXISTS por campaigns → user_id)
-- =========================
CREATE POLICY "Users can insert their own campaign logs"
ON public.campaign_logs
FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1
  FROM campaigns
  WHERE campaigns.id = campaign_logs.campaign_id
    AND campaigns.user_id = auth.uid()
));

CREATE POLICY "Users can update their own campaign logs"
ON public.campaign_logs
FOR UPDATE
USING (EXISTS (
  SELECT 1
  FROM campaigns
  WHERE campaigns.id = campaign_logs.campaign_id
    AND campaigns.user_id = auth.uid()
))
WITH CHECK (EXISTS (
  SELECT 1
  FROM campaigns
  WHERE campaigns.id = campaign_logs.campaign_id
    AND campaigns.user_id = auth.uid()
));

CREATE POLICY "Users can delete their own campaign logs"
ON public.campaign_logs
FOR DELETE
USING (EXISTS (
  SELECT 1
  FROM campaigns
  WHERE campaigns.id = campaign_logs.campaign_id
    AND campaigns.user_id = auth.uid()
));

-- =========================
-- FIX-014: referrals WRITE policies (EXISTS por clientes referrer → user_id)
-- =========================
CREATE POLICY "Users can insert their own referrals"
ON public.referrals
FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1
  FROM clientes
  WHERE clientes.id = referrals.referrer_id
    AND clientes.user_id = auth.uid()
));

CREATE POLICY "Users can update their own referrals"
ON public.referrals
FOR UPDATE
USING (EXISTS (
  SELECT 1
  FROM clientes
  WHERE clientes.id = referrals.referrer_id
    AND clientes.user_id = auth.uid()
))
WITH CHECK (EXISTS (
  SELECT 1
  FROM clientes
  WHERE clientes.id = referrals.referrer_id
    AND clientes.user_id = auth.uid()
));

CREATE POLICY "Users can delete their own referrals"
ON public.referrals
FOR DELETE
USING (EXISTS (
  SELECT 1
  FROM clientes
  WHERE clientes.id = referrals.referrer_id
    AND clientes.user_id = auth.uid()
));

-- =========================
-- FIX-015a: Remove policies DUPLICADAS em cronogramas_novos
--   Mantemos as policies "Users can create/update/delete their own cronogramas"
--   Removemos as *_insert_policy / *_update_policy que sao identicas
-- =========================
DROP POLICY IF EXISTS "cronogramas_novos_insert_policy" ON public.cronogramas_novos;
DROP POLICY IF EXISTS "cronogramas_novos_update_policy" ON public.cronogramas_novos;

-- =========================
-- FIX-015b: Remove policies DUPLICADAS em retornos_novos
-- =========================
DROP POLICY IF EXISTS "retornos_novos_insert_policy" ON public.retornos_novos;
DROP POLICY IF EXISTS "retornos_novos_update_policy" ON public.retornos_novos;
