'use server';

import { z } from 'zod';

import { authAction } from '@/lib/actions';
import prisma from '@/lib/prisma';
import { getBucketOrCreate, storage } from '@/lib/storage';
import { pathSchema } from '@/schemas/common-schema';

const paramSchema = z.object({
  bucket: z.string().min(1, 'Le nom du bucket est requis'),
  path: pathSchema,
  isPublic: z.boolean().optional().default(false),
  fileData: z.object({
    name: z
      .string()
      .min(1, 'Le nom du fichier est requis')
      .regex(/^[^\\/]+$/, 'Le nom du fichier est invalide'),
    size: z.number().positive(),
    type: z.string().nonempty('Le type du fichier est requis'),
    arrayBuffer: z.instanceof(ArrayBuffer),
  }),
});

const outputSchema = z.object({
  message: z.string(),
  success: z.boolean(),
  data: z
    .object({
      id: z.string(),
      path: pathSchema,
      publicUrl: z.string().nullable(),
    })
    .nullable(),
});

export const uploadFileAction = authAction
  .inputSchema(paramSchema)
  .outputSchema(outputSchema)
  .action(async ({ parsedInput: { bucket, path, fileData, isPublic }, ctx: { session } }) => {
    try {
      await getBucketOrCreate(bucket, isPublic);
    } catch {
      return {
        message: 'Le bucket n’existe pas et n’a pas pu être créé',
        success: false,
        data: null,
      };
    }

    const ext = fileData.name.split('.').pop()!;
    const base = fileData.name.replace(new RegExp(`\\.${ext}$`), '');
    const objectKey = `${path}/${base}.${ext}`;
    const buffer = Buffer.from(fileData.arrayBuffer);

    try {
      await storage.putObject(bucket, objectKey, buffer, buffer.length, {
        'Content-Type': fileData.type,
      });
    } catch {
      return {
        message: 'Une erreur est survenue lors de l’upload du fichier',
        success: false,
        data: null,
      };
    }

    const publicUrl = isPublic ? `${process.env.MINIO_CLOUD_URL}/${bucket}/${objectKey}` : null;

    let record;
    try {
      record = await prisma.storageFile.create({
        data: {
          bucket,
          path: objectKey,
          publicUrl,
          isPublic,
          fileName: fileData.name,
          size: fileData.size,
          type: fileData.type,
          uploaderId: session.user.id,
        },
      });
    } catch {
      return {
        message: 'Une erreur est survenue lors de la création du fichier en base',
        success: false,
        data: null,
      };
    }

    return {
      message: 'Le fichier a été uploadé avec succès',
      success: true,
      data: {
        id: record.id,
        path: record.path,
        publicUrl: record.publicUrl,
      },
    };
  });

export default uploadFileAction;
