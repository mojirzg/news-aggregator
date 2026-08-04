import { Button } from '@client/shared/ui/Button';

export const RetryFeedButton = ({ onRetry }: { onRetry: () => void }) => (
  <Button type="button" onClick={onRetry}>
    Retry feed
  </Button>
);
