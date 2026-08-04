import type { ArticleFilters } from '@contracts/index';
import type { FeedPreferences } from '@client/entities/feed-preferences';

export const buildPersonalizedFilters = (preferences: FeedPreferences): ArticleFilters => ({
  query: '',
  sourceIds: preferences.sourceIds,
  categories: preferences.categories,
  authors: preferences.authors,
});
