import { Label } from '@radix-ui/react-label';

import { Button } from '@/components/ui/button';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminPortfolioCategoryManagement({
  params,
}: Props): Promise<React.JSX.Element> {
  const { id } = await params;

  const isCreation = id.toLocaleLowerCase() === 'create';

  async function handleSubmit(): Promise<void> {
    'use server';
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
            placeholder="ex: Illustration de Logo"
            className="cursor-pointer rounded-xl border-1 border-white p-2"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="font-medium">Description</Label>
          <input
            type="text"
            name="description"
            placeholder="ex: Illustration de logo, qui va définir l'axe graphique de votre marque"
            className="cursor-pointer rounded-xl border-1 border-white p-2"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="font-medium">Complément de description</Label>
          <input
            type="text"
            name="underDescription"
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
            placeholder="ex: 200€ à 300€"
            className="cursor-pointer rounded-xl border-1 border-white p-2"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="font-medium">Complément de prix</Label>
          <input
            type="text"
            name="priceComplement"
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
          >
            <option value="blue" selected>
              Bleu
            </option>
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
