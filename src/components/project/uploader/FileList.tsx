'use client';

import React from 'react';

import { Button } from '@/components/ui/button';

import { FileItem } from './FileItem';
import type { TempFile } from './types';

interface FileListProps {
  files: TempFile[];
  maxFiles?: number;
  disabled?: boolean;
  onRemove: (id: string) => void;
  onClear: () => void;
}

export const FileList: React.FC<FileListProps> = ({
  files,
  maxFiles,
  disabled,
  onRemove,
  onClear,
}) => (
  <div className="min-w-[500px] flex-1 rounded-lg border p-4">
    <div className="mb-2 flex items-center justify-between">
      <p className="text-xl font-bold">
        Fichier{files.length > 1 ? 's' : ''} sélectionné{files.length > 1 ? 's' : ''} (
        {files.length}
        {maxFiles ? `/${maxFiles}` : ''})
      </p>
      {files.length > 0 && (
        <Button variant="secondary" onClick={onClear} disabled={disabled}>
          Tout effacer
        </Button>
      )}
    </div>

    {files.length === 0 ? (
      <p className="text-gray-500">Aucun fichier pour le moment.</p>
    ) : (
      <ul className="space-y-2">
        {files.map(({ id, file }) => (
          <FileItem
            key={id}
            name={file.name}
            type={file.type}
            size={file.size}
            disabled={disabled}
            onRemove={() => onRemove(id)}
          />
        ))}
      </ul>
    )}
  </div>
);
