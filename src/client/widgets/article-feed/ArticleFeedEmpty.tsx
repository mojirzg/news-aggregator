import type { ReactNode } from 'react';
import { EmptyState } from '@client/shared/ui/EmptyState';

export const ArticleFeedEmpty = ({ action }: { action?: ReactNode }) => (
  <EmptyState
    title="No articles match these filters"
    description="Broaden the date range, select more sources, or clear one of the active filters."
    action={action}
  />
);
