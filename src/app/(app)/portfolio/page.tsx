export const dynamic = 'force-dynamic';

import Image from 'next/image';

import images from '@/lib/boiler-config/images';

import PortfolioItemsContainer from '../_components/PortfolioItemsContainer';

import PortfolioBar from './_components/PortfolioBar';

export default async function Portfolio(): Promise<React.JSX.Element> {
  return (
    <div className="flex flex-col gap-10">
      <p className="font-comodo bg-gradient-to-r from-[#0F9BFF] to-[#095D99] bg-clip-text pb-20 text-center text-7xl font-normal text-transparent">
        portfolio
      </p>
      <div className="flex flex-col gap-10 px-10">
        <PortfolioBar />
        <PortfolioItemsContainer />
      </div>
      <div className="flex cursor-pointer items-center justify-center pt-10 transition-all duration-300 hover:scale-105">
        <Image {...images.LOAD_MORE} className="w-[200px]" />
      </div>
    </div>
  );
}
