-- ========================================================
-- AUDITORIA FASE 0 - ETAPA 2: Verificar estado RLS das tabelas
-- Operacao: SOMENTE LEITURA. Nenhuma modificacao.
-- ========================================================

-- Relatorio completo de todas as tabelas do schema public
SELECT 
    schemaname, 
    tablename, 
    rowsecurity,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
