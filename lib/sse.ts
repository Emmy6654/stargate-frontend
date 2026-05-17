export function invoiceStatusUrl(invoiceId: string) {
  return `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'}/payments/${invoiceId}/stream`;
}
