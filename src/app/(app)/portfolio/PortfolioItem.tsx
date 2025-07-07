import React from 'react';

import Image from 'next/image';

interface PortfolioItemProps {
  media: string;
}

const PortfolioItem: React.FC<PortfolioItemProps> = ({ media }) => {
  return (
    <Image
      src={media}
      alt="Portfolio Item"
      className="h-full w-full object-cover transition-all duration-300 hover:scale-102"
      width={2000}
      height={2000}
    />
  );
};

export default PortfolioItem;
