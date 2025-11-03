import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { MernAccessProvider } from 'mern-access-client';
import config from './mern-access.config.ts';
import { ToastContainer } from 'react-toastify';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MernAccessProvider config={config}>
      <ToastContainer position="top-center" autoClose={3000} />
      <App />
    </MernAccessProvider>
  </StrictMode>
);
