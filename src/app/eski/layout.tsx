import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Eski Tasarım | OMÜ Diş Not Hesaplama',
  robots: { index: false, follow: false },
};

export default function EskiLayout({ children }: { children: React.ReactNode }) {
  return children;
}
