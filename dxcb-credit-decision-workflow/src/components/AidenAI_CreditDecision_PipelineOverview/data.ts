// Data loading and shaping for the Pipeline Overview widget.
// Follows the Launchpad-safe pattern of Pega's Custom KPI Gauge: PCore.getDataApiUtils().getData()
// on a configurable data view, with Pega/standard property names resolved through getMappedKey.

export function getMappedKey(key: string): string {
  try {
    const namespacedKey = PCore.getNameSpaceUtils().getDefaultQualifiedName(key);
    const mappedKey = PCore.getEnvironmentInfo().getKeyMapping(namespacedKey);
    return mappedKey || namespacedKey;
  } catch {
    return key;
  }
}

const normalize = (s: string) => s.replace(/[^a-z0-9]/gi, '').toLowerCase();

// Reads a field from a row by its configured name: mapped key, exact name, then a
// case-insensitive match that also ignores a namespace prefix (e.g. "App__Priority").
export function readField(row: Record<string, any>, name?: string): any {
  if (!row || !name) return undefined;
  const mapped = getMappedKey(name);
  if (row[mapped] !== undefined) return row[mapped];
  if (row[name] !== undefined) return row[name];
  const target = normalize(name);
  const key = Object.keys(row).find(k => {
    const n = normalize(k);
    return n === target || n.endsWith(target);
  });
  return key ? row[key] : undefined;
}

export async function loadRows(dataViewName: string, contextName: string): Promise<Record<string, any>[]> {
  const api = PCore.getDataApiUtils();
  const name = getMappedKey(dataViewName);
  const pick = (response: any) => {
    const data = response?.data?.data;
    if (Array.isArray(data)) return data;
    return data ? [data] : [];
  };
  try {
    // Ask for a large page so the counts cover every case, not just the first page
    return pick(await api.getData(name, { paging: { pageNumber: 1, pageSize: 5000 } }, contextName));
  } catch {
    return pick(await api.getData(name, {}, contextName));
  }
}

// Pega dates arrive as 20261001T101500.000 GMT, 2026-10-01T10:15:00Z or 2026-10-01
export function parseDate(value: unknown): Date | null {
  if (!value) return null;
  const s = String(value);
  const m = s.match(/^(\d{4})-?(\d{2})-?(\d{2})(?:T(\d{2}):?(\d{2}):?(\d{2}))?/);
  if (m) {
    const [, y, mo, d, h = '0', mi = '0', se = '0'] = m;
    return new Date(Date.UTC(+y, +mo - 1, +d, +h, +mi, +se));
  }
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

export const daysSince = (date: Date | null) =>
  date ? Math.max(0, Math.floor((Date.now() - date.getTime()) / 86400000)) : null;

// "Pending-Screening Check" -> "Screening Check"; "Resolved-Completed" -> "Completed"
export const stageFromStatus = (status: string) => status.replace(/^[^-]*-/, '').trim();

export const isResolved = (status: string) => /^resolved/i.test(status.trim());

export interface CaseRow {
  id: string;
  insKey: string;
  className: string;
  status: string;
  stage: string;
  borrower: string;
  priority: string;
  amount: number | null;
  ageDays: number | null;
}

export interface FieldNames {
  statusField: string;
  idField: string;
  borrowerField: string;
  priorityField: string;
  amountField: string;
  updatedField: string;
}

export function toCaseRows(rows: Record<string, any>[], f: FieldNames): CaseRow[] {
  return rows.map(row => {
    const status = String(readField(row, f.statusField) ?? '');
    const rawAmount = readField(row, f.amountField);
    const amount = rawAmount === undefined || rawAmount === null || rawAmount === '' ? null : Number(rawAmount);
    return {
      id: String(readField(row, f.idField) ?? ''),
      insKey: String(readField(row, 'pzInsKey') ?? readField(row, 'ID') ?? ''),
      className: String(readField(row, 'pxObjClass') ?? readField(row, 'classID') ?? ''),
      status,
      stage: stageFromStatus(status),
      borrower: String(readField(row, f.borrowerField) ?? ''),
      priority: String(readField(row, f.priorityField) ?? ''),
      amount: amount !== null && Number.isFinite(amount) ? amount : null,
      ageDays: daysSince(parseDate(readField(row, f.updatedField)))
    };
  });
}

export const splitList = (s?: string) =>
  (s ?? '')
    .split(',')
    .map(x => x.trim())
    .filter(Boolean);

export const sameText = (a: string, b: string) => normalize(a) === normalize(b);
