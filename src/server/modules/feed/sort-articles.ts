import type { Article } from '@contracts/index';

export const sortArticlesByPublishedAt = (articles: Article[]): Article[] =>
  [...articles].sort((left, right) => {
    const timeDifference = Date.parse(right.publishedAt) - Date.parse(left.publishedAt);
    if (timeDifference !== 0) return timeDifference;
    return left.id.localeCompare(right.id);
  });
