import type { Article } from '@contracts/index';
import { ProviderBadge } from '@client/entities/provider';
import { formatPublicationDate } from '../lib/format-publication-date';
import styles from './ArticleMetadata.module.css';

export const ArticleMetadata = ({ article }: { article: Article }) => (
  <div className={styles.metadata}>
    <ProviderBadge id={article.source.id} name={article.source.name} />
    <span aria-hidden="true" className={styles.separator}>
      •
    </span>
    <time className={styles.date} dateTime={article.publishedAt}>
      {formatPublicationDate(article.publishedAt)}
    </time>
  </div>
);
