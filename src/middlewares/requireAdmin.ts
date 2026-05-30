import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '@/middlewares/authenticate';

const parseCsv = (value: string | undefined) => {
  return (value || '')
    .split(',')
    .map((v) => v.trim().toLowerCase())
    .filter(Boolean);
};

export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const adminUserId = (process.env.ADMIN_USER_ID || '').trim();
  const adminEmails = parseCsv(process.env.ADMIN_EMAILS);

  if (!adminUserId && adminEmails.length === 0) {
    return res.status(403).json({ error: 'admin_not_configured' });
  }

  const userId = req.user?.id || '';
  const email = (req.user?.email || '').trim().toLowerCase();

  const allowed =
    (adminUserId && userId === adminUserId) ||
    (adminEmails.length > 0 && !!email && adminEmails.includes(email));

  if (!allowed) {
    console.warn(
      JSON.stringify({
        type: 'admin_denied',
        path: req.originalUrl,
        ip: req.ip,
        ua: req.headers['user-agent'],
        ts: new Date().toISOString(),
        userId: userId || null,
        email: email || null,
      })
    );
    return res.status(403).json({ error: 'forbidden' });
  }

  next();
};

