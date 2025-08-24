'use client';

import React from 'react';

import { Upload } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DropzoneProps {
  disabled?: boolean;
  multiple?: boolean;
  supportedText: string | null;
  onOpen: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDragEnter: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  acceptAttr: string;
  pickerRef: React.RefObject<HTMLInputElement>;
  className?: string;
}

export const Dropzone: React.FC<DropzoneProps> = ({
  disabled,
  multiple,
  supportedText,
  onOpen,
  onChange,
  onDragEnter,
  onDragOver,
  onDrop,
  acceptAttr,
  pickerRef,
  className,
}) => {
  return (
    <div
      role="button"
      aria-label="Zone de dépôt de fichiers"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onOpen()}
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={cn(
        'flex flex-1 cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dotted border-[#109BFE] px-10 py-7 outline-none',
        disabled && 'cursor-not-allowed opacity-60',
        className,
      )}
    >
      <Upload className="h-10 w-10 text-[#109BFE]" />
      <Button
        type="button"
        disabled={disabled}
        className="rounded-4xl bg-[#109BFE] font-bold hover:bg-[#109BFE]/80"
      >
        Sélectionner {multiple ? 'des fichiers' : 'un fichier'}
      </Button>
      <p className="text-gray-200/40">Déposez {multiple ? 'vos fichiers' : 'votre fichier'} ici</p>
      {supportedText && <p className="text-sm text-gray-500">{supportedText}</p>}

      <input
        ref={pickerRef}
        type="file"
        className="hidden"
        multiple={multiple}
        accept={acceptAttr}
        disabled={disabled}
        onChange={onChange}
      />
    </div>
  );
};
