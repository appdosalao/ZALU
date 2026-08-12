import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

type PaidAccessCache = {
  isPaid: boolean;
  cachedAt: number;
};

const STORAGE_KEY_PREFIX = 'paid_access_cache_v1';
const CACHE_TTL_MS = 5 * 60 * 1000;

const toHex = (bytes: Uint8Array) => Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');

const getStorageKey = async (userId: string): Promise<string> => {
  const encoder = new TextEncoder();
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(userId));
  return `${STORAGE_KEY_PREFIX}:${toHex(new Uint8Array(digest))}`;
};

const readCache = async (userId: string): Promise<boolean | undefined> => {
  try {
    const storageKey = await getStorageKey(userId);
    const raw = localStorage.getItem(storageKey);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as PaidAccessCache;
    if (!Number.isFinite(parsed.cachedAt)) return undefined;
    if (Date.now() - parsed.cachedAt > CACHE_TTL_MS) return undefined;
    return !!parsed.isPaid;
  } catch {
    return undefined;
  }
};

const writeCache = async (userId: string, value: PaidAccessCache) => {
  try {
    const storageKey = await getStorageKey(userId);
    localStorage.setItem(storageKey, JSON.stringify(value));
  } catch {
  }
};

export const usePaidAccess = () => {
  const { session, usuario } = useSupabaseAuth();

  const userId = session?.user?.id ?? null;

  const paidFromProfile = typeof usuario?.paid_access === 'boolean' ? usuario.paid_access : undefined;

  const query = useQuery({
    queryKey: ['paidAccess', userId],
    enabled: !!userId && paidFromProfile === undefined,
    staleTime: CACHE_TTL_MS,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
    queryFn: async () => {
      if (!userId) return false;

      const cached = await readCache(userId);
      if (typeof cached === 'boolean') return cached;

      const { data, error } = await (supabase
        .from('assinaturas') as any)
        .select('paid_access')
        .eq('usuario_id', userId)
        .maybeSingle();

      if (error) {
        // Fallback to usuarios table for backward compatibility
        const { data: fallbackData, error: fallbackError } = await (supabase
          .from('usuarios') as any)
          .select('paid_access')
          .eq('id', userId)
          .maybeSingle();
        if (fallbackError) return false;
        const isPaid = !!fallbackData?.paid_access;
        await writeCache(userId, { isPaid, cachedAt: Date.now() });
        return isPaid;
      }

      const isPaid = !!data?.paid_access;
      await writeCache(userId, { isPaid, cachedAt: Date.now() });
      return isPaid;
    },
  });

  if (!userId) {
    return { isPaid: false, isLoading: false, refetch: undefined };
  }

  return {
    isPaid: paidFromProfile ?? !!query.data,
    isLoading: paidFromProfile === undefined && !query.data && query.isLoading,
    refetch: query.refetch,
  };
};
