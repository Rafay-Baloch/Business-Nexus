import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import axios from 'axios';

// Enforce global production backend routing footprint across all operational modules
axios.defaults.baseURL = 'https://business-nexus-production-2a96.up.railway.app';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);