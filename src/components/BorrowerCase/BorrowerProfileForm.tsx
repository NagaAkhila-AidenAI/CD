import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SectionPanel, { CardGrid, Field, FieldCard } from './SectionPanel';

export type BusinessType = '' | 'individual' | 'business';

export const INCORPORATION_TYPES = [
  'Public Limited',
  'Trust',
  'Society',
  'Government Entity',
  'Partnership',
  'One Person Company (OPC)',
  'Limited Liability Partnership (LLP)',
  'Private Limited',
  'Holding Company',
  'Sole Proprietorship',
  'Non-Profit Organization'
];
export const MARKET_POSITIONS = [
  'Top 10 Player',
  'New Entrant',
  'Emerging Competitor',
  'Market Leader',
  'Niche Player',
  'Top 5 Player',
  'Regional Player',
  'Other',
  'Established Competitor'
];
export const INDUSTRIES = [
  'Manufacturing',
  'Retail',
  'Wholesale',
  'Construction',
  'Information Technology',
  'Telecommunications',
  'Healthcare',
  'Education',
  'Transportation & Logistics',
  'Financial Services',
  'Real Estate',
  'Hospitality & Tourism',
  'Agriculture',
  'Energy & Utilities',
  'Professional Services',
  'Other'
];
export const COUNTRIES = ['India', 'Europe', 'USA'];
export const COUNTRY_CODES = ['+1', '+44', '+49', '+91'];
export const BANKING_RELATIONSHIP_OPTIONS = ['Yes', 'No'];
export const ADDRESS_PROOF_OPTIONS = ['Passport', "Driver's License", 'National ID', 'Utility Bill'];

export const SAMPLE_BUSINESS_DATA: Record<string, string> = {
  businessName: 'NovaTech Innovations GmbH',
  contactEmail: 'contact@novatech.eu',
  contactNumber: '1512 345678',
  countryOfIncorporation: 'Europe',
  legalRegistrationNumber: 'LRN123456789',
  incorporationNumber: 'INC-GDFM-328375',
  incorporationType: 'Private Limited',
  marketPosition: 'Emerging Competitor',
  businessDescription: 'Specialized in high-precision manufacturing for automotive components',
  industry: 'Information Technology',
  yearsOfOperations: '7',
  incorporationDate: '2018-06-15',
  taxIdentificationNumber: 'TAX-EU-9876543',
  registeredBusinessAddress: 'Tech Park, Innovation City, Berlin, Germany'
};

export const SAMPLE_BUSINESS_COUNTRY_CODE = '+49';

export const SAMPLE_INDIVIDUAL_DATA: Record<string, string> = {
  firstName: 'Jordan',
  middleName: 'Casey',
  lastName: 'Whitfield',
  addressProof: 'Passport',
  contactEmail: 'jordan.whitfield@example.com',
  contactNumber: '5559876543',
  existingBankingRelationships: 'Yes'
};

interface BorrowerProfileFormProps {
  businessType: BusinessType;
  onBusinessTypeChange: (value: BusinessType) => void;
  formData: Record<string, string>;
  onFieldChange: (field: string, value: string) => void;
  countryCode: string;
  onCountryCodeChange: (value: string) => void;
}

export default function BorrowerProfileForm({
  businessType,
  onBusinessTypeChange,
  formData,
  onFieldChange,
  countryCode,
  onCountryCodeChange
}: BorrowerProfileFormProps) {
  const handleChange = (field: string) => (event: { target: { value: string } }) => {
    onFieldChange(field, event.target.value);
  };

  return (
    <>
      <SectionPanel title='Customer Type' icon={<CategoryOutlinedIcon />}>
        <FieldCard>
          <Field label='Customer type' required>
            <TextField
              select
              fullWidth
              size='small'
              value={businessType}
              onChange={(e) => onBusinessTypeChange(e.target.value as BusinessType)}
              SelectProps={{ displayEmpty: true }}
            >
              <MenuItem value='' disabled>
                Select...
              </MenuItem>
              <MenuItem value='business'>Corporate</MenuItem>
              <MenuItem value='individual'>Individual</MenuItem>
            </TextField>
          </Field>
        </FieldCard>
      </SectionPanel>

      {businessType === 'business' && (
        <CardGrid>
          <SectionPanel title='Business Details' icon={<BusinessOutlinedIcon />}>
            <FieldCard columns={1}>
              <Field label='Business name'>
                <TextField fullWidth size='small' value={formData.businessName || ''} onChange={handleChange('businessName')} />
              </Field>
              <Field label='Contact email'>
                <TextField fullWidth size='small' value={formData.contactEmail || ''} onChange={handleChange('contactEmail')} />
              </Field>
              <Field label='Contact number'>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    select
                    size='small'
                    value={countryCode}
                    onChange={(e) => onCountryCodeChange(e.target.value)}
                    sx={{ width: 90 }}
                  >
                    {COUNTRY_CODES.map((code) => (
                      <MenuItem key={code} value={code}>
                        {code}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField fullWidth size='small' value={formData.contactNumber || ''} onChange={handleChange('contactNumber')} />
                </Box>
              </Field>
              <Field label='Business description'>
                <TextField
                  fullWidth
                  size='small'
                  value={formData.businessDescription || ''}
                  onChange={handleChange('businessDescription')}
                />
              </Field>
              <Field label='Industry'>
                <TextField
                  select
                  fullWidth
                  size='small'
                  value={formData.industry || ''}
                  onChange={handleChange('industry')}
                  SelectProps={{ displayEmpty: true }}
                >
                  <MenuItem value='' disabled>
                    Select...
                  </MenuItem>
                  {INDUSTRIES.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Field>
              <Field label='Market position'>
                <TextField
                  select
                  fullWidth
                  size='small'
                  value={formData.marketPosition || ''}
                  onChange={handleChange('marketPosition')}
                  SelectProps={{ displayEmpty: true }}
                >
                  <MenuItem value='' disabled>
                    Select...
                  </MenuItem>
                  {MARKET_POSITIONS.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Field>
              <Field label='Years of operations'>
                <TextField
                  fullWidth
                  size='small'
                  value={formData.yearsOfOperations || ''}
                  onChange={handleChange('yearsOfOperations')}
                />
              </Field>
            </FieldCard>
          </SectionPanel>
          <SectionPanel title='Incorporation Details' icon={<GavelOutlinedIcon />}>
            <FieldCard columns={1}>
              <Field label='Country of incorporation'>
                <TextField
                  select
                  fullWidth
                  size='small'
                  value={formData.countryOfIncorporation || ''}
                  onChange={handleChange('countryOfIncorporation')}
                  SelectProps={{ displayEmpty: true }}
                >
                  <MenuItem value='' disabled>
                    Select...
                  </MenuItem>
                  {COUNTRIES.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Field>
              <Field label='Legal registration number'>
                <TextField
                  fullWidth
                  size='small'
                  value={formData.legalRegistrationNumber || ''}
                  onChange={handleChange('legalRegistrationNumber')}
                />
              </Field>
              <Field label='Incorporation number'>
                <TextField
                  fullWidth
                  size='small'
                  value={formData.incorporationNumber || ''}
                  onChange={handleChange('incorporationNumber')}
                />
              </Field>
              <Field label='Incorporation type'>
                <TextField
                  select
                  fullWidth
                  size='small'
                  value={formData.incorporationType || ''}
                  onChange={handleChange('incorporationType')}
                  SelectProps={{ displayEmpty: true }}
                >
                  <MenuItem value='' disabled>
                    Select...
                  </MenuItem>
                  {INCORPORATION_TYPES.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Field>
              <Field label='Incorporation date'>
                <TextField
                  fullWidth
                  size='small'
                  type='date'
                  value={formData.incorporationDate || ''}
                  onChange={handleChange('incorporationDate')}
                />
              </Field>
              <Field label='Tax identification number'>
                <TextField
                  fullWidth
                  size='small'
                  value={formData.taxIdentificationNumber || ''}
                  onChange={handleChange('taxIdentificationNumber')}
                />
              </Field>
              <Field label='Registered business address'>
                <TextField
                  fullWidth
                  size='small'
                  value={formData.registeredBusinessAddress || ''}
                  onChange={handleChange('registeredBusinessAddress')}
                />
              </Field>
            </FieldCard>
          </SectionPanel>
        </CardGrid>
      )}

      {businessType === 'individual' && (
        <SectionPanel title='Applicant Details' icon={<PersonOutlineIcon />}>
          <FieldCard>
            <Field label='Applicant name'>
              <TextField
                fullWidth
                size='small'
                value={[formData.firstName, formData.middleName, formData.lastName].filter(Boolean).join(' ')}
                slotProps={{ input: { readOnly: true } }}
                sx={{ '& .MuiInputBase-input': { backgroundColor: 'action.hover' } }}
              />
            </Field>
            <Field label='First name'>
              <TextField fullWidth size='small' value={formData.firstName || ''} onChange={handleChange('firstName')} />
            </Field>
            <Field label='Middle name'>
              <TextField fullWidth size='small' value={formData.middleName || ''} onChange={handleChange('middleName')} />
            </Field>
            <Field label='Last name'>
              <TextField fullWidth size='small' value={formData.lastName || ''} onChange={handleChange('lastName')} />
            </Field>
            <Field label='Address proof'>
              <TextField
                select
                fullWidth
                size='small'
                value={formData.addressProof || ''}
                onChange={handleChange('addressProof')}
                SelectProps={{ displayEmpty: true }}
              >
                <MenuItem value='' disabled>
                  Select...
                </MenuItem>
                {ADDRESS_PROOF_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Field>
            <Field label='Contact email'>
              <TextField fullWidth size='small' value={formData.contactEmail || ''} onChange={handleChange('contactEmail')} />
            </Field>
            <Field label='Contact number'>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  select
                  size='small'
                  value={countryCode}
                  onChange={(e) => onCountryCodeChange(e.target.value)}
                  sx={{ width: 90 }}
                >
                  {COUNTRY_CODES.map((code) => (
                    <MenuItem key={code} value={code}>
                      {code}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField fullWidth size='small' value={formData.contactNumber || ''} onChange={handleChange('contactNumber')} />
              </Box>
            </Field>
            <Field label='Existing banking relationships'>
              <TextField
                select
                fullWidth
                size='small'
                value={formData.existingBankingRelationships || ''}
                onChange={handleChange('existingBankingRelationships')}
                SelectProps={{ displayEmpty: true }}
              >
                <MenuItem value='' disabled>
                  Select...
                </MenuItem>
                {BANKING_RELATIONSHIP_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Field>
          </FieldCard>
        </SectionPanel>
      )}
    </>
  );
}
