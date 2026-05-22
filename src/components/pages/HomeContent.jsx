'use client';

import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function HomeContent() {
  const [health, setHealth] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const { data } = await api.get('/health');
        setHealth(data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            'Unable to reach the API',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHealth();
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
