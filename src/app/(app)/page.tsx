import { Navbar } from '@/components/project/navbar';

import Confiance from './Confiance';
import Hero from './Hero';
import Services from './Services';

export default function Home(): React.JSX.Element {
  return (
    <div className="flex flex-col gap-30">
      <Navbar />
      <Hero />
      <Confiance />
      <Services />
    </div>
  );
}
