'use server';

import { createId } from '@paralleldrive/cuid2';
import { z } from 'zod';

import { uploadFileAction } from '@/actions/cloud-storage-file';
import { adminAction } from '@/lib/actions';
import prisma from '@/lib/prisma';

const inputSchema = z.object({
  categoryId: z.string().nullable(),
  media: z.object({
    name: z.string(),
    size: z.number(),
    type: z.string(),
    arrayBuffer: z.instanceof(ArrayBuffer),
  }),
});

const outputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

const uploadPortfolioItemAction = adminAction
  .inputSchema(inputSchema)
  .outputSchema(outputSchema)
  .action(async ({ parsedInput: { categoryId, media } }) => {
      if (categoryId) {
        try {
          const portFolioCategory = await prisma.portfolioCategory.findUnique({
            where: { id: categoryId },
          });

          if (!portFolioCategory) {
            return {
              success: false,
              message: 'Catégorie non trouvée',
            };
          }
        } catch {
          return {
            success: false,
            message: 'Erreur lors de la récupération de la catégorie',
          };
        }
      }

      const cuid = createId();

      const mediaUpload = await uploadFileAction({
        bucket: 'portfolio',
        path: cuid,
        fileData: media,
        isPublic: true,
      });

      if (!mediaUpload.data?.success) {
        return {
          success: false,
          message: mediaUpload.data?.message || "Erreur lors de l'upload du fichier",
        };
      }

      try {
        await prisma.portfolioItem.create({
          data: {
            categoryId: categoryId ?? undefined,
            id: cuid,
            mediaId: mediaUpload.data.data?.id,
          },
        });
      } catch {
        return {
          success: false,
          message:
            "Une erreur est survenue lors du lien de l'élément du portfolio avec la catégorie",
        };
      }

      return {
        success: true,
        message: 'Élément créé avec succès',
      };

  });

export default uploadPortfolioItemAction;
