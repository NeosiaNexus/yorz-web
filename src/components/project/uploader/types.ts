export type AcceptProp = string | string[];

export interface UploaderProps {
  name?: string;
  form?: string;
  required?: boolean;
  multiple?: boolean;
  accept?: AcceptProp;
  maxSize?: number;
  maxFiles?: number;
  disabled?: boolean;
  value?: File[];
  defaultValue?: File[];
  onChange?: (files: File[]) => void;
  className?: string;
}

export interface TempFile {
  id: string;
  file: File;
}
