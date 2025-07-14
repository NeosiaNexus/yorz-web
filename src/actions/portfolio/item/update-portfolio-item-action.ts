'use server';

import { z } from 'zod';

import { removeFilesAction, uploadFileAction } from '@/actions/cloud-storage-file';
import { adminAction } from '@/lib/actions/middleware';
import { parseZodErrors } from '@/lib/actions/parse-zod-errors';
import prisma from '@/lib/prisma';

const inputSchema = z.object({
  portfolioItemId: z.string(),
  categoryId: z.string().nullable(),
  media: z
    .object({
      name: z.string(),
      size: z.number(),
      type: z.string(),
      arrayBuffer: z.instanceof(ArrayBuffer),
    })
    .nullable(),
});

const outputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

const updatePortfolioItemAction = adminAction
  .inputSchema(inputSchema)
  .outputSchema(outputSchema)
  .action(async ({ parsedInput: { portfolioItemId, categoryId, media } }) => {
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
        message: 'Elément du portfolio non trouvé',
      };
    }

    if (categoryId) {
      try {
        await prisma.portfolioItem.update({
          where: {
            id: portfolioItemId,
          },
          data: {
            categoryId: categoryId ?? null,
          },
        });
      } catch {
        return {
          success: false,
          message: 'Erreur lors de la mise à jour de la catégorie en base de données',
        };
      }
    }

    if (media && media?.size > 0) {
      if (portfolioItem.media) {
        await removeFilesAction({
          bucket: portfolioItem.media.bucket,
          paths: [portfolioItem.media.path],
        });
      }

      const mediaUpload = await uploadFileAction({
        bucket: 'portfolio',
        path: portfolioItem.id,
        isPublic: true,
        fileData: {
          name: media.name,
          size: media.size,
          type: media.type,
          arrayBuffer: media.arrayBuffer,
        },
      });

      const validationErrors = parseZodErrors(mediaUpload.validationErrors || {});

      if (validationErrors.length > 0) {
        return {
          success: false,
          message: validationErrors[0].message,
        };
      }

      if (!mediaUpload.data?.success) {
        return {
          success: false,
          message: mediaUpload.data?.message || "Erreur lors de l'upload du fichier",
        };
      }

      await prisma.portfolioItem.update({
        where: {
          id: portfolioItemId,
        },
        data: {
          mediaId: mediaUpload.data?.data?.id,
        },
      });
    }

    return {
      success: true,
      message: 'Elément du portfolio mis à jour avec succès',
    };
  });

export default updatePortfolioItemAction;
