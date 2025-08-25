import React from 'react';

import { Crown, MessageCircle, Trash, User } from 'lucide-react';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

import serverToast from '@/actions/toast/server-toast-action';
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

interface CommentRow {
  id: string;
  content: string;
  type: 'MESSAGE' | 'REPLY';
  parentId: string | null;
  createdAt: Date;
  user: { id: string; name: string; role: string | null };
  parent?: { content: string } | null;
}

const PortfolioItemCommentsSheet: React.FC<PortfolioItemCommentsSheetProps> = async ({
  portfolioItemId,
}) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isCurrentUserAdmin = (session?.user.role ?? '').toLowerCase().split(',').includes('admin');

  const rows: CommentRow[] = await prisma.portfolioItemComment.findMany({
    where: { itemId: portfolioItemId },
    select: {
      id: true,
      content: true,
      type: true,
      parentId: true,
      createdAt: true,
      user: { select: { id: true, name: true, role: true } },
      parent: { select: { content: true } },
    },
    orderBy: { createdAt: 'asc' },
  });

  const byParent = new Map<string | null, CommentRow[]>();
  for (const r of rows) {
    const key = r.parentId ?? null;
    const arr = byParent.get(key) ?? [];
    arr.push(r);
    byParent.set(key, arr);
  }

  const roots = (byParent.get(null) ?? []).filter(r => r.type === 'MESSAGE');

  async function handleSendMessage(formData: FormData): Promise<void> {
    'use server';

    const message = getStr(formData, 'message').trim();
    if (!message) return;

    const { headers } = await import('next/headers');
    const auth = (await import('@/lib/auth/auth')).default;
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
      await serverToast({
        type: 'error',
        message: 'Vous devez être connecté pour envoyer un message',
      });
      return;
    }

    await prisma.$transaction(async tx => {
      await tx.portfolioItemComment.create({
        data: {
          content: message,
          itemId: portfolioItemId,
          userId: session.user.id,
          type: 'MESSAGE',
        },
      });

      await tx.portfolioItem.update({
        where: { id: portfolioItemId },
        data: { commentsCount: { increment: 1 } },
      });
    });

    revalidatePath(routes.portfolio);
  }

  async function handleDeleteComment(formData: FormData): Promise<void> {
    'use server';
    const commentId = getStr(formData, 'commentId');
    if (!commentId) return;

    const { headers } = await import('next/headers');
    const auth = (await import('@/lib/auth/auth')).default;
    const session = await auth.api.getSession({ headers: await headers() });

    const comment = await prisma.portfolioItemComment.findUnique({
      where: { id: commentId },
      select: { id: true, userId: true, itemId: true },
    });

    if (!comment) return;

    const isCurrentUserAdminLocal = (session?.user.role ?? '')
      .toLowerCase()
      .split(',')
      .includes('admin');

    if (comment.userId !== session?.user.id && !isCurrentUserAdminLocal) {
      await serverToast({
        type: 'error',
        message: "Vous n'avez pas les permissions pour supprimer ce commentaire",
      });
      return;
    }

    await prisma.$transaction(async tx => {
      await tx.portfolioItemComment.delete({ where: { id: commentId } });
      await tx.portfolioItem.update({
        where: { id: comment.itemId },
        data: { commentsCount: { decrement: 1 } },
      });
    });

    revalidatePath(routes.portfolio);
  }

  const CommentNode = ({ node, depth }: { node: CommentRow; depth: number }): React.JSX.Element => {
    const children = byParent.get(node.id) ?? [];
    const isAdmin = (node.user.role ?? '').toLowerCase().split(',').includes('admin');

    const container = (
      <div className="flex flex-col gap-2">
        <div
          className={cn(
            'flex flex-col rounded-xl p-2',
            depth === 0 ? 'gap-2' : 'gap-1',
            isAdmin ? 'bg-yellow-700' : 'bg-blue-500',
          )}
        >
          <div className="flex justify-between">
            <div className="flex items-center gap-1">
              {isAdmin ? <Crown className="h-4 w-4" /> : <User className="h-4 w-4" />}
              <p className="text-sm">
                <span className="font-bold">{node.user.name}</span>
              </p>
            </div>
            <div className="flex gap-2">
              <ReplyCommentDialog
                itemId={portfolioItemId}
                commentId={node.id}
                commentContent={node.content}
                commentUser={node.user.name}
              />
              {(isCurrentUserAdmin || node.user.id === session?.user.id) && (
                <form action={handleDeleteComment}>
                  <input type="hidden" name="commentId" value={node.id} />
                  <button className="text-white" type="submit" title="Supprimer">
                    <Trash className="h-5 w-5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {depth > 0 && node.parent?.content && (
            <p className="text-sm text-white/50 italic">« {node.parent.content} »</p>
          )}

          <p className="break-all">{node.content}</p>
        </div>

        <p className="text-right text-sm text-gray-500">
          {node.createdAt.toLocaleDateString()} à{' '}
          {node.createdAt.toLocaleString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    );

    return (
      <div className="flex flex-col gap-2">
        {container}
        {children.length > 0 && (
          <div className="flex flex-col gap-2 pl-8">
            {children.map(child => (
              <CommentNode key={child.id} node={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <MessageCircle className="h-10 w-10 cursor-pointer text-white" />
      </SheetTrigger>
      <SheetContent className="bg-yorz-dark border-none">
        <SheetHeader>
          <SheetTitle className="text-white">Commentaires</SheetTitle>
          <SheetDescription>
            Donnez votre avis, exprimez-vous, partagez votre expérience
          </SheetDescription>
        </SheetHeader>

        <div
          className={cn(
            'grid flex-1 auto-rows-min gap-4 overflow-y-auto px-4 text-white',
            roots.length === 0 && 'flex h-full items-center justify-center',
          )}
        >
          {roots.length === 0 && (
            <p className="text-center text-white">Aucun commentaire pour le moment...</p>
          )}

          {roots.length > 0 &&
            roots.map(root => (
              <div key={root.id} className="flex flex-col gap-2">
                <CommentNode node={root} depth={0} />
              </div>
            ))}
        </div>

        <SheetFooter>
          <form action={handleSendMessage} className="flex flex-col gap-2">
            <Textarea
              placeholder="Magnifique cet icon ! Félicitations !"
              className="bg-yorz-dark border-1 border-white text-white"
              name="message"
            />
            <Button type="submit" disabled={!session}>
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
