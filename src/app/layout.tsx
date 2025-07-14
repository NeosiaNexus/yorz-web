import { Suspense } from 'react';

import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from 'sonner';

import ServerToaster from '@/components/project/toaster/ServerToaster';
import { config } from '@/lib/boiler-config';

import './globals.css';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: config.name,
    description: config.description,
    openGraph: {
      title: config.name,
      description: config.description,
      images: [
        {
          url: `${process.env.BETTER_AUTH_URL}/images/open-graph/og-default.png`,
          width: 422,
          height: 255,
          alt: 'Slogan de YorzStudio',
        },
      ],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  return (
    <html lang={config.lang} suppressHydrationWarning className={poppins.variable}>
      <body
        className={`bg-yorz-dark w-screen overflow-x-hidden antialiased`}
        suppressHydrationWarning
      >
        <Toaster richColors expand theme="dark" />
        <Suspense>
          <ServerToaster />
        </Suspense>
        <NextTopLoader color={'#fff'} showSpinner={false} zIndex={10000000} />
        {children}
      </body>
    </html>
  );
}
