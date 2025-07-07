import React from 'react';

import { Trash } from 'lucide-react';
import { headers } from 'next/headers';

import { downloadFileAction } from '@/actions/cloud-storage-file';
import removePortfolioItemAction from '@/actions/portfolio/item/remove-portfolio-item-action';
import auth from '@/lib/auth/auth';
import images from '@/lib/boiler-config/images';
import prisma from '@/lib/prisma';

import PortfolioItem from './portfolio/PortfolioItem';

interface PortfolioItemsContainerProps {
  isAdmin?: boolean;
}

const PortfolioItemsContainer: React.FC<PortfolioItemsContainerProps> = async ({
  isAdmin = false,
}: PortfolioItemsContainerProps): Promise<React.JSX.Element> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const hasRoleAdmin = session?.user.role?.toLocaleLowerCase().split(',').includes('admin');

  const portFolioItem = await prisma.portfolioItem.findMany({
    include: {
      media: true,
    },
  });

  async function handleRemovePortfolioItem(formData: FormData): Promise<void> {
    'use server';
    const portfolioItemId = formData.get('portfolioItemId') as string;
    await removePortfolioItemAction({
      portfolioItemId,
    });
  }

  return (
    <div className="grid auto-rows-fr grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {portFolioItem.length === 0 && (
        <div className="col-span-full flex items-center justify-center text-white">
          <p className="text-center text-2xl font-bold">Aucun élément dans le portfolio...</p>
        </div>
      )}
      {portFolioItem.map(async item => {
        const mediaDownload = await downloadFileAction({
          bucket: item.media.bucket,
          path: item.media.path,
        });
        return (
          <div className="relative aspect-square" key={item.id}>
            <PortfolioItem media={mediaDownload.data?.url ?? images.NO_IMG.src} />
            {hasRoleAdmin && isAdmin && (
              <form action={handleRemovePortfolioItem} className="absolute top-3 right-3">
                <input type="hidden" name="portfolioItemId" value={item.id} />
                <button className="cursor-pointer rounded-full bg-red-500 p-2 text-white transition-all duration-300 hover:scale-110 hover:bg-red-600">
                  <Trash />
                </button>
              </form>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PortfolioItemsContainer;
