import { Navbar } from '@/components/project/navbar';

import Confiance from './Confiance';
import Hero from './Hero';

export default function Home(): React.JSX.Element {
  return (
    <div>
      <Navbar />
      <Hero />
      <Confiance />
    </div>
  );
}
