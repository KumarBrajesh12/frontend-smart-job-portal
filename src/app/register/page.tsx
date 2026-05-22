'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import AuthForm, { FormField } from '@/components/auth/AuthForm';
import { getAuthErrorMessage } from '@/context/AuthContext';
import * as authService from '@/services/authService';
import type { RegisterPayload } from '@/types/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<RegisterPayload['role']>('candidate');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    role?: string;
    form?: string;
  }>({});
  const [success, setSuccess] = useState('');

  const validate = (): boolean => {
    const nextErrors: typeof errors = {};
    if (!name.trim()) nextErrors.name = 'Name is required';
    if (!email.trim()) nextErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(email))
      nextErrors.email = 'Enter a valid email';
    if (!password) nextErrors.password = 'Password is required';
    else if (password.length < 8)
      nextErrors.password = 'Password must be at least 8 characters';
    if (!role) nextErrors.role = 'Please select a role';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});
    setSuccess('');
    if (!validate()) return;

    setLoading(true);
    try {
      const data = await authService.register({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
      });
      setSuccess(data.message);
      setTimeout(() => router.push('/login'), 2000);
    } catch (error) {
      setErrors({ form: getAuthErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm
      title="Create your account"
      subtitle="Join as a candidate or recruiter"
      onSubmit={handleSubmit}
      submitLabel="Sign up"
      loading={loading}
      footer={
        <p>
          Already have an account? <Link href="/login">Sign in</Link>
        </p>
      }
    >
      {success && <p className="form-success">{success}</p>}
      {errors.form && (
        <p className="form-error form-error--global">{errors.form}</p>
      )}
      <FormField id="name" label="Full name" error={errors.name}>
        <input
          id="name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Jane Doe"
        />
      </FormField>
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
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Min. 8 characters"
        />
      </FormField>
      <FormField id="role" label="I am a" error={errors.role}>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value as RegisterPayload['role'])}
        >
          <option value="candidate">Job seeker (Candidate)</option>
          <option value="recruiter">Recruiter / Employer</option>
        </select>
      </FormField>
    </AuthForm>
  );
}
