'use server';

import { Prisma } from '@prisma/client';
import { z } from 'zod';

import { removeFilesAction } from '@/actions/cloud-storage-file';
import { adminAction } from '@/lib/actions';
import prisma from '@/lib/prisma';

const inputSchema = z.object({
  portfolioCategoryId: z.string(),
});

const outputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

const removePortfolioCategorieAction = adminAction
  .inputSchema(inputSchema)
  .outputSchema(outputSchema)
  .action(async ({ parsedInput: { portfolioCategoryId } }) => {
    const portfolioCategory = await prisma.portfolioCategory.findUnique({
      where: { id: portfolioCategoryId },
      include: { mediaExample: true },
    });

    if (!portfolioCategory) {
      return { success: true, message: 'Catégorie déjà supprimée' };
    }

    const mediaBucket = portfolioCategory.mediaExample?.bucket ?? null;
    const mediaPath = portfolioCategory.mediaExample?.path ?? null;

    try {
      await prisma.portfolioCategory.delete({ where: { id: portfolioCategoryId } });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          return { success: true, message: 'Catégorie déjà supprimée' };
        }
      }

      return { success: false, message: 'Erreur lors de la suppression en base' };
    }

    if (mediaBucket && mediaPath) {
      try {
        const res = await removeFilesAction({ bucket: mediaBucket, paths: [mediaPath] });
        if (!res.data?.success) {
          return {
            success: true,
            message:
              "Catégorie supprimée. Cependant, l'image n'a pas pu être supprimée du stockage",
          };
        }
      } catch {
        return {
          success: true,
          message:
            'Catégorie supprimée. Cependant, une erreur est survenue lors du nettoyage du fichier',
        };
      }
    }

    return { success: true, message: 'Catégorie de portfolio supprimée avec succès' };
  });

export default removePortfolioCategorieAction;
