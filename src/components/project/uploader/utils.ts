import type { AcceptProp } from './types';

export const normalizeAccept = (accept?: AcceptProp): string[] =>
  !accept
    ? []
    : Array.isArray(accept)
      ? accept
      : accept
          .split(',')
          .map(s => s.trim())
          .filter(Boolean);

export const fileKey = (f: File): string => `${f.name}__${f.size}__${f.lastModified}`;

export const formatBytes = (bytes: number): string => {
  const units = ['o', 'Ko', 'Mo', 'Go', 'To'];
  let i = 0;
  let n = bytes;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n.toFixed(n < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
};

export const isTypeAllowed = (file: File, acceptList: string[]): boolean => {
  if (acceptList.length === 0) return true;
  const name = file.name.toLowerCase();
  const mime = (file.type || '').toLowerCase();

  return acceptList.some(rule => {
    const r = rule.toLowerCase();
    if (r.startsWith('.')) return name.endsWith(r);
    if (r.endsWith('/*')) {
      const family = r.slice(0, r.indexOf('/'));
      return mime.startsWith(`${family}/`);
    }
    return mime === r;
  });
};

export const toFileList = (files: File[]): FileList | null => {
  const dt = new DataTransfer();
  for (const f of files) dt.items.add(f);
  return dt.files;
};
