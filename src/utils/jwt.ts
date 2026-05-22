export const getTokenExpiryMs = (token: string): number | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1] ?? '')) as {
      exp?: number;
    };
    if (!payload.exp) return null;
    return payload.exp * 1000;
  } catch {
    return null;
  }
};

export const getRefreshIntervalMs = (token: string): number => {
  const expiryMs = getTokenExpiryMs(token);
  if (!expiryMs) return 14 * 60 * 1000;
  const refreshAt = expiryMs - 60 * 1000;
  const delay = refreshAt - Date.now();
  return Math.max(delay, 60 * 1000);
};
