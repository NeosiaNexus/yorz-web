export const dynamic = 'force-dynamic';

import { OrderItem, PortfolioCategory } from '@prisma/client';
import { Check, Loader } from 'lucide-react';

import prisma from '@/lib/prisma';

import AdminStatBlockLink from '../_components/AdminStatBlockLink';

import CreateOrderDialog from './_components/CreateOrderDialog';
import OrderItemRow from './_components/OrderItemRow';

export default async function AdminOrders(): Promise<React.JSX.Element> {
  const orders = await prisma.order.findMany({
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
          count={orders.filter(order => order.status === 'PENDING').length}
          variant="orange"
        />
        <AdminStatBlockLink
          href={'#'}
          icon={<Check size={40} className="text-white" />}
          title={`Terminée${orders.filter(order => order.status === 'COMPLETED').length > 1 ? 's' : ''}`}
          count={orders.filter(order => order.status === 'COMPLETED').length}
          variant="dark-green"
        />
      </div>
      <CreateOrderDialog />
      {orders.length === 0 ? (
        <p className="text-center text-white">Aucune commande trouvée</p>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map(order => (
            <OrderItemRow
              key={order.id}
              order={{
                ...order,
                category: order.category as PortfolioCategory,
                items: order.items as OrderItem[],
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
