export const dynamic = 'force-dynamic';

import { Images, List } from 'lucide-react';

import { routes } from '@/lib/boiler-config';
import prisma from '@/lib/prisma';

import AdminStatBlockLink from '../_components/AdminStatBlockLink';

export default async function AdminPortfolio(): Promise<React.JSX.Element> {
  const portfolioItems = await prisma.portfolioItem.findMany();
  const categories = await prisma.portfolioCategory.findMany();

  return (
    <div className="flex justify-center gap-10 text-white">
      <AdminStatBlockLink
        href={routes.admin.portfolio.media}
        icon={<Images size={40} className="text-white" />}
        title={'media'}
        count={portfolioItems.length}
      />
      <AdminStatBlockLink
        href={routes.admin.portfolio.category}
        icon={<List size={40} className="text-white" />}
        title={`catégorie${categories.length > 1 ? 's' : ''}`}
        count={categories.length}
        variant="red"
      />
    </div>
  );
}
