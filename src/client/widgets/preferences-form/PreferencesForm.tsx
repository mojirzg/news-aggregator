import { useState, type FormEvent } from 'react';
import type { FeedPreferences } from '@client/entities/feed-preferences';
import {
  usePreferencesForm,
  validatePreferences,
} from '@client/features/edit-feed-preferences';
import { Button } from '@client/shared/ui/Button';
import { AuthorPreferences } from './AuthorPreferences';
import { CategoryPreferences } from './CategoryPreferences';
import { SourcePreferences } from './SourcePreferences';
import styles from './PreferencesForm.module.css';

export const PreferencesForm = ({
  initial,
  onSave,
  onReset,
}: {
  initial: FeedPreferences;
  onSave: (preferences: FeedPreferences) => void;
  onReset: () => void;
}) => {
  const form = usePreferencesForm(initial);
  const [validationError, setValidationError] = useState<string | null>(null);
  const submit = () => {
    const result = validatePreferences(form.draft);
    if (!result.success) {
      setValidationError(
        'Preferences could not be saved. Review the selected values and try again.',
      );
      return;
    }
    setValidationError(null);
    onSave(result.data);
    form.markSaved();
  };
  return (
    <form
      className={styles.form}
      onSubmit={(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        submit();
      }}
    >
      <section className={styles.section}>
        <h2 className={styles.title}>Preferred sources</h2>
        <p className={styles.description}>
          Leave all unchecked to include every configured provider.
        </p>
        <SourcePreferences value={form.draft} onChange={form.setDraft} />
      </section>
      <section className={styles.section}>
        <h2 className={styles.title}>Preferred categories</h2>
        <p className={styles.description}>
          Select the topics that should shape your personalized feed.
        </p>
        <CategoryPreferences value={form.draft} onChange={form.setDraft} />
      </section>
      <section className={styles.section}>
        <h2 className={styles.title}>Preferred authors</h2>
        <AuthorPreferences value={form.draft} onChange={form.setDraft} />
      </section>
      <div className={styles.actions}>
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            onReset();
            form.setDraft({
              schemaVersion: 1,
              sourceIds: [],
              categories: [],
              authors: [],
            });
          }}
        >
          Reset
        </Button>
        <Button type="submit">Save preferences</Button>
      </div>
      {form.saved ? (
        <span className={styles.saved} role="status">
          Preferences saved
        </span>
      ) : null}
      {validationError ? (
        <p role="alert" className={styles.error}>
          {validationError}
        </p>
      ) : null}
    </form>
  );
};
