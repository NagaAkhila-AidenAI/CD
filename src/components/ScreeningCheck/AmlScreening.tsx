import { useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { alpha } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import GppGoodOutlinedIcon from '@mui/icons-material/GppGoodOutlined';
import PolicyOutlinedIcon from '@mui/icons-material/PolicyOutlined';
import SearchIcon from '@mui/icons-material/Search';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import ReadOnlyField from './ReadOnlyField';
import { SectionCard } from './SectionCard';
import SectionActionBar from './SectionActionBar';
import { formatDateTime, pickValue } from './caseData';
import type { CaseSnapshot } from './caseData';
import { SAMPLE_AML_CHECK_ID, lookupAmlCheck, toCaseFields } from './amlService';
import type { AmlResult } from './amlService';
import { saveScreeningForLater, submitScreeningDecision } from './launchpadActions';
import type { ScreeningDecision } from './launchpadActions';
import type { BorrowerKind } from './applicationFields';

export interface AmlSectionState {
  checkId: string;
  result: AmlResult | null;
}

export const EMPTY_AML_STATE: AmlSectionState = { checkId: '', result: null };

export function getAmlAnchors(hasResult: boolean) {
  return hasResult
    ? [
        { id: 'aml-check', title: 'AML Check' },
        { id: 'aml-screening', title: 'AML Screening' },
        { id: 'aml-sanctions', title: 'Sanctions Screening' },
        { id: 'aml-outcome', title: 'Screening Outcome' }
      ]
    : [{ id: 'aml-check', title: 'AML Check' }];
}

const RISK_COLORS: Record<string, 'success' | 'warning' | 'error'> = {
  low: 'success',
  medium: 'warning',
  high: 'error',
  a: 'success',
  b: 'warning',
  c: 'error'
};

const riskColor = (level: string) => RISK_COLORS[level.toLowerCase()] ?? 'warning';

const GRID_SX = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
  columnGap: 4,
  rowGap: 3
};

interface AmlScreeningProps {
  caseData: CaseSnapshot;
  borrowerKind?: BorrowerKind;
  state: AmlSectionState;
  onStateChange: (state: AmlSectionState) => void;
  onCancel: () => void;
  // Called after the decision is recorded; the parent moves to the next screen
  onDecision: (decision: ScreeningDecision) => void;
}

export default function AmlScreening({
  caseData,
  borrowerKind,
  state,
  onStateChange,
  onCancel,
  onDecision
}: AmlScreeningProps) {
  const requestRef = useRef(0);
  const [loading, setLoading] = useState(false);
  const [pendingDecision, setPendingDecision] = useState<ScreeningDecision | 'save' | null>(null);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const { checkId, result } = state;
  const isPreview = caseData.source === 'local';
  const busy = loading || !!pendingDecision;

  const customerName =
    pickValue(caseData.content, ['BusinessName']) ?? pickValue(caseData.content, ['ApplicantName', 'FullName']) ?? '';

  const runLookup = async (id: string, force = false) => {
    const trimmed = id.trim();
    if (!trimmed) return;
    if (!force && result && result.checkId === trimmed) return;
    // Only the latest request may update the screen (blur + click can fire back to back)
    const requestId = ++requestRef.current;
    setLoading(true);
    setError('');
    try {
      const next = await lookupAmlCheck(trimmed, { customerName, borrowerKind });
      if (requestId !== requestRef.current) return;
      onStateChange({ checkId: trimmed, result: next });
    } catch (e: any) {
      if (requestId !== requestRef.current) return;
      onStateChange({ checkId: trimmed, result: null });
      setError(e?.message || 'AML lookup failed');
    } finally {
      if (requestId === requestRef.current) setLoading(false);
    }
  };

  const handleIdChange = (value: string) => {
    setError('');
    // A different ID invalidates the previous result
    onStateChange({ checkId: value, result: result && result.checkId === value.trim() ? result : null });
  };

  const handleSample = () => {
    onStateChange({ checkId: SAMPLE_AML_CHECK_ID, result: null });
    runLookup(SAMPLE_AML_CHECK_ID, true);
  };

  const caseFields = () => (result ? toCaseFields(result) : { AMLCheckID: checkId.trim() });

  const handleSave = async () => {
    setPendingDecision('save');
    try {
      await saveScreeningForLater(caseData, caseFields());
      setToast(isPreview ? 'Saved for later (preview only, not sent to Launchpad)' : 'Saved for later');
    } catch (e: any) {
      setError(e?.message || 'Could not save');
    } finally {
      setPendingDecision(null);
    }
  };

  const handleDecision = async (decision: ScreeningDecision) => {
    setPendingDecision(decision);
    setError('');
    try {
      await submitScreeningDecision(caseData, decision, caseFields());
      onDecision(decision);
    } catch (e: any) {
      setError(e?.message || 'Could not submit the screening decision');
      setPendingDecision(null);
    }
  };

  return (
    <Stack spacing={3}>
      {/* Input */}
      <SectionCard id='aml-check' icon={<PolicyOutlinedIcon />} title='AML Check'>
        <Typography variant='body2' sx={{ fontWeight: 600, mb: 0.5 }}>
          AML Check ID
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ sm: 'flex-start' }} sx={{ maxWidth: 560 }}>
          <TextField
            fullWidth
            value={checkId}
            placeholder='e.g. AML-1001'
            disabled={!!pendingDecision}
            onChange={(e) => handleIdChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && runLookup(checkId)}
            onBlur={() => runLookup(checkId)}
            error={!!error}
            helperText={error || 'Enter the check ID to fetch the AML, sanctions and PEP screening results.'}
          />
          <Button
            variant='outlined'
            onClick={() => runLookup(checkId, true)}
            disabled={!checkId.trim() || busy}
            startIcon={loading ? <CircularProgress size={16} /> : <SearchIcon />}
            sx={{ textTransform: 'none', borderRadius: 2, height: 40, flexShrink: 0 }}
          >
            {loading ? 'Looking up…' : 'Look up'}
          </Button>
        </Stack>
      </SectionCard>

      {loading && (
        <Stack direction='row' spacing={2} alignItems='center' sx={{ py: 4, justifyContent: 'center', color: 'text.secondary' }}>
          <CircularProgress size={22} />
          <Typography>Fetching screening results…</Typography>
        </Stack>
      )}

      {/* Results appear only after a successful lookup */}
      {!loading && result && (
        <>
          <RiskSummary result={result} />

          {(result.matchFound || result.sanctionMatchFound) && (
            <Alert severity='error' variant='outlined' sx={{ borderRadius: 2 }}>
              {result.matchFound && result.sanctionMatchFound
                ? 'Potential AML and sanctions matches were found for this customer.'
                : result.matchFound
                  ? 'A potential AML match was found for this customer.'
                  : 'A potential sanctions match was found for this customer.'}
            </Alert>
          )}

          <SectionCard id='aml-screening' icon={<GppGoodOutlinedIcon />} title='AML Screening'>
            <Box sx={GRID_SX}>
              <ReadOnlyField label='AML check ID' value={result.checkId} />
              <ReadOnlyField label='AML screening date' value={formatDateTime(result.screeningDate)} />
              <ReadOnlyField label='AML status' value={result.status} />
              <ReadOnlyField label='AML risk rating' value={result.riskRating} />
              <ReadOnlyField label='AML risk level' value={result.riskLevel} />
              <ReadOnlyField label='AML risk score' value={String(result.riskScore ?? '')} />
              <BooleanField label='AML match found' value={result.matchFound} />
            </Box>
          </SectionCard>

          <SectionCard id='aml-sanctions' icon={<GavelOutlinedIcon />} title='Sanctions Screening'>
            <Box sx={GRID_SX}>
              <ReadOnlyField label='Sanction screening ID' value={result.sanctionScreeningId} />
              <ReadOnlyField label='Sanction screening date' value={formatDateTime(result.sanctionScreeningDate)} />
              <ReadOnlyField label='Sanction list name' value={result.sanctionListName} />
              <BooleanField label='Sanction match found' value={result.sanctionMatchFound} />
            </Box>
          </SectionCard>

          <SectionCard id='aml-outcome' icon={<VerifiedUserOutlinedIcon />} title='Screening Outcome'>
            <Box sx={GRID_SX}>
              <ReadOnlyField label='Screening status' value={result.screeningStatus} />
              <ReadOnlyField label='PEP status' value={result.pepStatus} />
            </Box>
          </SectionCard>
        </>
      )}

      {!loading && !result && (
        <Typography variant='body2' sx={{ color: 'text.disabled', fontStyle: 'italic' }}>
          The screening results appear here after you look up an AML Check ID.
        </Typography>
      )}

      {/* Before a lookup: Cancel · Fill with sample data · Save for later
          After a lookup:  Cancel · Save for later · Ineligible · Eligible */}
      <SectionActionBar
        onCancel={onCancel}
        cancelDisabled={!!pendingDecision}
        onFillSample={result ? undefined : handleSample}
        sampleDisabled={busy}
        extraActions={
          <>
            <Button
              variant='outlined'
              onClick={handleSave}
              disabled={busy || !checkId.trim()}
              startIcon={pendingDecision === 'save' ? <CircularProgress size={16} /> : undefined}
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              Save for later
            </Button>
            {result && (
              <>
                <Button
                  variant='outlined'
                  onClick={() => handleDecision('ineligible')}
                  disabled={busy}
                  startIcon={pendingDecision === 'ineligible' ? <CircularProgress size={16} /> : undefined}
                  sx={{ textTransform: 'none', borderRadius: 2 }}
                >
                  Ineligible
                </Button>
                <Button
                  variant='contained'
                  onClick={() => handleDecision('eligible')}
                  disabled={busy}
                  startIcon={pendingDecision === 'eligible' ? <CircularProgress size={16} color='inherit' /> : undefined}
                  sx={{ textTransform: 'none', borderRadius: 2 }}
                >
                  Eligible
                </Button>
              </>
            )}
          </>
        }
      />

      <Snackbar
        open={!!toast}
        autoHideDuration={3000}
        onClose={() => setToast('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity='success' variant='filled' onClose={() => setToast('')} sx={{ borderRadius: 2 }}>
          {toast}
        </Alert>
      </Snackbar>
    </Stack>
  );
}

function BooleanField({ label, value }: { label: string; value: boolean }) {
  return (
    <Box>
      <Typography
        variant='caption'
        component='div'
        sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4, mb: 0.5 }}
      >
        {label}
      </Typography>
      <Chip
        size='small'
        label={value ? 'Yes' : 'No'}
        color={value ? 'error' : 'success'}
        variant={value ? 'filled' : 'outlined'}
        sx={{ fontWeight: 600 }}
      />
    </Box>
  );
}

function RiskSummary({ result }: { result: AmlResult }) {
  const color = riskColor(String(result.riskLevel));
  const score = Math.max(0, Math.min(100, Number(result.riskScore) || 0));

  const chips: ReactNode[] = [
    <Chip key='level' size='small' color={color} label={`Risk level ${result.riskLevel}`} sx={{ fontWeight: 600 }} />,
    result.screeningStatus && (
      <Chip key='status' size='small' variant='outlined' label={result.screeningStatus} sx={{ fontWeight: 600 }} />
    ),
    result.pepStatus && <Chip key='pep' size='small' variant='outlined' label={result.pepStatus} sx={{ fontWeight: 600 }} />
  ];

  return (
    <Box
      sx={(theme) => ({
        p: 2.5,
        borderRadius: 3,
        border: '1px solid',
        borderColor: alpha(theme.palette[color].main, 0.4),
        backgroundColor: alpha(theme.palette[color].main, 0.06)
      })}
    >
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems={{ md: 'center' }}>
        <Box sx={{ minWidth: 140 }}>
          <Typography variant='caption' sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase' }}>
            AML risk score
          </Typography>
          <Typography variant='h4' sx={{ fontWeight: 700, lineHeight: 1.1 }}>
            {result.riskScore}
            <Typography component='span' variant='body2' color='text.secondary'>
              {' '}
              / 100
            </Typography>
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <LinearProgress
            variant='determinate'
            value={score}
            color={color}
            aria-label='AML risk score'
            sx={{ height: 8, borderRadius: 4, mb: 1.5 }}
          />
          <Stack direction='row' spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
            {chips}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
