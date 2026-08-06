import { useCallback, useMemo, useState, type KeyboardEvent } from 'react';
import { Plus, X } from 'lucide-react';
import type { FeedPreferences } from '@client/entities/feed-preferences';
import type { DiscoveredAuthor } from '@client/entities/feed';
import { Input } from '@client/shared/ui/Input';
import styles from './AuthorPreferences.module.css';

interface AuthorPreferencesProps {
  discoveredAuthors: DiscoveredAuthor[];
  value: FeedPreferences;
  onChange: (next: FeedPreferences) => void;
}

const normalizeAuthor = (author: string): string =>
  author.trim().replace(/\s+/g, ' ');

const authorKey = (author: string): string =>
  normalizeAuthor(author).toLocaleLowerCase('en-US');

export const AuthorPreferences = ({
  discoveredAuthors,
  value,
  onChange,
}: AuthorPreferencesProps) => {
  const [authorInput, setAuthorInput] = useState('');
  const discoveredByName = useMemo(
    () =>
      new Map(
        discoveredAuthors.map((author) => [authorKey(author.name), author]),
      ),
    [discoveredAuthors],
  );

  const isAvailableForSelectedSources = useCallback(
    (author: DiscoveredAuthor): boolean =>
      value.sourceIds.length === 0 ||
      author.sourceIds.some((sourceId) => value.sourceIds.includes(sourceId)),
    [value.sourceIds],
  );

  const addAuthorValue = useCallback(
    (rawAuthor: string) => {
      const author = normalizeAuthor(rawAuthor);

      if (!author) return;

      const alreadyExists = value.authors.some(
        (existingAuthor) => authorKey(existingAuthor) === authorKey(author),
      );

      if (!alreadyExists) {
        onChange({
          ...value,
          authors: [...value.authors, author],
        });
      }

      setAuthorInput('');
    },
    [onChange, value],
  );

  const removeAuthor = useCallback(
    (authorToRemove: string) => {
      onChange({
        ...value,
        authors: value.authors.filter(
          (author) => authorKey(author) !== authorKey(authorToRemove),
        ),
      });
    },
    [onChange, value],
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addAuthorValue(authorInput);
    }
  };

  const suggestions = discoveredAuthors.filter(
    (author) =>
      isAvailableForSelectedSources(author) &&
      !value.authors.some(
        (selectedAuthor) => authorKey(selectedAuthor) === authorKey(author.name),
      ),
  );

  return (
    <div className={styles.container}>
      <div className={styles.inputRow}>
        <Input
          label="Preferred authors"
          hint="Choose an author found in loaded articles or add a canonical full name manually."
          placeholder="e.g. Maya Chen"
          maxLength={100}
          value={authorInput}
          onChange={(event) => {
            setAuthorInput(event.target.value);
          }}
          onKeyDown={handleKeyDown}
        />

        <button
          type="button"
          className={styles.addButton}
          aria-label="Add preferred author"
          disabled={!authorInput.trim()}
          onClick={() => addAuthorValue(authorInput)}
        >
          <span>Add author</span>
          <Plus aria-hidden="true" />
        </button>
      </div>

      {suggestions.length > 0 ? (
        <div className={styles.suggestions}>
          <p className={styles.suggestionLabel}>
            Authors found in loaded articles
          </p>
          <ul className={styles.suggestionList}>
            {suggestions.map((author) => (
              <li key={authorKey(author.name)}>
                <button
                  type="button"
                  className={styles.suggestionButton}
                  onClick={() => addAuthorValue(author.name)}
                >
                  <Plus aria-hidden="true" />
                  {author.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className={styles.discoveryMessage}>
          No additional authors are available from the loaded articles and
          selected providers.
        </p>
      )}

      {value.authors.length > 0 ? (
        <ul className={styles.chipList} aria-label="Preferred authors">
          {value.authors.map((author) => {
            const discovered = discoveredByName.get(authorKey(author));
            const unavailable =
              discovered !== undefined &&
              !isAvailableForSelectedSources(discovered);

            return (
              <li key={authorKey(author)} className={styles.chip}>
                <span className={styles.chipContent}>
                  <span>{author}</span>
                  {unavailable ? (
                    <span className={styles.unavailable}>
                      Unavailable in selected providers
                    </span>
                  ) : null}
                  {!discovered ? (
                    <span className={styles.manual}>
                      Manual entry — not found in loaded articles
                    </span>
                  ) : null}
                </span>

                <button
                  type="button"
                  className={styles.removeButton}
                  aria-label={`Remove ${author}`}
                  onClick={() => removeAuthor(author)}
                >
                  <X aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className={styles.emptyMessage}>No preferred authors added.</p>
      )}
    </div>
  );
};
