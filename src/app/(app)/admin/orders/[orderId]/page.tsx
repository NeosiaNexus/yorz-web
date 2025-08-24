import { Eye } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { routes } from '@/lib/boiler-config';
import prisma from '@/lib/prisma';
import { cn } from '@/lib/utils';

import CreateItemDialog from '../../portfolio/categories/_components/CreateItemDialog';

import ConfirmDialogDeleteItem from './_components/ConfirmDialogDeleteItem';

interface Props {
  params: Promise<{ orderId: string }>;
}

export default async function AdminOrder({ params }: Props): Promise<React.JSX.Element> {
  const { orderId } = await params;

  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      items: true,
      category: true,
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="flex gap-5">
      <div className="bg-yorz-dark w-[500px] rounded-xl border-1 border-white p-5 text-white shadow-lg">
        <p>Titre: {order.title}</p>
        <p>Description: {order.description ?? 'Non défini'}</p>
        <p>Type: {order.category?.title ?? 'Non défini'}</p>
        <p>
          Status:{' '}
          <span
            className={cn(
              'rounded-xl px-2 py-1 text-xs font-bold text-white',
              order.status === 'PENDING' && 'bg-orange-300',
              order.status === 'WORKING' && 'bg-blue-400',
              order.status === 'COMPLETED' && 'bg-green-700',
            )}
          >
            {order.status}
          </span>
        </p>
        <p>
          Livraison (estimée):{' '}
          {order.estimatedDeliveryDate?.toLocaleDateString() ?? 'Aucune date estimée'}
        </p>
        <p>Livraison (réelle): {order.deliveryDate?.toLocaleDateString() ?? 'Pas encore livré'}</p>
      </div>
      <div className="flex-1 rounded-xl border-1 border-white p-5">
        <div className="justify-self-center">
          <CreateItemDialog orderId={order.id} />
        </div>
        <div>
          {order.items.length === 0 && (
            <p className="mt-5 text-center text-xl text-gray-500/60">
              Aucun item pour le moment...
            </p>
          )}
          {order.items.length > 0 && (
            <div className="flex flex-col gap-5">
              {order.items.map(item => (
                <div key={item.id} className="flex items-center gap-1 text-white">
                  <p>{item.title}</p>
                  <ConfirmDialogDeleteItem itemId={item.id} />

                  <Button asChild>
                    <Link href={`${routes.admin.orders.home}/${orderId}/${item.id}`}>
                      <Eye size={20} />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
