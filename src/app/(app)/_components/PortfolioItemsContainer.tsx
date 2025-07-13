import React from 'react';

import images from '@/lib/boiler-config/images';
import prisma from '@/lib/prisma';

import PortfolioItem from '../portfolio/_components/PortfolioItem';

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
      {portFolioItem.map(item => {
        return (
          <PortfolioItem
            portfolioItem={item}
            media={item.media?.publicUrl ?? images.NO_IMG.src}
            isAdmin={isAdmin}
            key={item.id}
          />
        );
      })}
    </div>
  );
};

export default PortfolioItemsContainer;
