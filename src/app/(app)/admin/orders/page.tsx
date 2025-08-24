export const dynamic = 'force-dynamic';

import { Check, Loader } from 'lucide-react';

import prisma from '@/lib/prisma';

import AdminStatBlockLink from '../_components/AdminStatBlockLink';

import CreateOrderDialog from './_components/CreateOrderDialog';
import OrderItemRow from './_components/OrderItemRow';

export default async function AdminOrders(): Promise<React.JSX.Element> {
  const prismaOrders = await prisma.order.findMany({
    include: {
      category: true,
      items: true,
    },
  });

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
      <CreateOrderDialog />
      <div className="flex flex-col gap-4">
        {prismaOrders.map(order => (
          <OrderItemRow key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}
