import { describe, expect, it } from 'vitest';
import type { Article } from '@contracts/index';
import { sortArticlesByPublishedAt } from '../sort-articles';

const article = (id: string, publishedAt: string): Article => ({
  id,
  url: `https://example.com/${id}`,
  title: id,
  publishedAt,
  categories: ['general'],
  source: { id: 'guardian', name: 'The Guardian' },
});

describe('sortArticlesByPublishedAt', () => {
  it('sorts newest first and uses id as a deterministic tie-breaker', () => {
    const result = sortArticlesByPublishedAt([
      article('b', '2026-01-01T12:00:00.000Z'),
      article('c', '2026-01-02T12:00:00.000Z'),
      article('a', '2026-01-01T12:00:00.000Z'),
    ]);

    expect(result.map((item) => item.id)).toEqual(['c', 'a', 'b']);
  });

  it('does not mutate the input array', () => {
    const input = [article('old', '2026-01-01T00:00:00.000Z'), article('new', '2026-01-02T00:00:00.000Z')];
    sortArticlesByPublishedAt(input);
    expect(input.map((item) => item.id)).toEqual(['old', 'new']);
  });
});
