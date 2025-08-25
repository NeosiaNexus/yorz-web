'use client';

import { useCallback, useMemo, useState } from 'react';

import { createId } from '@paralleldrive/cuid2';

import type { TempFile, UploaderProps } from './types';
import { fileKey, isTypeAllowed, normalizeAccept } from './utils';

export interface UseUploaderResult {
  filesState: TempFile[];
  errors: string[];
  acceptList: string[];
  acceptAttr: string;
  supportedText: string | null;
  addFiles: (incoming: FileList | File[]) => void;
  removeOne: (id: string) => void;
  clearAll: () => void;
}

export const useUploader = ({
  multiple = false,
  accept,
  maxSize,
  maxFiles,
  disabled = false,
  value,
  defaultValue,
  onChange,
}: Omit<UploaderProps, 'name' | 'form' | 'required' | 'className'>): UseUploaderResult => {
  const [internal, setInternal] = useState<TempFile[]>(() =>
    (defaultValue ?? []).map(f => ({ id: createId(), file: f })),
  );
  const [errors, setErrors] = useState<string[]>([]);

  const isControlled = value !== undefined;
  const acceptList = useMemo(() => normalizeAccept(accept), [accept]);

  const filesState = useMemo<TempFile[]>(
    () => (isControlled ? (value ?? []).map(f => ({ id: fileKey(f), file: f })) : internal),
    [isControlled, value, internal],
  );

  const emit = useCallback(
    (next: TempFile[]) => {
      onChange?.(next.map(n => n.file));
      if (!isControlled) setInternal(next);
    },
    [isControlled, onChange],
  );

  const addFiles = useCallback(
    (incoming: FileList | File[]) => {
      if (disabled) return;
      const list = Array.from(incoming ?? []);
      const newErrors: string[] = [];

      const valid = list.filter(f => {
        if (maxSize && f.size > maxSize) {
          newErrors.push(
            `"${f.name}" dépasse la taille autorisée (${Math.round(maxSize / 1024 / 1024)} Mo).`,
          );
          return false;
        }
        if (!isTypeAllowed(f, acceptList)) {
          newErrors.push(`"${f.name}" n'est pas dans les formats autorisés.`);
          return false;
        }
        return true;
      });

      const existingKeys = new Set(filesState.map(t => fileKey(t.file)));
      const deduped = valid.filter(f => !existingKeys.has(fileKey(f)));

      let next = [...filesState, ...deduped.map(f => ({ id: createId(), file: f }))];
      if (!multiple) next = next.slice(0, Math.min(1, next.length));
      if (maxFiles && next.length > maxFiles) {
        newErrors.push(`Le nombre de fichiers maximum est de ${maxFiles}.`);
        next = next.slice(0, maxFiles);
      }

      setErrors(newErrors);
      emit(next);
    },
    [acceptList, disabled, emit, filesState, maxFiles, maxSize, multiple],
  );

  const removeOne = useCallback(
    (id: string) => {
      emit(filesState.filter(t => t.id !== id));
    },
    [emit, filesState],
  );

  const clearAll = useCallback(() => {
    emit([]);
    setErrors([]);
  }, [emit]);

  const acceptAttr = useMemo(() => acceptList.join(','), [acceptList]);

  const supportedText = useMemo(() => {
    if (acceptList.length === 0) return null;
    const pretty = acceptList.map(r => (r.startsWith('.') ? r.slice(1) : (r.split('/')[1] ?? r)));
    return `Format${pretty.length > 1 ? 's' : ''} supporté${pretty.length > 1 ? 's' : ''}: ${pretty.join(', ')}`;
  }, [acceptList]);

  return {
    filesState,
    errors,
    acceptList,
    acceptAttr,
    supportedText,
    addFiles,
    removeOne,
    clearAll,
  };
};
