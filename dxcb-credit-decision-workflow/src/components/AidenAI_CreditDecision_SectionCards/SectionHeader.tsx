import { Icon, Status, Text } from '@pega/cosmos-react-core';
import { isEmptyValue, labelIn, splitLabels, statusVariant } from './fields';
import type { CardField } from './fields';

interface Fact {
  label: string;
  value: string;
  tone?: ReturnType<typeof statusVariant>;
}

const normalize = (s: string) => s.replace(/[^a-z0-9]/gi, '').toLowerCase();

// Reads one fact for the header. Accepts "Case ID", "Status", the label of a field shown in the cards,
// or a case property name (e.g. ApplicationNumber).
function readFact(name: string, getPConnect: () => any, fields: CardField[]): unknown {
  const key = normalize(name);
  try {
    const pConnect = getPConnect();
    if (key === 'caseid' || key === 'case') return pConnect.getCaseInfo?.()?.getBusinessID?.();
    if (key === 'status' || key === 'casestatus') {
      return pConnect.getValue?.('caseInfo.status') ?? pConnect.getValue?.('.pyStatusWork');
    }
    const field = fields.find(f => !f.isView && normalize(f.label) === key);
    if (field) return field.value;
    return pConnect.getValue?.(`.${name.replace(/\s+/g, '')}`);
  } catch {
    return undefined;
  }
}

interface SectionHeaderProps {
  title?: string;
  description?: string;
  iconName: string;
  factFields?: string;
  toneFields?: string;
  showProgress: boolean;
  fields: CardField[];
  getPConnect: () => any;
}

// Option B header: compact strip with the section title, case facts as chips and overall progress
export default function SectionHeader({
  title,
  description,
  iconName,
  factFields,
  toneFields,
  showProgress,
  fields,
  getPConnect
}: SectionHeaderProps) {
  const toned = splitLabels(toneFields);
  const facts: Fact[] = (factFields ?? '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .flatMap(label => {
      const raw = readFact(label, getPConnect, fields);
      if (isEmptyValue(raw) || typeof raw === 'object') return [];
      const value = String(raw);
      return [{ label, value, tone: labelIn(toned, label) ? statusVariant(value) : undefined }];
    });

  const valueFields = fields.filter(f => !f.isView);
  const filled = valueFields.filter(f => !isEmptyValue(f.value)).length;
  const pct = valueFields.length ? Math.round((filled / valueFields.length) * 100) : 0;
  const showBar = showProgress && valueFields.length > 0;

  return (
    <header className='sc-header'>
      <div className='sc-header-row'>
        <span className='sc-header-icon' aria-hidden>
          <Icon name={iconName} />
        </span>
        {title && (
          <Text variant='h2' className='sc-header-title'>
            {title}
          </Text>
        )}
        {facts.length > 0 && (
          <div className='sc-header-facts'>
            {facts.map(fact =>
              fact.tone ? (
                <Status key={fact.label} variant={fact.tone}>
                  {fact.value}
                </Status>
              ) : (
                <span key={fact.label} className='sc-fact'>
                  <span className='sc-fact-label'>{fact.label}</span>
                  <span className='sc-fact-value'>{fact.value}</span>
                </span>
              )
            )}
          </div>
        )}
      </div>
      {(description || showBar) && (
        <div className='sc-header-sub'>
          {description && <span className='sc-header-desc'>{description}</span>}
          {showBar && (
            <span className='sc-header-progress'>
              <span className='sc-header-count'>{`${filled} of ${valueFields.length} provided`}</span>
              <span
                className='sc-header-bar'
                role='meter'
                aria-label='Fields provided'
                aria-valuemin={0}
                aria-valuemax={valueFields.length}
                aria-valuenow={filled}
              >
                <i style={{ width: `${pct}%` }} />
              </span>
            </span>
          )}
        </div>
      )}
    </header>
  );
}
