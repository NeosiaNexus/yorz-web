import Image from 'next/image';
import Link from 'next/link';

import Footer from '@/components/project/footer/Footer';
import { Navbar } from '@/components/project/navbar';
import { routes } from '@/lib/boiler-config';
import images from '@/lib/boiler-config/images';

import Confiance from './Confiance';
import Features from './Features';
import Hero from './Hero';
import Services from './Services';

export default function Home(): React.JSX.Element {
  return (
    <div className="flex flex-col gap-30">
      <div>
        <Navbar />
        <Hero />
      </div>
      <Confiance />
      <Services />
      <Features />
      <Link
        href={routes.portfolio}
        className="w-fit self-center transition-all duration-300 hover:scale-105"
      >
        <Image {...images.HOME_PORTFOLIO} className="w-[300px]" />
      </Link>
      <Footer />
    </div>
  );
}
