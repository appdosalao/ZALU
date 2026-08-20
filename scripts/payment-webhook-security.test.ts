process.env.NODE_ENV = 'test';

import request from 'supertest';
import type { Express } from 'express';
import { timingSafeEqual, scryptSync } from 'crypto';

const VALID_SECRET = 'test-webhook-secret-abc123_xyz';
const NONEXISTENT_UUID = '00000000-0000-0000-0000-000000000000';
const VALID_FORMAT_UUID = '11111111-2222-3333-4444-555555555555';

type TestResult = {
  id: string;
  name: string;
  ok: boolean;
  expected: string;
  actual: string;
  details?: string;
};

const results: TestResult[] = [];

const mark = (
  id: string,
  name: string,
  ok: boolean,
  expected: string,
  actual: string,
  details?: string,
) => {
  results.push({ id, name, ok, expected, actual, details });
  const icon = ok ? '✅ PASS' : '❌ FAIL';
  console.log(`${icon}  [${id}] ${name}`);
  if (!ok) {
    console.log(`     Esperado: ${expected}`);
    console.log(`     Obtido:   ${actual}`);
    if (details) console.log(`     Detalhes: ${details}`);
  }
};

const safeEqual = (a: string, b: string): boolean => {
  const aBuf = Buffer.from(a, 'utf8');
  const bBuf = Buffer.from(b, 'utf8');
  if (aBuf.length !== bBuf.length) return false;
  const derivedA = scryptSync(aBuf, 'cakto-wh-salt', 32);
  const derivedB = scryptSync(bBuf, 'cakto-wh-salt', 32);
  return timingSafeEqual(derivedA, derivedB);
};

const buildValidPayload = (overrides: Record<string, unknown> = {}) => ({
  secret: VALID_SECRET,
  event: { custom_id: 'purchase_approved' },
  data: {
    external_id: VALID_FORMAT_UUID,
    status: 'paid',
    order_id: 'order-xyz-1',
    event_id: 'evt-replayable-001',
  },
  ...overrides,
});

const freshPaymentRouterWithEnv = async (
  envOverrides: NodeJS.ProcessEnv,
): Promise<{ app: Express; envApplied: boolean }> => {
  for (const [k, v] of Object.entries(envOverrides)) {
    if (v === undefined || v === null) {
      delete process.env[k];
    } else {
      process.env[k] = v;
    }
  }
  process.env.NODE_ENV = 'test';

  const resolvedPayment = await import(`../src/routes/payment.js?v=${Date.now()}-${Math.random().toString(36).slice(2)}`);
  const resolvedExpress = await import('express');
  const resolvedHelmet = await import('helmet');

  const paymentRouter = (resolvedPayment as any).default || (resolvedPayment as any).router;
  const app: Express = (resolvedExpress as any).default();
  app.use((resolvedHelmet as any).default());
  app.use((resolvedExpress as any).default.json({ limit: '200kb' }));
  app.use('/api/payment', paymentRouter);

  const applied = safeEqual((process.env.CAKTO_WEBHOOK_SECRET as string) || '', (envOverrides.CAKTO_WEBHOOK_SECRET as string) || '') ||
    (process.env.CAKTO_WEBHOOK_SECRET === '' && !envOverrides.CAKTO_WEBHOOK_SECRET);
  return { app, envApplied: !!applied };
};

const runSuite = async () => {
  console.log('\n================================================================');
  console.log('  BELLAGEST — SEC-001: Testes do Webhook de Pagamento (Cakto)');
  console.log('================================================================\n');

  // ------------------------------------------------------------------
  // TESTE 1 — Secret ausente
  // ------------------------------------------------------------------
  console.log('🧪 Teste 1: CAKTO_WEBHOOK_SECRET não configurado');
  try {
    const { app, envApplied } = await freshPaymentRouterWithEnv({
      CAKTO_WEBHOOK_SECRET: '',
      SUPABASE_SERVICE_ROLE_KEY: 'placeholder-for-test',
    });
    const res = await request(app)
      .post('/api/payment/webhook')
      .send(buildValidPayload({ secret: 'anything' }));
    const statusOk = res.statusCode === 500 || res.statusCode === 401;
    mark(
      'T1',
      'Secret ausente: rejeição com status 500/401 sem side effects',
      statusOk && envApplied,
      'HTTP 500 ou 401',
      `HTTP ${res.statusCode} (env aplicado=${envApplied})`,
      res.statusCode === 200 ? `Corpo: ${JSON.stringify(res.body)}` : undefined,
    );
  } catch (err: any) {
    mark('T1', 'Secret ausente: rejeição', false, '500/401', `Exceção: ${err?.message ?? err}`);
  }

  // ------------------------------------------------------------------
  // TESTE 2 — Secret incorreto
  // ------------------------------------------------------------------
  console.log('\n🧪 Teste 2: Secret recebido inválido (diferente do configurado)');
  try {
    const { app } = await freshPaymentRouterWithEnv({
      CAKTO_WEBHOOK_SECRET: VALID_SECRET,
      SUPABASE_SERVICE_ROLE_KEY: 'placeholder-for-test',
    });
    const res = await request(app)
      .post('/api/payment/webhook')
      .send(buildValidPayload({ secret: 'WRONG-SECRET-123' }));
    mark(
      'T2',
      'Secret incorreto: HTTP 401 e nenhum acesso concedido',
      res.statusCode === 401,
      'HTTP 401',
      `HTTP ${res.statusCode}`,
      res.body && typeof res.body === 'object' ? `Body.error=${(res.body as any).error}` : undefined,
    );
  } catch (err: any) {
    mark('T2', 'Secret incorreto: 401', false, '401', `Exceção: ${err?.message ?? err}`);
  }

  // ------------------------------------------------------------------
  // TESTE 3 — Secret correto + payload válido
  // ------------------------------------------------------------------
  console.log('\n🧪 Teste 3: Secret correto + payload válido (processa até a camada de dados)');
  try {
    const { app } = await freshPaymentRouterWithEnv({
      CAKTO_WEBHOOK_SECRET: VALID_SECRET,
      SUPABASE_SERVICE_ROLE_KEY: '',
    });
    const payload = buildValidPayload({
      secret: VALID_SECRET,
      data: {
        external_id: VALID_FORMAT_UUID,
        status: 'paid',
        order_id: 'order-test-3',
        event_id: 'evt-valid-flow-003',
      },
    });
    const res = await request(app).post('/api/payment/webhook').send(payload);
    const erroredBecauseAuthSecret =
      res.statusCode === 401 ||
      (res.statusCode === 500 && (res.body as any)?.error === 'webhook_config_error');
    const advancedPastAuth = !erroredBecauseAuthSecret;
    mark(
      'T3',
      'Secret correto + payload válido: passa por autenticação e avança para dados',
      advancedPastAuth,
      'Não pode retornar 401 / webhook_config_error',
      `HTTP ${res.statusCode}; error=${(res.body as any)?.error ?? 'none'}`,
      advancedPastAuth
        ? 'Autenticação do webhook validada corretamente. A etapa de dados falhou (esperado sem service_role real).'
        : `Corpo: ${JSON.stringify(res.body).slice(0, 300)}`,
    );
  } catch (err: any) {
    mark('T3', 'Secret correto: avançar para dados', false, 'Sem 401/500-secret', `Exceção: ${err?.message ?? err}`);
  }

  // ------------------------------------------------------------------
  // TESTE 4 — Secret correto + external_id inexistente / não-usuário
  // ------------------------------------------------------------------
  console.log('\n🧪 Teste 4: Secret correto + external_id não cadastrado');
  try {
    const { app } = await freshPaymentRouterWithEnv({
      CAKTO_WEBHOOK_SECRET: VALID_SECRET,
      SUPABASE_SERVICE_ROLE_KEY: '',
    });
    const payload = buildValidPayload({
      secret: VALID_SECRET,
      data: {
        external_id: NONEXISTENT_UUID,
        status: 'paid',
        order_id: 'order-test-4',
        event_id: 'evt-valid-flow-004',
      },
    });
    const res = await request(app).post('/api/payment/webhook').send(payload);
    const statusOk = res.statusCode === 400 || res.statusCode === 500;
    const body: any = res.body ?? {};
    const noPaidAccessGrant = !(body.approved === true && body.processed === true && body.alreadyProcessed === false);
    mark(
      'T4',
      'external_id inexistente: requisição rejeitada / paid_access não concedido',
      statusOk && noPaidAccessGrant,
      'HTTP 400/500 e SEM paid_access=true no body',
      `HTTP ${res.statusCode}; body.approved=${body.approved}; processed=${body.processed}; error=${body.error ?? 'none'}`,
      !noPaidAccessGrant ? 'RISCO: paid_access poderia ser concedido a UUID fantasma!' : undefined,
    );
  } catch (err: any) {
    mark('T4', 'external_id inexistente: rejeição', false, '400/500 e sem paid_access', `Exceção: ${err?.message ?? err}`);
  }

  // ------------------------------------------------------------------
  // TESTE 5 — Idempotência / replay do mesmo evento
  // ------------------------------------------------------------------
  console.log('\n🧪 Teste 5: Replay do mesmo evento — Idempotência');
  try {
    const { app } = await freshPaymentRouterWithEnv({
      CAKTO_WEBHOOK_SECRET: VALID_SECRET,
      SUPABASE_SERVICE_ROLE_KEY: '',
    });
    const sharedPayload = buildValidPayload({
      secret: VALID_SECRET,
      data: {
        external_id: VALID_FORMAT_UUID,
        status: 'paid',
        order_id: 'order-replay-5',
        event_id: 'evt-idempotency-005',
      },
    });
    const res1 = await request(app).post('/api/payment/webhook').send(sharedPayload);
    const res2 = await request(app).post('/api/payment/webhook').send(sharedPayload);

    const isAuthOrConfigFail = (r: any) =>
      r.statusCode === 401 ||
      (r.statusCode === 500 && (r.body as any)?.error === 'webhook_config_error');
    const bothAdvanced = !isAuthOrConfigFail(res1) && !isAuthOrConfigFail(res2);

    const bothSameClass =
      (res1.statusCode >= 200 && res1.statusCode < 300 && res2.statusCode >= 200 && res2.statusCode < 300) ||
      (res1.statusCode >= 400 && res1.statusCode < 500 && res2.statusCode >= 400 && res2.statusCode < 500) ||
      (res1.statusCode === 500 && res2.statusCode === 500);

    const b1: any = res1.body ?? {};
    const b2: any = res2.body ?? {};
    const noneGranted =
      !(b1.approved === true && b1.alreadyProcessed === false) &&
      !(b2.approved === true && b2.alreadyProcessed === false);

    const ok = bothAdvanced && bothSameClass && noneGranted;

    mark(
      'T5',
      'Replay idempotente: mesmo evento não causa acesso duplicado',
      ok,
      'Ambas requisições passam por auth, mesma classe de status, e nenhuma concede paid_access=true já que não há DB real',
      `HTTP res1=${res1.statusCode} (approved=${b1.approved}, alreadyProcessed=${b1.alreadyProcessed}, processed=${b1.processed}); HTTP res2=${res2.statusCode} (approved=${b2.approved}, alreadyProcessed=${b2.alreadyProcessed}, processed=${b2.processed})`,
    );
  } catch (err: any) {
    mark('T5', 'Idempotência', false, 'respostas consistentes sem paid_access', `Exceção: ${err?.message ?? err}`);
  }

  // ------------------------------------------------------------------
  // BÔNUS: Secret correto + formato UUID inválido em external_id
  // ------------------------------------------------------------------
  console.log('\n🧪 Bônus: external_id com formato NÃO-UUID → rejeição 400');
  try {
    const { app } = await freshPaymentRouterWithEnv({
      CAKTO_WEBHOOK_SECRET: VALID_SECRET,
      SUPABASE_SERVICE_ROLE_KEY: '',
    });
    const payload = buildValidPayload({
      secret: VALID_SECRET,
      data: {
        external_id: 'obviously-not-a-uuid',
        status: 'paid',
      },
    });
    const res = await request(app).post('/api/payment/webhook').send(payload);
    mark(
      'T-EXTRA',
      'external_id não-UUID rejeitado com 400',
      res.statusCode === 400,
      'HTTP 400 / invalid_external_id',
      `HTTP ${res.statusCode}; error=${(res.body as any)?.error ?? 'none'}`,
    );
  } catch (err: any) {
    mark('T-EXTRA', 'não-UUID 400', false, '400', `Exceção: ${err?.message ?? err}`);
  }

  // ------------------------------------------------------------------
  // Sumário
  // ------------------------------------------------------------------
  console.log('\n================================================================');
  console.log('  SUMÁRIO DE TESTES');
  console.log('================================================================');
  const passed = results.filter(r => r.ok).length;
  const total = results.length;
  const failed = results.filter(r => !r.ok);
  console.log(`\n  Total: ${total}  |  Aprovados: ${passed}  |  Reprovados: ${failed.length}\n`);
  if (failed.length > 0) {
    console.log('  Reprovados:');
    for (const f of failed) {
      console.log(`   • [${f.id}] ${f.name}`);
      console.log(`       Esperado: ${f.expected}`);
      console.log(`       Obtido:   ${f.actual}`);
      if (f.details) console.log(`       Detalhes: ${f.details}`);
    }
    process.exitCode = 1;
  } else {
    console.log('  Todos os testes passaram. ✨');
    process.exitCode = 0;
  }
  console.log('');
};

runSuite().catch(err => {
  console.error('Erro fatal ao rodar suíte de testes:', err);
  process.exitCode = 99;
});
