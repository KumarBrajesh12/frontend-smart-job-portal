import api from './api';
import type {
  LoginPayload,
  LoginResponse,
  MeResponse,
  RefreshResponse,
  RegisterPayload,
} from '@/types/auth';

export const register = async (payload: RegisterPayload) => {
  const { data } = await api.post<{ success: boolean; message: string }>(
    '/api/auth/register',
    payload,
  );
  return data;
};

export const login = async (payload: LoginPayload) => {
  const { data } = await api.post<LoginResponse>('/api/auth/login', payload);
  return data;
};

export const refresh = async (refreshToken: string) => {
  const { data } = await api.post<RefreshResponse>('/api/auth/refresh', {
    refreshToken,
  });
  return data;
};

export const logout = async () => {
  const { data } = await api.post<{ success: boolean; message: string }>(
    '/api/auth/logout',
  );
  return data;
};

export const getMe = async () => {
  const { data } = await api.get<MeResponse>('/api/auth/me');
  return data;
};
