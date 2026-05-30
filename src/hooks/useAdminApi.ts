import { supabase } from '@/integrations/supabase/client';

type AdminOverview = {
  totalAccounts: number;
  activeAccounts30d: number;
  inactiveAccounts30d: number;
  payingUsers: number;
  trialStarted: number;
  churnAfterTrial: number;
  planPrice: number | null;
  estimatedMrr: number | null;
  estimatedCumulativeRevenue: number | null;
  cutoff30d: string;
};

type AdminUserProfile = {
  id: string;
  nome_completo: string;
  nome_personalizado_app: string;
  telefone: string;
  plan_type: string | null;
  subscription_status: string | null;
  trial_start_date: string | null;
  paid_access: boolean;
  paid_at: string | null;
  subscription_updated_at: string | null;
  cakto_last_status: string | null;
};

type AdminUserRow = {
  id: string;
  email: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  inactive30d: boolean;
  profile: AdminUserProfile | null;
};

type AdminUsersResponse = {
  page: number;
  perPage: number;
  users: AdminUserRow[];
};

type AdminAuditLogRow = {
  id: string;
  created_at: string;
  actor_user_id: string | null;
  actor_email: string | null;
  action: string;
  metadata: unknown;
  ip: string | null;
  user_agent: string | null;
};

type AdminAuditLogsResponse = {
  page: number;
  perPage: number;
  logs: AdminAuditLogRow[];
};

const getToken = async () => {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token || null;
};

const request = async <T,>(path: string, init?: RequestInit): Promise<T> => {
  const token = await getToken();
  if (!token) {
    throw new Error('not_authenticated');
  }

  const res = await fetch(`/api/admin${path}`, {
    ...init,
    headers: {
      ...(init?.headers || {}),
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `request_failed_${res.status}`);
  }

  return (await res.json()) as T;
};

export const adminApi = {
  overview: () => request<AdminOverview>('/overview'),
  users: (page: number, perPage: number) => request<AdminUsersResponse>(`/users?page=${page}&perPage=${perPage}`),
  usage: (userId: string) => request<Record<string, number>>(`/users/${encodeURIComponent(userId)}/usage`),
  auditLogs: (page: number, perPage: number) => request<AdminAuditLogsResponse>(`/audit-logs?page=${page}&perPage=${perPage}`),
  sendPasswordReset: (userId: string) =>
    request<{ sent: boolean }>(`/users/${encodeURIComponent(userId)}/send-password-reset`, { method: 'POST' }),
};

export type { AdminOverview, AdminUsersResponse, AdminUserRow, AdminAuditLogsResponse, AdminAuditLogRow };

