'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import api from '@/services/api';

type VerifyStatus = 'loading' | 'success' | 'error';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams?.get('token') ?? null;
  const [status, setStatus] = useState<VerifyStatus>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage(
        'Verification token is missing. Check the link in your email.',
      );
      return;
    }

    const verify = async () => {
      try {
        const { data } = await api.get<{ success: boolean; message: string }>(
          `/api/auth/verify-email/${encodeURIComponent(token)}`,
        );
        setStatus('success');
        setMessage(data.message);
      } catch (error) {
        setStatus('error');
        const err = error as { response?: { data?: { message?: string } } };
        setMessage(
          err.response?.data?.message ??
            'Verification failed. The link may be invalid or expired.',
        );
      }
    };

    void verify();
  }, [token]);

  return (
    <section className="auth-card">
      <h1>Email verification</h1>
      {status === 'loading' && (
        <p className="auth-card__subtitle">Verifying your email...</p>
      )}
      {status === 'success' && (
        <>
          <p className="form-success">{message}</p>
          <p className="auth-card__footer">
            <Link href="/login">Go to login</Link>
          </p>
        </>
      )}
      {status === 'error' && (
        <>
          <p className="form-error form-error--global">{message}</p>
          <p className="auth-card__footer">
            <Link href="/register">Register again</Link> or{' '}
            <Link href="/login">Sign in</Link>
          </p>
        </>
      )}
    </section>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <section className="auth-card">
          <h1>Email verification</h1>
          <p className="auth-card__subtitle">Loading...</p>
        </section>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
