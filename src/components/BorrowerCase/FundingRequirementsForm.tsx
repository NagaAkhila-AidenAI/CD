import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import SectionPanel, { Field, FieldCard } from './SectionPanel';

export const PRODUCT_TYPES = [
  'Working Capital',
  'Term Loan',
  'Project Finance',
  'Trade Finance',
  'Bank Guarantee',
  'Letter of Credit'
];
export const LOAN_PURPOSES: string[] = [];
export const FACILITY_TYPES = [
  'Working capital',
  'Term loan',
  'Project finance',
  'Trade finance',
  'Cash credit',
  'Bank guarantee',
  'Letter of credit'
];
export const INDUSTRY_SECTORS = [
  'Manufacturing',
  'Retail',
  'Healthcare',
  'Financial Services',
  'Infrastructure',
  'Energy',
  'Other'
];
export const REPAYMENT_FREQUENCIES = ['Monthly', 'Quarterly', 'Semi-Annual', 'Annual', 'Bullet'];
export const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR'];
export const PRIORITIES = ['High', 'Medium', 'Low'];
export const INTEREST_TYPES = ['Fixed Rate', 'Variable Rate'];
export const BENCHMARK_TYPES = ['Repo', 'MCLR', 'SOFR'];
export const REPAYMENT_TYPES = ['EMI', 'Bullet', 'Step-Up', 'Moratorium + EMI'];

// Extra fields shown only for the selected interest type
const INTEREST_TYPE_FIELDS: Record<string, string[]> = {
  'Fixed Rate': ['fixedRate'],
  'Variable Rate': ['benchmarkType']
};

// What each product type shows. Tenure is fixed per product and shown read-only.
// `facilityTypes` set = Facility type dropdown is shown with those options;
// unset = Facility type is hidden and `facilityType` is filled in automatically.
interface ProductConfig {
  facilityTypes?: string[];
  facilityType: string;
  tenureMonths: string;
  tenureLabel: string;
}

export const PRODUCT_CONFIG: Record<string, ProductConfig> = {
  'Working Capital': {
    facilityTypes: ['Working capital', 'Cash credit'],
    facilityType: 'Working capital',
    tenureMonths: '24',
    tenureLabel: '24 Months'
  },
  'Term Loan': { facilityType: 'Term loan', tenureMonths: '36', tenureLabel: '3 years' },
  'Project Finance': { facilityType: 'Project finance', tenureMonths: '36', tenureLabel: '3 years' },
  'Trade Finance': { facilityTypes: FACILITY_TYPES, facilityType: '', tenureMonths: '36', tenureLabel: '3 years' },
  'Bank Guarantee': { facilityType: 'Bank guarantee', tenureMonths: '36', tenureLabel: '3 years' },
  'Letter of Credit': { facilityType: 'Letter of credit', tenureMonths: '36', tenureLabel: '3 years' }
};

export const SAMPLE_FUNDING_DATA: Record<string, string> = {
  productType: 'Term Loan',
  facilityType: 'Term loan',
  requestedAmount: '2500000',
  requestedTenure: '36',
  repaymentFrequency: 'Quarterly',
  currency: 'USD',
  priority: 'Medium',
  fundingPurpose: 'Equipment Upgrade',
  workingCapitalRequirement: '312',
  existingDebt: '865,178',
  additionalFundingRequirement: '427',
  utilizationPurpose: 'Inventory Management',
  industrySector: 'Manufacturing',
  interestType: 'Fixed Rate',
  fixedRate: '8.5',
  repaymentType: 'EMI',
  moratoriumPeriod: '3'
};

// Required (*) fields that are currently on screen, given the selected product and interest type
export function getRequiredFundingFields(formData: Record<string, string>): string[] {
  const product = PRODUCT_CONFIG[formData.productType || ''];
  const fields = ['productType', 'requestedTenure'];
  if (product) {
    if (product.facilityTypes) fields.push('facilityType');
    fields.push('industrySector', 'interestType');
    if (formData.interestType === 'Variable Rate') fields.push('benchmarkType');
  }
  return fields;
}

export function getMissingFundingFields(formData: Record<string, string>): string[] {
  return getRequiredFundingFields(formData).filter((field) => !formData[field]?.trim());
}

interface FundingRequirementsFormProps {
  formData: Record<string, string>;
  onFieldChange: (field: string, value: string) => void;
  // Set after a Submit attempt so every empty required field shows its error
  showErrors?: boolean;
}

const readOnlySx = { '& .MuiOutlinedInput-root': { backgroundColor: '#f0f0f0 !important' } };

export default function FundingRequirementsForm({ formData, onFieldChange, showErrors = false }: FundingRequirementsFormProps) {
  const product = PRODUCT_CONFIG[formData.productType || ''];
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const requiredFields = getRequiredFundingFields(formData);

  // Red outline + "Cannot be blank" once a required field has been visited (or Submit was clicked) and is still empty
  const errorProps = (field: string) => {
    const hasError = requiredFields.includes(field) && (touched[field] || showErrors) && !formData[field]?.trim();
    return {
      error: hasError,
      onBlur: () => setTouched((prev) => ({ ...prev, [field]: true })),
      helperText: hasError ? (
        <Box component='span' sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
          <WarningRoundedIcon sx={{ fontSize: 18 }} />
          Cannot be blank
        </Box>
      ) : undefined
    };
  };

  const handleChange = (field: string) => (event: { target: { value: string } }) => {
    onFieldChange(field, event.target.value);
  };

  const handleProductTypeChange = (event: { target: { value: string } }) => {
    const productType = event.target.value;
    const config = PRODUCT_CONFIG[productType];
    onFieldChange('productType', productType);
    if (config) {
      onFieldChange('facilityType', config.facilityType);
      onFieldChange('requestedTenure', config.tenureMonths);
    }
  };

  const handleInterestTypeChange = (event: { target: { value: string } }) => {
    const interestType = event.target.value;
    onFieldChange('interestType', interestType);
    // Clear the fields that belong to the other interest type so stale values aren't submitted
    Object.entries(INTEREST_TYPE_FIELDS)
      .filter(([type]) => type !== interestType)
      .forEach(([, fields]) => fields.forEach((field) => onFieldChange(field, '')));
  };

  const select = (field: string, options: string[], onChange = handleChange(field)) => (
    <TextField
      select
      fullWidth
      size='small'
      value={formData[field] || ''}
      onChange={onChange}
      SelectProps={{ displayEmpty: true }}
      {...errorProps(field)}
    >
      <MenuItem value='' disabled>
        Select...
      </MenuItem>
      {options.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </TextField>
  );

  const text = (field: string) => (
    <TextField fullWidth size='small' value={formData[field] || ''} onChange={handleChange(field)} />
  );

  const textArea = (field: string) => (
    <TextField fullWidth multiline minRows={3} value={formData[field] || ''} onChange={handleChange(field)} />
  );

  const withUnit = (field: string, unit: string, type?: string) => (
    <TextField
      fullWidth
      size='small'
      type={type}
      value={formData[field] || ''}
      onChange={handleChange(field)}
      slotProps={{ input: { endAdornment: <InputAdornment position='end'>{unit}</InputAdornment> } }}
    />
  );

  const readOnly = (value: string, placeholder?: string) => (
    <TextField
      fullWidth
      size='small'
      placeholder={placeholder}
      value={value}
      slotProps={{ input: { readOnly: true } }}
      sx={readOnlySx}
    />
  );

  return (
    <SectionPanel title='Funding Requirements' icon={<RequestQuoteOutlinedIcon />}>
      <FieldCard>
        <Field label='Product type' required>
          {select('productType', PRODUCT_TYPES, handleProductTypeChange)}
        </Field>
        {/* Always shown: typed in by hand until a product type fixes it */}
        <Field label='Requested tenure' required>
          {product ? (
            readOnly(product.tenureLabel)
          ) : (
            <TextField
              fullWidth
              size='small'
              type='number'
              value={formData.requestedTenure || ''}
              onChange={handleChange('requestedTenure')}
              slotProps={{
                input: { endAdornment: <InputAdornment position='end'>Months</InputAdornment> },
                htmlInput: { min: 1 }
              }}
              {...errorProps('requestedTenure')}
            />
          )}
        </Field>

        {/* Product-specific fields, in the same order as the Pega form */}
        {product && (
          <>
            <Field label='Facility amount'>{readOnly('', 'Calculated on submit')}</Field>
            {product.facilityTypes && (
              <Field label='Facility type' required>
                {select('facilityType', product.facilityTypes)}
              </Field>
            )}
            <Field label='Industry sector' required>
              {select('industrySector', INDUSTRY_SECTORS)}
            </Field>
            <Field label='Interest type' required>
              {select('interestType', INTEREST_TYPES, handleInterestTypeChange)}
            </Field>
            {formData.interestType === 'Fixed Rate' && (
              <Field label='Fixed Rate (%)'>{withUnit('fixedRate', '%', 'number')}</Field>
            )}
            {formData.interestType === 'Variable Rate' && (
              <Field label='Benchmark type' required>
                {select('benchmarkType', BENCHMARK_TYPES)}
              </Field>
            )}
            <Field label='Repayment type'>{select('repaymentType', REPAYMENT_TYPES)}</Field>
            <Field label='Moratorium period'>{withUnit('moratoriumPeriod', 'Months')}</Field>
          </>
        )}

        {/* General funding details: always shown */}
        <Field label='Loan purpose'>{select('loanPurpose', LOAN_PURPOSES)}</Field>
        <Field label='Requested amount'>{text('requestedAmount')}</Field>
        <Field label='Repayment frequency'>{select('repaymentFrequency', REPAYMENT_FREQUENCIES)}</Field>
        <Field label='Currency'>{select('currency', CURRENCIES)}</Field>
        <Field label='Application number'>{readOnly('', 'Auto-generated on submit')}</Field>
        <Field label='Priority'>{select('priority', PRIORITIES)}</Field>
        <Field label='Funding purpose' fullRow>
          {textArea('fundingPurpose')}
        </Field>
        <Field label='Working capital requirement'>{text('workingCapitalRequirement')}</Field>
        <Field label='Existing debt'>{text('existingDebt')}</Field>
        <Field label='Additional funding requirement'>{text('additionalFundingRequirement')}</Field>
        <Field label='Utilization purpose' fullRow>
          {textArea('utilizationPurpose')}
        </Field>
      </FieldCard>
    </SectionPanel>
  );
}
