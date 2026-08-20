import { useCallback, useEffect, useRef } from 'react';
import { storage, LOCAL_STORAGE_KEYS } from '@/lib/localStorage';

const CSRF_TOKEN_KEY = 'zalu.csrf-token.v1';
const AUDIT_LOG_MAX = 100;

type AuditAction =
  | 'login.success'
  | 'login.failure'
  | 'logout'
  | 'profile.update'
  | 'password.change'
  | 'mfa.enable'
  | 'mfa.disable'
  | 'client.create'
  | 'client.update'
  | 'client.delete'
  | 'schedule.create'
  | 'schedule.update'
  | 'schedule.delete'
  | 'payment.create'
  | 'payment.webhook'
  | 'security.flag'
  | 'data.export';

type AuditEntry = {
  t: number;
  action: AuditAction;
  entity?: string;
  meta?: Record<string, unknown>;
};

export function generateAntiCsrfToken(): string {
  try {
    if (typeof window === 'undefined' || !window.sessionStorage) {
      return 'ssr-anonymous';
    }
    let token = window.sessionStorage.getItem(CSRF_TOKEN_KEY);
    if (!token) {
      const rand =
        (globalThis.crypto?.randomUUID?.() ??
          Math.random().toString(36).slice(2) +
            Date.now().toString(36) +
            Math.random().toString(36).slice(2));
      token = rand.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64);
      window.sessionStorage.setItem(CSRF_TOKEN_KEY, token);
    }
    return token;
  } catch {
    return 'error-anonymous';
  }
}

function rotateAntiCsrfToken(): string {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      window.sessionStorage.removeItem(CSRF_TOKEN_KEY);
    }
  } catch {}
  return generateAntiCsrfToken();
}

export function getCsrfTokenHeaderRecord(): Record<string, string> {
  return {
    'X-Requested-With': 'XMLHttpRequest',
    'X-CSRF-Token': generateAntiCsrfToken(),
    'X-Zalu-Client': 'web',
    'Cache-Control': 'no-store, no-cache, must-revalidate',
  };
}

export function validatePasswordLeak(pwd: string): {
  breached: boolean;
  reason?: string;
} {
  if (!pwd) return { breached: true, reason: 'Senha vazia' };
  const commonTop = [
    '123456', '123456789', 'qwerty', 'password', '12345',
    '12345678', '111111', '1234567', '1234567890', 'senha',
    '123123', 'admin', 'letmein', 'welcome', 'monkey',
    '123321', '654321', 'abc123', 'password1', '000000',
  ];
  const normalized = pwd.toLowerCase().trim();
  if (commonTop.includes(normalized)) {
    return { breached: true, reason: 'Senha muito comum — faça sua lista negra (top-20 HIBP)' };
  }
  if (/^(\d)\1+$/.test(normalized)) {
    return { breached: true, reason: 'Senha com dígitos repetidos' };
  }
  if (/^(.)\1{2,}/.test(normalized)) {
    return { breached: true, reason: 'Padrão sequencial detectado' };
  }
  return { breached: false };
}

export function clearSensitiveStorageOnLogout(): void {
  try {
    if (typeof window === 'undefined') return;
    if (window.sessionStorage) {
      window.sessionStorage.removeItem(CSRF_TOKEN_KEY);
    }
    if (window.localStorage) {
      const keepKeys = new Set<string>([LOCAL_STORAGE_KEYS.APP_THEME]);
      const removeKeys: string[] = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const k = window.localStorage.key(i);
        if (k && !keepKeys.has(k)) removeKeys.push(k);
      }
      removeKeys.forEach((k) => window.localStorage.removeItem(k));
    }
    if (window.indexedDB && 'databases' in indexedDB) {
      try {
        indexedDB.deleteDatabase('zalu-pwa-cache');
      } catch {}
    }
    if (window.caches && typeof window.caches.keys === 'function') {
      window.caches.keys().then((keys) => {
        keys.forEach((k) => {
          try {
            window.caches.delete(k);
          } catch {}
        });
      }).catch(() => {});
    }
  } catch {}
}

export function auditLog(action: AuditAction, entity?: string, meta?: Record<string, unknown>): void {
  try {
    const entry: AuditEntry = {
      t: Date.now(),
      action,
      ...(entity ? { entity } : {}),
      ...(meta ? { meta } : {}),
    };
    const existingRaw = storage.getString(LOCAL_STORAGE_KEYS.AUDIT_LOG);
    const arr: AuditEntry[] = existingRaw ? JSON.parse(existingRaw) : [];
    arr.push(entry);
    const trimmed = arr.slice(-AUDIT_LOG_MAX);
    storage.setString(LOCAL_STORAGE_KEYS.AUDIT_LOG, JSON.stringify(trimmed));
    try {
      console.info(`[security:audit] ${action}`, entity ?? '');
    } catch {}
  } catch {}
}

export function useSecurity() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    generateAntiCsrfToken();
    try {
      if (typeof window !== 'undefined' && window.fetch && !(window as any).__zaluFetchPatched) {
        const original = window.fetch.bind(window);
        window.fetch = function patchedFetch(input: RequestInfo | URL, init?: RequestInit) {
          const url = typeof input === 'string'
            ? input
            : input instanceof URL
              ? input.toString()
              : (input as Request).url;
          const isExternal = /^https?:\/\//.test(url) && !url.startsWith(window.location.origin) && !url.includes('supabase');
          const method = (init?.method || (typeof input !== 'string' && 'method' in input ? (input as Request).method : 'GET') || 'GET').toUpperCase();
          if (!isExternal && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
            const headers = new Headers(init?.headers || {});
            const csrf = generateAntiCsrfToken();
            if (!headers.has('X-Requested-With')) headers.set('X-Requested-With', 'XMLHttpRequest');
            if (!headers.has('X-CSRF-Token')) headers.set('X-CSRF-Token', csrf);
            if (!headers.has('X-Zalu-Client')) headers.set('X-Zalu-Client', 'web');
            if (!headers.has('Cache-Control')) headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
            return original(input, { ...init, headers });
          }
          return original(input, init);
        };
        (window as any).__zaluFetchPatched = true;
      }
    } catch {}
    return () => {};
  }, []);

  const rotateToken = useCallback(() => rotateAntiCsrfToken(), []);
  const flagSuspicious = useCallback(
    (reason: string, ctx?: Record<string, unknown>) => {
      auditLog('security.flag', undefined, { reason, ...(ctx ? { ctx } : {}) });
    },
    []
  );
  const secureLogout = useCallback(() => {
    auditLog('logout', undefined, { origem: 'useSecurity.secureLogout' });
    clearSensitiveStorageOnLogout();
    rotateAntiCsrfToken();
  }, []);

  return {
    generateAntiCsrfToken,
    rotateAntiCsrfToken: rotateToken,
    validatePasswordLeak,
    auditLog,
    clearSensitiveStorageOnLogout: secureLogout,
    flagSuspicious,
    getCsrfTokenHeaderRecord,
  };
}
