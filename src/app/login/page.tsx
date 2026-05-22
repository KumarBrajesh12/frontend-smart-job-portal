'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';
import AuthForm, { FormField } from '@/components/auth/AuthForm';
import { getAuthErrorMessage, useAuthContext } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, loading, isAuthenticated, isReady } = useAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    form?: string;
  }>({});

  useEffect(() => {
    if (isReady && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isReady, isAuthenticated, router]);

  const validate = (): boolean => {
    const nextErrors: typeof errors = {};
    if (!email.trim()) nextErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(email))
      nextErrors.email = 'Enter a valid email';
    if (!password) nextErrors.password = 'Password is required';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});
    if (!validate()) return;

    try {
      await login({ email: email.trim(), password });
      router.push('/dashboard');
    } catch (error) {
      setErrors({ form: getAuthErrorMessage(error) });
    }
  };

  return (
    <AuthForm
      title="Welcome back"
      subtitle="Sign in to your Smart Job Portal account"
      onSubmit={handleSubmit}
      submitLabel="Sign in"
      loading={loading}
      footer={
        <p>
          Don&apos;t have an account? <Link href="/register">Create one</Link>
        </p>
      }
    >
      {errors.form && (
        <p className="form-error form-error--global">{errors.form}</p>
      )}
      <FormField id="email" label="Email" error={errors.email}>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
      </FormField>
      <FormField id="password" label="Password" error={errors.password}>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your password"
        />
      </FormField>
    </AuthForm>
  );
}
