'use server';

import Image from 'next/image';
import Marquee from 'react-fast-marquee';

import images from '@/lib/boiler-config/images';

const Confiance = async (): Promise<React.JSX.Element> => {
  return (
    <div className="flex flex-col items-center gap-25">
      <p className="bg-gradient-to-r from-[#D2FE00] to-[#55FF00] bg-clip-text text-center text-3xl font-bold text-transparent">
        Il m&apos;ont fait confiance
      </p>
      <div className="-rotate-2">
        <Marquee loop={0} autoFill speed={40} direction="left">
          <Image {...images.SLAYER_ADVENTURE_LOGO_WHITE} className="mx-10" />
        </Marquee>
        <Marquee loop={0} autoFill speed={40} direction="right">
          <Image {...images.SLAYER_ADVENTURE_LOGO_WHITE} className="mx-10" />
        </Marquee>
      </div>
    </div>
  );
};

export default Confiance;
