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
        className="flex w-fit flex-col gap-5 rounded-xl border-1 border-white p-5"
      >
        <div className="flex flex-col gap-1">
          <Label className="font-medium">Media</Label>
          <input
            type="file"
            accept="image/*,video/*"
            name="media"
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
