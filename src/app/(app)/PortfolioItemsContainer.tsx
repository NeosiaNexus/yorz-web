import React from 'react';

import { downloadFileAction } from '@/actions/cloud-storage-file';
import images from '@/lib/boiler-config/images';
import prisma from '@/lib/prisma';

import PortfolioItem from './portfolio/PortfolioItem';

interface PortfolioItemsContainerProps {
  isAdmin?: boolean;
}

const PortfolioItemsContainer: React.FC<PortfolioItemsContainerProps> = async ({
  isAdmin = false,
}: PortfolioItemsContainerProps): Promise<React.JSX.Element> => {
  const portFolioItem = await prisma.portfolioItem.findMany({
    include: {
      media: true,
    },
  });

  return (
    <div className="grid auto-rows-fr grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {portFolioItem.length === 0 && (
        <div className="col-span-full flex items-center justify-center text-white">
          <p className="text-center text-2xl font-bold">Aucun media dans le portfolio...</p>
        </div>
      )}
      {portFolioItem.map(async item => {
        const mediaDownload = await downloadFileAction({
          bucket: item.media?.bucket ?? '',
          path: item.media?.path ?? '',
        });
        return (
          <PortfolioItem
            portfolioItem={item}
            media={mediaDownload.data?.url ?? images.NO_IMG.src}
            isAdmin={isAdmin}
            key={item.id}
          />
        );
      })}
    </div>
  );
};

export default PortfolioItemsContainer;
