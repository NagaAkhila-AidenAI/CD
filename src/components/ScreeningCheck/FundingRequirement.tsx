import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { FieldGrid, SectionCard } from './SectionCard';
import { formatValue, pickValue } from './caseData';
import type { CaseSnapshot } from './caseData';
import { FUNDING_REQUIREMENT_AMOUNTS, FUNDING_REQUIREMENT_DETAILS, SUMMARY_KEYS } from './applicationFields';

export const FUNDING_REQUIREMENT_ANCHORS = [
  { id: 'funding-amounts', title: 'Amounts' },
  { id: 'funding-purpose', title: 'Purpose & Utilization' }
];

export default function FundingRequirement({ caseData }: { caseData: CaseSnapshot }) {
  const { content } = caseData;
  const currency = pickValue(content, SUMMARY_KEYS.currency);

  return (
    <Stack spacing={3}>
      {/* Amounts as stat tiles so the key figures read at a glance */}
      <Box
        id='review-funding-amounts'
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(5, 1fr)' },
          gap: 2,
          scrollMarginTop: 16
        }}
      >
        {FUNDING_REQUIREMENT_AMOUNTS.map((field) => {
          const value = formatValue(pickValue(content, field.keys), field.format, currency);
          return (
            <Card key={field.label} variant='outlined' sx={{ borderRadius: 3, p: 2.5 }}>
              <Typography
                variant='caption'
                component='div'
                sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4, mb: 1 }}
              >
                {field.label}
              </Typography>
              <Typography
                variant={value ? 'h6' : 'body1'}
                sx={{
                  fontWeight: value ? 700 : 400,
                  color: value ? 'text.primary' : 'text.disabled',
                  fontStyle: value ? 'normal' : 'italic',
                  wordBreak: 'break-word'
                }}
              >
                {value || 'Not provided'}
              </Typography>
            </Card>
          );
        })}
      </Box>

      <SectionCard id='funding-purpose' icon={<DescriptionOutlinedIcon />} title='Purpose & Utilization'>
        <FieldGrid fields={FUNDING_REQUIREMENT_DETAILS} content={content} currency={currency} />
      </SectionCard>
    </Stack>
  );
}
