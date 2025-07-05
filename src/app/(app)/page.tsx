import { Navbar } from '@/components/project/navbar';

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
    </div>
  );
}
