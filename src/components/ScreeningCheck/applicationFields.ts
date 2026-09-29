// Field layout for the read-only "Review Application Details" section.
//
// `keys` are candidate Pega property names on the case (caseInfo.content). Matching is
// case- and punctuation-insensitive, and the first key that has a value wins, so list the
// real property name first. Open the browser console on the Screening Check screen to see
// the property names the case actually has ("[ScreeningCheck] case properties").

export type FieldFormat = 'text' | 'currency' | 'date' | 'months' | 'years';

export type BorrowerKind = 'individual' | 'business';

export interface FieldDef {
  label: string;
  keys: string[];
  format?: FieldFormat;
  fullWidth?: boolean;
  // Only shown for this borrower type; shown for both when omitted
  showFor?: BorrowerKind;
}

export interface SectionDef {
  id: string;
  title: string;
  fields: FieldDef[];
  showFor?: BorrowerKind;
}

export const BORROWER_TYPE_KEYS = ['BorrowerType', 'BusinessType'];

export const SUMMARY_KEYS = {
  applicationNumber: ['ApplicationNumber', 'ApplicationID'],
  applicationStatus: ['ApplicationStatus'],
  priority: ['Priority'],
  applicationDate: ['ApplicationDate'],
  submissionDate: ['SubmissionDate'],
  currency: ['Currency']
};

export const DETAIL_SECTIONS: SectionDef[] = [
  {
    id: 'funding',
    title: 'Funding Request',
    fields: [
      { label: 'Loan purpose', keys: ['LoanPurpose'] },
      { label: 'Facility type', keys: ['FacilityType'] },
      { label: 'Requested amount', keys: ['RequestedAmount'], format: 'currency' },
      { label: 'Requested tenure', keys: ['RequestedTenure'], format: 'months' },
      { label: 'Repayment frequency', keys: ['RepaymentFrequency'] },
      { label: 'Currency', keys: ['Currency'] }
    ]
  },
  {
    id: 'borrower',
    title: 'Borrower Profile',
    fields: [
      { label: 'Borrower type', keys: BORROWER_TYPE_KEYS },
      { label: 'Business name', keys: ['BusinessName'], showFor: 'business' },
      { label: 'Applicant name', keys: ['ApplicantName', 'FullName'], showFor: 'individual' },
      { label: 'First name', keys: ['FirstName'], showFor: 'individual' },
      { label: 'Middle name', keys: ['MiddleName'], showFor: 'individual' },
      { label: 'Last name', keys: ['LastName'], showFor: 'individual' },
      { label: 'Contact email', keys: ['ContactEmail'] },
      { label: 'Contact phone number', keys: ['ContactPhoneNumber', 'ContactNumber'] },
      { label: 'Address proof', keys: ['AddressProof'] },
      { label: 'Existing banking relationships', keys: ['ExistingBankingRelationships'] }
    ]
  },
  {
    id: 'business',
    title: 'Business Details',
    showFor: 'business',
    fields: [
      { label: 'Country of incorporation', keys: ['CountryOfIncorporation'] },
      { label: 'Incorporation type', keys: ['IncorporationType'] },
      { label: 'Incorporation number', keys: ['IncorporationNumber'] },
      { label: 'Incorporation date', keys: ['IncorporationDate'], format: 'date' },
      { label: 'Legal registration number', keys: ['LegalRegistrationNumber'] },
      { label: 'Tax identification number', keys: ['TaxIdentificationNumber', 'TIN'] },
      { label: 'Industry', keys: ['Industry'] },
      { label: 'Market position', keys: ['MarketPosition'] },
      { label: 'Years in business', keys: ['YearsInBusiness', 'YearsOfOperations'], format: 'years' },
      { label: 'Registered office address', keys: ['RegisteredOfficeAddress', 'RegisteredBusinessAddress'], fullWidth: true },
      { label: 'Business description', keys: ['BusinessDescription'], fullWidth: true }
    ]
  }
];

// "Funding Requirement" section of Screening Check
export const FUNDING_REQUIREMENT_AMOUNTS: FieldDef[] = [
  { label: 'Project cost', keys: ['ProjectCost'], format: 'currency' },
  { label: 'Promoter contribution', keys: ['PromoterContribution'], format: 'currency' },
  { label: 'Existing debt', keys: ['ExistingDebt'], format: 'currency' },
  { label: 'Working capital requirement', keys: ['WorkingCapitalRequirement'], format: 'currency' },
  { label: 'Additional funding requirement', keys: ['AdditionalFundingRequirement'], format: 'currency' }
];

export const FUNDING_REQUIREMENT_DETAILS: FieldDef[] = [
  { label: 'Currency', keys: ['Currency'] },
  { label: 'Funding purpose', keys: ['FundingPurpose', 'LoanPurpose'], fullWidth: true },
  { label: 'Utilization purpose', keys: ['UtilizationPurpose'], fullWidth: true }
];

export const DOCUMENT_LIST_KEYS =['Documents', 'MandatoryDocuments', 'DocumentNames'];

export const OWNERSHIP_LIST_KEYS = ['OwnershipStructure', 'Ownership', 'Directors'];

export const OWNERSHIP_COLUMNS: FieldDef[] = [
  { label: 'Director name', keys: ['DirectorName'] },
  { label: 'Title', keys: ['DirectorTitle'] },
  { label: 'Director ID', keys: ['DirectorID', 'DirectorId'] },
  { label: 'Ultimate beneficial owner', keys: ['UltimateBeneficialOwner'] },
  { label: 'Ownership %', keys: ['OwnershipPercentage'] },
  { label: 'Parent entity', keys: ['ParentEntity'] },
  { label: 'Structure type', keys: ['OwnershipStructureType'] }
];

// Used when the case doesn't expose its stages (e.g. before it has loaded)
export const DEFAULT_STAGES = [
  'Application Intake',
  'Screening Check',
  'Credit Appraisal',
  'Credit Rating',
  'Committee Review',
  'Sanction',
  'Documentation'
];

export const CURRENT_STAGE = 'Screening Check';
