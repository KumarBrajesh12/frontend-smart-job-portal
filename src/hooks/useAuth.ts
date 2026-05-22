'use client';

import { useAuthContext } from '@/context/AuthContext';
import type { AuthContextValue } from '@/types/auth';

const useAuth = (): AuthContextValue => useAuthContext();

export default useAuth;
