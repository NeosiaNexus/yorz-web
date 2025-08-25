import { Reply } from 'lucide-react';
import { revalidatePath } from 'next/cache';

import serverToast from '@/actions/toast/server-toast-action';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { routes } from '@/lib/boiler-config';
import prisma from '@/lib/prisma';
import { getStr } from '@/lib/utils/formDataUtils';

import PendingFieldset from './PendingFieldset';
import SubmitReplyButton from './SubmitReplyButton';

interface ReplyCommentDialogProps {
  itemId: string;
  commentId: string;
  commentUser: string;
  commentContent: string;
}

const ReplyCommentDialog = ({
  itemId,
  commentId,
  commentUser,
  commentContent,
}: ReplyCommentDialogProps): React.JSX.Element => {
  async function handleReplyComment(formData: FormData): Promise<void> {
    'use server';

    const { headers } = await import('next/headers');
    const auth = (await import('@/lib/auth/auth')).default;
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const content = getStr(formData, 'message').trim();

    if (!content) return;

    if (!session) {
      await serverToast({
        type: 'error',
        message: 'Vous devez être connecté pour répondre à un commentaire',
      });
      return;
    }

    await prisma.$transaction(async tx => {
      const parent = await tx.portfolioItemComment.findUnique({
        where: { id: commentId },
        select: { itemId: true },
      });
      if (!parent || parent.itemId !== itemId) {
        await serverToast({
          type: 'error',
          message:
            "Une erreur est survenue lors de la réponse au commentaire. Si le problème persiste, veuillez contacter l'administrateur.",
        });
        return;
      }

      await tx.portfolioItemComment.create({
        data: { content, itemId, type: 'REPLY', userId: session.user.id, parentId: commentId },
      });

      await tx.portfolioItem.update({
        where: { id: itemId },
        data: { commentsCount: { increment: 1 } },
      });
    });

    revalidatePath(routes.portfolio);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Reply className="h-5 w-5 cursor-pointer" />
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Répondre à {commentUser}</DialogTitle>
          <DialogDescription>
            Répondez au message suivant : <span className="font-bold">{commentContent}</span>
          </DialogDescription>
        </DialogHeader>

        <form action={handleReplyComment} className="grid gap-4">
          <PendingFieldset>
            <div className="grid gap-3">
              <Textarea
                id="message"
                name="message"
                rows={4}
                placeholder={`Merci pour ton avis ${commentUser} !`}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Annuler
                </Button>
              </DialogClose>
              <SubmitReplyButton />
            </div>
          </PendingFieldset>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReplyCommentDialog;
