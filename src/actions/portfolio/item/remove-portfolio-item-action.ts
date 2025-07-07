'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { removeFilesAction } from '@/actions/cloud-storage-file';
import { adminAction } from '@/lib/actions';
import { routes } from '@/lib/boiler-config';
import prisma from '@/lib/prisma';

const inputSchema = z.object({
  portfolioItemId: z.string(),
});

const outputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

const removePortfolioItemAction = adminAction
  .inputSchema(inputSchema)
  .outputSchema(outputSchema)
  .action(async ({ parsedInput: { portfolioItemId } }) => {
    const portfolioItem = await prisma.portfolioItem.findUnique({
      where: {
        id: portfolioItemId,
      },
      include: {
        media: true,
      },
    });

    if (!portfolioItem) {
      return {
        success: false,
        message: 'Item non trouvé',
      };
    }

    if (portfolioItem.media) {
      const res = await removeFilesAction({
        bucket: portfolioItem.media.bucket,
        paths: [portfolioItem.media.path],
      });

      if (!res.data?.success) {
        return {
          success: false,
          message: res.data?.message ?? 'Erreur lors de la suppression du fichier',
        };
      }
    }

    await prisma.portfolioItem.delete({
      where: {
        id: portfolioItemId,
      },
    });

    revalidatePath(routes.admin.portfolio.media);

    return {
      success: true,
      message: 'Item supprimé avec succès',
    };
  });

export default removePortfolioItemAction;
