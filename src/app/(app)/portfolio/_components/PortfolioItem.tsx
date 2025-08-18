import React from 'react';

import { PortfolioItem as PortfolioItemType } from '@prisma/client';
import { Pencil, Trash } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import removePortfolioItemAction from '@/actions/portfolio/item/remove-portfolio-item-action';
import serverToast from '@/actions/toast/server-toast-action';
import hasRoleAPI from '@/lib/auth/utils/hasRoleAPI';
import { routes } from '@/lib/boiler-config';

interface PortfolioItemProps {
  portfolioItem: PortfolioItemType;
  media: string;
  isAdmin?: boolean;
}

const PortfolioItem: React.FC<PortfolioItemProps> = async ({
  portfolioItem,
  media,
  isAdmin = false,
}) => {
  const hasRoleAdmin = await hasRoleAPI('admin');

  async function handleRemovePortfolioItem(formData: FormData): Promise<void> {
    'use server';
    const portfolioItemId = formData.get('portfolioItemId') as string;
    const res = await removePortfolioItemAction({
      portfolioItemId,
    });

    if (res.data?.message) {
      await serverToast({
        message: res.data.message,
        type: res.data.success ? 'success' : 'error',
      });
    }
  }

  return (
    <div className="relative aspect-square">
      <Image
        src={media}
        alt="Portfolio Item"
        className="h-full w-full object-contain transition-all duration-300 hover:scale-102"
        width={4000}
        height={4000}
        unoptimized
      />
      {hasRoleAdmin && isAdmin && (
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <Link
            href={`${routes.admin.portfolio.media}/${portfolioItem.id}`}
            className="cursor-pointer rounded-full bg-[#0F9BFF] p-2 text-white transition-all duration-300 hover:scale-110"
          >
            <Pencil />
          </Link>
          <form action={handleRemovePortfolioItem}>
            <input type="hidden" name="portfolioItemId" value={portfolioItem.id} />
            <button className="cursor-pointer rounded-full bg-red-500 p-2 text-white transition-all duration-300 hover:scale-110">
              <Trash />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PortfolioItem;
