import { Reply } from 'lucide-react';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

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
import auth from '@/lib/auth/auth';
import { routes } from '@/lib/boiler-config';
import prisma from '@/lib/prisma';
import { getStr } from '@/lib/utils/formDataUtils';

interface ReplyCommentDialogProps {
  itemId: string;
  commentId: string;
  commentUser: string;
  commentContent: string;
}

const ReplyCommentDialog = async ({
  itemId,
  commentId,
  commentUser,
  commentContent,
}: ReplyCommentDialogProps): Promise<React.JSX.Element> => {
  const user = await auth.api.getSession({
    headers: await headers(),
  });

  async function handleReplyComment(formData: FormData): Promise<void> {
    'use server';

    const message = getStr(formData, 'message');

    if (!message) return;

    if (!user) {
      await serverToast({
        type: 'error',
        message: 'Vous devez être connecté pour répondre à un commentaire',
      });
      return;
    }

    await prisma.portfolioItemComment.create({
      data: {
        content: message,
        itemId,
        type: 'REPLY',
        userId: user?.user.id,
        parentId: commentId,
      },
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
          <div className="grid gap-3">
            <Textarea
              id="message"
              name="message"
              rows={4}
              placeholder={`Merci pour ton avis ${commentUser} !`}
            />
          </div>
          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Annuler
              </Button>
            </DialogClose>
            <Button type="submit">Répondre</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReplyCommentDialog;
