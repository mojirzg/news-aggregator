import { useCallback, useEffect, useState } from 'react';
import type { FeedPreferences } from '@client/entities/feed-preferences';

export const usePreferencesForm = (initial: FeedPreferences) => {
  const [draft, setDraftState] = useState(initial);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDraftState(initial);
  }, [initial]);

  useEffect(() => {
    if (!saved) return undefined;
    const timer = setTimeout(() => setSaved(false), 2200);
    return () => clearTimeout(timer);
  }, [saved]);

  const setDraft = useCallback((next: FeedPreferences) => {
    setDraftState(next);
    setSaved(false);
  }, []);

  return {
    draft,
    setDraft,
    saved,
    markSaved: () => setSaved(true),
  };
};
