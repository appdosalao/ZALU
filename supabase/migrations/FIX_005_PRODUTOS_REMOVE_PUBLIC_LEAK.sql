-- ========================================================
-- FIX-005: Remocao de leak cross-tenant em `produtos`
-- Problema:
--   Policy "Public select produtos" SELECT USING (ativo=true)
--   Qualquer usuario autenticado le INVENTARIO COMPLETO (nome, descricao,
--   preco_custo, preco_venda, estoque) de TODOS os tenants competidores.
--   Produtos NAO sao usados no agendamento online publico (apenas servicos),
--   entao nao ha justificativa para essa politica publica.
-- Solucao:
--   - DROP da policy publica
--   - Mantem "Owner access produtos" ALL (user_id = auth.uid()) → ja segura
-- ========================================================

DROP POLICY IF EXISTS "Public select produtos" ON public.produtos;
