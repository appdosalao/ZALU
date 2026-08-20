type LoggedFetchOptions = {
  label: string;
  timeoutMs: number;
};

const CSRF_TOKEN_KEY = 'zalu.csrf-token.v1';

function getOrCreateCsrfToken(): string {
  try {
    if (typeof window === 'undefined' || !window.sessionStorage) {
      return 'anonymous';
    }
    let token = window.sessionStorage.getItem(CSRF_TOKEN_KEY);
    if (!token) {
      const rand =
        (globalThis.crypto?.randomUUID?.() ??
          Math.random().toString(36).slice(2) + Date.now().toString(36) + Math.random().toString(36).slice(2));
      token = rand.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64);
      window.sessionStorage.setItem(CSRF_TOKEN_KEY, token);
    }
    return token;
  } catch {
    return 'anonymous';
  }
}

const shouldDebug = () => {
  try {
    const isDev = Boolean((import.meta as any)?.env?.DEV);
    if (isDev) return true;
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).has('debugSupabase');
  } catch {
    return false;
  }
};

const isUnsafeMethod = (m?: string) => {
  const method = (m || 'GET').toUpperCase();
  return method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE';
};

export function createLoggedFetch({ label, timeoutMs }: LoggedFetchOptions) {
  return async (input: RequestInfo | URL, init?: RequestInit) => {
    const startedAt = performance.now();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const csrfToken = getOrCreateCsrfToken();
      const headers = new Headers((init?.headers as HeadersInit) ?? {});
      headers.set('X-Requested-With', 'XMLHttpRequest');
      headers.set('X-Zalu-Client', 'web');
      if (isUnsafeMethod(init?.method)) {
        headers.set('X-CSRF-Token', csrfToken);
      }
      headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');

      const requestInit: RequestInit = {
        ...init,
        headers,
        signal: init?.signal ?? controller.signal,
        credentials: init?.credentials ?? 'same-origin',
      };

      const res = await fetch(input, requestInit);
      const elapsedMs = Math.round(performance.now() - startedAt);

      if (shouldDebug()) {
        const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : (input as Request).url;
        const path = (() => {
          try {
            const u = new URL(url);
            return `${u.origin}${u.pathname}`;
          } catch {
            return url;
          }
        })();
        console.debug(`[${label}]`, requestInit.method || 'GET', path, res.status, `${elapsedMs}ms`);
      }

      return res;
    } catch (err) {
      const elapsedMs = Math.round(performance.now() - startedAt);
      if (shouldDebug()) console.debug(`[${label}]`, 'ERR', `${elapsedMs}ms`);
      throw err;
    } finally {
      clearTimeout(timeout);
    }
  };
}
