'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { isAxiosError } from 'axios';
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from '@/lib/tokenStore';
import * as authService from '@/services/authService';
import { getRefreshIntervalMs } from '@/utils/jwt';
import type { AuthContextValue, LoginPayload, User } from '@/types/auth';

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const refreshTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearRefreshTimer = useCallback(() => {
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  }, []);

  const performTokenRefresh = useCallback(async (): Promise<string | null> => {
    const storedRefresh = getRefreshToken();
    if (!storedRefresh) return null;

    try {
      const data = await authService.refresh(storedRefresh);
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      setAccessTokenState(data.accessToken);
      return data.accessToken;
    } catch {
      clearTokens();
      setAccessTokenState(null);
      setUser(null);
      clearRefreshTimer();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth:logout'));
      }
      return null;
    }
  }, [clearRefreshTimer]);

  const scheduleTokenRefresh = useCallback(
    (token: string) => {
      clearRefreshTimer();
      const intervalMs = getRefreshIntervalMs(token);
      refreshTimerRef.current = setInterval(() => {
        performTokenRefresh().catch(() => {
          clearRefreshTimer();
        });
      }, intervalMs);
    },
    [clearRefreshTimer, performTokenRefresh],
  );

  const refreshTokens = useCallback(async (): Promise<string | null> => {
    const newToken = await performTokenRefresh();
    if (newToken) {
      scheduleTokenRefresh(newToken);
    }
    return newToken;
  }, [performTokenRefresh, scheduleTokenRefresh]);

  const fetchCurrentUser = useCallback(async () => {
    const data = await authService.getMe();
    setUser(data.user);
  }, []);

  const login = useCallback(
    async (payload: LoginPayload) => {
      setLoading(true);
      try {
        const data = await authService.login(payload);
        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);
        setAccessTokenState(data.accessToken);
        setUser({
          id: data.user.id,
          name: data.user.name,
          email: payload.email,
          role: data.user.role,
          isEmailVerified: true,
          createdAt: new Date().toISOString(),
        });
        scheduleTokenRefresh(data.accessToken);
        await fetchCurrentUser();
      } finally {
        setLoading(false);
      }
    },
    [fetchCurrentUser, scheduleTokenRefresh],
  );

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      if (getAccessToken()) {
        await authService.logout();
      }
    } catch {
      // Proceed with local logout even if API call fails
    } finally {
      clearTokens();
      setAccessTokenState(null);
      setUser(null);
      clearRefreshTimer();
      setLoading(false);
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  }, [clearRefreshTimer]);

  useEffect(() => {
    setIsReady(true);

    const handleLogout = () => {
      clearTokens();
      setAccessTokenState(null);
      setUser(null);
      clearRefreshTimer();
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => {
      window.removeEventListener('auth:logout', handleLogout);
      clearRefreshTimer();
    };
  }, [clearRefreshTimer]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      loading,
      isAuthenticated: Boolean(accessToken && user),
      isReady,
      login,
      logout,
      refreshTokens,
    }),
    [user, accessToken, loading, isReady, login, logout, refreshTokens],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
}

export const getAuthErrorMessage = (error: unknown): string => {
  if (isAxiosError(error)) {
    return (
      (error.response?.data as { message?: string })?.message ??
      error.message ??
      'Something went wrong'
    );
  }
  if (error instanceof Error) return error.message;
  return 'Something went wrong';
};
