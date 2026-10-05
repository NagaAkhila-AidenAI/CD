import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import AppTopBars from '../AppTopBars';
import CaseStageBar, { buildStages } from '../ScreeningCheck/CaseStageBar';

interface CreditAppraisalProps {
  applicationNumber?: string;
  onBack: () => void;
}

// Stage 3. Its sections get added here the same way as Screening Check's.
export default function CreditAppraisal({ applicationNumber, onBack }: CreditAppraisalProps) {
  return (
    <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
      <AppTopBars />

      <Box sx={{ px: 3, pb: 2 }}>
        <CaseStageBar stages={buildStages('Credit Appraisal')} />
      </Box>

      <Box sx={{ p: { xs: 2, md: 4 }, minHeight: 'calc(100vh - 224px)' }}>
        <Alert severity='success' sx={{ mb: 3, borderRadius: 2 }}>
          Screening Check passed{applicationNumber ? ` for ${applicationNumber}` : ''}. The application has moved to Credit
          Appraisal.
        </Alert>

        <Box sx={{ textAlign: 'center', color: 'text.secondary', py: 8 }}>
          <AssessmentOutlinedIcon sx={{ fontSize: 48, mb: 1 }} />
          <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
            Credit Appraisal
          </Typography>
          <Typography variant='body2'>The Credit Appraisal sections will appear here.</Typography>
        </Box>
      </Box>

      <Box sx={{ px: 3, py: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button onClick={onBack} startIcon={<ArrowBackIcon fontSize='small' />} sx={{ textTransform: 'none', color: 'text.secondary' }}>
          Back
        </Button>
      </Box>
    </Box>
  );
}
