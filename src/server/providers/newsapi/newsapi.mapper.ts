import type { Article, Category } from '@contracts/index';
import type { NewsApiResponse } from './newsapi-response.schema';

type NewsApiItem = NewsApiResponse['articles'][number];

const inferCategory = (title: string, description?: string | null): Category => {
  const text = `${title} ${description ?? ''}`.toLowerCase();
  const terms: Array<[Category, string[]]> = [
    ['technology', ['technology', 'software', 'ai', 'computer', 'cyber']],
    ['business', ['business', 'market', 'economy', 'company', 'finance']],
    ['science', ['science', 'research', 'space', 'climate']],
    ['sports', ['sport', 'football', 'soccer', 'tennis', 'basketball']],
    ['health', ['health', 'medical', 'medicine', 'hospital']],
    ['entertainment', ['film', 'movie', 'music', 'television', 'celebrity']],
  ];
  return terms.find(([, keywords]) => keywords.some((keyword) => text.includes(keyword)))?.[0] ?? 'general';
};

export const mapNewsApiResponse = (payload: NewsApiResponse): Article[] =>
  payload.articles
    .filter((item: NewsApiItem) => item.title !== '[Removed]')
    .map((item: NewsApiItem) => ({
      id: `newsapi:${item.url}`,
      url: item.url,
      title: item.title,
      ...(item.description ? { description: item.description } : {}),
      ...(item.urlToImage ? { imageUrl: item.urlToImage } : {}),
      ...(item.author ? { author: item.author } : {}),
      publishedAt: new Date(item.publishedAt).toISOString(),
      categories: [inferCategory(item.title, item.description)],
      source: { id: 'newsapi', name: item.source.name || 'NewsAPI' },
    }));
