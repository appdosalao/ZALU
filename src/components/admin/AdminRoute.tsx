import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { isAdminEmail } from '@/config/adminAccess';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

export default function AdminRoute({ children }: { children: ReactNode }) {
  const { usuario, user } = useSupabaseAuth();

  if (!isAdminEmail(user?.email ?? usuario?.email)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
