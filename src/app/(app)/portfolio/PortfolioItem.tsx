import Image from 'next/image';

import images from '@/lib/boiler-config/images';

const PortfolioItem = (): React.JSX.Element => {
  return (
    <Image
      {...images.PORTFOLIO_EXAMPLE}
      className="h-full w-full object-cover transition-all duration-300 hover:scale-102"
    />
  );
};

export default PortfolioItem;
