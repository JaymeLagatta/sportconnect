import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Fazewr depois
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App /> /* O AuthProvider deve estar AQUI ou dentro do App */
  </React.StrictMode>
);

