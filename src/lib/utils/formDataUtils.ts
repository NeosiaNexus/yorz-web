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
  // Autorise virgule décimale ("12,5")
  const n = Number(v.replace(',', '.'));
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
 * getDate / getOptDate gèrent les <input type="date"> ("YYYY-MM-DD") sans décalage.
 * Par défaut, on construit une date en UTC (00:00:00Z) pour éviter l'off-by-one.
 * Passez { mode: 'local' } si vous préférez la minuit locale.
 */
const parseDate = (raw: string, mode: DateMode): Date => {
  if (!raw) return new Date(NaN);

  // si on a déjà un datetime (contient 'T'), on laisse le moteur parser
  if (raw.includes('T')) {
    const d = new Date(raw);
    return isNaN(d.getTime()) ? new Date(NaN) : d;
  }

  // format "YYYY-MM-DD" d'un <input type="date">
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw);
  if (!m) return new Date(NaN);
  const [, y, mo, d] = m.map(Number);
  return mode === 'utc' ? new Date(Date.UTC(y, mo - 1, d)) : new Date(y, mo - 1, d);
};

export const getDate = (fd: FormData, name: string, opts: { mode?: DateMode } = {}): Date => {
  const v = _getRaw(fd, name);
  const d = parseDate(v, opts.mode ?? 'utc');
  return d;
};

export const getOptDate = (
  fd: FormData,
  name: string,
  opts: { mode?: DateMode } = {},
): Date | undefined => {
  const d = getDate(fd, name, opts);
  return isNaN(d.getTime()) ? undefined : d;
};

/* ---------- export groupé ---------- */

export const formDataUtils = {
  getStr,
  getOptStr,
  getNumber,
  getOptNumber,
  getInt,
  getOptInt,
  getDate,
  getOptDate,
};

export default formDataUtils;
