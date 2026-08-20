-- ========================================================
-- AUDITORIA FASE 0 - ETAPA 3: Verificar politicas RLS existentes
-- Operacao: SOMENTE LEITURA. Nenhuma modificacao.
-- ========================================================

-- Todas as politicas de RLS para o schema public
SELECT 
    n.nspname AS schemaname,
    c.relname AS tablename,
    p.polname AS policy_name,
    CASE 
        WHEN p.polcmd = 'r' THEN 'SELECT'
        WHEN p.polcmd = 'a' THEN 'INSERT'
        WHEN p.polcmd = 'w' THEN 'UPDATE'
        WHEN p.polcmd = 'd' THEN 'DELETE'
        WHEN p.polcmd = '*' THEN 'ALL'
        ELSE p.polcmd::text
    END AS command,
    CASE 
        WHEN p.polpermissive = true THEN 'PERMISSIVE'
        ELSE 'RESTRICTIVE'
    END AS policy_type,
    pg_get_expr(p.polqual, p.polrelid) AS using_expression,
    pg_get_expr(p.polwithcheck, p.polrelid) AS with_check_expression,
    ARRAY(
        SELECT r.rolname 
        FROM pg_roles r 
        WHERE r.oid = ANY(p.polroles)
    ) AS applied_roles
FROM pg_policy p
JOIN pg_class c ON c.oid = p.polrelid
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
ORDER BY c.relname, p.polname;
