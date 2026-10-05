import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ReadOnlyField from './ReadOnlyField';
import { formatValue, pickValue } from './caseData';
import type { BorrowerKind, FieldDef } from './applicationFields';

export const isVisibleFor = (showFor: BorrowerKind | undefined, kind: BorrowerKind | undefined) =>
  !showFor || !kind || showFor === kind;

interface SectionCardProps {
  id: string;
  icon: ReactNode;
  title: string;
  children: ReactNode;
}

export function SectionCard({ id, icon, title, children }: SectionCardProps) {
  return (
    <Card id={`review-${id}`} variant='outlined' sx={{ borderRadius: 3, scrollMarginTop: 16 }}>
      <Stack direction='row' spacing={1.5} alignItems='center' sx={{ px: 3, py: 2 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(25, 118, 210, 0.08)',
            color: 'primary.main'
          }}
        >
          {icon}
        </Box>
        <Typography variant='subtitle1' sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
      </Stack>
      <Divider />
      <Box sx={{ p: 3 }}>{children}</Box>
    </Card>
  );
}

interface FieldGridProps {
  fields: FieldDef[];
  content: Record<string, any>;
  currency?: string;
  kind?: BorrowerKind;
}

// Read-only fields in a responsive grid; fullWidth fields span the whole row
export function FieldGrid({ fields, content, currency, kind }: FieldGridProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
        columnGap: 4,
        rowGap: 3
      }}
    >
      {fields
        .filter((field) => isVisibleFor(field.showFor, kind))
        .map((field) => (
          <Box key={field.label} sx={{ gridColumn: field.fullWidth ? '1 / -1' : undefined }}>
            <ReadOnlyField label={field.label} value={formatValue(pickValue(content, field.keys), field.format, currency)} />
          </Box>
        ))}
    </Box>
  );
}
