'use client';

import React, { useCallback, useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';

import { Dropzone } from './Dropzone';
import { FileList } from './FileList';
import type { UploaderProps } from './types';
import { useUploader } from './useUploader';
import { toFileList } from './utils';

const prevent = (e: React.DragEvent): void => {
  e.preventDefault();
  e.stopPropagation();
};

const Uploader: React.FC<UploaderProps> = ({
  name = 'files',
  form,
  required,
  multiple = false,
  accept,
  maxSize,
  maxFiles,
  disabled = false,
  value,
  defaultValue,
  onChange,
  className = '',
}) => {
  const pickerRef = useRef<HTMLInputElement>(null);
  const formInputRef = useRef<HTMLInputElement>(null);

  const { filesState, errors, acceptAttr, supportedText, addFiles, removeOne, clearAll } =
    useUploader({
      multiple,
      accept,
      maxSize,
      maxFiles,
      disabled,
      value,
      defaultValue,
      onChange,
    });

  useEffect(() => {
    if (!formInputRef.current) return;
    formInputRef.current.files = toFileList(filesState.map(f => f.file));
  }, [filesState]);

  const handleOpen = useCallback(() => {
    if (disabled) return;
    if (pickerRef.current) pickerRef.current.value = ''; // permet re-sélection identique
    pickerRef.current?.click();
  }, [disabled]);

  const handlePickerChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) addFiles(e.target.files);
    },
    [addFiles],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
    },
    [addFiles, disabled],
  );

  return (
    <div className={cn(className, 'bg-yorz-dark flex flex-col gap-4 rounded-xl p-5')}>
      <div className="flex flex-wrap gap-4">
        <Dropzone
          disabled={disabled}
          multiple={multiple}
          supportedText={supportedText}
          onOpen={handleOpen}
          onChange={handlePickerChange}
          onDragEnter={prevent}
          onDragOver={prevent}
          onDrop={handleDrop}
          acceptAttr={acceptAttr}
          pickerRef={pickerRef as React.RefObject<HTMLInputElement>}
        />

        <FileList
          files={filesState}
          maxFiles={maxFiles}
          disabled={disabled}
          onRemove={removeOne}
          onClear={() => {
            clearAll();
            if (pickerRef.current) pickerRef.current.value = '';
            if (formInputRef.current) formInputRef.current.value = '';
          }}
        />
      </div>

      <input
        ref={formInputRef}
        type="file"
        className="hidden"
        name={name}
        form={form}
        required={required}
        multiple={multiple}
      />
      {errors.length > 0 && (
        <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {errors.map((err, i) => (
            <p key={i}>{err}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default Uploader;
