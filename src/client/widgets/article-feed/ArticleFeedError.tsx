import { ErrorState } from '@client/shared/ui/ErrorState';
import { RetryFeedButton } from '@client/features/retry-feed';

export const ArticleFeedError = ({ onRetry }: { onRetry: () => void }) => (
  <ErrorState action={<RetryFeedButton onRetry={onRetry} />} />
);
