import { useState } from 'react';
import PegaAuthProvider from '../../context/PegaAuthProvider';
import { PegaReadyProvider, usePega } from '../../context/PegaReadyContext';
import { theme } from '../../theme';
import { NEW_BORROWER_CASE_TYPE } from '../../constants';
import BorrowerCase from '../BorrowerCase';
import CreditDecisionWorkflow from '../CreditDecisionWorkflow';
import type { BusinessType } from '../BorrowerCase/BorrowerProfileForm';

type Screen = 'landing' | 'case';
type CaseMode = 'new' | 'existing';

function AppContent() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [caseMode, setCaseMode] = useState<CaseMode>('new');
  const { createCase } = usePega();

  const handleSelectNewBorrower = () => {
    setCaseMode('new');
    setScreen('case');
  };

  const handleSelectExistingBorrower = () => {
    // TODO: wire to an existing-case search/list flow once that screen is built
    setCaseMode('existing');
    setScreen('case');
  };

  const handleSubmitNewBorrower = (borrowerType: BusinessType, data: Record<string, unknown>) => {
    createCase(NEW_BORROWER_CASE_TYPE, { startingFields: { borrowerType, ...data } }).catch((err: any) => console.error(err));
  };

  const handleWithdraw = () => {
    setScreen('landing');
  };

  if (screen === 'landing') {
    return (
      <CreditDecisionWorkflow
        onSelectNewBorrower={handleSelectNewBorrower}
        onSelectExistingBorrower={handleSelectExistingBorrower}
      />
    );
  }

  return (
    <BorrowerCase
      mode={caseMode}
      onBack={handleWithdraw}
      onWithdraw={handleWithdraw}
      onSubmitNewBorrower={handleSubmitNewBorrower}
    />
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
