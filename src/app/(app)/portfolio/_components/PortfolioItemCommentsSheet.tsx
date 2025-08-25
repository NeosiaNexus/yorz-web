import { Crown, MessageCircle, Trash, User } from 'lucide-react';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import auth from '@/lib/auth/auth';
import { routes } from '@/lib/boiler-config';
import prisma from '@/lib/prisma';
import { cn } from '@/lib/utils';
import { getStr } from '@/lib/utils/formDataUtils';

import ReplyCommentDialog from './ReplyCommentDialog';

interface PortfolioItemCommentsSheetProps {
  portfolioItemId: string;
}

const PortfolioItemCommentsSheet: React.FC<PortfolioItemCommentsSheetProps> = async ({
  portfolioItemId,
}) => {
  const user = await auth.api.getSession({
    headers: await headers(),
  });

  const portfolioItemComments = await prisma.portfolioItemComment.findMany({
    where: {
      itemId: portfolioItemId,
    },
    include: {
      user: true,
      replies: {
        include: {
          user: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  });

  async function handleSendMessage(formData: FormData): Promise<void> {
    'use server';

    const message = getStr(formData, 'message');

    if (!message) return;

    await prisma.portfolioItemComment.create({
      data: {
        content: message,
        itemId: portfolioItemId,
        userId: user?.user.id ?? '',
        type: 'MESSAGE',
      },
    });

    revalidatePath(routes.portfolio);
  }

  async function handleDeleteComment(formData: FormData): Promise<void> {
    'use server';
    const commentId = getStr(formData, 'commentId');

    if (!commentId) return;

    const comment = await prisma.portfolioItemComment.findUnique({
      where: { id: commentId },
    });

    if (!comment) return;

    if (comment.userId !== user?.user.id) return;

    await prisma.portfolioItemComment.delete({
      where: { id: commentId },
    });

    revalidatePath(routes.portfolio);
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <MessageCircle className="h-10 w-10 cursor-pointer text-white" />
      </SheetTrigger>
      <SheetContent className="bg-yorz-dark border-none">
        <SheetHeader>
          <SheetTitle className="text-white">Commentaires</SheetTitle>
          <SheetDescription>
            Donnez votres avis, exprimez vous, partagez votre expérience
          </SheetDescription>
        </SheetHeader>
        <div
          className={cn(
            'grid flex-1 auto-rows-min gap-4 overflow-y-auto px-4 text-white',
            portfolioItemComments.length === 0 && 'flex h-full items-center justify-center',
          )}
        >
          {portfolioItemComments.length === 0 && (
            <div className="flex h-full items-center justify-center">
              <p className="my-auto flex justify-center text-center text-white">
                Aucun commentaire pour le moment...
              </p>
            </div>
          )}
          {portfolioItemComments
            .filter(comment => comment.type === 'MESSAGE')
            .map(comment => {
              const isAdmin = comment.user.role?.toLowerCase().split(',').includes('admin');
              return (
                <div key={comment.id} className="flex flex-col gap-2">
                  <div className="flex flex-col gap-2">
                    <div
                      className={cn(
                        'flex flex-col gap-2 rounded-xl p-2',
                        isAdmin ? 'bg-yellow-700' : 'bg-blue-500',
                      )}
                    >
                      <div className="flex justify-between">
                        <div className="flex items-center gap-1">
                          {isAdmin ? <Crown className="h-4 w-4" /> : <User className="h-4 w-4" />}
                          <p className="text-sm">
                            <span className="font-bold">{comment.user.name}</span>
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <ReplyCommentDialog
                            itemId={portfolioItemId}
                            commentId={comment.id}
                            commentContent={comment.content}
                            commentUser={comment.user.name}
                          />
                          {(comment.user.id === user?.user.id || isAdmin) && (
                            <form action={handleDeleteComment}>
                              <input type="hidden" name="commentId" value={comment.id} />
                              <button className="text-white" type="submit">
                                <Trash className="h-5 w-5" />
                              </button>
                            </form>
                          )}
                        </div>
                      </div>
                      <p className="break-all">{comment.content}</p>
                    </div>
                    <p className="text-right text-sm text-gray-500">
                      {comment.createdAt.toLocaleDateString()} à{' '}
                      {comment.createdAt.toLocaleString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 pl-8">
                    {comment.replies.length > 0 &&
                      comment.replies.map(reply => {
                        const isReplyAdmin = reply.user?.role
                          ?.toLowerCase()
                          .split(',')
                          .includes('admin');
                        return (
                          <div key={reply.id} className="flex flex-col gap-2">
                            <div
                              className={cn(
                                'flex flex-col gap-2 rounded-xl p-2',
                                isReplyAdmin ? 'bg-yellow-700' : 'bg-blue-500',
                              )}
                            >
                              <div className="flex justify-between">
                                <div className="flex items-center gap-1">
                                  {isReplyAdmin ? (
                                    <Crown className="h-4 w-4" />
                                  ) : (
                                    <User className="h-4 w-4" />
                                  )}
                                  <p className="text-sm">
                                    <span className="font-bold">{reply.user.name}</span> à{' '}
                                    <span className="font-bold">{comment.user.name}</span>
                                  </p>
                                </div>
                                {(reply.user.id === user?.user.id || isReplyAdmin) && (
                                  <form action={handleDeleteComment}>
                                    <input type="hidden" name="commentId" value={reply.id} />
                                    <button className="text-white" type="submit">
                                      <Trash className="h-5 w-5" />
                                    </button>
                                  </form>
                                )}
                              </div>
                              <p className="break-all">{reply.content}</p>
                            </div>
                            <p className="text-right text-sm text-gray-500">
                              {reply.createdAt.toLocaleDateString()} à{' '}
                              {reply.createdAt.toLocaleString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        );
                      })}
                  </div>
                </div>
              );
            })}
        </div>
        <SheetFooter>
          <form action={handleSendMessage} className="flex flex-col gap-2">
            <Textarea
              placeholder="Magnifique cet icon ! Félicitations !"
              className="bg-yorz-dark border-1 border-white text-white"
              name="message"
            />
            <Button type="submit" disabled={!user}>
              Envoyer
            </Button>
          </form>

          <SheetClose asChild>
            <Button variant="outline">Annuler</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default PortfolioItemCommentsSheet;
