import { useFeedPreferences } from '@client/entities/feed-preferences';
import { PreferencesForm } from '@client/widgets/preferences-form';
import styles from './PreferencesPage.module.css';

export const PreferencesPage = () => {
  const { preferences, save, clear } = useFeedPreferences();
  return (
    <main id="main-content" className={styles.page}>
      <div className={`container ${styles.content}`}>
        <header className={styles.header}>
          <span className={styles.eyebrow}>Local, versioned preferences</span>
          <h1 className={styles.title}>Customize your feed</h1>
          <p className={styles.subtitle}>
            Preferences are validated at runtime and stored in the browser. No
            authentication or server-side profile is required for this
            assessment.
          </p>
        </header>
        <PreferencesForm initial={preferences} onSave={save} onReset={clear} />
      </div>
    </main>
  );
};
