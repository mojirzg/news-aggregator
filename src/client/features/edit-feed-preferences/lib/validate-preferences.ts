import { feedPreferencesSchema, type FeedPreferences } from '@client/entities/feed-preferences';

export const validatePreferences = (preferences: FeedPreferences) => feedPreferencesSchema.safeParse(preferences);
