import { Plus } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { routes } from '@/lib/boiler-config';

export default async function AdminPortfolioCategory(): Promise<React.JSX.Element> {
  return (
    <div className="flex flex-col items-center justify-center gap-5 text-white">
      <div>
        <Link href={`${routes.admin.portfolio.category}/create`}>
          <Button className="cursor-pointer rounded-xl bg-[#00863A] hover:bg-[#00863A]/80">
            <Plus size={20} />
            Ajouter une catégorie
          </Button>
        </Link>
      </div>
      <div>
        <p className="font-comodo py-5 text-center text-5xl text-[#FF0066]">categories</p>
      </div>
    </div>
  );
}
