import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { AppProviders } from './app/providers/AppProviders';
import { router } from './app/router';
import './app/styles/globals.css';
import { initializeSentry } from '@client/shared/monitoring/init-sentry';
import { reportWebVitals } from '@client/shared/monitoring/report-web-vitals';

const root = document.getElementById('root');
if (!root) throw new Error('Root element was not found.');

initializeSentry();
reportWebVitals();

createRoot(root).render(
  <StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  </StrictMode>,
);
