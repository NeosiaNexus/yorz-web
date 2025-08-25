import React from 'react';

import { PortfolioItem as PortfolioItemType } from '@prisma/client';
import { Heart, Pencil, Trash } from 'lucide-react';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';

import removePortfolioItemAction from '@/actions/portfolio/item/remove-portfolio-item-action';
import serverToast from '@/actions/toast/server-toast-action';
import auth from '@/lib/auth/auth';
import hasRoleAPI from '@/lib/auth/utils/hasRoleAPI';
import { routes } from '@/lib/boiler-config';
import prisma from '@/lib/prisma';
import { getStr } from '@/lib/utils/formDataUtils';

import PortfolioItemCommentsSheet from './PortfolioItemCommentsSheet';

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

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isAuthenticated = !!session?.user;

  const liked = await prisma.portfolioItemLike.findFirst({
    where: {
      userId: session?.user?.id,
      itemId: portfolioItem.id,
    },
  });

  async function handleLikePortfolioItem(formData: FormData): Promise<void> {
    'use server';

    const portfolioItemId = getStr(formData, 'portfolioItemId');

    if (!portfolioItemId) {
      await serverToast({
        message: 'Media non trouvé',
        type: 'error',
      });
      return;
    }

    const portfolioItem = await prisma.portfolioItem.findUnique({
      where: {
        id: portfolioItemId,
      },
    });

    if (!portfolioItem) {
      await serverToast({
        message: 'Media non trouvé',
        type: 'error',
      });
      return;
    }

    if (!isAuthenticated) {
      await serverToast({
        message: 'Vous devez être connecté pour liker un media',
        type: 'error',
      });
      return;
    }

    const currentLike = await prisma.portfolioItemLike.findFirst({
      where: {
        userId: session?.user?.id,
        itemId: portfolioItemId,
      },
    });

    if (currentLike) {
      await prisma.portfolioItemLike.delete({
        where: {
          id: currentLike.id,
        },
      });
    } else {
      await prisma.portfolioItemLike.create({
        data: {
          userId: session?.user?.id,
          itemId: portfolioItemId,
        },
      });

      await serverToast({
        message: 'Media liké. Merci de votre soutien !',
        type: 'success',
      });
    }

    revalidatePath('/');
  }

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
      <div className="absolute top-1 right-1 z-10 flex flex-col items-center justify-center">
        <form action={handleLikePortfolioItem}>
          <input type="hidden" name="portfolioItemId" value={portfolioItem.id} />
          <button
            type="submit"
            className="cursor-pointer text-white transition-all duration-300 hover:scale-110"
          >
            <Heart className="h-10 w-10" fill={liked ? 'red' : 'none'} stroke="red" type="submit" />
          </button>
        </form>
        <PortfolioItemCommentsSheet portfolioItemId={portfolioItem.id} />
      </div>

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
