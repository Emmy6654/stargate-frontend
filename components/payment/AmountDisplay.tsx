export function AmountDisplay({ amount }: { amount: string }) {
  return <div className="text-4xl font-semibold text-ink">{amount} <span className="text-base text-slate-500">USDC</span></div>;
}
