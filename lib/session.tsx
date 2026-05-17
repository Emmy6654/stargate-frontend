'use client';

import type { Merchant } from '@stargate/types';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { setAccessToken } from './api';

type Session = {
  token: string | null;
  merchant: Merchant | null;
  login(token: string, merchant?: Merchant): void;
  logout(): void;
};

const SessionContext = createContext<Session | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  useEffect(() => {
    const savedToken = sessionStorage.getItem('stargate_token');
    const savedMerchant = sessionStorage.getItem('stargate_merchant');
    if (!savedToken) return;
    setToken(savedToken);
    setAccessToken(savedToken);
    if (savedMerchant) setMerchant(JSON.parse(savedMerchant));
  }, []);
  const value = useMemo<Session>(() => ({
    token,
    merchant,
    login(nextToken, nextMerchant) {
      setToken(nextToken);
      setMerchant(nextMerchant ?? null);
      setAccessToken(nextToken);
      sessionStorage.setItem('stargate_token', nextToken);
      if (nextMerchant) sessionStorage.setItem('stargate_merchant', JSON.stringify(nextMerchant));
      document.cookie = 'stargate_session=1; path=/dashboard; SameSite=Lax';
    },
    logout() {
      setToken(null);
      setMerchant(null);
      setAccessToken(null);
      sessionStorage.removeItem('stargate_token');
      sessionStorage.removeItem('stargate_merchant');
      document.cookie = 'stargate_session=; path=/dashboard; max-age=0';
    },
  }), [token, merchant]);
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const session = useContext(SessionContext);
  if (!session) throw new Error('useSession must be used within SessionProvider');
  return session;
}
