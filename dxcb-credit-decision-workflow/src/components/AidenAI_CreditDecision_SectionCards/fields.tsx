import type { ReactElement, ReactNode } from 'react';
import { Status } from '@pega/cosmos-react-core';

export interface CardField {
  key: string;
  label: string;
  value: unknown;
  isView: boolean;
  // Long text inputs (text area, rich text) take the full card width when editable
  isWide: boolean;
  pConnect: any;
}

const WIDE_TYPES = new Set(['textarea', 'richtext', 'richtexteditor']);

type StatusVariant = 'success' | 'urgent' | 'warn' | 'pending' | 'info';

const normalize = (s: string) => s.replace(/[^a-z0-9]/gi, '').toLowerCase();

// Embedded views, groups and embedded data lists / tables are rendered by Launchpad itself (so Add,
// upload, validation and connectors keep working) instead of being shown as a single text value.
// Decided mainly by the field's value: fields from a data reference also have type "reference", but
// they carry a single value (number, text, date), while lists and views carry a list, an object or nothing.
const CONTAINER_TYPES = new Set(['group', 'view', 'region', 'simpletable', 'simpletablemanual', 'listview', 'table', 'fieldgrouptemplate', 'embeddeddata']);

function isContainer(meta: any, value: unknown): boolean {
  const type = normalize(String(meta?.type ?? ''));
  if (Array.isArray(value) || Boolean(meta?.config?.referenceList)) return true;
  if (value !== null && typeof value === 'object') return true;
  if (CONTAINER_TYPES.has(type) || type.includes('table')) return true;
  // A reference to a view (not a field) has no value and names a view
  if (type === 'reference') return value === undefined && (meta?.config?.type === 'view' || !meta?.config?.value);
  return false;
}

export const isEmptyValue = (v: unknown) =>
  v === undefined || v === null || (typeof v === 'string' && v.trim() === '') || (Array.isArray(v) && v.length === 0);

export const splitLabels = (setting?: string) =>
  new Set(
    (setting ?? '')
      .split(',')
      .map(s => normalize(s))
      .filter(Boolean)
  );

export const labelIn = (labels: Set<string>, label: string) => labels.has(normalize(label));

// Fields placed in one region (card), with their resolved label and value
export function readFields(child: ReactElement<any>): CardField[] {
  let kids: any[] = [];
  try {
    kids = Object.values(child?.props?.getPConnect?.().getChildren?.() ?? []);
  } catch {
    return [];
  }
  return kids.flatMap((kid: any, i: number) => {
    try {
      const pConnect = kid.getPConnect();
      const meta = pConnect.getRawMetadata();
      const { label, caption, value, hideLabel } = pConnect.resolveConfigProps(pConnect.getConfigProps());
      const name = hideLabel ? '' : String(label ?? caption ?? '');
      return [
        {
          key: `${meta?.type}-${name}-${i}`,
          label: name,
          value,
          isView: isContainer(meta, value),
          isWide: WIDE_TYPES.has(normalize(String(meta?.type ?? ''))),
          pConnect
        }
      ];
    } catch {
      return [];
    }
  });
}

const TONES: Array<[RegExp, StatusVariant]> = [
  [/^(high|critical|urgent|rejected|declined|failed|hit|flagged|ineligible|withdrawn)/, 'urgent'],
  [/^pending/, 'pending'],
  [/^(medium|moderate|review|inprogress|open|new)/, 'warn'],
  [/^(low|approved|completed|resolved|cleared|clear|eligible|pass|passed|active)/, 'success']
];

export function statusVariant(value: unknown): StatusVariant {
  const v = normalize(String(value));
  return TONES.find(([re]) => re.test(v))?.[1] ?? 'info';
}

// Ask the field to render in display mode so it reads as formatted text (dates, currency, etc.);
// fall back to Launchpad's own rendering if that isn't possible
function displayOnly(pConnect: any): ReactNode {
  try {
    const meta = pConnect.getRawMetadata();
    const created = pConnect.createComponent({
      ...meta,
      config: { ...meta.config, displayMode: 'DISPLAY_ONLY', readOnly: true, hideLabel: true }
    });
    if (created) return created;
  } catch {
    // fall through to the field's normal rendering
  }
  return pConnect.getComponent();
}

export function FieldValue({ field, asBadge }: { field: CardField; asBadge: boolean }) {
  if (isEmptyValue(field.value)) {
    return <span className='sc-empty'>Not provided</span>;
  }
  if (asBadge) {
    return <Status variant={statusVariant(field.value)}>{String(field.value)}</Status>;
  }
  return <>{displayOnly(field.pConnect)}</>;
}
