import * as Sentry from '@sentry/react';
import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ErrorState } from '@client/shared/ui/ErrorState';
import { Button } from '@client/shared/ui/Button';
import styles from './AppErrorBoundary.module.css';

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  error: Error | null;
  eventId: string | null;
}

const initialState: AppErrorBoundaryState = {
  error: null,
  eventId: null,
};

export class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  public state: AppErrorBoundaryState = initialState;

  public static getDerivedStateFromError(
    error: Error,
  ): Partial<AppErrorBoundaryState> {
    return { error };
  }

  public componentDidCatch(error: Error, info: ErrorInfo): void {
    const eventId = Sentry.withScope((scope) => {
      scope.setLevel('error');

      scope.setTag('error.boundary', 'AppErrorBoundary');
      scope.setTag('error.type', error.name);

      scope.setContext('react', {
        componentStack: info.componentStack ?? 'Unavailable',
      });

      scope.setExtra('componentStack', info.componentStack ?? 'Unavailable');

      return Sentry.captureException(error);
    });

    this.setState({ eventId });

    if (import.meta.env.DEV) {
      console.error('Unhandled React render error', {
        error,
        componentStack: info.componentStack,
        sentryEventId: eventId,
      });
    }
  }

  private reloadApplication = (): void => {
    window.location.reload();
  };

  private resetBoundary = (): void => {
    this.setState(initialState);
  };

  public render(): ReactNode {
    const { error, eventId } = this.state;

    if (!error) {
      return this.props.children;
    }

    return (
      <main
        id="main-content"
        className={`container ${styles.page}`}
        aria-labelledby="application-error-title"
      >
        <ErrorState
          action={
            <div className={styles.actions}>
              <Button type="button" onClick={this.resetBoundary}>
                Try again
              </Button>

              <Button type="button" onClick={this.reloadApplication}>
                Reload application
              </Button>
            </div>
          }
        />

        {import.meta.env.DEV && (
          <details className={styles.details}>
            <summary>Error details</summary>

            <pre>{error.message}</pre>

            {eventId && (
              <p>
                Sentry event ID: <code>{eventId}</code>
              </p>
            )}
          </details>
        )}
      </main>
    );
  }
}
