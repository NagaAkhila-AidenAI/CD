import { useState } from 'react';
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface SectionPanelProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  collapsible?: boolean;
}

// Panel with a light grey header bar (icon + navy title) over a dark rule, and a white body
export default function SectionPanel({ title, icon, children, collapsible = true }: SectionPanelProps) {
  const [open, setOpen] = useState(true);

  return (
    <Box sx={{ mb: 3, border: '1px solid #e6e6e6', borderRadius: 1, backgroundColor: 'background.paper' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 2.5,
          py: 1.25,
          backgroundColor: '#f5f5f5',
          borderBottom: '1px solid',
          borderColor: 'primary.main',
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4,
          color: 'primary.main',
          '& .MuiSvgIcon-root': { fontSize: 22 }
        }}
      >
        {icon}
        <Typography sx={{ flexGrow: 1, fontWeight: 700, fontSize: '1.1rem', color: 'primary.main' }}>{title}</Typography>
        {collapsible && (
          <IconButton size='small' onClick={() => setOpen((prev) => !prev)} sx={{ color: 'primary.main' }}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        )}
      </Box>
      <Collapse in={open}>
        <Box sx={{ p: 2.5 }}>{children}</Box>
      </Collapse>
    </Box>
  );
}

// Grey inner card that groups related fields in a responsive grid
export function FieldCard({ children, columns = 2 }: { children: ReactNode; columns?: 1 | 2 | 3 }) {
  return (
    <Box
      sx={{
        backgroundColor: '#f7f7f7',
        borderRadius: 1,
        px: 3,
        pt: 2.5,
        pb: 1,
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: `repeat(${columns}, 1fr)` },
        columnGap: 4,
        '& .MuiOutlinedInput-root': { backgroundColor: '#fff' }
      }}
    >
      {children}
    </Box>
  );
}

// Grid of FieldCards laid out side by side, like the Submission Details panel
export function CardGrid({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 2.5 }}>{children}</Box>
  );
}

interface FieldProps {
  label: string;
  required?: boolean;
  // Span every column of the surrounding FieldCard grid (e.g. multi-line text areas)
  fullRow?: boolean;
  children: ReactNode;
}

export function Field({ label, required, fullRow, children }: FieldProps) {
  return (
    <Box sx={{ mb: 2, ...(fullRow && { gridColumn: '1 / -1' }) }}>
      <Typography variant='body2' sx={{ fontWeight: 600, mb: 0.5, color: 'text.primary' }}>
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
