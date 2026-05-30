'use client';

import { useState, useCallback } from 'react';
import { AVAILABLE_WALLETS, WalletSigner } from '@/lib/stellar';

export interface WalletConnectionError {
  code: string;
  message: string;
}

/**
 * Hook for managing wallet connections in the payment flow.
 *
 * Handles connecting to Freighter or Albedo wallets, managing connection state,
 * and providing error handling for various failure scenarios including timeouts
 * and iOS Safari navigation errors.
 *
 * @returns {Object} Wallet connection state and methods
 * @returns {WalletSigner[]} wallets - Array of available wallets that can be connected
 * @returns {WalletSigner | null} wallet - Currently connected wallet instance
 * @returns {string | null} publicKey - Public key of the connected wallet
 * @returns {Function} connect - Async function to connect to a wallet, returns public key or null
 * @returns {WalletConnectionError | null} error - Connection error if one occurred
 * @returns {Function} clearError - Function to clear the error state
 * @returns {boolean} isConnecting - Whether a connection attempt is in progress
 *
 * @example
 * const { wallets, connect, publicKey, error } = useWallet();
 * const handleConnect = async (wallet) => {
 *   const key = await connect(wallet);
 *   if (key) console.log('Connected:', key);
 * };
 */
export function useWallet() {
  const [wallet, setWallet] = useState<WalletSigner | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [error, setError] = useState<WalletConnectionError | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connect = useCallback(async (next: WalletSigner): Promise<string | null> => {
    try {
      setIsConnecting(true);
      setError(null);

      // Add timeout for mobile wallets that might take longer to respond
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Wallet connection timeout')), 30000)
      );

      const connectionPromise = (async () => {
        try {
          const key = await next.getPublicKey();
          setWallet(next);
          setPublicKey(key);
          return key;
        } catch (err) {
          // Handle iOS Safari specific errors
          const message = err instanceof Error ? err.message : String(err);
          if (message.includes('Navigation') || message.includes('DOMException')) {
            // iOS Safari deep-link navigation error - retry might help
            setError({
              code: 'NAVIGATION_ERROR',
              message: 'Wallet connection was interrupted. Please ensure the wallet app is installed and try again.',
            });
            return null;
          }
          throw err;
        }
      })();

      return await Promise.race([connectionPromise, timeoutPromise]);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('Wallet connection error:', { wallet: next.name, error: message });

      const isNotInstalled = message.includes('not installed');
      setError({
        code: isNotInstalled ? 'WALLET_NOT_INSTALLED' : 'CONNECTION_ERROR',
        message: isNotInstalled ? message : `Failed to connect with ${next.name}. ${message}`,
      });
      setWallet(null);
      setPublicKey(null);
      return null;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    wallets: AVAILABLE_WALLETS.filter((w) => w.isAvailable()),
    wallet,
    publicKey,
    connect,
    error,
    clearError,
    isConnecting,
  };
}
