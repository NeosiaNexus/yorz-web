import { Metadata } from 'next';

import { config } from '@/lib/boiler-config';

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

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  return <main className="flex min-h-screen flex-col items-center justify-center">{children}</main>;
}
