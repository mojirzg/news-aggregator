import type { ReactNode } from 'react';
import { EmptyState } from '../EmptyState';

export const ErrorState = ({ action }: { action?: ReactNode }) => (
  <EmptyState
    title="We could not load the news feed"
    description="The request failed before any provider returned usable articles. Retry now or check the server configuration."
    action={action}
  />
);
