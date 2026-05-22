export interface AuthContextValue {
  token: string | null;
  isAuthenticated: boolean;
  isReady: boolean;
  login: (accessToken: string) => void;
  logout: () => void;
}
