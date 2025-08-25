import { Order, OrderItem, PortfolioCategory } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { routes } from '@/lib/boiler-config';
import prisma from '@/lib/prisma';

interface OrderItemRow {
  order: Order & {
    category?: PortfolioCategory;
    items: OrderItem[];
  };
}

const OrderItemRow: React.FC<OrderItemRow> = ({ order }) => {
  return (
    <form
      className="flex flex-col gap-4"
      action={async () => {
        'use server';

        await prisma.order.delete({
          where: {
            id: order.id,
          },
        });

        revalidatePath(routes.admin.orders.home);
      }}
    >
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold">{order.category?.title}</h3>
        <p>titre: {order.title}</p>
        <p>description: {order.description ?? 'Aucune description'}</p>
        <p>
          date de livraison (estimée):{' '}
          {order.estimatedDeliveryDate?.toLocaleDateString() ?? 'Aucune date estimée'}
        </p>
        <p>
          date de livraison (réelle):{' '}
          {order.deliveryDate?.toLocaleDateString() ?? 'Pas encore livré'}
        </p>
        <p>status: {order.status}</p>
        <p>date de création: {order.createdAt.toLocaleDateString()}</p>
        <p>Prix total: {order.items.reduce((acc, item) => acc + item.price, 0)}€</p>
        <Button type="submit" variant={'destructive'}>
          Supprimer
        </Button>
        <Button type="button" className="w-full" asChild>
          <Link href={`${routes.admin.orders.home}/${order.id}`}>Modifier</Link>
        </Button>
      </div>
    </form>
  );
};

export default OrderItemRow;
