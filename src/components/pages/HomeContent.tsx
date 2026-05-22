'use client';

import { useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import api from '@/services/api';
import type { HealthResponse } from '@/types/api';

export default function HomeContent() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const { data } = await api.get<HealthResponse>('/health');
        setHealth(data);
      } catch (err) {
        if (isAxiosError(err)) {
          const message =
            (err.response?.data as { message?: string })?.message ??
            err.message;
          setError(message);
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Unable to reach the API');
        }
      } finally {
        setLoading(false);
      }
    };

    void fetchHealth();
  }, []);

  return (
    <section className="hero">
      <h1>Find your next opportunity</h1>
      <p className="hero__subtitle">
        Smart Job Portal connects talented professionals with top employers.
      </p>

      <div className="hero__status">
        <h2>API Status</h2>
        {loading && <p>Checking backend connection...</p>}
        {error && (
          <p className="hero__error">
            Backend unreachable: {error}. Start the API and Docker services.
          </p>
        )}
        {health && (
          <pre className="hero__health">{JSON.stringify(health, null, 2)}</pre>
        )}
      </div>
    </section>
  );
}
