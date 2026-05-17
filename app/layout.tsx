import './globals.css';
import type { Metadata } from 'next';
import { SessionProvider } from '@/lib/session';

export const metadata: Metadata = {
  title: 'Stargate',
  description: 'USDC payments on Stellar',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
