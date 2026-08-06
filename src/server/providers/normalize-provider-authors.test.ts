import { describe, expect, it } from 'vitest';
import { normalizeProviderAuthors } from './normalize-provider-authors';

describe('normalizeProviderAuthors', () => {
  it.each([
    ['By Jane Smith', ['Jane Smith']],
    ['Jane Smith and John Doe', ['Jane Smith', 'John Doe']],
    ['By Jane Smith, Reuters', ['Jane Smith']],
    ['Jane Smith; John Doe', ['Jane Smith', 'John Doe']],
    ['Jane Smith, John Doe', ['Jane Smith', 'John Doe']],
    ['Reuters', []],
  ])('normalizes %j', (byline, expected) => {
    expect(normalizeProviderAuthors(byline)).toEqual(expected);
  });

  it('deduplicates authors case-insensitively', () => {
    expect(normalizeProviderAuthors('Jane Smith and jane smith')).toEqual([
      'Jane Smith',
    ]);
  });
});
