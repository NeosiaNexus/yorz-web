import { File, MessageCircle, Send } from 'lucide-react';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import Image from 'next/image';
import { notFound, unauthorized } from 'next/navigation';

import { downloadFileAction } from '@/actions/cloud-storage-file';
import serverToast from '@/actions/toast/server-toast-action';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import auth from '@/lib/auth/auth';
import { routes } from '@/lib/boiler-config';
import images from '@/lib/boiler-config/images';
import prisma from '@/lib/prisma';
import { getStr } from '@/lib/utils/formDataUtils';

interface Props {
  params: Promise<{ itemId: string; stepId: string }>;
}

export default async function AdminOrderItemStep({ params }: Props): Promise<React.JSX.Element> {
  const { itemId, stepId } = await params;

  const user = await auth.api.getSession({
    headers: await headers(),
  });

  if (!user) {
    unauthorized();
  }

  const step = await prisma.orderStep.findUnique({
    where: {
      id: stepId,
      orderItemId: itemId,
    },
    include: {
      feedbacks: {
        include: {
          author: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
      item: true,
    },
  });

  if (!step) {
    notFound();
  }

  const media = step?.item
    ? await downloadFileAction({
        bucket: step.item.bucket,
        path: step.item.path,
      })
        .then(res => res.data?.url ?? images.NO_IMG.src)
        .catch(() => images.NO_IMG.src)
    : images.NO_IMG.src;

  return (
    <div className="mx-auto grid w-full max-w-screen-xl grid-cols-1 items-center gap-6 px-4 lg:grid-cols-2">
      {/* Colonne gauche */}
      <div className="flex min-w-0 flex-col items-center">
        <Image
          src={media}
          alt="Media"
          width={3000}
          height={3000}
          unoptimized
          className="h-auto max-h-[70vh] w-full object-contain"
        />
        <p className="mt-5 text-center text-sm text-white">
          Mise à jour publiée
          {step.createdAt.toDateString() === new Date().toDateString()
            ? " aujourd'hui à "
            : ' le ' +
              step.createdAt.toLocaleString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
          {' à '}
          {step.createdAt.toLocaleString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
        </p>
        <p className="mt-1 text-center text-sm text-white">
          Description: <span className="text-gray-500">{step.description ?? 'Non renseignée'}</span>
        </p>
      </div>

      {/* Colonne droite */}
      <div className="flex min-w-0 flex-col gap-3">
        <div className="rounded-lg bg-gray-900 p-5">
          <p className="flex items-center gap-2 text-2xl font-bold text-white">
            <MessageCircle /> Conversation
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Une remarque ? Un problème ? Engagez la conversation dès maintenant
          </p>
        </div>

        <div className="flex h-[300px] flex-col gap-3 overflow-y-auto rounded-lg bg-gray-900 p-5 text-white">
          {step.feedbacks.length === 0 ? (
            <p className="flex h-full items-center justify-center text-center text-gray-500">
              Aucun message, démarrez la discussion dès maintenant
            </p>
          ) : (
            step.feedbacks.map(feedback => (
              <div
                key={feedback.id}
                className={`flex w-full ${
                  feedback.authorId === user.user.id
                    ? 'justify-end text-right'
                    : 'justify-start text-left'
                }`}
              >
                <div
                  className={`flex max-w-[70%] flex-col rounded-lg p-3 ${
                    feedback.authorId === user.user.id
                      ? 'rounded-tr-none bg-blue-600'
                      : 'rounded-tl-none bg-gray-700'
                  }`}
                >
                  <span className="mb-1 text-sm text-gray-300">
                    {feedback.authorId === user.user.id ? 'Vous' : feedback.author.name}
                  </span>
                  <p className="break-all">{feedback.message}</p>
                  <p className="text-xs text-white/50">
                    {feedback.createdAt.toDateString() !== new Date().toDateString() &&
                      'Le ' +
                        feedback.createdAt.toLocaleString('fr-FR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        }) +
                        ' à '}
                    {feedback.createdAt.toLocaleString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex w-full items-center gap-3 rounded-lg bg-gray-900 p-3">
          <form
            className="flex flex-1 items-center gap-3"
            action={async (formData: FormData) => {
              'use server';
              const message = getStr(formData, 'message');
              if (!message) {
                await serverToast({ type: 'error', message: 'Le message ne peut pas être vide' });
                return;
              }
              await prisma.orderStepFeedback.create({
                data: { message, orderStepId: stepId, authorId: user.user.id },
              });
              revalidatePath(routes.home);
            }}
          >
            <Textarea
              className="max-h-[100px] w-full resize-none rounded-lg bg-gray-800 p-3 text-white"
              placeholder="Écrivez votre message..."
              name="message"
              rows={10}
            />
            <Button
              type="submit"
              className="text-yorz-dark rounded-lg bg-white p-3 hover:bg-white/80"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>

          <form className="flex">
            <Button
              variant="outline"
              className="text-yorz-dark rounded-lg bg-white p-3 hover:bg-white/80"
            >
              <File />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
