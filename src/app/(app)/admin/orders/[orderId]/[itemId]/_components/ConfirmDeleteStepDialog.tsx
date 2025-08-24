import { Trash, TriangleAlert } from 'lucide-react';
import { revalidatePath } from 'next/cache';

import { removeFilesAction } from '@/actions/cloud-storage-file';
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

interface ConfirmDeleteStepDialogProps {
  stepId: string;
}

const ConfirmDeleteStepDialog = ({ stepId }: ConfirmDeleteStepDialogProps): React.JSX.Element => {
  async function handleDeleteStep(formData: FormData): Promise<void> {
    'use server';

    const stepId = getStr(formData, 'stepId');
    if (!stepId) {
      await serverToast({
        type: 'error',
        message: "Impossible de supprimer la mise à jour, l'id n'est pas founit",
      });
      return;
    }

    const step = await prisma.orderStep.findUnique({
      where: {
        id: stepId,
      },
      include: {
        item: true,
      },
    });

    if (!step) {
      await serverToast({
        type: 'error',
        message: "Impossible de supprimer la mise à jour, la mise à jour n'existe pas",
      });
      return;
    }

    if (step.item) {
      const res = await removeFilesAction({
        bucket: step.item.bucket,
        paths: [step.item.path],
      });

      if (!res.data?.success) {
        await serverToast({
          type: 'error',
          message: 'La suppression du visuel de la mise à jour a échoué',
        });
        return;
      }
    }

    try {
      await prisma.orderStep.delete({
        where: {
          id: stepId,
        },
      });

      await serverToast({
        type: 'success',
        message: 'La mise à jour a été supprimée avec succès',
      });

      revalidatePath(routes.home);
    } catch {
      await serverToast({
        type: 'error',
        message: 'La suppression de la mise à jour a échoué',
      });
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={'destructive'} className="rounded-xl text-white">
          <Trash size={20} className="cursor-pointer" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer la mise à jour</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer cette mise à jour ?
          </DialogDescription>
        </DialogHeader>
        <form action={handleDeleteStep}>
          <input type="hidden" name="stepId" value={stepId} />
          <div className="flex flex-col gap-2 border-l-4 border-l-red-600 bg-red-400/20 p-5">
            <div className="flex items-center gap-2 font-bold text-red-500">
              <TriangleAlert size={20} className="text-red-500" />
              <p>Attention</p>
            </div>
            <p className="text-sm text-red-500">
              Cette action est irréversible. Vous ne pourrez pas récupérer la mise à jour supprimée.
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

export default ConfirmDeleteStepDialog;
