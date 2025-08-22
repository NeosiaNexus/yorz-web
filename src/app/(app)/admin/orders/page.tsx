export const dynamic = 'force-dynamic';

import { Check, Loader, Plus } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { routes } from '@/lib/boiler-config';
import prisma from '@/lib/prisma';

import AdminStatBlockLink from '../_components/AdminStatBlockLink';

export default async function AdminOrders(): Promise<React.JSX.Element> {
  const prismaOrders = await prisma.order.findMany();

  return (
    <div className="flex flex-col items-center justify-center gap-10 text-white">
      <div className="flex justify-center gap-10">
        <AdminStatBlockLink
          href={'#'}
          icon={<Loader size={40} className="text-white" />}
          title={'En cours'}
          count={prismaOrders.filter(order => order.status === 'PENDING').length}
          variant="orange"
        />
        <AdminStatBlockLink
          href={'#'}
          icon={<Check size={40} className="text-white" />}
          title={`Terminée${prismaOrders.filter(order => order.status === 'COMPLETED').length > 1 ? 's' : ''}`}
          count={prismaOrders.filter(order => order.status === 'COMPLETED').length}
          variant="dark-green"
        />
      </div>

      <Link href={`${routes.admin.portfolio.media}/create`}>
        <Button className="cursor-pointer rounded-xl bg-[#00863A] hover:bg-[#00863A]/80">
          <Plus size={20} />
          Ajouter un élément
        </Button>
      </Link>
    </div>
  );
}
