export const dynamic = 'force-dynamic';

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

const CreateOrderDialog = async (): Promise<React.JSX.Element> => {
  const categories = await prisma.portfolioCategory.findMany({
    select: { id: true, title: true },
    orderBy: { title: 'asc' },
  });

  async function handleCreateOrder(formData: FormData): Promise<void> {
    'use server';

    const getStr = (name: string): string => formData.get(name)?.toString().trim() ?? '';
    const getOptStr = (name: string): string | undefined => {
      const v = getStr(name);
      return v.length ? v : undefined;
    };
    const getOptDate = (name: string): Date | undefined => {
      const v = getStr(name);
      if (!v) return undefined;
      const d = new Date(v);
      return isNaN(d.getTime()) ? undefined : d;
    };

    const title = getStr('title');
    if (!title) {
      await serverToast({ message: 'Le titre est obligatoire', type: 'error' });
      return;
    }

    try {
      await prisma.order.create({
        data: {
          title,
          description: getOptStr('description'),
          categoryId: getOptStr('categoryId'),
          estimatedDeliveryDate: getOptDate('estimatedDeliveryDate'),
        },
      });

      await serverToast({ message: 'Commande créée avec succès', type: 'success' });
      revalidatePath(routes.admin.orders.home);
    } catch {
      await serverToast({
        message: 'Erreur lors de la création de la commande',
        type: 'error',
      });
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
          Créer une commande
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Créer une commande</DialogTitle>
          <DialogDescription>Commencez à créer une commande pour un client.</DialogDescription>
        </DialogHeader>

        <form action={handleCreateOrder} className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="title">
              Titre{' '}
              <span className="-ml-1 text-red-500" title="obligatoire">
                *
              </span>
            </Label>
            <Input id="title" name="title" placeholder="ex: Logo - Rinaorc (SlayerAdventure)" />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" rows={4} />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="categoryId">Catégorie</Label>
            <Select name="categoryId">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-3">
            <Label htmlFor="estimatedDeliveryDate">Livraison (estimée)</Label>
            <Input id="estimatedDeliveryDate" name="estimatedDeliveryDate" type="date" />
            <p className="text-muted-foreground text-xs">Date estimée de livraison finale.</p>
          </div>

          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Annuler
              </Button>
            </DialogClose>
            <Button type="submit">Créer</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateOrderDialog;
