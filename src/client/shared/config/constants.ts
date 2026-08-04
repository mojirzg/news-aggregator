import type { Category, ProviderId } from '@contracts/index';

export const providerOptions: Array<{ id: ProviderId; label: string }> = [
  { id: 'guardian', label: 'The Guardian' },
  { id: 'nyt', label: 'The New York Times' },
  { id: 'newsapi', label: 'NewsAPI' },
];

export const categoryOptions: Array<{ id: Category; label: string }> = [
  { id: 'business', label: 'Business' },
  { id: 'technology', label: 'Technology' },
  { id: 'science', label: 'Science' },
  { id: 'sports', label: 'Sports' },
  { id: 'health', label: 'Health' },
  { id: 'entertainment', label: 'Entertainment' },
  { id: 'general', label: 'General' },
];
