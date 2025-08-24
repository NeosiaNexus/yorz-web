import { Trash, TriangleAlert } from 'lucide-react';
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
import { routes } from '@/lib/boiler-config';
import prisma from '@/lib/prisma';
import { getStr } from '@/lib/utils/formDataUtils';

interface ConfirmDialogDeleteItemProps {
  itemId: string;
}

const ConfirmDialogDeleteItem = ({ itemId }: ConfirmDialogDeleteItemProps): React.JSX.Element => {
  async function handleDeleteItem(formData: FormData): Promise<void> {
    'use server';

    const itemId = getStr(formData, 'itemId');

    try {
      await prisma.orderItem.delete({
        where: { id: itemId },
      });
      await serverToast({ message: 'Item supprimé avec succès', type: 'success' });
      revalidatePath(routes.home);
    } catch {
      await serverToast({ message: "Erreur lors de la suppression de l'item", type: 'error' });
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Trash size={20} className="cursor-pointer text-red-500" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer l&apos;item</DialogTitle>
          <DialogDescription>Êtes-vous sûr de vouloir supprimer cet item ?</DialogDescription>
        </DialogHeader>
        <form action={handleDeleteItem}>
          <input type="hidden" name="itemId" value={itemId} />
          <div className="flex flex-col gap-2 border-l-4 border-l-red-600 bg-red-400/20 p-5">
            <div className="flex items-center gap-2 font-bold text-red-500">
              <TriangleAlert size={20} className="text-red-500" />
              <p>Attention</p>
            </div>
            <p className="text-sm text-red-500">
              Cette action est irréversible. Vous ne pourrez pas récupérer l&apos;item supprimé.
            </p>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Annuler
              </Button>
            </DialogClose>
            <Button type="submit" variant={'destructive'}>
              <Trash size={20} />
              Supprimer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialogDeleteItem;
