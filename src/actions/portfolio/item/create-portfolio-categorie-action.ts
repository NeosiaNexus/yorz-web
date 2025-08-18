'use server';

import { createId } from '@paralleldrive/cuid2';
import { z } from 'zod';

import { removeFilesAction, uploadFileAction } from '@/actions/cloud-storage-file';
import { adminAction } from '@/lib/actions';
import { parseZodErrors } from '@/lib/actions/parse-zod-errors';
import prisma from '@/lib/prisma';

const inputSchema = z.object({
  title: z
    .string({
      message: 'Le titre est requis',
    })
    .trim()
    .min(1, {
      message: 'Le titre est requis',
    }),
  description: z.string().trim().nullable().optional(),
  underDescription: z.string().trim().nullable().optional(),
  price: z.string().trim().min(1, {
    message: 'Le prix est requis',
  }),
  priceComplement: z.string().trim().nullable().optional(),
  colorVariant: z.enum(['blue', 'green', 'red']),
  mediaExample: z
    .object({
      name: z.string().trim(),
      size: z.number().min(0),
      type: z.string(),
      arrayBuffer: z.instanceof(ArrayBuffer),
    })
    .optional()
    .nullable(),
});

const outputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

const createPortfolioCategorieAction = adminAction
  .inputSchema(inputSchema)
  .outputSchema(outputSchema)
  .action(
    async ({
      parsedInput: {
        colorVariant,
        price,
        title,
        description,
        mediaExample,
        priceComplement,
        underDescription,
      },
    }) => {
      const categoryId = createId();
      let mediaUpload = null;

      if (mediaExample && mediaExample.size > 0) {
        mediaUpload = await uploadFileAction({
          bucket: 'categories',
          path: categoryId,
          fileData: {
            arrayBuffer: mediaExample.arrayBuffer,
            name: mediaExample.name,
            size: mediaExample.size,
            type: mediaExample.type,
          },
          isPublic: true,
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
            message: "Erreur lors de l'upload de l'image d'exemple de la catégorie du portfolio",
            success: false,
          };
        }
      }

      try {
        await prisma.portfolioCategory.create({
          data: {
            id: categoryId,
            colorVariant,
            price,
            title,
            description,
            priceComplement,
            underDescription,
            mediaExampleId: mediaUpload?.data?.data?.id,
            order: 10,
          },
        });
      } catch {
        try {
          if (mediaUpload?.data?.data?.id) {
            await removeFilesAction({
              bucket: 'categories',
              paths: [mediaUpload.data.data.path],
            });
          }
        } catch {
          return {
            success: false,
            message:
              "Erreur lors de la suppression de l'image d'exemple de la catégorie du portfolio suite à une erreur lors de la création",
          };
        }

        return {
          success: false,
          message: 'Erreur lors de la création de la catégorie du portfolio',
        };
      }

      return {
        success: true,
        message: 'Catégorie du portfolio créée avec succès',
      };
    },
  );

export default createPortfolioCategorieAction;
