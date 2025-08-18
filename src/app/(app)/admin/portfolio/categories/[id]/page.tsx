import { PortfolioCategory } from '@prisma/client';
import { Label } from '@radix-ui/react-label';
import { redirect } from 'next/navigation';

import createPortfolioCategorieAction from '@/actions/portfolio/categories/create-portfolio-categorie-action';
import serverToast from '@/actions/toast/server-toast-action';
import { Button } from '@/components/ui/button';
import { parseZodErrors } from '@/lib/actions/parse-zod-errors';
import prisma from '@/lib/prisma';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminPortfolioCategoryManagement({
  params,
}: Props): Promise<React.JSX.Element> {
  const { id } = await params;

  const isCreation = id.toLocaleLowerCase() === 'create';

  let category: PortfolioCategory | null = null;

  if (!isCreation) {
    category = await prisma.portfolioCategory.findUnique({
      where: {
        id,
      },
    });
  }

  async function handleSubmit(formData: FormData): Promise<void> {
    'use server';

    const data = Object.fromEntries(formData);

    const mediaExample = data.mediaExample as File;

    const result = await createPortfolioCategorieAction({
      title: data.title as string,
      description: data.description as string,
      underDescription: data.underDescription as string,
      price: data.price as string,
      priceComplement: data.priceComplement as string,
      colorVariant: data.colorVariant as 'blue' | 'green' | 'red',
      mediaExample: {
        name: mediaExample.name,
        type: mediaExample.type,
        size: mediaExample.size,
        arrayBuffer: await mediaExample.arrayBuffer(),
      },
    });

    const validationErrors = parseZodErrors(result.validationErrors ?? {});

    if (validationErrors.length > 0) {
      await serverToast({
        type: 'error',
        message: validationErrors[0].message,
      });
      return;
    }

    if (!result.data?.success) {
      await serverToast({
        type: 'error',
        message: result.data?.message ?? 'Erreur lors de la création de la catégorie du portfolio',
      });
      return;
    }

    await serverToast({
      type: 'success',
      message: result.data?.message ?? 'Catégorie du portfolio créée avec succès',
    });

    redirect('/admin/portfolio/categories');
  }

  return (
    <div className="flex flex-col items-center justify-center gap-5 text-white">
      <p className="font-comodo py-5 text-center text-5xl text-[#FF0066]">
        {isCreation ? 'Creation' : 'Modification'} d&apos;une categorie
      </p>
      <form
        action={handleSubmit}
        className="flex w-[40%] flex-col gap-5 rounded-xl border-1 border-white p-5"
      >
        <div className="flex flex-col gap-1">
          <Label className="font-medium">
            Titre
            <span className="cursor-help text-red-500" title="Champ obligatoire">
              *
            </span>
          </Label>
          <input
            type="text"
            name="title"
            defaultValue={category?.title}
            placeholder="ex: Illustration de Logo"
            className="cursor-pointer rounded-xl border-1 border-white p-2"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="font-medium">Description</Label>
          <input
            type="text"
            name="description"
            defaultValue={category?.description ?? undefined}
            placeholder="ex: Illustration de logo, qui va définir l'axe graphique de votre marque"
            className="cursor-pointer rounded-xl border-1 border-white p-2"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="font-medium">Complément de description</Label>
          <input
            type="text"
            name="underDescription"
            defaultValue={category?.underDescription ?? undefined}
            placeholder="ex: Offert avec un icône et une bannière (tiré du logo)."
            className="cursor-pointer rounded-xl border-1 border-white p-2"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="font-medium">
            Prix
            <span className="cursor-help text-red-500" title="Champ obligatoire">
              *
            </span>
          </Label>
          <input
            type="text"
            name="price"
            defaultValue={category?.price ?? undefined}
            placeholder="ex: 200€ à 300€"
            className="cursor-pointer rounded-xl border-1 border-white p-2"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="font-medium">Complément de prix</Label>
          <input
            type="text"
            name="priceComplement"
            defaultValue={category?.priceComplement ?? undefined}
            placeholder="ex: Commande de 150€ minimum"
            className="cursor-pointer rounded-xl border-1 border-white p-2"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="font-medium">
            Couleur
            <span className="cursor-help text-red-500" title="Champ obligatoire">
              *
            </span>
          </Label>
          <select
            name="colorVariant"
            className="bg-yorz-dark cursor-pointer rounded-xl border-1 border-white p-2"
            defaultValue={category?.colorVariant ?? undefined}
          >
            <option value="blue">Bleu</option>
            <option value="green">Vert</option>
            <option value="red">Rouge</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <Label className="font-medium">Image d&apos;exemple</Label>
          <input
            type="file"
            accept="image/*,video/*"
            name="mediaExample"
            className="cursor-pointer rounded-xl border-1 border-white p-2"
          />
        </div>
        <Button className="cursor-pointer rounded-xl bg-[#00863A] hover:bg-[#00863A]/80">
          {isCreation ? 'Créer' : 'Modifier'}
        </Button>
      </form>
    </div>
  );
}
