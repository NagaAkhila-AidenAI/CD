import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    backgroundColor: string;
    card: { backgroundColor: string; borderLeft: string; borderLeftColor: string };
    modal: { backgroundColor: string; topColor: string };
    headerNav: { backgroundColor: string; navLinkColor: string; navLinkHoverColor: string; menuToggleColor: string };
    embedded: { resolutionTextColor: string };
    actionButtons: { primary: { backgroundColor: string; color: string }; secondary: { backgroundColor: string; color: string } };
  }
  interface ThemeOptions {
    backgroundColor?: string;
    card?: { backgroundColor: string; borderLeft: string; borderLeftColor: string };
    modal?: { backgroundColor: string; topColor: string };
    headerNav?: { backgroundColor: string; navLinkColor: string; navLinkHoverColor: string; menuToggleColor: string };
    embedded?: { resolutionTextColor: string };
    actionButtons?: { primary: { backgroundColor: string; color: string }; secondary: { backgroundColor: string; color: string } };
  }
}

const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ':root': {
          '--app-primary-color': '#003781',
          '--app-primary-dark-color': '#002557',
          '--app-primary-light-color': '#3d6bb3',
          '--app-secondary-color': '#dc004e',
          '--app-neutral-color': 'grey',
          '--app-neutral-light-color': 'lightgrey',
          '--app-neutral-dark-color': '#262626',
          '--app-error-color': '#f44336',
          '--app-error-light-color': '#e57373',
          '--app-error-dark-color': '#d32f2f',
          '--app-warning-color': '#ff9800',
          '--app-warning-color-light': '#ffb74d',
          '--app-warning-color-dark': '#f57c00',
          '--app-background-color': '#fafafa',
          '--app-form-bg-color': 'white',
          '--app-nav-bg': '#003781',
          '--app-nav-color': '#ffffff',
          '--modal-background-color': 'rgba(100, 100, 100, 0.4)',
          '--modal-top-color': 'white',
          '--modal-border-color': 'black',
          '--modal-box-shadow-color': '#777',
          '--utility-count-background-color': '#b8cae6',
          '--utility-card-border-color': '#f5f5f5',
          '--link-button-color': '#003781',
          '--banner-text-color': '#414141',
          '--app-text-color': 'white',
          '--utility-background-color': 'white',
          '--table-header-background': '#003781',
          '--step-line-color': 'rgba(0, 0, 0, 0.12)',
          '--selected-step-label-color': 'rgba(0, 0, 0, 0.87)',
          '--step-label-color': 'rgba(0, 0, 0, 0.54)',
          '--svg-color': 'invert(0%)',
          '--secondary-button-text-color': '#ffffff',
          '--text-primary-color': '#414141',
          '--text-secondary-color': '#757575',
          '--stepper-completed-bg-color': '#218721'
        }
      }
    },
    MuiTextField: {
      defaultProps: { size: 'small' },
      styleOverrides: { root: { width: '100%' } }
    },
    // Navy table header with white text, light blue-grey body rows
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': { backgroundColor: '#003781', color: '#fff', fontWeight: 600 }
        }
      }
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          '& .MuiTableRow-root': { backgroundColor: '#f2f5f9' },
          '& .MuiTableCell-body': { borderRight: '1px solid #dde3ec' }
        }
      }
    },
    MuiTab: {
      styleOverrides: { root: { color: '#003781', '&.Mui-selected': { color: '#003781' } } }
    }
  },
  headerNav: {
    backgroundColor: '#ffffff',
    navLinkColor: '#003781',
    navLinkHoverColor: '#003781',
    menuToggleColor: 'rgba(0, 0, 0, 0.87)'
  },
  actionButtons: {
    primary: { backgroundColor: '#003781', color: '#FFFFFF' },
    secondary: { backgroundColor: '#dc004e', color: '#FFFFFF' }
  },
  modal: { backgroundColor: 'rgba(100, 100, 100, 0.4)', topColor: 'white' },
  embedded: { resolutionTextColor: 'darkslategray' },
  backgroundColor: '#fff',
  card: { backgroundColor: '#fff', borderLeft: '6px solid', borderLeftColor: '#003781' },
  palette: {
    primary: { main: '#003781', light: '#3d6bb3', dark: '#002557', contrastText: '#fff' },
    secondary: { main: '#dc004e', light: '#ff4081', dark: '#c51162', contrastText: '#fff' },
    background: { default: '#fafafa', paper: '#fff' },
    text: { primary: '#414141', secondary: '#6b6b6b' }
  },
  typography: {
    fontFamily: '"Nunito Sans", "Helvetica", "Arial", sans-serif',
    h1: { color: '#003781' },
    h2: { color: '#003781' },
    h3: { color: '#003781' },
    h4: { color: '#003781' },
    h5: { color: '#003781' },
    h6: { color: '#003781' },
    button: { fontWeight: 600 }
  }
});

// Dark variant for screens that opt into it (Constellation's sdk-config.json also supports
// "theme": "dark" for Pega-rendered views — this is the matching MUI-side counterpart for
// custom screens in this app, using the same design-token vocabulary as the light theme above).
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#4791db', light: '#7fb1e6', dark: '#1976d2', contrastText: '#fff' },
    secondary: { main: '#ff4081', light: '#ff79b0', dark: '#c51162', contrastText: '#fff' },
    background: { default: '#0a0a0a', paper: '#141414' },
    text: { primary: '#e0e0e0', secondary: '#9e9e9e' }
  },
  typography: { fontFamily: '"Nunito Sans", "Helvetica", "Arial", sans-serif' }
});

export { theme, darkTheme };
