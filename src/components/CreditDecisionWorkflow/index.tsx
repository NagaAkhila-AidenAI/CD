import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AppTopBars from '../AppTopBars';

interface CreditDecisionWorkflowProps {
  onSelectNewBorrower: () => void;
  onSelectExistingBorrower: () => void;
}

export default function CreditDecisionWorkflow({
  onSelectNewBorrower,
  onSelectExistingBorrower
}: CreditDecisionWorkflowProps) {
  return (
    <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
      <AppTopBars />

      {/* Body: branding + both options, soft sky-blue background fills the whole content area */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          flexGrow: 1,
          minHeight: 'calc(100vh - 112px)',
          p: 4,
          background: 'linear-gradient(135deg, #f2f5f9 0%, #d6e0ef 55%, #f2f5f9 100%)'
        }}
      >
        <HeroDecoration />

        <Typography
          variant='h3'
          sx={{
            position: 'relative',
            fontFamily: '"Baloo 2", "Nunito Sans", sans-serif',
            fontWeight: 700,
            color: '#003781',
            letterSpacing: -1,
            mb: 3
          }}
        >
          aiden ai
        </Typography>

        <Stack spacing={2} sx={{ position: 'relative' }}>
          <OptionCard
            icon={<PersonAddIcon color='primary' />}
            title='New Borrower'
            description='Start a new credit decision case for a new borrower.'
            actionLabel='Start'
            onClick={onSelectNewBorrower}
          />
          <OptionCard
            icon={<PersonSearchIcon color='primary' />}
            title='Existing Borrower'
            description="Look up and continue a borrower's existing credit decision case."
            actionLabel='Continue'
            onClick={onSelectExistingBorrower}
          />
        </Stack>
      </Box>
    </Box>
  );
}

function HeroDecoration() {
  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        '@keyframes hero-float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        '@keyframes hero-pulse': {
          '0%, 100%': { opacity: 0.55 },
          '50%': { opacity: 0.9 }
        }
      }}
    >
      {/* Sunburst glare, top area */}
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          left: '20%',
          width: 420,
          height: 420,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 65%)',
          animation: 'hero-pulse 8s ease-in-out infinite'
        }}
      />

      {/* Large soft sphere, bottom-center-right */}
      <Box
        sx={{
          position: 'absolute',
          bottom: -160,
          left: '48%',
          width: 340,
          height: 340,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(184,202,230,0.5) 60%, rgba(184,202,230,0) 75%)',
          animation: 'hero-float 9s ease-in-out infinite'
        }}
      />
    </Box>
  );
}

interface OptionCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel: string;
  onClick: () => void;
}

function OptionCard({ icon, title, description, actionLabel, onClick }: OptionCardProps) {
  return (
    <Card variant='outlined' sx={{ borderRadius: 3 }}>
      <CardContent
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {icon}
          <Box>
            <Typography variant='subtitle1' sx={{ fontWeight: 700 }}>
              {title}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {description}
            </Typography>
          </Box>
        </Box>
        <Button
          variant='contained'
          onClick={onClick}
          endIcon={<ArrowForwardIcon />}
          sx={{ textTransform: 'none', borderRadius: 2 }}
        >
          {actionLabel}
        </Button>
      </CardContent>
    </Card>
  );
}
