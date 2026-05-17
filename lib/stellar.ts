export interface WalletSigner {
  name: string;
  getPublicKey(): Promise<string>;
  signTransaction(xdr: string, network: 'testnet' | 'mainnet'): Promise<string>;
  isAvailable(): boolean;
}

export const FreighterSigner: WalletSigner = {
  name: 'Freighter',
  isAvailable: () => typeof window !== 'undefined' && !!(window as any).freighter,
  async getPublicKey() {
    const { requestAccess } = await import('@stellar/freighter-api');
    const result = await requestAccess();
    if (result.error) throw new Error(result.error.message ?? 'Freighter access was denied');
    return result.address;
  },
  async signTransaction(xdr, network) {
    const { signTransaction } = await import('@stellar/freighter-api');
    const result = await signTransaction(xdr, { networkPassphrase: networkPassphrase(network) });
    if (result.error) throw new Error(result.error.message ?? 'Freighter could not sign the transaction');
    return result.signedTxXdr;
  },
};

export const AlbedoSigner: WalletSigner = {
  name: 'Albedo',
  isAvailable: () => true,
  async getPublicKey() {
    const albedo = (await import('@albedo-link/intent')).default as any;
    const result = await albedo.publicKey({});
    return result.pubkey;
  },
  async signTransaction(xdr, network) {
    const albedo = (await import('@albedo-link/intent')).default as any;
    const result = await albedo.tx({ xdr, network, submit: false });
    return result.signed_envelope_xdr;
  },
};

export const AVAILABLE_WALLETS = [FreighterSigner, AlbedoSigner];

function networkPassphrase(network: 'testnet' | 'mainnet') {
  return network === 'mainnet' ? 'Public Global Stellar Network ; September 2015' : 'Test SDF Network ; September 2015';
}
