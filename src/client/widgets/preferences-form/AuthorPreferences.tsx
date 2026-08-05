import { useCallback, useState, type KeyboardEvent } from 'react';
import { Plus, X } from 'lucide-react';
import type { FeedPreferences } from '@client/entities/feed-preferences';
import { Input } from '@client/shared/ui/Input';
import styles from './AuthorPreferences.module.css';

interface AuthorPreferencesProps {
  value: FeedPreferences;
  onChange: (next: FeedPreferences) => void;
}

const normalizeAuthor = (author: string): string =>
  author.trim().replace(/\s+/g, ' ');

export const AuthorPreferences = ({
  value,
  onChange,
}: AuthorPreferencesProps) => {
  const [authorInput, setAuthorInput] = useState('');

  const addAuthor = useCallback(() => {
    const author = normalizeAuthor(authorInput);

    if (!author) {
      return;
    }

    const alreadyExists = value.authors.some(
      (existingAuthor) =>
        existingAuthor.toLocaleLowerCase() === author.toLocaleLowerCase(),
    );

    if (alreadyExists) {
      setAuthorInput('');
      return;
    }

    onChange({
      ...value,
      authors: [...value.authors, author],
    });

    setAuthorInput('');
  }, [authorInput, onChange, value]);

  const removeAuthor = useCallback(
    (authorToRemove: string) => {
      onChange({
        ...value,
        authors: value.authors.filter((author) => author !== authorToRemove),
      });
    },
    [onChange, value],
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addAuthor();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputRow}>
        <Input
          label="Preferred authors"
          placeholder="e.g. Maya Chen"
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
          onClick={addAuthor}
        >
          <label>Add Author</label>
          <Plus aria-hidden="true" />
        </button>
      </div>

      {value.authors.length > 0 ? (
        <ul className={styles.chipList} aria-label="Preferred authors">
          {value.authors.map((author) => (
            <li key={author} className={styles.chip}>
              <span>{author}</span>

              <button
                type="button"
                className={styles.removeButton}
                aria-label={`Remove ${author}`}
                onClick={() => {
                  removeAuthor(author);
                }}
              >
                <X aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.emptyMessage}>No preferred authors added.</p>
      )}
    </div>
  );
};
