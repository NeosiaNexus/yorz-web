import React from 'react';

import { Plus } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { routes } from '@/lib/boiler-config';
import prisma from '@/lib/prisma';
import { getNumber, getOptStr, getStr } from '@/lib/utils/formDataUtils';

interface CreateItemDialogProps {
  orderId: string;
}

const CreateItemDialog: React.FC<CreateItemDialogProps> = ({ orderId }) => {
  async function handleCreateItem(formData: FormData): Promise<void> {
    'use server';

    const title = getStr(formData, 'title');
    const price = getNumber(formData, 'price');
    if (!title) {
      await serverToast({ message: 'Le titre est obligatoire', type: 'error' });
      return;
    }
    if (!price) {
      await serverToast({ message: 'Le prix est obligatoire', type: 'error' });
      return;
    }

    const description = getOptStr(formData, 'description');

    try {
      await prisma.orderItem.create({
        data: {
          title,
          price,
          description,
          orderId,
        },
      });
      await serverToast({ message: 'Item créé avec succès', type: 'success' });
      revalidatePath(routes.home);
    } catch {
      await serverToast({ message: "Erreur lors de la création de l'item", type: 'error' });
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          className="cursor-pointer rounded-xl bg-[#00863A] hover:bg-[#00863A]/80"
        >
          <Plus size={20} />
          Créer un item
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Créer un item</DialogTitle>
          <DialogDescription>Commencez à créer un item pour cette commande</DialogDescription>
        </DialogHeader>

        <form action={handleCreateItem} className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="title">
              Titre{' '}
              <span className="-ml-1 text-red-500" title="obligatoire">
                *
              </span>
            </Label>
            <Input id="title" name="title" placeholder="ex: Logo version hiver" />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" rows={4} maxLength={200} />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="price">
              Prix{' '}
              <span className="-ml-1 text-red-500" title="obligatoire">
                *
              </span>
            </Label>
            <Input id="price" name="price" placeholder="ex: 100" type="number" />
          </div>
          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Annuler
              </Button>
            </DialogClose>
            <Button type="submit">Ajouter</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateItemDialog;
