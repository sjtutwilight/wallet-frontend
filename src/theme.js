import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#ff9800', 
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e', 
    },
    text: {
      primary: '#ffffff', 
      secondary: '#b0b0b0', 
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
    button: {
      textTransform: 'none', 
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          transition: 'background-color 0.3s, transform 0.2s',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 6px 12px rgba(0,0,0,0.2)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            borderRadius: '8px',
          },
        },
      },
    },
  },
});

export default theme;
