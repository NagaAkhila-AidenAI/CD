import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

export type BusinessType = '' | 'individual' | 'business';

export const INCORPORATION_TYPES = ['LLC', 'Corporation', 'Partnership', 'Sole Proprietorship'];
export const MARKET_POSITIONS = ['Market Leader', 'Challenger', 'Niche Player', 'New Entrant'];
export const INDUSTRIES = ['Real Estate', 'Manufacturing', 'Retail', 'Technology', 'Healthcare', 'Financial Services', 'Other'];
export const BANKING_RELATIONSHIP_OPTIONS = ['Yes', 'No'];
export const ADDRESS_PROOF_OPTIONS = ['Passport', "Driver's License", 'National ID', 'Utility Bill'];

export const SAMPLE_BUSINESS_DATA: Record<string, string> = {
  businessName: 'Meridian Structural Holdings LLC',
  contactEmail: 'contact@meridianholdings.com',
  contactNumber: '5551234567',
  countryOfIncorporation: 'United States',
  legalRegistrationNumber: 'REG-48213097',
  incorporationNumber: 'INC-2019-77451',
  incorporationType: 'LLC',
  marketPosition: 'Challenger',
  businessDescription: 'Commercial real estate development and property management.',
  industry: 'Real Estate',
  yearsOfOperations: '8',
  incorporationDate: '14/03/2016',
  taxIdentificationNumber: '84-1234567',
  registeredBusinessAddress: '2200 Meridian Ave, Austin, TX 78701',
  existingBankingRelationships: 'Yes'
};

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
    <Box sx={{ maxWidth: 640 }}>
      <Field label='Business type' required>
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
          <MenuItem value='individual'>Individual</MenuItem>
          <MenuItem value='business'>Business</MenuItem>
        </TextField>
      </Field>

      {businessType === 'business' && (
        <>
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
                <MenuItem value='+1'>+1</MenuItem>
                <MenuItem value='+44'>+44</MenuItem>
                <MenuItem value='+91'>+91</MenuItem>
              </TextField>
              <TextField fullWidth size='small' value={formData.contactNumber || ''} onChange={handleChange('contactNumber')} />
            </Box>
          </Field>
          <Field label='Country of incorporation'>
            <TextField
              fullWidth
              size='small'
              value={formData.countryOfIncorporation || ''}
              onChange={handleChange('countryOfIncorporation')}
            />
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
          <Field label='Years of operations'>
            <TextField
              fullWidth
              size='small'
              value={formData.yearsOfOperations || ''}
              onChange={handleChange('yearsOfOperations')}
            />
          </Field>
          <Field label='Incorporation date'>
            <TextField
              fullWidth
              size='small'
              placeholder='DD/MM/YYYY'
              value={formData.incorporationDate || ''}
              onChange={handleChange('incorporationDate')}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position='end'>
                      <CalendarTodayIcon fontSize='small' />
                    </InputAdornment>
                  )
                }
              }}
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
        </>
      )}

      {businessType === 'individual' && (
        <>
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
                <MenuItem value='+1'>+1</MenuItem>
                <MenuItem value='+44'>+44</MenuItem>
                <MenuItem value='+91'>+91</MenuItem>
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
        </>
      )}
    </Box>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant='body2' sx={{ fontWeight: 600, mb: 0.5 }}>
        {label}
        {required && (
          <Box component='span' sx={{ color: 'error.main' }}>
            {' '}
            *
          </Box>
        )}
      </Typography>
      {children}
    </Box>
  );
}
