import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import paymentRoutes from './routes/payment.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.disable('x-powered-by');
app.set('etag', 'strong');

const allowedOrigins = new Set(
  [
    process.env.FRONTEND_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
  ].filter((v): v is string => !!v)
);

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  app.set('trust proxy', 2);
}

app.use((req, res, next) => {
  const path = req.originalUrl || req.url || '';
  res.removeHeader('X-Powered-By');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-DNS-Prefetch-Control', 'off');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), fullscreen=(self), autoplay=()');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');

  if (isProd) {
    res.setHeader(
      'Strict-Transport-Security',
      'max-age=63072000; includeSubDomains; preload'
    );
  }

  const nonce = Buffer.from(crypto.randomUUID?.() ?? (Math.random().toString(36).slice(2) + Date.now().toString(36))).toString('base64');
  res.locals.cspNonce = nonce;

  const csp = [
    `default-src 'self'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
    `object-src 'none'`,
    `img-src 'self' data: https: blob:`,
    `style-src 'self' 'unsafe-inline' https:`,
    `font-src 'self' data: https:`,
    `script-src 'self' https://cdn.jsdelivr.net 'wasm-unsafe-eval' 'unsafe-inline'`,
    `connect-src 'self' https: wss: ws: blob:`,
    `worker-src 'self' blob:`,
    `manifest-src 'self'`,
    `media-src 'self' data: blob:`,
    `frame-src 'none'`,
    isProd ? `upgrade-insecure-requests` : '',
  ]
    .filter(Boolean)
    .join('; ');

  res.setHeader('Content-Security-Policy', csp);

  if (isProd) {
    const proto = (req.headers['x-forwarded-proto'] as string | undefined) || 'http';
    if (proto !== 'https') {
      const host = req.headers.host;
      if (host) {
        return res.redirect(301, `https://${host}${path}`);
      }
    }
  }

  const authHeader = req.headers['authorization'] || '';
  const suspicious =
    req.method !== 'GET' &&
    req.method !== 'HEAD' &&
    req.method !== 'OPTIONS' &&
    !authHeader &&
    !path.startsWith('/api/payment/webhook') &&
    !path.startsWith('/health');
  if (suspicious) {
    const origin = req.headers['origin'];
    const referer = req.headers['referer'];
    const host = req.headers['host'];
    const hasOriginOrReferer =
      (origin && (allowedOrigins.has(origin) || (host && origin.includes(host)))) ||
      (referer && host && referer.includes(host));
    if (allowedOrigins.size > 0 && !hasOriginOrReferer && origin) {
      console.warn(
        JSON.stringify({
          type: 'csrf_orig_mismatch',
          path,
          method: req.method,
          ip: req.ip,
          origin,
          referer: referer ? String(referer).slice(0, 120) : undefined,
          ts: new Date().toISOString(),
        })
      );
    }
  }

  next();
});

app.options('*', (req, res) => {
  const origin = req.headers.origin;
  if (origin && (allowedOrigins.size === 0 || allowedOrigins.has(origin))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With,X-CSRF-Token');
    res.setHeader('Access-Control-Max-Age', '86400');
  }
  res.sendStatus(204);
});

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.size === 0) return callback(null, true);
      if (allowedOrigins.has(origin)) return callback(null, true);
      console.warn(
        JSON.stringify({
          type: 'cors_block',
          origin,
          ts: new Date().toISOString(),
        })
      );
      return callback(new Error('CORS bloqueado'), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Token'],
    maxAge: 86400,
  })
);

app.use(
  helmet({
    contentSecurityPolicy: false,
    strictTransportSecurity: false,
    xFrameOptions: false,
    xContentTypeOptions: false,
    referrerPolicy: false,
    permittedCrossDomainPolicies: { permittedPolicies: 'none' },
    originAgentCluster: true,
    crossOriginResourcePolicy: { policy: 'same-origin' },
    crossOriginOpenerPolicy: { policy: 'same-origin' },
    crossOriginEmbedderPolicy: { policy: 'require-corp' },
  })
);

app.use(express.json({ limit: '200kb', strict: true }));
app.use(express.urlencoded({ extended: false, limit: '100kb' }));

const generalLimiter = rateLimit({
  windowMs: 60_000,
  limit: 120,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  keyGenerator: (req) => (req.ip || 'unknown') + ':' + (req.headers['x-forwarded-for'] || ''),
  handler: (req, res) => {
    console.warn(
      JSON.stringify({
        type: 'rate_limit',
        path: req.originalUrl,
        ip: req.ip,
        ua: req.headers['user-agent'],
        ts: new Date().toISOString(),
      })
    );
    res.status(429).json({ error: 'rate_limited', message: 'Muitas requisições. Tente novamente mais tarde.' });
  },
});

const authSensitiveLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 15,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  keyGenerator: (req) => (req.ip || 'unknown') + ':' + (req.body?.email ? String(req.body.email).toLowerCase().slice(0, 80) : 'no-email'),
  handler: (req, res) => {
    console.warn(
      JSON.stringify({
        type: 'auth_rate_limit',
        path: req.originalUrl,
        ip: req.ip,
        ts: new Date().toISOString(),
      })
    );
    res.status(429).json({ error: 'rate_limited', message: 'Muitas tentativas. Aguarde alguns minutos.' });
  },
});

const webhookLimiter = rateLimit({
  windowMs: 60_000,
  limit: 60,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  keyGenerator: (req) => (req.ip || 'unknown'),
  handler: (req, res) => {
    res.status(429).json({ error: 'rate_limited_webhook' });
  },
});

app.use('/health', generalLimiter);
app.use('/api/payment/webhook', webhookLimiter);
app.use('/api/payment/status', authSensitiveLimiter);
app.use('/api/payment/checkout', authSensitiveLimiter);
app.use(generalLimiter);

app.use('/api/payment', paymentRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Servidor de backend rodando na porta ${PORT}`);
  });
}

export default app;
