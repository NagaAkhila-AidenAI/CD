import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import CircularProgress from '@mui/material/CircularProgress';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AppTopBars from '../AppTopBars';
import { usePega } from '../../context/PegaReadyContext';
import BorrowerProfileForm, {
  SAMPLE_BUSINESS_COUNTRY_CODE,
  SAMPLE_BUSINESS_DATA,
  SAMPLE_INDIVIDUAL_DATA
} from './BorrowerProfileForm';
import type { BusinessType } from './BorrowerProfileForm';
import OwnershipStructureTable, { SAMPLE_OWNERSHIP_ROW } from './OwnershipStructureTable';
import type { OwnershipRow } from './OwnershipStructureTable';
import FundingRequirementsForm, { SAMPLE_FUNDING_DATA, getMissingFundingFields } from './FundingRequirementsForm';
import DocumentsForm, { SAMPLE_DOCUMENT_NAMES } from './DocumentsForm';
import ExistingBorrowerSearch from './ExistingBorrowerSearch';
import type { ExistingBorrowerOption } from './ExistingBorrowerSearch';

const SECTIONS = [
  { key: 'borrowerProfile', label: 'Borrower Profile', icon: <PersonOutlineIcon /> },
  { key: 'fundingRequirements', label: 'Funding Requirements', icon: <AccountBalanceOutlinedIcon /> },
  { key: 'documents', label: 'Documents', icon: <FolderOutlinedIcon /> }
] as const;

type SectionKey = (typeof SECTIONS)[number]['key'];
type IndividualStep = 'fields' | 'borrowerSearch' | 'ownership';
type CorporateStep = 'profile' | 'ownership';

interface BorrowerCaseProps {
  mode: 'new' | 'existing';
  onBack: () => void;
  onWithdraw: () => void;
  onSubmitNewBorrower: (borrowerType: BusinessType, data: Record<string, unknown>) => void;
}

export default function BorrowerCase({ mode, onBack, onWithdraw, onSubmitNewBorrower }: BorrowerCaseProps) {
  const [activeSection, setActiveSection] = useState<SectionKey>('borrowerProfile');
  const [businessType, setBusinessType] = useState<BusinessType>('');
  const [countryCode, setCountryCode] = useState('+1');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [ownershipRows, setOwnershipRows] = useState<OwnershipRow[]>([]);
  const [fundingData, setFundingData] = useState<Record<string, string>>({});
  const [showFundingErrors, setShowFundingErrors] = useState(false);
  const [documentNames, setDocumentNames] = useState<string[]>([]);
  const [selectedExistingBorrower, setSelectedExistingBorrower] = useState<ExistingBorrowerOption | null>(null);
  const [individualStep, setIndividualStep] = useState<IndividualStep>('fields');
  const [corporateStep, setCorporateStep] = useState<CorporateStep>('profile');
  const { isPegaReady, PegaContainer } = usePega();

  const isNewBorrowerProfile = mode === 'new' && activeSection === 'borrowerProfile';
  const isExistingBorrowerSearch = mode === 'existing' && activeSection === 'borrowerProfile';
  const isFundingRequirements = activeSection === 'fundingRequirements';
  const isDocuments = activeSection === 'documents';
  const isIndividualFlow = isNewBorrowerProfile && businessType === 'individual';
  const isCorporateFlow = isNewBorrowerProfile && businessType === 'business';
  const isFormSection =
    (isNewBorrowerProfile && !(isIndividualFlow && individualStep === 'borrowerSearch')) ||
    isFundingRequirements ||
    isDocuments ||
    (isExistingBorrowerSearch && !!selectedExistingBorrower);

  const handleBusinessTypeChange = (value: BusinessType) => {
    setBusinessType(value);
    setIndividualStep('fields');
    setCorporateStep('profile');
    setSelectedExistingBorrower(null);
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFundingFieldChange = (field: string, value: string) => {
    setFundingData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectExistingBorrower = (val: ExistingBorrowerOption | null) => {
    setSelectedExistingBorrower(val);
    if (isIndividualFlow && val) {
      setIndividualStep('ownership');
    }
  };

  const handleCreateNewBorrower = () => {
    setSelectedExistingBorrower({ code: 'NEW', name: 'New Borrower' });
    if (isIndividualFlow) {
      setIndividualStep('ownership');
    }
  };

  const handleFillSampleData = () => {
    if (isNewBorrowerProfile) {
      if (isIndividualFlow) {
        if (individualStep === 'fields') {
          setFormData(SAMPLE_INDIVIDUAL_DATA);
        } else if (individualStep === 'ownership') {
          setOwnershipRows([{ ...SAMPLE_OWNERSHIP_ROW }]);
        }
      } else if (isCorporateFlow && corporateStep === 'ownership') {
        setOwnershipRows([{ ...SAMPLE_OWNERSHIP_ROW }]);
      } else {
        setFormData(SAMPLE_BUSINESS_DATA);
        setCountryCode(SAMPLE_BUSINESS_COUNTRY_CODE);
      }
    } else if (isExistingBorrowerSearch && selectedExistingBorrower) {
      setOwnershipRows([{ ...SAMPLE_OWNERSHIP_ROW }]);
    } else if (isFundingRequirements) {
      setFundingData(SAMPLE_FUNDING_DATA);
    } else if (isDocuments) {
      setDocumentNames(SAMPLE_DOCUMENT_NAMES);
    }
  };

  const handleSubmit = () => {
    if (isNewBorrowerProfile) {
      if (isIndividualFlow) {
        if (individualStep === 'fields') {
          setIndividualStep('borrowerSearch');
        } else if (individualStep === 'ownership') {
          onSubmitNewBorrower(businessType, {
            ...formData,
            linkedBorrower: selectedExistingBorrower,
            ownershipStructure: ownershipRows
          });
          setActiveSection('fundingRequirements');
        }
      } else if (isCorporateFlow && corporateStep === 'profile') {
        // Profile done: unlock the ownership structure and bring it into view
        setCorporateStep('ownership');
        setTimeout(() => document.getElementById('ownership-structure')?.scrollIntoView({ behavior: 'smooth' }), 0);
      } else {
        onSubmitNewBorrower(businessType, { ...formData, ownershipStructure: ownershipRows });
        setActiveSection('fundingRequirements');
      }
    } else if (isExistingBorrowerSearch) {
      // TODO: wire to the real case-lookup action once the DX API is connected
      console.log('Continue with existing borrower', selectedExistingBorrower);
      setActiveSection('fundingRequirements');
    } else if (isFundingRequirements) {
      if (getMissingFundingFields(fundingData).length > 0) {
        setShowFundingErrors(true);
        return;
      }
      // TODO: wire to the real funding-requirements case action once the DX API is connected
      console.log('Submit funding requirements', fundingData);
      setActiveSection('documents');
    } else if (isDocuments) {
      // TODO: wire to the real document-upload case action once the DX API is connected
      console.log('Submit documents', documentNames);
    }
  };

  const actionBar = (
    <Stack direction='row' spacing={2} justifyContent='flex-end' alignItems='center' sx={{ pt: 1, pb: 3 }}>
      <Button variant='outlined' color='inherit' onClick={onWithdraw} sx={{ textTransform: 'none', borderRadius: 2 }}>
        Cancel
      </Button>
      {isFormSection && (
        <Button
          variant='outlined'
          startIcon={<AutoAwesomeIcon fontSize='small' />}
          onClick={handleFillSampleData}
          disabled={isNewBorrowerProfile && !businessType}
          sx={{ textTransform: 'none', borderRadius: 2, color: '#7c4dff', borderColor: '#7c4dff' }}
        >
          Fill with sample data
        </Button>
      )}
      <Button
        variant='contained'
        onClick={handleSubmit}
        disabled={
          (isNewBorrowerProfile && !businessType) ||
          (isIndividualFlow && individualStep === 'borrowerSearch') ||
          (isExistingBorrowerSearch && !selectedExistingBorrower)
        }
        sx={{ textTransform: 'none', borderRadius: 2 }}
      >
        {isDocuments ? 'Submit Documents' : 'Submit'}
      </Button>
    </Stack>
  );
  // Corporate profile step: buttons sit between the profile and the (locked) ownership structure
  const showInlineActionBar = isCorporateFlow && corporateStep === 'profile';

  return (
    <Box sx={{ backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <AppTopBars />

      {/* White page card holding the tabs and the section panels */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: 'calc(100vh - 200px)',
          mx: 3,
          my: 2,
          backgroundColor: 'background.paper',
          borderRadius: 1.5,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)'
        }}
      >
        {/* Horizontal tab navigation */}
        <Box sx={{ px: 4, pt: 1.5 }}>
          <Tabs
            value={activeSection}
            onChange={(_, value: SectionKey) => setActiveSection(value)}
            variant='scrollable'
            scrollButtons='auto'
            sx={{
              '& .MuiTabs-indicator': { height: 3, borderRadius: 2 },
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: '1.05rem',
                fontWeight: 600,
                minHeight: 56,
                mr: 3,
                px: 0.5,
                color: 'primary.main'
              }
            }}
          >
            {SECTIONS.map((section) => (
              <Tab
                key={section.key}
                value={section.key}
                label={section.label}
                icon={section.icon}
                iconPosition='start'
              />
            ))}
          </Tabs>
        </Box>

        {/* Main content */}
        <Box sx={{ flexGrow: 1, minWidth: 0, px: 4, pt: 2, pb: 3, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ flexGrow: 1 }}>
            {isNewBorrowerProfile ? (
              isIndividualFlow && individualStep === 'borrowerSearch' ? (
                <ExistingBorrowerSearch
                  value={selectedExistingBorrower}
                  onChange={handleSelectExistingBorrower}
                  onCreateNew={handleCreateNewBorrower}
                />
              ) : isIndividualFlow && individualStep === 'ownership' ? (
                <OwnershipStructureTable rows={ownershipRows} onRowsChange={setOwnershipRows} />
              ) : (
                <>
                  <BorrowerProfileForm
                    businessType={businessType}
                    onBusinessTypeChange={handleBusinessTypeChange}
                    formData={formData}
                    onFieldChange={handleFieldChange}
                    countryCode={countryCode}
                    onCountryCodeChange={setCountryCode}
                  />
                  {businessType === 'business' && (
                    <>
                      {showInlineActionBar && actionBar}
                      <Box id='ownership-structure'>
                        <OwnershipStructureTable
                          rows={ownershipRows}
                          onRowsChange={setOwnershipRows}
                          locked={corporateStep === 'profile'}
                        />
                      </Box>
                    </>
                  )}
                </>
              )
            ) : isExistingBorrowerSearch ? (
              <>
                <ExistingBorrowerSearch
                  value={selectedExistingBorrower}
                  onChange={handleSelectExistingBorrower}
                  onCreateNew={handleCreateNewBorrower}
                />
                {selectedExistingBorrower && (
                  <OwnershipStructureTable rows={ownershipRows} onRowsChange={setOwnershipRows} />
                )}
              </>
            ) : isFundingRequirements ? (
              <FundingRequirementsForm
                formData={fundingData}
                onFieldChange={handleFundingFieldChange}
                showErrors={showFundingErrors}
              />
            ) : isDocuments ? (
              <DocumentsForm fileNames={documentNames} onFileNamesChange={setDocumentNames} />
            ) : isPegaReady ? (
              <div id='pega-root'>
                <PegaContainer />
              </div>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '50vh',
                  color: 'text.secondary'
                }}
              >
                <CircularProgress size={24} sx={{ mr: 2 }} />
                <Typography>Connecting to Pega Launchpad...</Typography>
              </Box>
            )}
          </Box>

          {/* Action bar */}
          {!showInlineActionBar && actionBar}
        </Box>
      </Box>

      {/* Sits below the main content */}
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
