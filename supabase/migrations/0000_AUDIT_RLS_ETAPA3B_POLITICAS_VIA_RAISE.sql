-- ========================================================
-- AUDITORIA FASE 0 - ETAPA 3 (ALT): Obter politicas via DO block com RAISE EXCEPTION formatado
-- Operacao: SOMENTE LEITURA. Nenhuma modificacao.
-- ========================================================

DO $$
DECLARE
    r RECORD;
    json_policies JSONB := '[]'::JSONB;
BEGIN
    FOR r IN
        SELECT 
            c.relname AS tablename,
            p.polname AS policy_name,
            CASE p.polcmd
                WHEN 'r' THEN 'SELECT'
                WHEN 'a' THEN 'INSERT'
                WHEN 'w' THEN 'UPDATE'
                WHEN 'd' THEN 'DELETE'
                WHEN '*' THEN 'ALL'
                ELSE p.polcmd::text
            END AS command,
            COALESCE(pg_get_expr(p.polqual, p.polrelid), '') AS using_expr,
            COALESCE(pg_get_expr(p.polwithcheck, p.polrelid), '') AS with_check_expr
        FROM pg_policy p
        JOIN pg_class c ON c.oid = p.polrelid
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE n.nspname = 'public'
        ORDER BY c.relname, p.polname
    LOOP
        json_policies := json_policies || jsonb_build_object(
            'tablename', r.tablename,
            'policy_name', r.policy_name,
            'command', r.command,
            'using_expr', r.using_expr,
            'with_check_expr', r.with_check_expr
        );
    END LOOP;

    RAISE EXCEPTION 'AUDIT_POLICIES_JSON: %', json_policies::TEXT;
END $$;
