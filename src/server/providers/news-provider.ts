import type { Article, ArticleFilters, ProviderId } from '@contracts/index';

export interface NewsProvider {
  readonly id: ProviderId;
  readonly displayName: string;
  fetchArticles(
    filters: ArticleFilters,
    signal: AbortSignal,
  ): Promise<Article[]>;
}
