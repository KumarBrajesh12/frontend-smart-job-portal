'use client';

import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import useAuth from '@/hooks/useAuth';

interface PrivateRouteProps {
  children: ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { isAuthenticated, isReady, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isReady && !loading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isReady, loading, isAuthenticated, router]);

  if (!isReady || loading) {
    return (
      <div className="auth-loading">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return children;
}
