import type { ReactNode } from 'react';
import { AppErrorBoundary } from './AppErrorBoundary';
import { QueryProvider } from './QueryProvider';

export const AppProviders = ({ children }: { children: ReactNode }) => (
  <AppErrorBoundary>
    <QueryProvider>{children}</QueryProvider>
  </AppErrorBoundary>
);
