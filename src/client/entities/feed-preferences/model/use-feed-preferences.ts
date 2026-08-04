import { useCallback, useEffect, useState } from 'react';
import type { FeedPreferences } from '../lib/preferences-schema';
import {
  clearPreferences,
  readPreferences,
  subscribeToPreferences,
  writePreferences,
} from '../lib/preferences-storage';

export const useFeedPreferences = () => {
  const [preferences, setPreferences] = useState<FeedPreferences>(() => readPreferences());

  useEffect(() => subscribeToPreferences(() => setPreferences(readPreferences())), []);

  const save = useCallback((next: FeedPreferences) => writePreferences(next), []);
  const clear = useCallback(() => clearPreferences(), []);
  return { preferences, save, clear };
};
