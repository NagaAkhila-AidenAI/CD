import { Status, useTheme, withConfiguration } from '@pega/cosmos-react-core';

import './create-nonce';
import StyledStageProgress from './styles';

interface StageProgressProps {
  // Value of the field the component is placed on (e.g. the Status column of a case list)
  value?: string;
  // Property chosen in the component settings (Status Badge pattern), used when value isn't passed
  inputProperty?: string;
  stages?: string;
  showStepCount?: boolean;
  testId?: string;
}

type Tone = 'progress' | 'done' | 'stopped' | 'new';

const DEFAULT_STAGES =
  'Application Intake, Screening Check, Credit Appraisal, Credit Rating, Committee Review, Sanction, Documentation Legal, Compliance Check, Disbursement';

const normalize = (s: string) => s.replace(/[^a-z0-9]/gi, '').toLowerCase();

// "Pending-Screening Check" -> { prefix: "Pending", stage: "Screening Check" }
function parseStatus(status: string) {
  const dash = status.indexOf('-');
  return dash === -1
    ? { prefix: '', stage: status.trim() }
    : { prefix: status.slice(0, dash).trim(), stage: status.slice(dash + 1).trim() };
}

function toneFor(prefix: string, stage: string): Tone {
  const p = prefix.toLowerCase();
  const s = stage.toLowerCase();
  if (p === 'resolved') {
    return /reject|withdraw|cancel|declin|fail/.test(s) ? 'stopped' : 'done';
  }
  if (p === 'new') return 'new';
  return 'progress';
}

const STATUS_VARIANT: Record<Tone, 'pending' | 'success' | 'urgent' | 'info'> = {
  progress: 'pending',
  done: 'success',
  stopped: 'urgent',
  new: 'info'
};

// Field component (Text) for case lists: shows the case's current stage as a pill with a
// mini stage tracker underneath. Display only; the status itself is set by the case flow.
function AidenAICreditDecisionStageProgress(props: StageProgressProps) {
  const { value, inputProperty, stages = DEFAULT_STAGES, showStepCount = true, testId } = props;
  const theme = useTheme();

  const status = String(value ?? inputProperty ?? '').trim();
  if (!status) return <span>—</span>;

  const stageList = stages
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
  const { prefix, stage } = parseStatus(status);
  const tone = toneFor(prefix, stage);
  const index = stageList.findIndex(s => normalize(s) === normalize(stage));
  // Resolved cases count as past the last stage
  const reached = tone === 'done' || tone === 'stopped' ? stageList.length : index;

  return (
    <StyledStageProgress theme={theme} data-testid={testId} title={status}>
      <span className='sp-top'>
        <Status variant={STATUS_VARIANT[tone]}>{stage || status}</Status>
        {showStepCount && index >= 0 && tone !== 'done' && tone !== 'stopped' && (
          <span className='sp-count'>{`${index + 1} of ${stageList.length}`}</span>
        )}
      </span>
      {reached >= 0 && stageList.length > 0 && (
        <span className={`sp-track sp-${tone}`} aria-hidden>
          {stageList.map((name, i) => {
            let cls = 'sp-seg';
            if (i < reached) cls += ' sp-seg-done';
            else if (i === reached) cls += ' sp-seg-current';
            return <span key={name} className={cls} />;
          })}
        </span>
      )}
    </StyledStageProgress>
  );
}

export default withConfiguration(AidenAICreditDecisionStageProgress);
