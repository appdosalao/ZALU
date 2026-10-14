export const ADMIN_EMAIL = 'resellr7@gmail.com';

export const isAdminEmail = (email: string | null | undefined) =>
  email?.trim().toLowerCase() === ADMIN_EMAIL;
