import type { Article } from '@contracts/index';
import { ProviderBadge } from '@client/entities/provider';
import { formatPublicationDate } from '../lib/format-publication-date';

export const ArticleMetadata = ({ article }: { article: Article }) => (
  <div
    style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}
  >
    <ProviderBadge id={article.source.id} name={article.source.name} />
    <span aria-hidden="true" style={{ color: '#98a2b3' }}>
      •
    </span>
    <time
      dateTime={article.publishedAt}
      style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem' }}
    >
      {formatPublicationDate(article.publishedAt)}
    </time>
  </div>
);
