import { Plus } from 'lucide-react';
import Link from 'next/link';

import TarifItem from '@/app/(app)/tarifs/_components/TarifItem';
import { Button } from '@/components/ui/button';
import { routes } from '@/lib/boiler-config';
import prisma from '@/lib/prisma';

export default async function AdminPortfolioCategory(): Promise<React.JSX.Element> {
  const categories = await prisma.portfolioCategory.findMany({
    orderBy: {
      order: 'asc',
    },
    include: {
      mediaExample: true,
    },
  });

  return (
    <div className="flex flex-col items-center justify-center gap-5 text-white">
      <div>
        <Button className="cursor-pointer rounded-xl bg-[#00863A] hover:bg-[#00863A]/80" asChild>
          <Link href={`${routes.admin.portfolio.category}/create`}>
            <Plus size={20} />
            Ajouter une catégorie
          </Link>
        </Button>
      </div>
      <div>
        <p className="font-comodo py-5 text-center text-5xl text-[#FF0066]">categories</p>
        <div className="flex flex-col gap-8">
          {categories.map((category, index) => (
            <TarifItem
              tarifItem={category}
              key={category.id}
              reverse={index % 2 === 0}
              media={category.mediaExample?.publicUrl ?? ''}
              isAdmin
            />
          ))}
        </div>
      </div>
    </div>
  );
}
