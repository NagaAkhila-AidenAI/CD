import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CircularProgress from '@mui/material/CircularProgress';
import PersonIcon from '@mui/icons-material/Person';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import FolderIcon from '@mui/icons-material/Folder';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AppTopBars from '../AppTopBars';
import { usePega } from '../../context/PegaReadyContext';
import BorrowerProfileForm, {
  SAMPLE_BUSINESS_DATA,
  SAMPLE_INDIVIDUAL_DATA
} from './BorrowerProfileForm';
import type { BusinessType } from './BorrowerProfileForm';
import OwnershipStructureTable, { SAMPLE_OWNERSHIP_ROW } from './OwnershipStructureTable';
import type { OwnershipRow } from './OwnershipStructureTable';
import FundingRequirementsForm, { SAMPLE_FUNDING_DATA } from './FundingRequirementsForm';
import DocumentsForm, { SAMPLE_DOCUMENT_NAMES } from './DocumentsForm';
import ExistingBorrowerSearch from './ExistingBorrowerSearch';
import type { ExistingBorrowerOption } from './ExistingBorrowerSearch';

const SECTIONS = [
  { key: 'borrowerProfile', label: 'Borrower Profile', icon: <PersonIcon /> },
  { key: 'fundingRequirements', label: 'Funding Requirements', icon: <AccountBalanceIcon /> },
  { key: 'documents', label: 'Documents', icon: <FolderIcon /> }
] as const;

type SectionKey = (typeof SECTIONS)[number]['key'];
type IndividualStep = 'fields' | 'borrowerSearch' | 'ownership';

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
  const [documentNames, setDocumentNames] = useState<string[]>([]);
  const [selectedExistingBorrower, setSelectedExistingBorrower] = useState<ExistingBorrowerOption | null>(null);
  const [individualStep, setIndividualStep] = useState<IndividualStep>('fields');
  const { isPegaReady, PegaContainer } = usePega();

  const isNewBorrowerProfile = mode === 'new' && activeSection === 'borrowerProfile';
  const isExistingBorrowerSearch = mode === 'existing' && activeSection === 'borrowerProfile';
  const isFundingRequirements = activeSection === 'fundingRequirements';
  const isDocuments = activeSection === 'documents';
  const isIndividualFlow = isNewBorrowerProfile && businessType === 'individual';
  const isFormSection =
    (isNewBorrowerProfile && !(isIndividualFlow && individualStep === 'borrowerSearch')) ||
    isFundingRequirements ||
    isDocuments ||
    (isExistingBorrowerSearch && !!selectedExistingBorrower);

  const handleBusinessTypeChange = (value: BusinessType) => {
    setBusinessType(value);
    setIndividualStep('fields');
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
      } else {
        setFormData(SAMPLE_BUSINESS_DATA);
        if (businessType === 'business') {
          setOwnershipRows([{ ...SAMPLE_OWNERSHIP_ROW }]);
        }
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
      } else {
        onSubmitNewBorrower(businessType, { ...formData, ownershipStructure: ownershipRows });
        setActiveSection('fundingRequirements');
      }
    } else if (isExistingBorrowerSearch) {
      // TODO: wire to the real case-lookup action once the DX API is connected
      console.log('Continue with existing borrower', selectedExistingBorrower);
      setActiveSection('fundingRequirements');
    } else if (isFundingRequirements) {
      // TODO: wire to the real funding-requirements case action once the DX API is connected
      console.log('Submit funding requirements', fundingData);
      setActiveSection('documents');
    } else if (isDocuments) {
      // TODO: wire to the real document-upload case action once the DX API is connected
      console.log('Submit documents', documentNames);
    }
  };

  return (
    <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
      <AppTopBars />

      <Box sx={{ display: 'flex', minHeight: 'calc(100vh - 168px)' }}>
        {/* Sidebar navigation */}
        <Box
          sx={{
            width: 240,
            flexShrink: 0,
            backgroundColor: 'background.paper',
            borderRight: '1px solid',
            borderColor: 'divider'
          }}
        >
          <List sx={{ py: 2 }}>
            {SECTIONS.map((section) => (
              <ListItemButton
                key={section.key}
                selected={activeSection === section.key}
                onClick={() => setActiveSection(section.key)}
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
                <ListItemIcon sx={{ minWidth: 36 }}>{section.icon}</ListItemIcon>
                <ListItemText primary={section.label} />
              </ListItemButton>
            ))}
          </List>
        </Box>

        {/* Main content */}
        <Box sx={{ flexGrow: 1, minWidth: 0, p: 4, display: 'flex', flexDirection: 'column' }}>
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
                    <OwnershipStructureTable rows={ownershipRows} onRowsChange={setOwnershipRows} />
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
              <FundingRequirementsForm formData={fundingData} onFieldChange={handleFundingFieldChange} />
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
          <Stack direction='row' spacing={2} justifyContent='flex-end' sx={{ pt: 3 }}>
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
        </Box>
      </Box>

      {/* Sits below the sidebar/content split, not inside the sidebar */}
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
