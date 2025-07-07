import { Images, List } from 'lucide-react';

import { routes } from '@/lib/boiler-config';
import prisma from '@/lib/prisma';

import AdminStatBlockLink from '../AdminStatBlockLink';

export default async function AdminPortfolio(): Promise<React.JSX.Element> {
  const portfolioItems = await (await prisma.portfolioItem.findMany()).length;
  const categories = await (await prisma.portfolioCategory.findMany()).length;

  return (
    <div className="flex justify-center gap-10 text-white">
      <AdminStatBlockLink
        href={routes.admin.portfolio.item}
        icon={<Images size={40} className="text-white" />}
        title={`Element${portfolioItems > 1 ? 's' : ''}`}
        count={portfolioItems}
      />
      <AdminStatBlockLink
        href={routes.admin.categories}
        icon={<List size={40} className="text-white" />}
        title={`Catégorie${categories > 1 ? 's' : ''}`}
        count={categories}
        variant="red"
      />
    </div>
  );
}
