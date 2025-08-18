'use server';

import { PortfolioCategory } from '@prisma/client';
import { z } from 'zod';

import { uploadFileAction } from '@/actions/cloud-storage-file';
import { adminAction } from '@/lib/actions';
import { parseZodErrors } from '@/lib/actions/parse-zod-errors';
import prisma from '@/lib/prisma';

const inputSchema = z.object({
  title: z.string({
    message: 'Le titre est requis',
  }),
  description: z.string({
    message: 'La description est requise',
  }),
  underDescription: z.string().nullable(),
  price: z.string({
    message: 'Le prix est requis',
  }),
  priceComplement: z.string().nullable(),
  colorVariant: z.enum(['blue', 'green', 'red']),
  mediaExample: z.object({
    name: z.string({
      message: "Le fichier d'exemple est requis ou invalide",
    }),
    size: z.number().min(1, {
      message: "Le fichier d'exemple est requis ou invalide",
    }),
    type: z.string({
      message: "Le fichier d'exemple est requis ou invalide",
    }),
    arrayBuffer: z.instanceof(ArrayBuffer, {
      message: "Le fichier d'exemple est requis ou invalide",
    }),
  }),
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
      let portfolioCategory: PortfolioCategory | null = null;
      try {
        portfolioCategory = await prisma.portfolioCategory.create({
          data: {
            colorVariant,
            price,
            title,
            description,
            priceComplement,
            underDescription,
            order: 10,
          },
        });
      } catch {
        return {
          success: false,
          message: 'Erreur lors de la création de la catégorie du portfolio',
        };
      }

      if (mediaExample) {
        const mediaUpload = await uploadFileAction({
          bucket: 'categories',
          path: portfolioCategory.id,
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

        try {
          await prisma.portfolioCategory.update({
            where: {
              id: portfolioCategory.id,
            },
            data: {
              mediaExampleId: mediaUpload.data?.data?.id,
            },
          });
        } catch {
          return {
            success: false,
            message: "Erreur lors de l'ajout de l'image d'exemple de la catégorie du portfolio",
          };
        }
      }

      return {
        success: true,
        message: 'Catégorie du portfolio créée avec succès',
      };
    },
  );

export default createPortfolioCategorieAction;
