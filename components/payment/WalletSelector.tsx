import { Button } from '@/components/ui/Button';
import { WalletSigner } from '@/lib/stellar';

export function WalletSelector({ wallets, onConnect }: { wallets: WalletSigner[]; onConnect(wallet: WalletSigner): void }) {
  return (
    <div className="flex gap-2">
      {wallets.map((wallet) => (
        <Button key={wallet.name} onClick={() => onConnect(wallet)}>{wallet.name}</Button>
      ))}
    </div>
  );
}
