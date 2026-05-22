'use client';

import PrivateRoute from '@/components/auth/PrivateRoute';
import useAuth from '@/hooks/useAuth';

function DashboardContent() {
  const { user } = useAuth();

  return (
    <section>
      <h1>Dashboard</h1>
      <p>
        Welcome, <strong>{user?.name}</strong> ({user?.role})
      </p>
      <p className="hero__subtitle">
        This page is protected by <code>PrivateRoute</code>.
      </p>
    </section>
  );
}

export default function DashboardPage() {
  return (
    <PrivateRoute>
      <DashboardContent />
    </PrivateRoute>
  );
}
