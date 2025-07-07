import Image from 'next/image';
import Link from 'next/link';

import Footer from '@/components/project/footer/Footer';
import { Navbar } from '@/components/project/navbar';
import { routes } from '@/lib/boiler-config';
import images from '@/lib/boiler-config/images';

import AvisContainer from './_components/AvisContainer';
import Confiance from './_components/Confiance';
import Features from './_components/Features';
import Hero from './_components/Hero';
import Services from './_components/Services';

export default function Home(): React.JSX.Element {
  return (
    <div className="flex flex-col gap-45">
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
      <AvisContainer />
      <Footer />
    </div>
  );
}
