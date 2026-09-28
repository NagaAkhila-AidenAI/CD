import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

export const LOAN_PURPOSES = ['Working Capital', 'Expansion', 'Refinancing', 'Acquisition', 'Equipment Purchase'];
export const FACILITY_TYPES = ['Term Loan', 'Revolving Credit', 'Line of Credit', 'Letter of Credit'];
export const REPAYMENT_FREQUENCIES = ['Monthly', 'Quarterly', 'Semi-Annual', 'Annual', 'Bullet'];
export const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR'];
export const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

export const SAMPLE_FUNDING_DATA: Record<string, string> = {
  loanPurpose: 'Expansion',
  facilityType: 'Term Loan',
  requestedAmount: '2500000',
  requestedTenure: '60',
  repaymentFrequency: 'Quarterly',
  currency: 'USD',
  priority: 'Medium'
};

interface FundingRequirementsFormProps {
  formData: Record<string, string>;
  onFieldChange: (field: string, value: string) => void;
}

export default function FundingRequirementsForm({ formData, onFieldChange }: FundingRequirementsFormProps) {
  const handleChange = (field: string) => (event: { target: { value: string } }) => {
    onFieldChange(field, event.target.value);
  };

  return (
    <Box sx={{ maxWidth: 900, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, columnGap: 4 }}>
      <Field label='Loan purpose'>
        <TextField
          select
          fullWidth
          size='small'
          value={formData.loanPurpose || ''}
          onChange={handleChange('loanPurpose')}
          SelectProps={{ displayEmpty: true }}
        >
          <MenuItem value='' disabled>
            Select...
          </MenuItem>
          {LOAN_PURPOSES.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Field>

      <Field label='Facility type'>
        <TextField
          select
          fullWidth
          size='small'
          value={formData.facilityType || ''}
          onChange={handleChange('facilityType')}
          SelectProps={{ displayEmpty: true }}
        >
          <MenuItem value='' disabled>
            Select...
          </MenuItem>
          {FACILITY_TYPES.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Field>

      <Field label='Requested amount'>
        <TextField fullWidth size='small' value={formData.requestedAmount || ''} onChange={handleChange('requestedAmount')} />
      </Field>

      <Field label='Requested tenure'>
        <TextField fullWidth size='small' value={formData.requestedTenure || ''} onChange={handleChange('requestedTenure')} />
      </Field>

      <Field label='Repayment frequency'>
        <TextField
          select
          fullWidth
          size='small'
          value={formData.repaymentFrequency || ''}
          onChange={handleChange('repaymentFrequency')}
          SelectProps={{ displayEmpty: true }}
        >
          <MenuItem value='' disabled>
            Select...
          </MenuItem>
          {REPAYMENT_FREQUENCIES.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Field>

      <Field label='Currency'>
        <TextField
          select
          fullWidth
          size='small'
          value={formData.currency || ''}
          onChange={handleChange('currency')}
          SelectProps={{ displayEmpty: true }}
        >
          <MenuItem value='' disabled>
            Select...
          </MenuItem>
          {CURRENCIES.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Field>

      <Field label='Application number'>
        <TextField
          fullWidth
          size='small'
          placeholder='Auto-generated on submit'
          value=''
          slotProps={{ input: { readOnly: true } }}
          sx={{ '& .MuiInputBase-input': { backgroundColor: 'action.hover' } }}
        />
      </Field>

      <Field label='Priority'>
        <TextField
          select
          fullWidth
          size='small'
          value={formData.priority || ''}
          onChange={handleChange('priority')}
          SelectProps={{ displayEmpty: true }}
        >
          <MenuItem value='' disabled>
            Select...
          </MenuItem>
          {PRIORITIES.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Field>
    </Box>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant='body2' sx={{ fontWeight: 600, mb: 0.5 }}>
        {label}
      </Typography>
      {children}
    </Box>
  );
}
