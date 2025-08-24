export const dynamic = 'force-dynamic';

import { Plus } from 'lucide-react';
import Link from 'next/link';

import PortfolioItemsContainer from '@/app/(app)/_components/PortfolioItemsContainer';
import { Button } from '@/components/ui/button';
import { routes } from '@/lib/boiler-config';

export default async function AdminPortfolioItem(): Promise<React.JSX.Element> {
  return (
    <div className="flex flex-col items-center justify-center gap-5 text-white">
      <div>
        <Button className="cursor-pointer rounded-xl bg-[#00863A] hover:bg-[#00863A]/80" asChild>
          <Link href={`${routes.admin.portfolio.media}/create`}>
            <Plus size={20} />
            Ajouter un élément
          </Link>
        </Button>
      </div>
      <div>
        <p className="font-comodo py-5 text-center text-5xl text-[#FF0066]">Medias</p>
        <PortfolioItemsContainer isAdmin />
      </div>
    </div>
  );
}
