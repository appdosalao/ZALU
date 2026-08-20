-- ========================================================
-- AUDITORIA FASE 0 - ETAPA 4: Informacoes de colunas (proprietario)
-- Operacao: SOMENTE LEITURA. Nenhuma modificacao.
-- ========================================================

-- Verifica colunas que podem representar o proprietario do tenant
SELECT 
    table_schema,
    table_name,
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND column_name IN (
    'user_id', 'usuario_id', 'owner_id', 'owner_user_id',
    'cliente_id', 'criado_por', 'created_by', 'tenant_id'
  )
ORDER BY table_name, column_name;
