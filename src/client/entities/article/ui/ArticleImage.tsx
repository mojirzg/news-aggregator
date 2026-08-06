import { useState } from 'react';
import type { Article } from '@contracts/index';
import { getArticleImageAlt } from '../lib/get-article-image-alt';
import styles from './ArticleImage.module.css';

interface ArticleImageProps {
  article: Article;
  className?: string;
  isAboveTheFold?: boolean;
}

export const ArticleImage = ({
  article,
  className = '',
  isAboveTheFold = false,
}: ArticleImageProps) => {
  const [failed, setFailed] = useState(false);
  const classes = [styles.media, className].filter(Boolean).join(' ');

  if (!article.imageUrl || failed) {
    return (
      <div
        className={`${classes} ${styles.placeholder}`}
        role="img"
        aria-label="Article image unavailable"
      >
        SIGNAL
      </div>
    );
  }

  return (
    <img
      className={classes}
      src={article.imageUrl}
      width={460}
      height={340}
      alt={getArticleImageAlt(article)}
      loading={isAboveTheFold ? 'eager' : 'lazy'}
      fetchPriority={isAboveTheFold ? 'high' : 'auto'}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
};
