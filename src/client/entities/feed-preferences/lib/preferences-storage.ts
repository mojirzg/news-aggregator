import { defaultPreferences } from './default-preferences';
import { feedPreferencesSchema, type FeedPreferences } from './preferences-schema';

const storageKey = 'signal-news:feed-preferences';
const changeEvent = 'signal-news:preferences-changed';

export const readPreferences = (): FeedPreferences => {
  if (typeof window === 'undefined') return defaultPreferences;
  const raw = window.localStorage.getItem(storageKey);
  if (!raw) return defaultPreferences;
  try {
    const payload: unknown = JSON.parse(raw) as unknown;
    return feedPreferencesSchema.parse(payload);
  } catch {
    window.localStorage.removeItem(storageKey);
    return defaultPreferences;
  }
};

export const writePreferences = (preferences: FeedPreferences): void => {
  const parsed = feedPreferencesSchema.parse(preferences);
  window.localStorage.setItem(storageKey, JSON.stringify(parsed));
  window.dispatchEvent(new Event(changeEvent));
};

export const clearPreferences = (): void => {
  window.localStorage.removeItem(storageKey);
  window.dispatchEvent(new Event(changeEvent));
};

export const subscribeToPreferences = (listener: () => void): (() => void) => {
  const onStorage = (event: StorageEvent) => {
    if (event.key === storageKey) listener();
  };
  window.addEventListener('storage', onStorage);
  window.addEventListener(changeEvent, listener);
  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener(changeEvent, listener);
  };
};

export const hasConfiguredPreferences = (preferences: FeedPreferences): boolean =>
  preferences.sourceIds.length > 0 || preferences.categories.length > 0 || preferences.authors.length > 0;
