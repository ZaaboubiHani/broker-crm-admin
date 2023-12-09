import React from 'react';
import './App.css';
import AppRouter from './routes/routes';
import { BrowserRouter, } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material';

// const theme = createTheme({
//   components: {
//     MuiButton: {
//       styleOverrides: {
//         root: {
//           '&:hover': {
//             backgroundColor: '#35d9da',
//           },
//         },
//       },
//     },
//   },
// });

function App() {
  return (
    // <ThemeProvider theme={theme}>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    // </ThemeProvider>
  );
}

export default App;
