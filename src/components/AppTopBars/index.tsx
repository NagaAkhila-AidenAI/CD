import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AppsIcon from '@mui/icons-material/Apps';
import DescriptionIcon from '@mui/icons-material/Description';
import Brightness6Icon from '@mui/icons-material/Brightness6';

export const APP_TITLE = 'Corporate Credit Decisioning Enterprise Solution';

export default function AppTopBars() {
  return (
    <>
      {/* Top app bar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          py: 1.5,
          backgroundColor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1,
              backgroundColor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <DescriptionIcon sx={{ color: '#fff', fontSize: 20 }} />
          </Box>
          <Typography variant='subtitle1' sx={{ fontWeight: 700, lineHeight: 1.1 }}>
            {APP_TITLE}
          </Typography>
          <Typography variant='body2' color='text.secondary' sx={{ ml: 1 }}>
            Broker Portal
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton size='small'>
            <Brightness6Icon fontSize='small' />
          </IconButton>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'grey.900', fontSize: 14 }}>NA</Avatar>
        </Box>
      </Box>

      {/* Page title bar */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 3, py: 1.5 }}>
        <AppsIcon fontSize='small' sx={{ color: 'text.secondary' }} />
        <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
          {APP_TITLE}
        </Typography>
      </Box>
    </>
  );
}
