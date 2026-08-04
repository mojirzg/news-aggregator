import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ErrorState } from '@client/shared/ui/ErrorState';
import { Button } from '@client/shared/ui/Button';

interface State { hasError: boolean }

export class AppErrorBoundary extends Component<{ children: ReactNode }, State> {
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
        <main className="container" style={{ padding: '64px 0' }}>
          <ErrorState action={<Button type="button" onClick={() => window.location.reload()}>Reload application</Button>} />
        </main>
      );
    }
    return this.props.children;
  }
}
