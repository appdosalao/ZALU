import * as z from 'zod';

// ---------------------------------------------------------------------------
// Política de senha forte
// ---------------------------------------------------------------------------

export const PASSWORD_POLICY = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecial: true,
} as const;

export interface PasswordRule {
  key: keyof typeof PASSWORD_POLICY | 'length';
  label: string;
  test: (value: string) => boolean;
}

export const PASSWORD_RULES: PasswordRule[] = [
  {
    key: 'length',
    label: `Mínimo de ${PASSWORD_POLICY.minLength} caracteres`,
    test: (v) => v.length >= PASSWORD_POLICY.minLength,
  },
  {
    key: 'requireUppercase',
    label: 'Pelo menos 1 letra maiúscula',
    test: (v) => /[A-Z]/.test(v),
  },
  {
    key: 'requireLowercase',
    label: 'Pelo menos 1 letra minúscula',
    test: (v) => /[a-z]/.test(v),
  },
  {
    key: 'requireNumber',
    label: 'Pelo menos 1 número',
    test: (v) => /[0-9]/.test(v),
  },
  {
    key: 'requireSpecial',
    label: 'Pelo menos 1 símbolo (ex.: !@#$%)',
    test: (v) => /[^A-Za-z0-9\s]/.test(v),
  },
];

export const isStrongPassword = (value: string): boolean =>
  PASSWORD_RULES.every((rule) => rule.test(value));

export const missingPasswordRules = (value: string): PasswordRule[] =>
  PASSWORD_RULES.filter((rule) => !rule.test(value));

export const passwordStrength = (value: string): { score: number; label: string } => {
  if (!value) return { score: 0, label: 'Vazia' };
  let score = 0;
  if (value.length >= PASSWORD_POLICY.minLength) score += 25;
  if (/[a-z]/.test(value)) score += 15;
  if (/[A-Z]/.test(value)) score += 20;
  if (/[0-9]/.test(value)) score += 20;
  if (/[^A-Za-z0-9]/.test(value)) score += 20;
  if (value.length >= 12) score += 10;
  score = Math.min(100, score);

  const label = score >= 80 ? 'Forte' : score >= 50 ? 'Boa' : score >= 25 ? 'Fraca' : 'Muito fraca';
  return { score, label };
};

/**
 * Schema de senha forte (validação reutilizável com Zod) para ser usado
 * por `.superRefine` ou mesclado em schemas de formulário.
 */
export function strongPasswordSchema(): z.ZodString {
  return z
    .string()
    .min(1, 'Senha é obrigatória')
    .superRefine((value, ctx) => {
      for (const rule of PASSWORD_RULES) {
        if (!rule.test(value)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: rule.label,
          });
          break;
        }
      }
    });
}

export function passwordMatchSchema<T extends { senha: string; confirmar_senha: string }>() {
  return z
    .object({
      senha: strongPasswordSchema(),
      confirmar_senha: z.string().min(1, 'Confirmação de senha é obrigatória'),
    })
    .refine((data: T) => data.senha === data.confirmar_senha, {
      message: 'As senhas não coincidem',
      path: ['confirmar_senha'],
    }) as unknown as z.ZodType<T>;
}

// ---------------------------------------------------------------------------
// Limite de tentativas de login (anti brute-force)
// Implementa bloqueio temporário com backoff exponencial, persistido no dispositivo.
// O backend Supabase já tem rate limit próprio; esta camada protege a camada de UI.
// ---------------------------------------------------------------------------

const ATTEMPT_KEY_PREFIX = 'zalu.login-attempts.v1.';
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutos
const BASE_LOCK_MS = 60 * 1000; // 1 minuto base
const MAX_LOCK_MS = 30 * 60 * 1000; // 30 minutos (teto)

interface AttemptState {
  failures: number;
  firstFailureAt: number;
  lockedUntil: number | null;
}

const normalizeEmail = (email: string): string => email.trim().toLowerCase();

const readState = (email: string): AttemptState => {
  try {
    const raw = window.localStorage.getItem(ATTEMPT_KEY_PREFIX + normalizeEmail(email));
    if (!raw) return { failures: 0, firstFailureAt: 0, lockedUntil: null };
    const parsed = JSON.parse(raw) as AttemptState;
    // Se a janela expirou, reinit
    if (parsed.firstFailureAt && Date.now() - parsed.firstFailureAt > WINDOW_MS) {
      return { failures: 0, firstFailureAt: 0, lockedUntil: null };
    }
    return parsed;
  } catch {
    return { failures: 0, firstFailureAt: 0, lockedUntil: null };
  }
};

const writeState = (email: string, state: AttemptState): void => {
  try {
    if (state.failures === 0) {
      window.localStorage.removeItem(ATTEMPT_KEY_PREFIX + normalizeEmail(email));
      return;
    }
    window.localStorage.setItem(ATTEMPT_KEY_PREFIX + normalizeEmail(email), JSON.stringify(state));
  } catch {
    // localStorage indisponível — segue sem persistir
  }
};

/** Retorna quantos ms restam de bloqueio para o e-mail (0 se liberado). */
export const getLoginLockRemainingMs = (email: string): number => {
  const state = readState(email);
  if (!state.lockedUntil) return 0;
  const remaining = state.lockedUntil - Date.now();
  return Math.max(0, remaining);
};

/** Quantas tentativas falhas ainda são permitidas antes do bloqueio (na janela atual). */
export const getRemainingLoginAttempts = (email: string): number => {
  const state = readState(email);
  if (state.lockedUntil && state.lockedUntil > Date.now()) return 0;
  return Math.max(0, MAX_ATTEMPTS - state.failures);
};

/** Registra uma tentativa falha e retorna o tempo de bloqueio resultante (ms). */
export const recordLoginFailure = (email: string): number => {
  const key = normalizeEmail(email);
  const state = readState(key);
  const now = Date.now();
  const firstFailureAt = state.firstFailureAt === 0 ? now : state.firstFailureAt;

  // Se já estava bloqueado, mantém/estende levemente para impedir "contagem no vazio"
  if (state.lockedUntil && state.lockedUntil > now) {
    return state.lockedUntil - now;
  }

  const failures = state.failures + 1;
  let lockedUntil: number | null = null;
  if (failures >= MAX_ATTEMPTS) {
    const excess = failures - MAX_ATTEMPTS;
    const lockMs = Math.min(BASE_LOCK_MS * Math.pow(2, excess), MAX_LOCK_MS);
    lockedUntil = now + lockMs;
  }

  writeState(key, { failures, firstFailureAt, lockedUntil });
  return lockedUntil ? lockedUntil - now : 0;
};

/** Limpa o registro após um login bem-sucedido. */
export const recordLoginSuccess = (email: string): void => {
  writeState(email, { failures: 0, firstFailureAt: 0, lockedUntil: null });
};

export const formatLockCountdown = (ms: number): string => {
  const totalSeconds = Math.max(1, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes > 0 ? `${minutes}min ` : ''}${seconds}s`;
};

/** Formata o limite de tentativas exibido na UI. */
export const MAX_LOGIN_ATTEMPTS = MAX_ATTEMPTS;