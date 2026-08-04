import { useEffect, useState } from 'react';
import type { FeedPreferences } from '@client/entities/feed-preferences';

export const usePreferencesForm = (initial: FeedPreferences) => {
  const [draft, setDraft] = useState(initial);
  const [saved, setSaved] = useState(false);

  useEffect(() => setDraft(initial), [initial]);
  useEffect(() => {
    if (!saved) return undefined;
    const timer = window.setTimeout(() => setSaved(false), 2200);
    return () => window.clearTimeout(timer);
  }, [saved]);

  return {
    draft,
    setDraft,
    saved,
    markSaved: () => setSaved(true),
  };
};
