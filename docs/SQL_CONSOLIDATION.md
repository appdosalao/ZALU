# SQL Consolidation — Opção Mais Segura

## Canônicos (APLICAR)
- `AGENDAMENTO_ONLINE_MASTER_FIX.sql` — **corrigido** em 2025-10: `USING/WITH CHECK (true)` → `user_id=auth.uid()`, GRANT anon restrito a SELECT/INSERT mínimos.
- `supabase/migrations/20251006120000_safe_booking_concurrency_and_rate_limit.sql` — RPC conflito `criar_agendamento_seguro` + `check_booking_rate_limit`, sem quebrar `origem=manual`.

## Legado (NÃO APLICAR EM PROD)
Arquivos com `GRANT ALL TO anon`, `WITH CHECK (true)`, `USING (true)` — executar sobrescreve RLS seguro e reabre anon total:
- `EXTERMINIO_ERRO_OWNER_ID.sql`
- `FIX_ACESSO_CONTA.sql` (USING true anon)
- `RESTAURACAO_USER_ID.sql` / `RESTAURACAO_USER_ID_TOTAL.sql`
- `SQL_DEFINITIVO_UNIFICADO.sql` / `SOLUCAO_FINAL_AGENDAMENTO.sql`
- `fix_online_booking_*`, `fix_rls_*`, `FIX_VISIBILIDADE_HORARIOS.sql`
- Migrations antigas 202508* com `USING (true)` — manter só como histórico, não reaplicar.

## Trava
`scripts/block_legacy_sql.ps1` falha se algum desses arquivos for aplicado fora de `docs/` review. Rodar em CI antes de `supabase db push`.

## Teste migration segura (staging)
```powershell
npx supabase db push --dry-run
# ou
psql $DATABASE_URL -f supabase/migrations/20251006120000_safe_booking_concurrency_and_rate_limit.sql --dry not exec, validar com \d+ agendamentos
```
Validar: `SELECT verificar_conflito_agendamento(auth.uid(), '2025-10-06','10:00',60)` e `SELECT check_booking_rate_limit('testhash','testslug')`.

## Regra
Nunca rodar `--force` audit no main; breaking `tailwind@4`, `vite@8`, `react-router@7` só em branch `chore/audit-breaking` com `npm run build`.
