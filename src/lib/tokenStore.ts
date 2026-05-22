let accessToken: string | null = null;
let refreshToken: string | null = null;

export const getAccessToken = (): string | null => accessToken;

export const setAccessToken = (token: string | null): void => {
  accessToken = token;
};

export const getRefreshToken = (): string | null => refreshToken;

export const setRefreshToken = (token: string | null): void => {
  refreshToken = token;
};

export const clearTokens = (): void => {
  accessToken = null;
  refreshToken = null;
};

export const hasTokens = (): boolean => Boolean(accessToken && refreshToken);
