import { s as supabase } from './index-BxmTkSue.js';

const getToken = async () => {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token || null;
};
const request = async (path, init) => {
  const token = await getToken();
  if (!token) {
    throw new Error("not_authenticated");
  }
  const res = await fetch(`/api/admin${path}`, {
    ...init,
    headers: {
      ...init?.headers || {},
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `request_failed_${res.status}`);
  }
  return await res.json();
};
const adminApi = {
  overview: () => request("/overview"),
  users: (page, perPage) => request(`/users?page=${page}&perPage=${perPage}`),
  usage: (userId) => request(`/users/${encodeURIComponent(userId)}/usage`),
  auditLogs: (page, perPage) => request(`/audit-logs?page=${page}&perPage=${perPage}`),
  sendPasswordReset: (userId) => request(`/users/${encodeURIComponent(userId)}/send-password-reset`, { method: "POST" })
};

export { adminApi as a };
