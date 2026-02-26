import { useState, useEffect } from 'react';

const SESSION_TOKEN_KEY = 'admin_session_token';

export function getSessionToken(): string | null {
  return localStorage.getItem(SESSION_TOKEN_KEY);
}

export function setSessionToken(token: string): void {
  localStorage.setItem(SESSION_TOKEN_KEY, token);
}

export function clearSessionToken(): void {
  localStorage.removeItem(SESSION_TOKEN_KEY);
}

export function useSessionToken() {
  const [token, setToken] = useState<string | null>(() => getSessionToken());

  useEffect(() => {
    const handleStorage = () => {
      setToken(getSessionToken());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const updateToken = (newToken: string | null) => {
    if (newToken) {
      setSessionToken(newToken);
    } else {
      clearSessionToken();
    }
    setToken(newToken);
  };

  return { token, updateToken };
}
