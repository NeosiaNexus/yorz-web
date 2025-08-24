import { Eye } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { downloadFileAction } from '@/actions/cloud-storage-file';
import serverToast from '@/actions/toast/server-toast-action';
import { Button } from '@/components/ui/button';
import { routes } from '@/lib/boiler-config';
import images from '@/lib/boiler-config/images';
import prisma from '@/lib/prisma';

import ConfirmDeleteStepDialog from './_components/ConfirmDeleteStepDialog';
import CreateOrderItemStepDialog from './_components/CreateOrderItemStepDialog';

interface Props {
  params: Promise<{ orderId: string; itemId: string }>;
}

export default async function AdminOrderItem({ params }: Props): Promise<React.JSX.Element> {
  const { orderId, itemId } = await params;

  const orderItem = await prisma.orderItem.findUnique({
    where: {
      id: itemId,
      orderId,
    },
    include: {
      steps: {
        include: {
          item: true,
        },
      },
    },
  });

  if (!orderItem) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="self-center justify-self-center">
        <CreateOrderItemStepDialog orderItemId={orderItem.id} />
      </div>
      {orderItem.steps.map(step => (
        <div key={step.id}>
          <p>{step.description}</p>
        </div>
      ))}
      {orderItem.steps.length === 0 && (
        <p className="w-full text-center text-white">
          Aucune mise à jour d&apos;étape n&apos;a été effectuée pour le moment.
        </p>
      )}
      {orderItem.steps.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {orderItem.steps.map(async step => {
            const mediaDownload = step.item
              ? await downloadFileAction({
                  bucket: step.item.bucket,
                  path: step.item.path,
                })
                  .then(res => res.data?.url ?? images.NO_IMG.src)
                  .catch(async () => {
                    await serverToast({
                      type: 'error',
                      message: 'Une erreur est survenue lors du téléchargement du fichier',
                    });
                    return images.NO_IMG.src;
                  })
              : images.NO_IMG.src;
            return (
              <div key={step.id} className="relative flex items-center justify-center">
                <p>{step.description}</p>
                <div className="relative h-[300px] w-[500px] transition-all duration-300 hover:scale-105">
                  <Image
                    src={mediaDownload}
                    alt={'Image de mise à jour'}
                    width={3000}
                    height={3000}
                    unoptimized
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-0 right-0 flex gap-2 p-3">
                    <ConfirmDeleteStepDialog stepId={step.id} />
                    <Button asChild className="rounded-xl">
                      <Link href={`${routes.admin.orders.home}/${orderId}/${itemId}/${step.id}`}>
                        <Eye size={20} />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
