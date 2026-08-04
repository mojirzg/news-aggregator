import { useState } from 'react';
import type { Article } from '@contracts/index';
import { getArticleImageAlt } from '../lib/get-article-image-alt';

export const ArticleImage = ({ article, className }: { article: Article; className?: string }) => {
  const [failed, setFailed] = useState(false);
  if (!article.imageUrl || failed) {
    return <div className={className} role="img" aria-label="Article image unavailable" style={{ display: 'grid', placeItems: 'center', background: '#e8edf3', color: '#667085', fontWeight: 800 }}>SIGNAL</div>;
  }
  return <img className={className} src={article.imageUrl} width={460} height={340} alt={getArticleImageAlt(article)} loading="lazy" decoding="async" onError={() => setFailed(true)} />;
};
