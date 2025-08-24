'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

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
        message: 'Elément de portfolio non trouvé',
      };
    }

    if (portfolioItem.media) {
      try {
        await prisma.storageFileDelete.create({
          data: {
            bucket: portfolioItem.media.bucket,
            path: portfolioItem.media.path,
          },
        });
      } catch {
        return {
          success: false,
          message: 'Erreur lors de la suppression du média en base de données',
        };
      }
    }

    try {
      await prisma.portfolioItem.delete({
        where: {
          id: portfolioItemId,
        },
      });
    } catch {
      return {
        success: false,
        message: "Erreur lors de la suppression dans la base de données de l'élément du portfolio",
      };
    }

    revalidatePath(routes.admin.portfolio.media);

    return {
      success: true,
      message: 'Elément de portfolio supprimé avec succès',
    };
  });

export default removePortfolioItemAction;
