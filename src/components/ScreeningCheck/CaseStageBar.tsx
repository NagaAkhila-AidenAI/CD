import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CheckIcon from '@mui/icons-material/Check';
import type { CaseStage } from './caseData';
import { DEFAULT_STAGES } from './applicationFields';

const CHEVRON = 14;

// Stage list used when the case doesn't provide its own (preview mode)
export function buildStages(currentStage: string): CaseStage[] {
  const activeIndex = DEFAULT_STAGES.indexOf(currentStage);
  return DEFAULT_STAGES.map((name, i) => ({
    name,
    status: i < activeIndex ? 'completed' : i === activeIndex ? 'active' : 'future'
  }));
}

export default function CaseStageBar({ stages }: { stages: CaseStage[] }) {
  return (
    <Box
      component='nav'
      aria-label='Case stages'
      sx={{ display: 'flex', overflowX: 'auto', pb: 0.5, '&::-webkit-scrollbar': { height: 6 } }}
    >
      {stages.map((stage, i) => {
        const isFirst = i === 0;
        const isLast = i === stages.length - 1;
        const colors =
          stage.status === 'active'
            ? { bg: 'primary.main', fg: '#fff' }
            : stage.status === 'completed'
              ? { bg: '#e3f4e6', fg: '#1b5e20' }
              : { bg: 'grey.100', fg: 'text.secondary' };

        return (
          <Box
            key={stage.name}
            aria-current={stage.status === 'active' ? 'step' : undefined}
            sx={{
              flex: '1 0 auto',
              minWidth: 150,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0.75,
              height: 40,
              px: 3,
              ml: isFirst ? 0 : `-${CHEVRON - 4}px`,
              backgroundColor: colors.bg,
              color: colors.fg,
              clipPath: `polygon(0 0, calc(100% - ${isLast ? 0 : CHEVRON}px) 0, 100% 50%, calc(100% - ${
                isLast ? 0 : CHEVRON
              }px) 100%, 0 100%, ${isFirst ? 0 : CHEVRON}px 50%)`,
              borderRadius: isFirst ? '8px 0 0 8px' : isLast ? '0 8px 8px 0' : 0
            }}
          >
            {stage.status === 'completed' && <CheckIcon sx={{ fontSize: 18 }} />}
            <Typography variant='body2' sx={{ fontWeight: stage.status === 'active' ? 700 : 500, whiteSpace: 'nowrap' }}>
              {stage.name}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}
