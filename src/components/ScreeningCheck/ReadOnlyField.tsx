import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface ReadOnlyFieldProps {
  label: string;
  value: string;
}

// Plain-text value instead of a disabled input, so reviewers read the data rather than try to edit it
export default function ReadOnlyField({ label, value }: ReadOnlyFieldProps) {
  const isEmpty = !value;
  return (
    <Box>
      <Typography
        variant='caption'
        component='div'
        sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4, mb: 0.5 }}
      >
        {label}
      </Typography>
      <Typography
        variant='body1'
        sx={{
          color: isEmpty ? 'text.disabled' : 'text.primary',
          fontStyle: isEmpty ? 'italic' : 'normal',
          fontWeight: isEmpty ? 400 : 500,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word'
        }}
      >
        {isEmpty ? 'Not provided' : value}
      </Typography>
    </Box>
  );
}
