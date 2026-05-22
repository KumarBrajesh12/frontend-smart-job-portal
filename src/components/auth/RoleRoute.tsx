'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, type ReactNode } from 'react';
import useAuth from '@/hooks/useAuth';
import type { UserRole } from '@/types/auth';

interface RoleRouteProps {
  role: UserRole | UserRole[];
  children: ReactNode;
  fallbackPath?: string;
}

export default function RoleRoute({
  role,
  children,
  fallbackPath = '/',
}: RoleRouteProps) {
  const { user, isAuthenticated, isReady, loading } = useAuth();
  const router = useRouter();
  const allowedRoles = useMemo(
    () => (Array.isArray(role) ? role : [role]),
    [role],
  );

  useEffect(() => {
    if (!isReady || loading) return;

    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    if (user && !allowedRoles.includes(user.role)) {
      router.replace(fallbackPath);
    }
  }, [
    isReady,
    loading,
    isAuthenticated,
    user,
    router,
    fallbackPath,
    allowedRoles,
  ]);

  if (!isReady || loading) {
    return (
      <div className="auth-loading">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user || !allowedRoles.includes(user.role)) {
    return null;
  }

  return children;
}
