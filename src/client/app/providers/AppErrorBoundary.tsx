import * as Sentry from '@sentry/react';
import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ErrorState } from '@client/shared/ui/ErrorState';
import { Button } from '@client/shared/ui/Button';
import styles from './AppErrorBoundary.module.css';

interface State {
  hasError: boolean;
}

export class AppErrorBoundary extends Component<
  { children: ReactNode },
  State
> {
  public state: State = { hasError: false };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled React error', error, info.componentStack);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Sentry.ErrorBoundary
          fallback={
            <main>
              <h1>Something went wrong</h1>
              <p>The error has been recorded.</p>
            </main>
          }
        >
          <main id="main-content" className={`container ${styles.page}`}>
            <ErrorState
              action={
                <Button type="button" onClick={() => window.location.reload()}>
                  Reload application
                </Button>
              }
            />
          </main>
        </Sentry.ErrorBoundary>
      );
    }
    return this.props.children;
  }
}
