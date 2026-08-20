-- ========================================================
-- FIX-011: `configuracoes_agendamento_online` public SELECT — reduz leak leve
-- Problema (baixo risco):
--   Policy "Public can view active booking configs for form display" 
--   USING (ativo = true) → 
--   lista TODAS configs ativas de TODOS os tenants (whatsapp, endereco, instagram, email do salao).
--   Impacto menor (dados de contato do salao, nao dos clientes).
-- Solucao:
--   - DROP da policy atual
--   - Re-cria policy adicionando AND public_id IS NOT NULL (só expõe salões que realmente tem public_id válido)
--   Obs: mantida por enquanto a exposicao minima pois o agendamento online publico PRECISA
--   ler esses dados para exibir a pagina de booking do salao. Na proxima fase podemos escopor
--   por salon_slug tambem.
-- ========================================================

DROP POLICY IF EXISTS "Public can view active booking configs for form display" ON public.configuracoes_agendamento_online;

CREATE POLICY "Public can view active booking configs for form display"
ON public.configuracoes_agendamento_online
FOR SELECT
USING (ativo = true AND public_id IS NOT NULL);
