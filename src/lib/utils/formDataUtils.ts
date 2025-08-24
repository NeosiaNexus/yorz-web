// Outils de lecture/parse de FormData pour server actions

export type DateMode = 'utc' | 'local';

const _getRaw = (fd: FormData, name: string): string => fd.get(name)?.toString().trim() ?? '';

/* ---------- string ---------- */

export const getStr = (fd: FormData, name: string): string => _getRaw(fd, name);

export const getOptStr = (fd: FormData, name: string): string | undefined => {
  const v = _getRaw(fd, name);
  return v.length ? v : undefined;
};

/* ---------- number ---------- */

export const getNumber = (fd: FormData, name: string): number => {
  const v = _getRaw(fd, name);
  const n = Number(v.replace(',', '.')); // accepte "12,5"
  return Number.isFinite(n) ? n : NaN;
};

export const getOptNumber = (fd: FormData, name: string): number | undefined => {
  const n = getNumber(fd, name);
  return Number.isFinite(n) ? n : undefined;
};

export const getInt = (fd: FormData, name: string): number => {
  const v = _getRaw(fd, name);
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? n : NaN;
};

export const getOptInt = (fd: FormData, name: string): number | undefined => {
  const n = getInt(fd, name);
  return Number.isFinite(n) ? n : undefined;
};

/* ---------- date ---------- */
/**
 * Gère <input type="date"> ("YYYY-MM-DD") sans décalage.
 * Par défaut, construit la date en UTC (00:00:00Z).
 */
const parseDate = (raw: string, mode: DateMode): Date => {
  if (!raw) return new Date(NaN);
  if (raw.includes('T')) {
    const d = new Date(raw);
    return isNaN(d.getTime()) ? new Date(NaN) : d;
  }
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw);
  if (!m) return new Date(NaN);
  const [, yStr, moStr, dStr] = m;
  const y = Number(yStr),
    mo = Number(moStr),
    d = Number(dStr);
  return mode === 'utc' ? new Date(Date.UTC(y, mo - 1, d)) : new Date(y, mo - 1, d);
};

export const getDate = (fd: FormData, name: string, opts: { mode?: DateMode } = {}): Date => {
  const v = _getRaw(fd, name);
  return parseDate(v, opts.mode ?? 'utc');
};

export const getOptDate = (
  fd: FormData,
  name: string,
  opts: { mode?: DateMode } = {},
): Date | undefined => {
  const d = getDate(fd, name, opts);
  return isNaN(d.getTime()) ? undefined : d;
};

/* ---------- file helpers ---------- */

export type FileAccept = string | string[]; // ".png", "image/*", "application/pdf", ...
export interface FileConstraints {
  accept?: FileAccept; // ex: ['image/*', '.pdf']
  maxSize?: number; // bytes
  minSize?: number; // bytes
}

/** Normalise accept en string[] */
export const normalizeAccept = (accept?: FileAccept): string[] =>
  !accept
    ? []
    : Array.isArray(accept)
      ? accept
      : accept
          .split(',')
          .map(s => s.trim())
          .filter(Boolean);

/** Vérifie un type/extension (".png", "image/*", "image/png") */
export const isTypeAllowed = (file: File, acceptList: string[]): boolean => {
  if (acceptList.length === 0) return true;
  const name = file.name.toLowerCase();
  const mime = (file.type || '').toLowerCase();
  return acceptList.some(rule => {
    const r = rule.toLowerCase();
    if (r.startsWith('.')) return name.endsWith(r); // extension
    if (r.endsWith('/*')) return mime.startsWith(r.slice(0, r.indexOf('/')) + '/'); // famille
    return mime === r; // MIME exact
  });
};

/** Renvoie tous les File valides trouvés sous ce name (ignore les strings) */
const _getAllFiles = (fd: FormData, name: string): File[] => {
  const all = fd.getAll(name);
  return all.filter((v): v is File => typeof v !== 'string' && v instanceof File);
};

/** Filtre par contraintes (accept/size). Laisse passer si pas de contrainte. */
export const filterFilesByConstraints = (files: File[], c: FileConstraints = {}): File[] => {
  const list = normalizeAccept(c.accept);
  return files.filter(f => {
    if (c.minSize !== undefined && f.size < c.minSize) return false;
    if (c.maxSize !== undefined && f.size > c.maxSize) return false;
    if (list.length && !isTypeAllowed(f, list)) return false;
    return true;
  });
};

/** getFile: premier fichier ou null (pour champs obligatoires, tu valides ensuite) */
export const getFile = (fd: FormData, name: string, constraints?: FileConstraints): File | null => {
  const files = _getAllFiles(fd, name);
  const filtered = constraints ? filterFilesByConstraints(files, constraints) : files;
  return filtered[0] ?? null;
};

/** getOptFile: premier fichier ou undefined (pour champs optionnels) */
export const getOptFile = (
  fd: FormData,
  name: string,
  constraints?: FileConstraints,
): File | undefined => {
  const f = getFile(fd, name, constraints);
  return f ?? undefined;
};

/** getFiles: tous les fichiers (tableau possiblement vide) */
export const getFiles = (fd: FormData, name: string, constraints?: FileConstraints): File[] => {
  const files = _getAllFiles(fd, name);
  return constraints ? filterFilesByConstraints(files, constraints) : files;
};

/** getOptFiles: undefined si aucun fichier valide, sinon tableau */
export const getOptFiles = (
  fd: FormData,
  name: string,
  constraints?: FileConstraints,
): File[] | undefined => {
  const arr = getFiles(fd, name, constraints);
  return arr.length ? arr : undefined;
};

/* ---------- export groupé ---------- */

export const formDataUtils = {
  // string
  getStr,
  getOptStr,
  // number
  getNumber,
  getOptNumber,
  getInt,
  getOptInt,
  // date
  getDate,
  getOptDate,
  // file
  normalizeAccept,
  isTypeAllowed,
  getFile,
  getOptFile,
  getFiles,
  getOptFiles,
  filterFilesByConstraints,
};

export default formDataUtils;
