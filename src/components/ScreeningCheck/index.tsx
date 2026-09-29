import { useState } from 'react';
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import PaymentsIcon from '@mui/icons-material/Payments';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import AppTopBars from '../AppTopBars';
import { usePega } from '../../context/PegaReadyContext';
import CaseStageBar, { buildStages } from './CaseStageBar';
import ReviewApplicationDetails, { getBorrowerKind, getReviewAnchors } from './ReviewApplicationDetails';
import FundingRequirement, { FUNDING_REQUIREMENT_ANCHORS } from './FundingRequirement';
import AmlScreening, { EMPTY_AML_STATE, getAmlAnchors } from './AmlScreening';
import type { ScreeningDecision } from './launchpadActions';
import type { AmlSectionState } from './AmlScreening';
import PolicyIcon from '@mui/icons-material/Policy';
import SectionActionBar from './SectionActionBar';
import { useLatestCase } from './caseData';
import type { CaseSnapshot } from './caseData';
import { CURRENT_STAGE } from './applicationFields';

const SECTIONS = [
  {
    key: 'reviewApplicationDetails',
    label: 'Review Application Details',
    icon: <FactCheckIcon />,
    description: 'Details captured during Application Intake. Review them before starting the screening checks.'
  },
  {
    key: 'fundingRequirement',
    label: 'Funding Requirement',
    icon: <PaymentsIcon />,
    description: "The borrower's funding need, how it is financed and what it will be used for."
  },
  {
    key: 'amlScreening',
    label: 'Perform AML Screening',
    icon: <PolicyIcon />,
    description: 'Enter the AML Check ID to fetch the anti-money-laundering screening result for this borrower.'
  }
] as const;

type SectionKey = (typeof SECTIONS)[number]['key'];

interface ScreeningCheckProps {
  onBack: () => void;
  // Leaves the case, same as Cancel in Stage 1
  onCancel: () => void;
  // AML "Eligible": the case moves on to Credit Appraisal
  onEligible: () => void;
  // AML "Ineligible": the case goes back to Application Intake (Funding Requirements)
  onIneligible: () => void;
  // Built from the Stage 1 forms; used while Launchpad isn't connected
  localCase?: CaseSnapshot | null;
}

export default function ScreeningCheck({ onBack, onCancel, onEligible, onIneligible, localCase }: ScreeningCheckProps) {
  const [activeSection, setActiveSection] = useState<SectionKey>('reviewApplicationDetails');
  // Kept here so the AML result survives switching between sections
  const [amlState, setAmlState] = useState<AmlSectionState>(EMPTY_AML_STATE);
  const [completed, setCompleted] = useState<SectionKey[]>([]);
  const { isPegaReady } = usePega();
  const pegaCase = useLatestCase(isPegaReady);
  const caseData = pegaCase ?? localCase ?? null;

  const stages = caseData?.stages.length ? caseData.stages : buildStages(CURRENT_STAGE);
  const sectionIndex = SECTIONS.findIndex((s) => s.key === activeSection);
  const section = SECTIONS[sectionIndex];
  const nextSection = SECTIONS[sectionIndex + 1];
  const allCompleted = SECTIONS.every((s) => completed.includes(s.key));

  const borrowerKind = caseData ? getBorrowerKind(caseData) : undefined;
  const anchors = !caseData
    ? []
    : activeSection === 'reviewApplicationDetails'
      ? getReviewAnchors(borrowerKind)
      : activeSection === 'fundingRequirement'
        ? FUNDING_REQUIREMENT_ANCHORS
        : getAmlAnchors(!!amlState.result);

  const scrollTo = (id: string) => {
    document.getElementById(`review-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const goToSection = (key: SectionKey) => {
    setActiveSection(key);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const markCompleted = (key: SectionKey) => {
    setCompleted((prev) => (prev.includes(key) ? prev : [...prev, key]));
  };

  const handleAmlDecision = (decision: ScreeningDecision) => {
    markCompleted('amlScreening');
    if (decision === 'eligible') onEligible();
    else onIneligible();
  };

  // TODO: submit the assignment in Launchpad once connected
  const handleSubmitSection = () => {
    markCompleted(activeSection);
    if (nextSection) goToSection(nextSection.key);
  };

  return (
    <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
      <AppTopBars />

      <Box sx={{ px: 3, pb: 2 }}>
        <CaseStageBar stages={stages} />
      </Box>

      <Box sx={{ display: 'flex', minHeight: 'calc(100vh - 224px)' }}>
        {/* Sidebar navigation */}
        <Box
          sx={{
            width: 240,
            flexShrink: 0,
            backgroundColor: 'background.paper',
            borderRight: '1px solid',
            borderColor: 'divider',
            display: { xs: 'none', md: 'block' }
          }}
        >
          <List sx={{ py: 2, position: 'sticky', top: 0 }}>
            {SECTIONS.map((item) => (
              <ListItemButton
                key={item.key}
                selected={activeSection === item.key}
                onClick={() => goToSection(item.key)}
                sx={{
                  mx: 1,
                  mb: 0.5,
                  borderRadius: 2,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: '#fff',
                    '& .MuiListItemIcon-root': { color: '#fff' },
                    '&:hover': { backgroundColor: 'primary.dark' }
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
                {completed.includes(item.key) && (
                  <CheckCircleIcon
                    fontSize='small'
                    aria-label='Completed'
                    sx={{ ml: 1, color: activeSection === item.key ? '#fff' : 'success.main' }}
                  />
                )}
              </ListItemButton>
            ))}

            {anchors.length > 0 && (
              <>
                <ListSubheader
                  disableSticky
                  sx={{ mt: 2, lineHeight: '32px', fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}
                >
                  On this page
                </ListSubheader>
                {anchors.map((anchor) => (
                  <ListItemButton key={anchor.id} onClick={() => scrollTo(anchor.id)} sx={{ mx: 1, py: 0.5, borderRadius: 2 }}>
                    <ListItemText
                      disableTypography
                      primary={
                        <Typography variant='body2' color='text.secondary'>
                          {anchor.title}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                ))}
              </>
            )}
          </List>
        </Box>

        {/* Main content */}
        <Box sx={{ flexGrow: 1, minWidth: 0, p: { xs: 2, md: 4 } }}>
          <Typography variant='h6' sx={{ fontWeight: 700, mb: 0.5 }}>
            {section.label}
          </Typography>
          <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
            {section.description}
          </Typography>

          {caseData?.source === 'local' && (
            <Alert severity='info' variant='outlined' sx={{ mb: 3, borderRadius: 2 }}>
              Preview: showing the details entered in Application Intake. This will switch to the Launchpad case once
              the app is connected.
            </Alert>
          )}

          {allCompleted && (
            <Alert severity='success' sx={{ mb: 3, borderRadius: 2 }}>
              All Screening Check sections are submitted.
            </Alert>
          )}

          {caseData ? (
            <>
              {activeSection === 'reviewApplicationDetails' && <ReviewApplicationDetails caseData={caseData} />}
              {activeSection === 'fundingRequirement' && <FundingRequirement caseData={caseData} />}
              {activeSection === 'amlScreening' ? (
                <AmlScreening
                  caseData={caseData}
                  borrowerKind={borrowerKind}
                  state={amlState}
                  onStateChange={setAmlState}
                  onCancel={onCancel}
                  onDecision={handleAmlDecision}
                />
              ) : (
                // Read-only sections: no "Fill with sample data"
                <SectionActionBar onCancel={onCancel} onSubmit={handleSubmitSection} />
              )}
            </>
          ) : (
            <CenteredMessage>
              <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
                <InboxOutlinedIcon sx={{ fontSize: 48, mb: 1 }} />
                <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
                  No application loaded
                </Typography>
                <Typography variant='body2'>Complete Application Intake to review the application here.</Typography>
              </Box>
            </CenteredMessage>
          )}
        </Box>
      </Box>

      <Box sx={{ px: 3, py: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button
          onClick={onBack}
          startIcon={<ArrowBackIcon fontSize='small' />}
          sx={{ textTransform: 'none', color: 'text.secondary' }}
        >
          Back
        </Button>
      </Box>
    </Box>
  );
}

function CenteredMessage({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '40vh', color: 'text.secondary' }}>
      {children}
    </Box>
  );
}
