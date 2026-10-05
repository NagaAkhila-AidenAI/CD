import type { ReactNode } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

interface SectionActionBarProps {
  onCancel: () => void;
  // Each optional button is hidden when its handler is omitted
  onFillSample?: () => void;
  onSubmit?: () => void;
  submitLabel?: string;
  submitDisabled?: boolean;
  sampleDisabled?: boolean;
  cancelDisabled?: boolean;
  // Extra buttons shown between "Fill with sample data" and "Submit" (e.g. Save for later, Eligible)
  extraActions?: ReactNode;
}

// Same button set and styling as the Stage 1 action bar
export default function SectionActionBar({
  onCancel,
  onFillSample,
  onSubmit,
  submitLabel = 'Submit',
  submitDisabled,
  sampleDisabled,
  cancelDisabled,
  extraActions
}: SectionActionBarProps) {
  return (
    <Stack direction='row' spacing={2} justifyContent='flex-end' sx={{ pt: 4, flexWrap: 'wrap', rowGap: 1.5 }}>
      <Button
        variant='outlined'
        color='inherit'
        onClick={onCancel}
        disabled={cancelDisabled}
        sx={{ textTransform: 'none', borderRadius: 2 }}
      >
        Cancel
      </Button>
      {onFillSample && (
        <Button
          variant='outlined'
          startIcon={<AutoAwesomeIcon fontSize='small' />}
          onClick={onFillSample}
          disabled={sampleDisabled}
          sx={{ textTransform: 'none', borderRadius: 2, color: '#7c4dff', borderColor: '#7c4dff' }}
        >
          Fill with sample data
        </Button>
      )}
      {extraActions}
      {onSubmit && (
        <Button variant='contained' onClick={onSubmit} disabled={submitDisabled} sx={{ textTransform: 'none', borderRadius: 2 }}>
          {submitLabel}
        </Button>
      )}
    </Stack>
  );
}
