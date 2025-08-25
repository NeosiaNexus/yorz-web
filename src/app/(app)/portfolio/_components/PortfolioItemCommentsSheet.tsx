import { MessageCircle, User } from 'lucide-react';
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
import { getStr } from '@/lib/utils/formDataUtils';

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
        <div className="grid flex-1 auto-rows-min gap-3 overflow-y-auto px-4 text-white">
          {portfolioItemComments.map(comment => (
            <div key={comment.id} className="flex flex-col gap-2 rounded-xl bg-blue-500 p-2">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <p className="text-sm">
                  <span className="font-bold">{comment.user.name}</span> ⋅{' '}
                  {comment.createdAt.toLocaleDateString()} à{' '}
                  {comment.createdAt.toLocaleString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <p className="break-all">{comment.content}</p>
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
