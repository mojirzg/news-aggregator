import type { FeedPreferences } from '@client/entities/feed-preferences';
import { Input } from '@client/shared/ui/Input';

export const AuthorPreferences = ({
  value,
  onChange,
}: {
  value: FeedPreferences;
  onChange: (next: FeedPreferences) => void;
}) => (
  <Input
    label="Preferred authors"
    hint="Comma-separated names. Matching is case-insensitive and applied after provider normalization."
    placeholder="e.g. Maya Chen, Jordan Lee"
    value={value.authors.join(', ')}
    onChange={(event) =>
      onChange({
        ...value,
        authors: event.target.value
          .split(',')
          .map((author) => author.trim())
          .filter(Boolean),
      })
    }
  />
);
