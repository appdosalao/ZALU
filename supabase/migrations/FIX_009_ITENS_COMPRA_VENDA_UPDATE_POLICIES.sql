-- ========================================================
-- FIX-009: `itens_compra` e `itens_venda` — adicionam UPDATE policies
-- Problema:
--   UPDATE policies nao existiam para nenhuma das duas tabelas.
--   UI ao tentar editar item de compra/item de venda → falha silent (403 default deny).
--   Apenas SELECT/INSERT/DELETE existiam, usando EXISTS join com compras/vendas_produtos por user_id.
-- Solucao:
--   - Cria UPDATE policies usando a mesma estrategia EXISTS das outras operacoes.
-- ========================================================

-- itens_compra UPDATE
CREATE POLICY "Users can update their own purchase items"
ON public.itens_compra
FOR UPDATE
USING (EXISTS (
  SELECT 1
  FROM compras
  WHERE compras.id = itens_compra.compra_id
    AND compras.user_id = auth.uid()
))
WITH CHECK (EXISTS (
  SELECT 1
  FROM compras
  WHERE compras.id = itens_compra.compra_id
    AND compras.user_id = auth.uid()
));

-- itens_venda UPDATE
CREATE POLICY "Users can update their own sale items"
ON public.itens_venda
FOR UPDATE
USING (EXISTS (
  SELECT 1
  FROM vendas_produtos
  WHERE vendas_produtos.id = itens_venda.venda_id
    AND vendas_produtos.user_id = auth.uid()
))
WITH CHECK (EXISTS (
  SELECT 1
  FROM vendas_produtos
  WHERE vendas_produtos.id = itens_venda.venda_id
    AND vendas_produtos.user_id = auth.uid()
));
