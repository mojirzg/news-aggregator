import * as Sentry from '@sentry/react';
import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '@client/shared/ui/Button';
import { ErrorState } from '@client/shared/ui/ErrorState';
import styles from './RouteChunkBoundary.module.css';

interface RouteChunkBoundaryProps {
  children: ReactNode;
}

interface RouteChunkBoundaryState {
  error: Error | null;
}

export class RouteChunkBoundary extends Component<
  RouteChunkBoundaryProps,
  RouteChunkBoundaryState
> {
  public state: RouteChunkBoundaryState = { error: null };

  public static getDerivedStateFromError(
    error: Error,
  ): RouteChunkBoundaryState {
    return { error };
  }

  public componentDidCatch(error: Error, info: ErrorInfo): void {
    Sentry.captureException(error, {
      tags: { boundary: 'route-chunk' },
      contexts: { react: { componentStack: info.componentStack ?? '' } },
    });
  }

  public render() {
    if (this.state.error) {
      return (
        <main id="main-content" className={`container ${styles.page}`}>
          <ErrorState
            action={
              <Button type="button" onClick={() => window.location.reload()}>
                Reload page
              </Button>
            }
          />
          <p className={styles.message}>
            The route bundle could not be loaded. Reload to retry with the
            latest deployed assets.
          </p>
        </main>
      );
    }

    return this.props.children;
  }
}
