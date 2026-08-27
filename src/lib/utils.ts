import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toISODate(date: Date | string): string {
  if (typeof date === 'string') return date;
  const d = new Date(date);
  // Retornar data no fuso LOCAL, não UTC, para evitar mudança de dia
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function safeToDate(value: any): Date {
  if (value instanceof Date) return value;
  if (typeof value === 'string') {
    const [y, m, d] = value.split('-').map(Number);
    return new Date(y, (m || 1) - 1, d || 1);
  }
  return new Date(value);
}

// Time utilities
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

// Check if two time ranges overlap
export function overlaps(start1: number, end1: number, start2: number, end2: number): boolean {
  return start1 < end2 && start2 < end1;
}

// ----- Identificadores Públicos do Agendamento Online -----
// Extrai o slug/public_id da query string (prioridade s > public_id > salao > slug)
export function getPublicIdFromUrl(): string {
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get('s') || params.get('public_id') || params.get('salao') || params.get('slug') || '';
  } catch {
    return '';
  }
}

// Extrai o owner/user_id direto da query string (prioridade uid > user_id > owner > id)
export function getOwnerUserIdFromUrl(): string {
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get('uid') || params.get('user_id') || params.get('owner') || params.get('id') || '';
  } catch {
    return '';
  }
}

// Resolve ownerUserId a partir de um public_id (slug) via RPC do Supabase.
// Retorna null se não encontrar ou em caso de erro.
export async function resolveOwnerIdFromPublicId(
  db: any,
  publicId: string
): Promise<string | null> {
  if (!publicId || publicId === 'demo') return null;
  try {
    const { data, error } = await db.rpc('get_booking_owner_id', { p_public_id: publicId });
    if (error || !data) return null;
    const resolved = String(data);
    return resolved && resolved !== 'demo' ? resolved : null;
  } catch {
    return null;
  }
}

// Monta o link PÚBLICO de agendamento online a partir da configuração do salão.
// Prioriza sempre o formato ?s=<public_id> (slug) e só usa ?uid= como fallback.
export function buildPublicBookingLink(opts: {
  origin?: string;
  public_id?: string | null;
  user_id?: string | null;
}): string {
  const base = (opts.origin ?? (typeof window !== 'undefined' ? window.location.origin : '')).replace(/\/$/, '');
  const pid = typeof opts.public_id === 'string' ? opts.public_id.trim() : '';
  const uid = typeof opts.user_id === 'string' ? opts.user_id.trim() : '';

  const query = pid
    ? `s=${encodeURIComponent(pid)}`
    : uid
      ? `uid=${encodeURIComponent(uid)}`
      : '';

  return query ? `${base}/agendamento-online?${query}` : `${base}/agendamento-online`;
}
