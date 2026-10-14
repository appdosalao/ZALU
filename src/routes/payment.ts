/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router, Response, Request } from 'express';
import { authenticate, AuthenticatedRequest } from '../middlewares/authenticate.js';
import { supabaseAdmin } from '../lib/supabaseServer.js';
import dotenv from 'dotenv';
import { z } from 'zod';
import { timingSafeEqual, scryptSync, createHash } from 'crypto';
import { getAdminPlan } from '../config/adminPlans.js';
import { supabaseAffiliateAdmin } from '../lib/supabaseServer.js';

if (process.env.NODE_ENV !== 'test') {
  dotenv.config();
}

const router = Router();

const CAKTO_PRODUCT_URL = process.env.CAKTO_PRODUCT_URL || '';
const CAKTO_WEBHOOK_SECRET_RAW = process.env.CAKTO_WEBHOOK_SECRET || '';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8080';

const UUID_REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
const APPROVED_STATUS_SET = new Set(['paid', 'approved']);
const APPROVED_EVENT_SET = new Set(['purchase_approved']);
const CANCELLED_STATUS_SET = new Set(['refunded', 'refund', 'cancelled', 'canceled', 'chargeback', 'charged_back']);

const CaktoWebhookPayloadSchema = z.object({
  secret: z.string().nullish(),
  data: z
    .object({
      secret: z.string().nullish(),
      external_id: z.string().nullish(),
      refId: z.string().nullish(),
      status: z.string().nullish(),
      order_id: z.string().nullish(),
      id: z.string().nullish(),
      event_id: z.string().nullish(),
    })
    .catchall(z.unknown())
    .nullish(),
  fields: z
    .object({
      secret: z.string().nullish(),
    })
    .catchall(z.unknown())
    .nullish(),
  event: z
    .union([
      z.string(),
      z
        .object({
          custom_id: z.string().nullish(),
          id: z.string().nullish(),
        })
        .catchall(z.unknown()),
    ])
    .nullish(),
  type: z.string().nullish(),
  external_id: z.string().nullish(),
  refId: z.string().nullish(),
  product_id: z.string().nullish(),
  productId: z.string().nullish(),
  product: z.unknown().nullish(),
  amount: z.unknown().optional(),
  total_amount: z.unknown().optional(),
  payment_amount: z.unknown().optional(),
  total: z.unknown().optional(),
  price: z.unknown().optional(),
  order_id: z.string().nullish(),
  payment_id: z.string().nullish(),
  transaction_id: z.string().nullish(),
  purchase_id: z.string().nullish(),
  status: z.string().nullish(),
  id: z.string().nullish(),
  event_id: z.string().nullish(),
}).strip().strict();

const safeTimingEqual = (a: string, b: string): boolean => {
  try {
    const aBuf = Buffer.from(a, 'utf8');
    const bBuf = Buffer.from(b, 'utf8');
    const derivedA = scryptSync(aBuf, 'cakto-wh-salt', 32);
    const derivedB = scryptSync(bBuf, 'cakto-wh-salt', 32);
    return timingSafeEqual(derivedA, derivedB);
  } catch {
    return false;
  }
};

const hashPayloadForIdempotency = (rawBody: unknown, externalId: string): string => {
  const serialized = JSON.stringify({ body: rawBody, externalId });
  return createHash('sha256').update(serialized).digest('hex');
};

const isTruthyNonEmpty = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;

const getNestedValue = (value: unknown, key: string): unknown => {
  if (typeof value !== 'object' || value === null) return undefined;
  return (value as Record<string, unknown>)[key];
};

const resolveProductId = (parsed: z.infer<typeof CaktoWebhookPayloadSchema>): string | null => {
  const product = getNestedValue(parsed.data, 'product');
  const candidates = [
    parsed.product_id,
    parsed.productId,
    getNestedValue(parsed.product, 'id'),
    getNestedValue(parsed.product, 'product_id'),
    getNestedValue(parsed.data, 'product_id'),
    getNestedValue(parsed.data, 'productId'),
    getNestedValue(product, 'id'),
    getNestedValue(product, 'product_id'),
    getNestedValue(parsed.fields, 'product_id'),
    getNestedValue(getNestedValue(parsed.fields, 'product'), 'id'),
  ];
  const productId = candidates.find(isTruthyNonEmpty);
  return typeof productId === 'string' ? productId.trim() : null;
};

const resolveIncomingSecret = (parsed: z.infer<typeof CaktoWebhookPayloadSchema>): string | null => {
  const candidates = [
    parsed.secret,
    parsed.data?.secret,
    parsed.fields?.secret,
    (parsed.data as any)?.fields?.secret,
  ];
  for (const c of candidates) {
    if (isTruthyNonEmpty(c)) return c;
  }
  return null;
};

const resolveExternalId = (parsed: z.infer<typeof CaktoWebhookPayloadSchema>): string | null => {
  const candidates = [
    parsed.data?.external_id,
    parsed.external_id,
    parsed.data?.refId,
    parsed.refId,
  ];
  for (const c of candidates) {
    if (isTruthyNonEmpty(c)) return c;
  }
  return null;
};

const resolveEventKey = (parsed: z.infer<typeof CaktoWebhookPayloadSchema>): string | null => {
  const candidates = [
    parsed.event_id,
    parsed.data?.event_id,
    parsed.id,
    parsed.data?.id,
    parsed.data?.order_id,
  ];
  for (const c of candidates) {
    if (isTruthyNonEmpty(c)) return c;
  }
  return null;
};

const resolveStatus = (parsed: z.infer<typeof CaktoWebhookPayloadSchema>): string | null => {
  const candidates = [parsed.data?.status, parsed.status];
  for (const c of candidates) {
    if (isTruthyNonEmpty(c)) return c;
  }
  return null;
};

const resolveEventType = (parsed: z.infer<typeof CaktoWebhookPayloadSchema>): string | null => {
  if (typeof parsed.event === 'string') return parsed.event;
  if (parsed.event && typeof parsed.event === 'object' && typeof parsed.event.custom_id === 'string') {
    return parsed.event.custom_id;
  }
  if (isTruthyNonEmpty(parsed.type)) return parsed.type;
  return null;
};

const resolvePaymentReference = (parsed: z.infer<typeof CaktoWebhookPayloadSchema>) => {
  const data = parsed.data;
  const candidates = [
    getNestedValue(data, 'order_id'),
    getNestedValue(data, 'payment_id'),
    getNestedValue(data, 'transaction_id'),
    getNestedValue(data, 'purchase_id'),
    parsed.order_id,
    parsed.payment_id,
    parsed.transaction_id,
    parsed.purchase_id,
    getNestedValue(data, 'id'),
    parsed.id,
  ];
  const reference = candidates.find(isTruthyNonEmpty);
  return typeof reference === 'string' ? reference.trim().slice(0, 200) : null;
};

const parseMoneyAmount = (value: unknown): number | null => {
  const directValue = typeof value === 'object' && value !== null
    ? getNestedValue(value, 'value') ?? getNestedValue(value, 'amount')
    : value;
  if (typeof directValue !== 'string' && typeof directValue !== 'number') return null;
  let normalized: string | number = directValue;
  if (typeof directValue === 'string') {
    normalized = directValue.trim().replace(/^R\$\s*/i, '').replace(/\s/g, '');
    if (normalized.includes(',') && normalized.includes('.')) {
      normalized = normalized.lastIndexOf(',') > normalized.lastIndexOf('.')
        ? normalized.replace(/\./g, '').replace(',', '.')
        : normalized.replace(/,/g, '');
    } else {
      normalized = normalized.replace(',', '.');
    }
  }
  const amount = Number(normalized);
  return Number.isFinite(amount) && amount > 0 && amount <= 1_000_000
    ? Math.round(amount * 100) / 100
    : null;
};

const resolvePaymentAmount = (parsed: z.infer<typeof CaktoWebhookPayloadSchema>) => {
  const data = parsed.data;
  const fields = parsed.fields;
  const candidates = [
    getNestedValue(data, 'amount'),
    getNestedValue(data, 'total_amount'),
    getNestedValue(data, 'payment_amount'),
    getNestedValue(data, 'total'),
    getNestedValue(data, 'price'),
    getNestedValue(fields, 'amount'),
    getNestedValue(fields, 'total_amount'),
    getNestedValue(fields, 'payment_amount'),
    getNestedValue(fields, 'total'),
    getNestedValue(fields, 'price'),
    parsed.amount,
    parsed.total_amount,
    parsed.payment_amount,
    parsed.total,
    parsed.price,
  ];
  for (const candidate of candidates) {
    const amount = parseMoneyAmount(candidate);
    if (amount !== null) return amount;
  }
  return null;
};

router.get('/status', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'unauthorized', message: 'Usuário não identificado' });
    }

    const { data: usuario, error } = await supabaseAdmin
      .from('usuarios')
      .select('paid_access')
      .eq('id', userId)
      .single();

    if (error || !usuario) {
      console.error('Erro ao buscar status de pagamento:', error);
      return res.status(500).json({ error: 'internal_error', message: 'Erro ao consultar banco de dados' });
    }

    return res.json({ paid_access: !!usuario.paid_access });
  } catch (error) {
    console.error('Erro na rota /status:', error);
    return res.status(500).json({ error: 'internal_error' });
  }
});

router.post('/checkout', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'unauthorized', message: 'Usuário não identificado' });
    }

    const { data: usuario, error: fetchError } = await supabaseAdmin
      .from('usuarios')
      .select('paid_access')
      .eq('id', userId)
      .single();

    if (fetchError || !usuario) {
      console.error('Erro ao buscar usuário:', fetchError);
      return res.status(500).json({ error: 'internal_error', message: 'Erro ao consultar banco de dados' });
    }

    if (usuario.paid_access) {
      return res.json({ alreadyPaid: true });
    }

    if (!CAKTO_PRODUCT_URL) {
      return res.status(500).json({ error: 'config_error', message: 'URL do produto Cakto não configurada' });
    }

    const redirectUrl = encodeURIComponent(`${FRONTEND_URL}/payment/success`);
    const checkoutUrl = `${CAKTO_PRODUCT_URL}?external_id=${userId}&redirect_url=${redirectUrl}`;

    return res.json({ checkoutUrl });
  } catch (error) {
    console.error('Erro na rota /checkout:', error);
    return res.status(500).json({ error: 'internal_error', message: 'Erro ao processar checkout' });
  }
});

router.post('/webhook', async (req: Request, res: Response) => {
  const rawBody = req.body;

  if (!CAKTO_WEBHOOK_SECRET_RAW) {
    console.error('[Webhook] ERRO FATAL: CAKTO_WEBHOOK_SECRET não está configurada no ambiente. Webhook recusado.');
    return res.status(500).json({
      error: 'webhook_config_error',
      message: 'Webhook payment secret not configured',
    });
  }

  const parseResult = CaktoWebhookPayloadSchema.safeParse(rawBody);
  if (!parseResult.success) {
    console.warn('[Webhook] Payload com formato inválido (Zod schema rejeitou).');
    return res.status(400).json({
      error: 'invalid_payload',
      message: 'Formato de payload inválido',
    });
  }
  const parsed = parseResult.data;

  const incomingSecret = resolveIncomingSecret(parsed);
  if (!incomingSecret) {
    console.warn('[Webhook] Nenhum secret encontrado no payload.');
    return res.status(401).json({
      error: 'unauthorized',
      message: 'Missing webhook secret',
    });
  }

  const secretsMatch = safeTimingEqual(CAKTO_WEBHOOK_SECRET_RAW, incomingSecret);
  if (!secretsMatch) {
    console.warn('[Webhook] Secret recebido não corresponde ao configurado.');
    return res.status(401).json({
      error: 'unauthorized',
      message: 'Unauthorized webhook',
    });
  }

  const externalId = resolveExternalId(parsed);
  if (!externalId) {
    console.warn('[Webhook] Payload autenticado, porém sem externalId. Ignorando sem side effects.');
    return res.status(200).json({
      received: true,
      processed: false,
      reason: 'missing_external_id',
    });
  }

  if (!UUID_REGEX.test(externalId)) {
    console.warn('[Webhook] externalId não é um UUID válido.');
    return res.status(400).json({
      error: 'invalid_external_id',
      message: 'externalId must be a UUID',
    });
  }

  const status = resolveStatus(parsed);
  const eventType = resolveEventType(parsed);
  const normalizedStatus = status?.trim().toLowerCase() ?? '';
  const normalizedEventType = eventType?.trim().toLowerCase() ?? '';
  const isApproved =
    APPROVED_STATUS_SET.has(normalizedStatus) ||
    APPROVED_EVENT_SET.has(normalizedEventType);
  const isCancelled =
    CANCELLED_STATUS_SET.has(normalizedStatus) ||
    /refund|chargeback|cancel/.test(normalizedEventType);

  if (isCancelled) {
    const paymentReference = resolvePaymentReference(parsed);
    const subscriptionCancellation =
      /subscription.*cancel|cancel.*subscription/.test(normalizedEventType);
    if (!paymentReference) {
      if (!subscriptionCancellation) {
        console.warn('[Webhook] Estorno/cancelamento sem referência do pagamento; nenhuma comissão foi alterada.');
        return res.status(200).json({
          received: true,
          processed: false,
          reason: 'missing_payment_reference',
        });
      }
      console.info('[Webhook] Cancelamento de assinatura sem ID de cobrança; comissões pendentes do indicado serão canceladas.');
    }

    try {
      const authUserRes = await supabaseAdmin.auth.admin.getUserById(externalId);
      if (authUserRes.error || !authUserRes.data.user) {
        return res.status(400).json({ error: 'user_not_found', message: 'Usuário identificado pelo externalId não existe.' });
      }

      const { data: cancelledCount, error } = await supabaseAffiliateAdmin.rpc('cancel_referral_commission', {
        p_referred_user_id: externalId,
        p_payment_reference: paymentReference,
      });
      if (error) throw error;
      if (cancelledCount === 0) {
        console.info(
          paymentReference
            ? `[Webhook] Nenhuma comissão pendente ou paga corresponde ao pagamento ${paymentReference.slice(0, 32)}…`
            : '[Webhook] Nenhuma comissão pendente para cancelar por encerramento da assinatura.'
        );
      }
      return res.status(200).json({
        received: true,
        processed: true,
        cancelledCommissions: cancelledCount,
      });
    } catch (error) {
      console.error('[Webhook] Falha ao cancelar comissão por estorno/cancelamento:', error);
      return res.status(500).json({
        error: 'referral_commission_cancellation_error',
        message: 'Não foi possível atualizar a comissão vinculada ao pagamento.',
      });
    }
  }

  if (!isApproved) {
    const statusForLog = status === null ? 'undefined' : String(status).slice(0, 64);
    const eventForLog = eventType === null ? 'undefined' : String(eventType).slice(0, 64);
    console.log(`[Webhook] Evento de pagamento não aprovado para usuário. status=${statusForLog} event=${eventForLog}`);
    return res.status(200).json({
      received: true,
      processed: true,
      alreadyProcessed: false,
      approved: false,
    });
  }

  const eventKey = resolveEventKey(parsed);
  let idempotencyKey: string;
  if (eventKey) {
    idempotencyKey = `cakto:event:${eventKey}`;
  } else {
    idempotencyKey = `cakto:hash:${hashPayloadForIdempotency(rawBody, externalId)}`;
  }

  let usuarioExists = false;
  let usuario: {
    paid_access: boolean | null;
    subscription_status: string | null;
    cakto_product_id: string | null;
  } | null = null;
  try {
    const authUserRes = await supabaseAdmin.auth.admin.getUserById(externalId);
    if (authUserRes.error || !authUserRes.data.user) {
      console.warn(`[Webhook] externalId não corresponde a nenhum usuário auth existente.`);
      return res.status(400).json({
        error: 'user_not_found',
        message: 'Usuário identificado pelo externalId não existe',
      });
    }

    const usuarioRes = await supabaseAdmin
      .from('usuarios')
      .select('paid_access, subscription_status, cakto_product_id')
      .eq('id', externalId)
      .maybeSingle();

    if (usuarioRes.error) {
      throw usuarioRes.error;
    }

    if (!usuarioRes.data) {
      console.warn(`[Webhook] Usuário existe em auth, mas não há linha na tabela usuarios. Perfil ausente.`);
      return res.status(400).json({
        error: 'profile_not_found',
        message: 'Perfil do usuário não encontrado',
      });
    }
    usuario = usuarioRes.data;
    usuarioExists = true;
  } catch (dbErr: any) {
    console.error('[Webhook] Erro ao consultar usuário/perfil:', dbErr?.message || dbErr);
    return res.status(500).json({
      error: 'internal_error',
      message: 'Erro ao consultar dados do usuário',
    });
  }

  if (!usuarioExists || !usuario) {
    return res.status(400).json({
      error: 'user_not_found',
      message: 'Usuário identificado pelo externalId não existe',
    });
  }

  const productId = resolveProductId(parsed);
  const plan = getAdminPlan(productId);
  const paymentReference = resolvePaymentReference(parsed);
  const paymentAmount = resolvePaymentAmount(parsed);
  let referralCommissionFailed = false;

  if (paymentReference && paymentAmount !== null) {
    const { error: commissionError } = await supabaseAffiliateAdmin.rpc('record_referral_commission', {
      p_referred_user_id: externalId,
      p_payment_reference: paymentReference,
      p_payment_amount: paymentAmount,
    });
    if (commissionError) {
      console.error('[Webhook] Falha ao registrar comissão de indicação:', commissionError);
      referralCommissionFailed = true;
    }
  } else {
    console.warn('[Webhook] Pagamento aprovado sem valor/referência identificável; comissão não registrada.');
  }

  if (usuario.paid_access === true) {
    if (productId && !usuario.cakto_product_id) {
      const { error: planUpdateError } = await supabaseAdmin
        .from('usuarios')
        .update({
          cakto_product_id: productId,
          ...(plan ? { plan_type: plan.name === 'Anual' ? 'vitalicio' : 'mensal' } : {}),
        })
        .eq('id', externalId)
        .is('cakto_product_id', null);

      if (planUpdateError) {
        console.error('[Webhook] Erro ao associar plano à assinatura existente:', planUpdateError);
        return res.status(500).json({
          error: 'database_error',
          message: 'Erro ao atualizar o plano da assinatura',
        });
      }
    }
    if (referralCommissionFailed) {
      return res.status(500).json({
        error: 'referral_commission_error',
        message: 'O acesso foi preservado, mas a comissão não foi registrada; o provedor deve reenviar o webhook.',
      });
    }
    console.log(`[Webhook] Usuário já possui paid_access=true. Evento ${idempotencyKey.slice(0, 32)}… tratado como idempotente.`);
    return res.status(200).json({
      received: true,
      processed: true,
      alreadyProcessed: true,
      idempotency: idempotencyKey.slice(0, 16),
    });
  }

  const now = new Date().toISOString();
  const eventTypeStored = eventType ?? 'purchase_approved';
  const statusStored = status ?? 'paid';
  const { error: updateError } = await supabaseAdmin
    .from('usuarios')
    .update({
      paid_access: true,
      paid_at: now,
      subscription_status: 'active',
      payment_provider: 'cakto',
      ...(productId ? { cakto_product_id: productId } : {}),
      ...(plan ? { plan_type: plan.name === 'Anual' ? 'vitalicio' : 'mensal' } : {}),
      cakto_last_event: eventTypeStored,
      cakto_last_status: statusStored,
      subscription_updated_at: now,
    })
    .eq('id', externalId)
    .eq('paid_access', false);

  if (updateError) {
    console.error('[Webhook] Erro ao persistir paid_access no banco:', updateError);
    return res.status(500).json({
      error: 'database_error',
      message: 'Erro ao atualizar dados de assinatura',
    });
  }

  try {
    await supabaseAdmin.auth.admin.updateUserById(externalId, {
      user_metadata: {
        paid_access: true,
        subscription_status: 'active',
        payment_provider: 'cakto',
      },
      app_metadata: {
        paid_access: true,
        subscription_status: 'active',
        payment_provider: 'cakto',
      },
    });
  } catch (metaErr: any) {
    console.warn('[Webhook] Não foi possível atualizar metadata do auth.user (não bloqueante):', metaErr?.message || metaErr);
  }

  if (referralCommissionFailed) {
    return res.status(500).json({
      error: 'referral_commission_error',
      message: 'O acesso foi preservado, mas a comissão não foi registrada; o provedor deve reenviar o webhook.',
    });
  }

  console.log(`[Webhook] Pagamento aprovado. paid_access=true concedido via evento ${idempotencyKey.slice(0, 24)}…`);
  return res.status(200).json({
    received: true,
    processed: true,
    alreadyProcessed: false,
    approved: true,
  });
});

export default router;
