import React from 'react';

import Image from 'next/image';

import images from '@/lib/boiler-config/images';
import { cn } from '@/lib/utils';

type TarifItemColorVariant = 'green' | 'red' | 'blue';

interface TarifItemProps {
  image: typeof images.YORZ_RENARD;
  title: string;
  description?: string;
  underDescription?: string;
  price: string;
  priceComplement?: string;
  colorVariant: TarifItemColorVariant;
  reverse?: boolean;
}

const TarifItem: React.FC<TarifItemProps> = ({
  image,
  title,
  description,
  underDescription,
  price,
  priceComplement,
  colorVariant,
  reverse = false,
}) => {
  const color =
    colorVariant === 'green'
      ? 'text-[#A6FF00]'
      : colorVariant === 'red'
        ? 'text-[#FF0066]'
        : 'text-[#109BFE]';
  return (
    <div
      className={`flex items-center justify-center gap-20 self-center ${reverse ? 'flex-row-reverse' : ''} flex-wrap`}
    >
      <div className="flex-1">
        <Image
          {...image}
          className={cn(
            'w-[600px] transition-all duration-300 hover:scale-105',
            !reverse && 'justify-self-end',
          )}
        />
      </div>
      <div
        className={cn('flex w-[600px] flex-1 flex-col gap-5 text-white', reverse && 'items-end')}
      >
        <p className="font-comodo text-6xl">{title}</p>
        {(underDescription || description) && (
          <div className={cn(reverse && 'text-right', 'flex flex-col gap-1')}>
            {description && <p className="text-xl">{description}</p>}
            {underDescription && <p className="font-extralight">{underDescription}</p>}
          </div>
        )}
        <p className={`${color} text-5xl font-bold`}>{price}</p>
        {priceComplement && (
          <p className={`${color} -mt-3 text-3xl font-extralight`}>{priceComplement}</p>
        )}
      </div>
    </div>
  );
};

export default TarifItem;
