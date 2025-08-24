import { createId } from '@paralleldrive/cuid2';
import { OrderStepType } from '@prisma/client';
import { Plus } from 'lucide-react';
import { revalidatePath } from 'next/cache';

import { uploadFileAction } from '@/actions/cloud-storage-file';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { routes } from '@/lib/boiler-config';
import prisma from '@/lib/prisma';
import { getOptFile, getOptStr, getStr } from '@/lib/utils/formDataUtils';

interface CreateOrderItemStepDialogProps {
  orderItemId: string;
}

const CreateOrderItemStepDialog = ({
  orderItemId,
}: CreateOrderItemStepDialogProps): React.JSX.Element => {
  async function handleCreateOrderStep(formData: FormData): Promise<void> {
    'use server';

    const description = getOptStr(formData, 'description');
    const type = getStr(formData, 'type') as OrderStepType;
    const item = getOptFile(formData, 'item');

    if (!item || item.size === 0) {
      await serverToast({
        type: 'error',
        message:
          'Veuillez ajouter un visuel pour permettre au client de voir la mise à jour depuis la dernière fois',
      });
      return;
    }

    const uploadItem = await uploadFileAction({
      bucket: 'order-steps',
      path: `${orderItemId}/${createId()}`,
      fileData: {
        type: item.type,
        name: item.name,
        size: item.size,
        arrayBuffer: await item.arrayBuffer(),
      },
      isPublic: false,
    });

    if (!uploadItem.data?.success) {
      await serverToast({
        type: 'error',
        message: 'Une erreur est survenue lors de l&apos;envoi du visuel',
      });
      return;
    }

    await prisma.orderStep.create({
      data: {
        description,
        type,
        itemId: uploadItem.data.data.id,
        orderItemId,
      },
    });

    revalidatePath(routes.home);
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          className="w-fit cursor-pointer rounded-xl bg-[#00863A] hover:bg-[#00863A]/80"
        >
          <Plus size={20} />
          Publier une mise à jour
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Publier une mise à jour</DialogTitle>
          <DialogDescription>
            Publiez une mise à jour pour tenir le client informé de l&apos;avancement de la
            commande.
          </DialogDescription>
        </DialogHeader>

        <form action={handleCreateOrderStep} className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={4}
              placeholder="Expliquez ce que vous avez modifié depuis la dernière mise à jour"
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="type">Type</Label>
            <Select name="type" defaultValue="NORMAL">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent defaultValue="NORMAL">
                <SelectItem value="NORMAL">Normal (simple mise à jour)</SelectItem>
                <SelectItem value="FINAL">Final (livrable final)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-muted-foreground text-xs">
              Le livrable final est le fichier que le client pourra télécharger.
            </p>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="item">Visuel</Label>
            <Input type="file" name="item" />
          </div>
          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Annuler
              </Button>
            </DialogClose>
            <Button type="submit">Publier</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateOrderItemStepDialog;
