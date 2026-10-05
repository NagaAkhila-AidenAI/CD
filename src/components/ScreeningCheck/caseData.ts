import { useEffect, useState } from 'react';
import type { FieldFormat } from './applicationFields';

export interface CaseStage {
  name: string;
  status: 'completed' | 'active' | 'future';
}

export interface CaseSnapshot {
  id: string;
  businessId: string;
  status: string;
  createTime?: string;
  stages: CaseStage[];
  content: Record<string, any>;
  // 'local' = built from the Stage 1 forms because Launchpad isn't connected
  source: 'pega' | 'local';
  // Pega store context the case lives in (e.g. app/primary_1/workarea_1); needed to submit its assignment
  contextName?: string;
}

// What Stage 1 captured, kept in AppShell so Stage 2 can show it without Launchpad
export interface IntakeData {
  applicationNumber: string;
  submittedAt: string;
  borrowerType?: string;
  borrower: Record<string, any>;
  funding: Record<string, any>;
  documents: string[];
}

export function generateApplicationNumber(): string {
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `CD-APP${new Date().getFullYear()}-${suffix}`;
}

const capitalize = (s?: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');

export function buildLocalCase(intake: IntakeData): CaseSnapshot {
  const { borrower, funding } = intake;
  const applicantName = [borrower.firstName, borrower.middleName, borrower.lastName].filter(Boolean).join(' ');
  return {
    id: intake.applicationNumber,
    businessId: intake.applicationNumber,
    status: 'Pending-Screening Check',
    createTime: intake.submittedAt,
    stages: [],
    source: 'local',
    content: {
      ...borrower,
      ...funding,
      borrowerType: capitalize(intake.borrowerType),
      applicantName,
      applicationNumber: intake.applicationNumber,
      applicationStatus: 'Pending-Screening Check',
      applicationDate: intake.submittedAt,
      submissionDate: intake.submittedAt,
      documents: intake.documents
    }
  };
}

const normalize = (key: string) => key.replace(/[^a-z0-9]/gi, '').toLowerCase();

// Case- and punctuation-insensitive lookup; returns the first candidate key that has a value
export function pickValue(source: Record<string, any> | undefined, keys: string[]): any {
  if (!source) return undefined;
  const index = new Map(Object.keys(source).map((k) => [normalize(k), k]));
  for (const key of keys) {
    const actual = index.get(normalize(key));
    const value = actual ? source[actual] : undefined;
    if (value !== undefined && value !== null && value !== '') return value;
  }
  return undefined;
}

function toSnapshot(caseInfo: any): CaseSnapshot {
  const stages: CaseStage[] = (caseInfo.stages ?? [])
    .filter((s: any) => !s.type || s.type === 'Primary')
    .map((s: any) => ({ name: s.name, status: s.visited_status ?? 'future' }));

  return {
    id: caseInfo.ID,
    businessId: caseInfo.businessID ?? caseInfo.ID?.split(' ').pop() ?? '',
    status: caseInfo.status ?? '',
    createTime: caseInfo.createTime,
    stages,
    content: caseInfo.content ?? {},
    source: 'pega'
  };
}

// Finds the most recently updated case held in the Pega store. Stage 1 creates the case through
// the mashup API, which loads it into the store, so no case ID has to be passed between screens.
function findLatestCase(): CaseSnapshot | null {
  const data = PCore?.getStore?.()?.getState?.()?.data ?? {};
  let latest: any = null;
  let latestContext = '';
  Object.entries<any>(data).forEach(([contextName, ctx]) => {
    const caseInfo = ctx?.caseInfo;
    if (!caseInfo?.ID || !caseInfo?.content) return;
    if (!latest || String(caseInfo.lastUpdateTime ?? '') >= String(latest.lastUpdateTime ?? '')) {
      latest = caseInfo;
      latestContext = contextName;
    }
  });
  return latest ? { ...toSnapshot(latest), contextName: latestContext } : null;
}

export function useLatestCase(isPegaReady: boolean): CaseSnapshot | null {
  const [snapshot, setSnapshot] = useState<CaseSnapshot | null>(null);

  useEffect(() => {
    if (!isPegaReady) return undefined;
    const store = PCore.getStore();
    const refresh = () => {
      const next = findLatestCase();
      setSnapshot((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next));
    };
    refresh();
    return store.subscribe(refresh);
  }, [isPegaReady]);

  useEffect(() => {
    if (snapshot) console.info('[ScreeningCheck] case properties', Object.keys(snapshot.content));
  }, [snapshot?.id]);

  return snapshot;
}

// Pega dates come as 20260929, 2026-09-29 or 20260929T101500.000 GMT
export function parsePegaDate(value: unknown): Date | null {
  if (!value) return null;
  const str = String(value);
  const m = str.match(/^(\d{4})-?(\d{2})-?(\d{2})(?:T(\d{2}):?(\d{2}):?(\d{2}))?/);
  if (!m) {
    const d = new Date(str);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const [, y, mo, d, h, mi, s] = m;
  return h ? new Date(Date.UTC(+y, +mo - 1, +d, +h, +mi, +s)) : new Date(+y, +mo - 1, +d);
}

export function formatDate(value: unknown): string {
  const d = parsePegaDate(value);
  return d ? d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }) : String(value ?? '');
}

export function formatDateTime(value: unknown): string {
  const d = parsePegaDate(value);
  return d
    ? d.toLocaleString(undefined, { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : String(value ?? '');
}

export function formatValue(value: unknown, format: FieldFormat = 'text', currency?: string): string {
  if (value === undefined || value === null || value === '') return '';
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';

  const num = Number(value);
  switch (format) {
    case 'currency': {
      if (Number.isNaN(num)) return String(value);
      // Accepts "USD" as well as labels like "USD - US Dollar"
      const code = currency?.match(/\b[A-Z]{3}\b/)?.[0];
      try {
        return code
          ? new Intl.NumberFormat(undefined, { style: 'currency', currency: code, maximumFractionDigits: 2 }).format(num)
          : num.toLocaleString();
      } catch {
        return num.toLocaleString();
      }
    }
    case 'date':
      return formatDate(value);
    case 'months':
      return Number.isNaN(num) ? String(value) : `${num} ${num === 1 ? 'month' : 'months'}`;
    case 'years':
      return Number.isNaN(num) ? String(value) : `${num} ${num === 1 ? 'year' : 'years'}`;
    default:
      return String(value);
  }
}
