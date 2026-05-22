'use client';

import RoleRoute from '@/components/auth/RoleRoute';
import useAuth from '@/hooks/useAuth';

function CompaniesContent() {
  const { user } = useAuth();

  return (
    <section>
      <h1>Companies</h1>
      <p>
        Recruiter-only area. Signed in as <strong>{user?.name}</strong> (
        {user?.role}).
      </p>
      <p className="hero__subtitle">
        Protected by <code>RoleRoute role=&quot;recruiter&quot;</code>.
      </p>
    </section>
  );
}

export default function CompaniesPage() {
  return (
    <RoleRoute role="recruiter">
      <CompaniesContent />
    </RoleRoute>
  );
}
