import Image from 'next/image';

import images from '@/lib/boiler-config/images';

import PortfolioBar from './PortfolioBar';
import PortfolioItem from './PortfolioItem';

export default function Portfolio(): React.JSX.Element {
  return (
    <div className="flex flex-col gap-10">
      <p className="font-comodo bg-gradient-to-r from-[#0F9BFF] to-[#095D99] bg-clip-text pb-20 text-center text-7xl font-normal text-transparent">
        portfolio
      </p>
      <div className="flex flex-col gap-10 px-10">
        <PortfolioBar />
        <div className="grid auto-rows-fr grid-cols-1 gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 10 }).map((_, index) => (
            <div className="aspect-square" key={index}>
              <PortfolioItem />
            </div>
          ))}
        </div>
      </div>
      <div className="flex cursor-pointer items-center justify-center pt-10 transition-all duration-300 hover:scale-105">
        <Image {...images.LOAD_MORE} className="w-[200px]" />
      </div>
    </div>
  );
}
