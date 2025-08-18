import React from 'react';

import { PortfolioCategory, StorageFile } from '@prisma/client';
import { Pencil, Trash } from 'lucide-react';
import { revalidatePath } from 'next/cache';
import Image from 'next/image';
import Link from 'next/link';

import removePortfolioCategorieAction from '@/actions/portfolio/categories/remove-portfolio-categorie-action';
import hasRoleAPI from '@/lib/auth/utils/hasRoleAPI';
import { routes } from '@/lib/boiler-config';
import images from '@/lib/boiler-config/images';
import { cn } from '@/lib/utils';

interface TarifItemProps {
  tarifItem: PortfolioCategory & {
    mediaExample: StorageFile | null;
  };
  media: string;
  reverse?: boolean;
  isAdmin?: boolean;
}

const TarifItem: React.FC<TarifItemProps> = async ({
  tarifItem,
  reverse = false,
  isAdmin = false,
}) => {
  const hasRoleAdmin = await hasRoleAPI('admin');

  const color =
    tarifItem.colorVariant === 'green'
      ? 'text-[#A6FF00]'
      : tarifItem.colorVariant === 'red'
        ? 'text-[#FF0066]'
        : 'text-[#109BFE]';
  return (
    <div
      className={`relative flex items-center justify-center gap-20 self-center ${reverse ? 'flex-row-reverse' : ''} flex-wrap`}
    >
      {hasRoleAdmin && isAdmin && (
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
          <Link
            href={`${routes.admin.portfolio.category}/${tarifItem.id}`}
            className="cursor-pointer rounded-full bg-[#0F9BFF] p-2 text-white transition-all duration-300 hover:scale-110"
          >
            <Pencil />
          </Link>
          <form
            action={async () => {
              'use server';

              await removePortfolioCategorieAction({
                portfolioCategoryId: tarifItem.id,
              });

              revalidatePath(routes.admin.portfolio.category);
            }}
          >
            <input type="hidden" name="portfolioCategoryId" value={tarifItem.id} />
            <button className="cursor-pointer rounded-full bg-red-500 p-2 text-white transition-all duration-300 hover:scale-110">
              <Trash />
            </button>
          </form>
        </div>
      )}
      <div className="flex-1">
        <Image
          src={tarifItem.mediaExample?.publicUrl ?? images.NO_IMG.src}
          width={600}
          height={400}
          alt={`${tarifItem.title} - ${tarifItem.description}`}
          className={cn(
            'h-[400px] w-[600px] overflow-hidden object-contain object-center transition-all duration-300 hover:scale-105',
            !reverse && 'justify-self-end',
          )}
          unoptimized
        />
      </div>
      <div
        className={cn('flex w-[600px] flex-1 flex-col gap-5 text-white', reverse && 'items-end')}
      >
        <p className="font-comodo text-6xl">{tarifItem.title}.</p>
        {(tarifItem.underDescription || tarifItem.description) && (
          <div className={cn(reverse && 'text-right', 'flex flex-col gap-1')}>
            {tarifItem.description && <p className="text-xl">{tarifItem.description}</p>}
            {tarifItem.underDescription && (
              <p className="font-extralight">{tarifItem.underDescription}</p>
            )}
          </div>
        )}
        <p className={`${color} text-5xl font-bold`}>{tarifItem.price}</p>
        {tarifItem.priceComplement && (
          <p className={`${color} -mt-3 text-3xl font-extralight`}>{tarifItem.priceComplement}</p>
        )}
      </div>
    </div>
  );
};

export default TarifItem;
