import type { Article } from '@contracts/index';

export const getArticleImageAlt = (article: Article): string => `Illustration for “${article.title}”`;
