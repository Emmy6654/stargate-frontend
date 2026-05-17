'use client';

import { useState } from 'react';
import { AVAILABLE_WALLETS, WalletSigner } from '@/lib/stellar';

export function useWallet() {
  const [wallet, setWallet] = useState<WalletSigner | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);

  async function connect(next: WalletSigner) {
    const key = await next.getPublicKey();
    setWallet(next);
    setPublicKey(key);
    return key;
  }

  return { wallets: AVAILABLE_WALLETS.filter((w) => w.isAvailable()), wallet, publicKey, connect };
}
