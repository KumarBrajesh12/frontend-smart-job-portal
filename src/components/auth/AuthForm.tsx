'use client';

import type { FormEvent, ReactNode } from 'react';

interface AuthFormProps {
  title: string;
  subtitle?: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
  submitLabel: string;
  loading?: boolean;
  footer?: ReactNode;
}

export default function AuthForm({
  title,
  subtitle,
  onSubmit,
  children,
  submitLabel,
  loading = false,
  footer,
}: AuthFormProps) {
  return (
    <div className="auth-card">
      <h1>{title}</h1>
      {subtitle && <p className="auth-card__subtitle">{subtitle}</p>}
      <form className="auth-form" onSubmit={onSubmit} noValidate>
        {children}
        <button
          type="submit"
          className="btn btn--primary btn--full"
          disabled={loading}
        >
          {loading ? 'Please wait...' : submitLabel}
        </button>
      </form>
      {footer && <div className="auth-card__footer">{footer}</div>}
    </div>
  );
}

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}

export function FormField({ id, label, error, children }: FormFieldProps) {
  return (
    <div className={`form-field ${error ? 'form-field--error' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      {error && <span className="form-field__error">{error}</span>}
    </div>
  );
}
