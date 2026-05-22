'use client';

import Link from 'next/link';
import useAuth from '../../hooks/useAuth';
import { APP_NAME } from '../../utils/constants';

export default function Navbar() {
  const { isAuthenticated, logout, isReady } = useAuth();

  return (
    <header className="navbar">
      <nav className="navbar__inner">
        <Link href="/" className="navbar__brand">
          {APP_NAME}
        </Link>

        <ul className="navbar__links">
          <li>
            <Link href="/jobs">Jobs</Link>
          </li>
          <li>
            <Link href="/companies">Companies</Link>
          </li>
        </ul>

        <div className="navbar__actions">
          {!isReady ? (
            <span className="navbar__placeholder" />
          ) : isAuthenticated ? (
            <button type="button" className="btn btn--ghost" onClick={logout}>
              Logout
            </button>
          ) : (
            <>
              <Link href="/login" className="btn btn--ghost">
                Login
              </Link>
              <Link href="/register" className="btn btn--primary">
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
