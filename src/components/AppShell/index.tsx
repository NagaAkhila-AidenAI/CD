import { useState } from 'react';
import Box from '@mui/material/Box';
import PegaAuthProvider from '../../context/PegaAuthProvider';
import { PegaReadyProvider, usePega } from '../../context/PegaReadyContext';
import { theme } from '../../theme';
import { NEW_BORROWER_CASE_TYPE } from '../../constants';
import BorrowerCase from '../BorrowerCase';
import CreditDecisionWorkflow from '../CreditDecisionWorkflow';
import ScreeningCheck from '../ScreeningCheck';
import CreditAppraisal from '../CreditAppraisal';
import { buildLocalCase, generateApplicationNumber } from '../ScreeningCheck/caseData';
import type { IntakeData } from '../ScreeningCheck/caseData';
import type { BusinessType } from '../BorrowerCase/BorrowerProfileForm';

interface BorrowerSubmission {
  borrowerType: BusinessType;
  data: Record<string, unknown>;
}

type Screen = 'landing' | 'case' | 'screening' | 'creditAppraisal';
type CaseMode = 'new' | 'existing';

// http://localhost:6006/#screening opens Stage 2 directly
const initialScreen = (): Screen => (window.location.hash === '#screening' ? 'screening' : 'landing');

function AppContent() {
  const [screen, setScreen] = useState<Screen>(initialScreen);
  const [caseMode, setCaseMode] = useState<CaseMode>('new');
  const [borrowerSubmission, setBorrowerSubmission] = useState<BorrowerSubmission | null>(null);
  const [intake, setIntake] = useState<IntakeData | null>(null);
  // Stage 1 stays mounted for the whole case so its form data survives visits to later stages;
  // a new key starts a fresh Stage 1
  const [caseKey, setCaseKey] = useState(0);
  const [caseStarted, setCaseStarted] = useState(false);
  const [stage1Jump, setStage1Jump] = useState<{ section: 'fundingRequirements'; nonce: number } | undefined>();
  const { createCase } = usePega();

  const startCase = (mode: CaseMode) => {
    setCaseMode(mode);
    setBorrowerSubmission(null);
    setIntake(null);
    setStage1Jump(undefined);
    setCaseKey((k) => k + 1);
    setCaseStarted(true);
    setScreen('case');
  };

  const handleSelectNewBorrower = () => startCase('new');

  // TODO: wire to an existing-case search/list flow once that screen is built
  const handleSelectExistingBorrower = () => startCase('existing');

  const handleSubmitNewBorrower = (borrowerType: BusinessType, data: Record<string, unknown>) => {
    setBorrowerSubmission({ borrowerType, data });
    createCase(NEW_BORROWER_CASE_TYPE, { startingFields: { borrowerType, ...data } }).catch((err: any) => console.error(err));
  };

  const handleSubmitDocuments = (fundingData: Record<string, string>, documentNames: string[]) => {
    setIntake((prev) => ({
      // Keep the number when the application comes back from Screening Check as Ineligible
      applicationNumber: prev?.applicationNumber ?? generateApplicationNumber(),
      submittedAt: new Date().toISOString().slice(0, 10),
      borrowerType: borrowerSubmission?.borrowerType,
      borrower: borrowerSubmission?.data ?? {},
      funding: fundingData,
      documents: documentNames
    }));
    setScreen('screening');
  };

  const handleWithdraw = () => {
    setCaseStarted(false);
    setScreen('landing');
  };

  // Screening Check "Ineligible": back to Stage 1's Funding Requirements to rework the request
  const handleIneligible = () => {
    setStage1Jump({ section: 'fundingRequirements', nonce: Date.now() });
    setScreen('case');
  };

  return (
    <>
      {screen === 'landing' && (
        <CreditDecisionWorkflow
          onSelectNewBorrower={handleSelectNewBorrower}
          onSelectExistingBorrower={handleSelectExistingBorrower}
        />
      )}

      {caseStarted && (
        <Box sx={{ display: screen === 'case' ? 'block' : 'none' }}>
          <BorrowerCase
            key={caseKey}
            mode={caseMode}
            onBack={handleWithdraw}
            onWithdraw={handleWithdraw}
            onSubmitNewBorrower={handleSubmitNewBorrower}
            onSubmitDocuments={handleSubmitDocuments}
            jumpToSection={stage1Jump}
          />
        </Box>
      )}

      {screen === 'screening' && (
        <ScreeningCheck
          onBack={() => setScreen(caseStarted ? 'case' : 'landing')}
          onCancel={handleWithdraw}
          onEligible={() => setScreen('creditAppraisal')}
          onIneligible={handleIneligible}
          localCase={intake ? buildLocalCase(intake) : null}
        />
      )}

      {screen === 'creditAppraisal' && (
        <CreditAppraisal applicationNumber={intake?.applicationNumber} onBack={() => setScreen('screening')} />
      )}
    </>
  );
}

export default function AppShell() {
  return (
    <PegaAuthProvider>
      <PegaReadyProvider theme={theme}>
        <AppContent />
      </PegaReadyProvider>
    </PegaAuthProvider>
  );
}
