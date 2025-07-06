import type { Metadata } from 'next';

import Footer from '@/components/project/footer/Footer';
import { Navbar } from '@/components/project/navbar';
import { config } from '@/lib/boiler-config';

export const metadata: Metadata = {
  title: `${config.name} | Portfolio`,
  description: config.description,
};

export default function PortfolioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  return (
    <main>
      <Navbar />
      {children}
      <Footer />
    </main>
  );
}
