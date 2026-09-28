import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import ButtonBase from '@mui/material/ButtonBase';
import AddIcon from '@mui/icons-material/Add';

export interface ExistingBorrowerOption {
  code: string;
  name: string;
}

export const SAMPLE_EXISTING_BORROWERS: ExistingBorrowerOption[] = [
  { code: 'BP-795JGD', name: '' },
  { code: 'BP-553BUK', name: '' },
  { code: 'BP-323XYH', name: 'zxcvbnm' },
  { code: 'BP-987WDG', name: 'Innovative Engineering Solutions Pvt. Ltd.' },
  { code: 'BP-189FEZ', name: 'Elena Sofia Nguyen' },
  { code: 'BP-519VMP', name: 'Ella Ananya Patel' },
  { code: 'BP-184QXJ', name: 'Meridian Structural Holdings LLC' },
  { code: 'BP-602TNR', name: 'Jordan Casey Whitfield' },
  { code: 'BP-441KDS', name: 'Summit Logistics Group' }
];

interface ExistingBorrowerSearchProps {
  value: ExistingBorrowerOption | null;
  onChange: (value: ExistingBorrowerOption | null) => void;
  onCreateNew?: () => void;
}

export default function ExistingBorrowerSearch({ value, onChange, onCreateNew }: ExistingBorrowerSearchProps) {
  return (
    <Box sx={{ maxWidth: 640 }}>
      <Typography variant='body2' sx={{ fontWeight: 600, mb: 0.5 }}>
        Borrower Name
      </Typography>
      <Autocomplete
        options={SAMPLE_EXISTING_BORROWERS}
        value={value}
        onChange={(_, newValue) => onChange(newValue)}
        getOptionLabel={(option) => option.name || option.code}
        isOptionEqualToValue={(option, val) => option.code === val.code}
        ListboxProps={{ sx: { maxHeight: 260, overflowY: 'auto' } }}
        renderOption={(props, option) => (
          <Box component='li' {...props} sx={{ display: 'block !important' }}>
            {option.name && (
              <Typography variant='body2' sx={{ fontWeight: 500 }}>
                {option.name}
              </Typography>
            )}
            <Typography variant='caption' color='text.secondary'>
              {option.code}
            </Typography>
          </Box>
        )}
        renderInput={(params) => <TextField {...params} size='small' placeholder='Search or create a borrower...' />}
        PaperComponent={({ children, ...paperProps }) => (
          <Paper {...paperProps}>
            {children}
            {onCreateNew && (
              <>
                <Divider />
                <ButtonBase
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={onCreateNew}
                  sx={{
                    width: '100%',
                    justifyContent: 'flex-start',
                    gap: 0.5,
                    px: 2,
                    py: 1,
                    color: 'primary.main',
                    fontSize: 14
                  }}
                >
                  <AddIcon fontSize='small' />
                  Create new
                </ButtonBase>
              </>
            )}
          </Paper>
        )}
      />
    </Box>
  );
}
