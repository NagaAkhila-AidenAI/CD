import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Card, CardContent, CardHeader, Progress, Status, Text, useTheme, withConfiguration } from '@pega/cosmos-react-core';

import type { PConnProps } from './PConnProps';
import './create-nonce';
import { isResolved, loadRows, sameText, splitList, toCaseRows } from './data';
import type { CaseRow } from './data';
import StyledPipelineOverview from './styles';

interface PipelineOverviewProps extends PConnProps {
  heading?: string;
  dataViewName?: string;
  stages?: string;
  statusField?: string;
  idField?: string;
  borrowerField?: string;
  priorityField?: string;
  amountField?: string;
  updatedField?: string;
  currency?: string;
  highPriorityValues?: string;
  staleDays?: string;
  maxAttention?: string;
  showDiagnostics?: boolean;
}

interface AttentionItem {
  row: CaseRow;
  reasons: string[];
}

const priorityVariant = (p: string): 'urgent' | 'warn' | 'success' | 'info' => {
  const v = p.trim().toLowerCase();
  if (['high', 'critical', 'urgent'].includes(v)) return 'urgent';
  if (['medium', 'moderate'].includes(v)) return 'warn';
  if (v === 'low') return 'success';
  return 'info';
};

function formatMoney(total: number, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: currency ? 'currency' : 'decimal',
      currency: currency || undefined,
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(total);
  } catch {
    return new Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 1 }).format(total);
  }
}

// PAGE widget for the case type landing page: KPI strip, stage pipeline and a needs-attention list,
// all computed from one case data view.
function AidenAICreditDecisionPipelineOverview(props: PipelineOverviewProps) {
  const {
    heading = 'Application pipeline',
    dataViewName = '',
    stages = 'Application Intake, Screening Check, Credit Appraisal, Credit Rating, Committee Review, Sanction, Documentation Legal, Compliance Check, Disbursement',
    statusField = 'pyStatusWork',
    idField = 'pyID',
    borrowerField = '',
    priorityField = '',
    amountField = '',
    updatedField = 'pxUpdateDateTime',
    currency = '',
    highPriorityValues = 'High, Critical, Urgent',
    staleDays = '7',
    maxAttention = '8',
    showDiagnostics = false,
    getPConnect
  } = props;
  const theme = useTheme();

  const [rawRows, setRawRows] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchRows = useCallback(() => {
    if (!dataViewName) return;
    setLoading(true);
    setError('');
    const contextName = getPConnect?.()?.getContextName?.() || '';
    loadRows(dataViewName, contextName)
      .then(setRawRows)
      .catch((e: any) => setError(`Could not load "${dataViewName}": ${e?.message || 'unknown error'}`))
      .finally(() => setLoading(false));
  }, [dataViewName, getPConnect]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  const rows = useMemo(
    () => toCaseRows(rawRows, { statusField, idField, borrowerField, priorityField, amountField, updatedField }),
    [rawRows, statusField, idField, borrowerField, priorityField, amountField, updatedField]
  );

  const stageList = splitList(stages);
  const highValues = splitList(highPriorityValues);
  const stale = parseInt(staleDays, 10) || 7;
  const limit = parseInt(maxAttention, 10) || 8;

  const open = rows.filter(r => !isResolved(r.status));
  const completed = rows.filter(r => /completed|approved/i.test(r.status) && isResolved(r.status)).length;
  const exposure = open.reduce((sum, r) => sum + (r.amount ?? 0), 0);
  const hasAmounts = open.some(r => r.amount !== null);

  const stageStats = stageList.map(name => {
    const inStage = open.filter(r => sameText(r.stage, name));
    const ages = inStage.map(r => r.ageDays).filter((d): d is number => d !== null);
    return { name, count: inStage.length, oldest: ages.length ? Math.max(...ages) : null };
  });
  const busiest = Math.max(0, ...stageStats.map(s => s.count));

  const attention: AttentionItem[] = open
    .map(row => {
      const reasons: string[] = [];
      if (row.priority && highValues.some(h => sameText(h, row.priority))) reasons.push(`${row.priority} priority`);
      if (row.ageDays !== null && row.ageDays >= stale) reasons.push(`no update for ${row.ageDays} days`);
      if (borrowerField && !row.borrower) reasons.push('no borrower linked');
      return { row, reasons };
    })
    .filter(item => item.reasons.length > 0)
    .sort((a, b) => b.reasons.length - a.reasons.length || (b.row.ageDays ?? 0) - (a.row.ageDays ?? 0));

  const openCase = (row: CaseRow) => {
    if (!row.insKey) return;
    try {
      getPConnect().getActionsApi().openWorkByHandle(row.insKey, row.className);
    } catch {
      // opening is a convenience; the list still shows the case ID
    }
  };

  const kpis = [
    { label: 'Total applications', value: String(rows.length), note: 'in this list' },
    { label: 'Open', value: String(open.length), note: 'not yet resolved' },
    ...(hasAmounts ? [{ label: 'Requested exposure', value: formatMoney(exposure, currency), note: 'across open cases' }] : []),
    { label: 'Completed', value: String(completed), note: 'resolved' },
    { label: 'Needs attention', value: String(attention.length), note: `priority, ${stale}+ days idle or no borrower`, alert: true }
  ];

  return (
    <StyledPipelineOverview theme={theme}>
      <Card className='po-card'>
        <CardHeader
          actions={
            <Button variant='simple' label='Refresh' icon compact onClick={fetchRows} disabled={loading || !dataViewName}>
              <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                <path d='M21 2v6h-6' />
                <path d='M3 12a9 9 0 0 1 15-6.7L21 8' />
                <path d='M3 22v-6h6' />
                <path d='M21 12a9 9 0 0 1-15 6.7L3 16' />
              </svg>
            </Button>
          }
        >
          <Text variant='h2'>{heading}</Text>
        </CardHeader>
        <CardContent>
          {!dataViewName && (
            <Text variant='secondary'>Set the "Case list data view" in this widget's settings to show the pipeline.</Text>
          )}
          {dataViewName && loading && <Progress placement='local' message='Loading applications…' />}
          {dataViewName && !loading && error && <Text variant='secondary'>{error}</Text>}

          {dataViewName && !loading && !error && (
            <div className='po-body'>
              {/* KPI strip */}
              <dl className='po-kpis'>
                {kpis.map(k => (
                  <div key={k.label} className={k.alert ? 'po-kpi po-kpi-alert' : 'po-kpi'}>
                    <dt>{k.label}</dt>
                    <dd>{k.value}</dd>
                    <span className='po-kpi-note'>{k.note}</span>
                  </div>
                ))}
              </dl>

              {/* Stage pipeline */}
              <section aria-label='Applications by stage'>
                <h3 className='po-section-title'>Open applications by stage</h3>
                <ol className='po-pipeline'>
                  {stageStats.map(s => (
                    <li key={s.name} className={s.count > 0 && s.count === busiest ? 'po-stage po-stage-busiest' : 'po-stage'}>
                      <span className='po-stage-count'>{s.count}</span>
                      <span className='po-stage-name'>{s.name}</span>
                      <span className='po-stage-age'>
                        {s.oldest === null ? 'no cases' : `oldest ${s.oldest} d`}
                        {s.count > 0 && s.count === busiest ? ' · busiest' : ''}
                      </span>
                    </li>
                  ))}
                </ol>
              </section>

              {/* Needs attention */}
              <section aria-label='Needs attention'>
                <h3 className='po-section-title'>
                  Needs attention <span className='po-count'>{attention.length}</span>
                </h3>
                {attention.length === 0 ? (
                  <Text variant='secondary'>Nothing needs attention right now.</Text>
                ) : (
                  <ul className='po-attention'>
                    {attention.slice(0, limit).map(({ row, reasons }) => (
                      <li key={row.insKey || row.id}>
                        <button type='button' className='po-attention-row' onClick={() => openCase(row)} disabled={!row.insKey}>
                          <span className='po-case-id'>{row.id || '—'}</span>
                          <span className='po-case-main'>
                            <span className='po-borrower'>{row.borrower || 'No borrower'}</span>
                            <span className='po-reasons'>
                              {row.stage || row.status} · {reasons.join(' · ')}
                            </span>
                          </span>
                          {row.priority && <Status variant={priorityVariant(row.priority)}>{row.priority}</Status>}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              {showDiagnostics && (
                <details className='po-diagnostics' open>
                  <summary>Fields returned by {dataViewName}</summary>
                  <code>{rawRows[0] ? Object.keys(rawRows[0]).join(', ') : 'No rows returned.'}</code>
                </details>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </StyledPipelineOverview>
  );
}

export default withConfiguration(AidenAICreditDecisionPipelineOverview);
