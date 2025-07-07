import updatePortfolioItemAction from '@/actions/portfolio/item/update-portfolio-item-action';
import uploadPortfolioItemAction from '@/actions/portfolio/item/upload-portfolio-item-action';
import { Button } from '@/components/ui/button';
import prisma from '@/lib/prisma';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminPortfolioItemManagement({
  params,
}: Props): Promise<React.JSX.Element> {
  const { id } = await params;

  const isCreation = id.toLocaleLowerCase() === 'create';

  const categories = await prisma.portfolioCategory.findMany();

  async function handleSubmit(formData: FormData): Promise<void> {
    'use server';

    const media = formData.get('media') as File;
    const categoryId = formData.get('category') as string;

    if (isCreation) {
      await uploadPortfolioItemAction({
        categoryId,
        media: {
          name: media.name,
          size: media.size,
          type: media.type,
          arrayBuffer: await media.arrayBuffer(),
        },
      });
      return;
    }

    const mediaData =
      media.size > 0
        ? {
            name: media.name,
            size: media.size,
            type: media.type,
            arrayBuffer: await media.arrayBuffer(),
          }
        : null;

    await updatePortfolioItemAction({
      portfolioItemId: id,
      categoryId,
      media: mediaData,
    });
  }

  return (
    <div className="flex flex-col items-center justify-center gap-5 text-white">
      <p className="font-comodo py-5 text-center text-5xl text-[#FF0066]">
        {isCreation ? 'Creation' : 'Modification'} d&apos;un media
      </p>
      <form
        action={handleSubmit}
        className="flex w-fit flex-col gap-5 rounded-xl border-1 border-white p-5"
      >
        <input type="file" accept="image/*,video/*" name="media" />
        <select name="category">
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.title}
            </option>
          ))}
        </select>
        <Button className="cursor-pointer rounded-xl bg-[#00863A] hover:bg-[#00863A]/80">
          {isCreation ? 'Créer' : 'Modifier'}
        </Button>
      </form>
    </div>
  );
}
