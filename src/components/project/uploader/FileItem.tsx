'use client';

import React from 'react';

import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { formatBytes } from './utils';

interface FileItemProps {
  name: string;
  type: string;
  size: number;
  onRemove: () => void;
  disabled?: boolean;
}

export const FileItem: React.FC<FileItemProps> = ({ name, type, size, onRemove, disabled }) => (
  <li className="flex items-center justify-between rounded-md border p-2">
    <div className="min-w-0">
      <p className="truncate font-medium">{name}</p>
      <p className="text-xs text-gray-500">
        {type || 'type inconnu'} • {formatBytes(size)}
      </p>
    </div>
    <Button
      type="button"
      variant="destructive"
      onClick={onRemove}
      disabled={disabled}
      className="flex items-center gap-1"
      aria-label={`Supprimer ${name}`}
    >
      <X className="h-4 w-4" />
      Supprimer
    </Button>
  </li>
);
