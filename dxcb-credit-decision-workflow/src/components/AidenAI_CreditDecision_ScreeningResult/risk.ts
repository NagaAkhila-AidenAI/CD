import type { RegionField } from './fields';

export type RiskTone = 'success' | 'warn' | 'urgent';

export interface RiskSummary {
  score?: number;
  scoreText?: string;
  level?: string;
  tone: RiskTone;
  matches: string[];
  chips: Array<{ label: string; value: string }>;
}

const normalize = (s: string) => s.replace(/[^a-z0-9]/gi, '').toLowerCase();

// Comma-separated labels from the App Studio settings, e.g. "AML Match Found, Sanction Match Found"
export const splitLabels = (setting?: string) =>
  (setting ?? '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

const isEmpty = (v: unknown) => v === undefined || v === null || v === '';

export const isTrue = (v: unknown) => v === true || ['true', 'yes', 'y', '1'].includes(String(v).trim().toLowerCase());

const LEVEL_TONES: Record<string, RiskTone> = {
  low: 'success',
  a: 'success',
  medium: 'warn',
  moderate: 'warn',
  b: 'warn',
  high: 'urgent',
  critical: 'urgent',
  c: 'urgent'
};

function toneFor(level: string | undefined, score: number | undefined, maxScore: number): RiskTone {
  const fromLevel = level ? LEVEL_TONES[normalize(level)] : undefined;
  if (fromLevel) return fromLevel;
  if (score === undefined) return 'warn';
  const pct = (score / maxScore) * 100;
  if (pct < 35) return 'success';
  if (pct < 70) return 'warn';
  return 'urgent';
}

interface SummaryLabels {
  riskScoreLabel?: string;
  riskLevelLabel?: string;
  matchLabels?: string;
  chipLabels?: string;
  maxScore: number;
}

// Picks the risk fields out of the form by label. Returns null until a score or level has a value,
// so nothing shows before the AML lookup has filled the fields.
export function buildRiskSummary(fields: RegionField[], labels: SummaryLabels): RiskSummary | null {
  const byLabel = new Map(fields.map(f => [normalize(f.label), f.value]));
  const find = (label?: string) => (label ? byLabel.get(normalize(label)) : undefined);

  const rawScore = find(labels.riskScoreLabel);
  const rawLevel = find(labels.riskLevelLabel);
  if (isEmpty(rawScore) && isEmpty(rawLevel)) return null;

  const parsed = Number(rawScore);
  const score = isEmpty(rawScore) || Number.isNaN(parsed) ? undefined : parsed;
  const level = isEmpty(rawLevel) ? undefined : String(rawLevel);

  const matches = splitLabels(labels.matchLabels).filter(label => isTrue(find(label)));
  const chips = splitLabels(labels.chipLabels)
    .map(label => ({ label, value: find(label) }))
    .filter(c => !isEmpty(c.value))
    .map(c => ({ label: c.label, value: String(c.value) }));

  const tone = matches.length > 0 ? 'urgent' : toneFor(level, score, labels.maxScore);

  return {
    score,
    scoreText: isEmpty(rawScore) ? undefined : String(rawScore),
    level,
    tone,
    matches,
    chips
  };
}
