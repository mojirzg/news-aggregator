import type { Article, ArticleFilters, ProviderId } from '@contracts/index';
import type { NewsProvider } from '../news-provider';
import { mockArticles } from './mock-articles';

const includesInsensitive = (value: string | undefined, search: string) =>
  value?.toLowerCase().includes(search.toLowerCase()) ?? false;

export class MockProvider implements NewsProvider {
  public readonly displayName: string;

  public constructor(public readonly id: ProviderId) {
    this.displayName = {
      guardian: 'The Guardian',
      nyt: 'The New York Times',
      newsapi: 'NewsAPI',
    }[id];
  }

  public async fetchArticles(filters: ArticleFilters, signal: AbortSignal): Promise<Article[]> {
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(resolve, 120);
      signal.addEventListener(
        'abort',
        () => {
          clearTimeout(timer);
          reject(signal.reason);
        },
        { once: true },
      );
    });

    return mockArticles[this.id].filter((article) => {
      const queryMatches =
        !filters.query ||
        includesInsensitive(article.title, filters.query) ||
        includesInsensitive(article.description, filters.query) ||
        article.keywords?.some((keyword) => includesInsensitive(keyword, filters.query));
      const categoryMatches =
        filters.categories.length === 0 ||
        filters.categories.some((category) => article.categories.includes(category));
      const authorMatches =
        filters.authors.length === 0 ||
        filters.authors.some((author) => includesInsensitive(article.author, author));
      const date = article.publishedAt.slice(0, 10);
      const afterFrom = !filters.dateFrom || date >= filters.dateFrom;
      const beforeTo = !filters.dateTo || date <= filters.dateTo;
      return queryMatches && categoryMatches && authorMatches && afterFrom && beforeTo;
    });
  }
}
