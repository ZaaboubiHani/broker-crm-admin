import React from 'react';
import './App.css';
import AppRouter from './routes/routes';
import { BrowserRouter, } from 'react-router-dom';


function App() {
  return (
   
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
  );
}

export default App;
