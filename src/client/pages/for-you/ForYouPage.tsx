import { useNavigate } from 'react-router-dom';
import { useFeedQuery } from '@client/entities/feed';
import { hasConfiguredPreferences, useFeedPreferences } from '@client/entities/feed-preferences';
import { routes } from '@client/shared/config/routes';
import { Button } from '@client/shared/ui/Button';
import { EmptyState } from '@client/shared/ui/EmptyState';
import { ArticleFeed, ArticleFeedEmpty, ArticleFeedError, ArticleFeedSkeleton } from '@client/widgets/article-feed';
import { ProviderStatusBanner } from '@client/widgets/provider-status-banner';
import { buildPersonalizedFilters } from './build-personalized-filters';
import styles from './ForYouPage.module.css';

export const ForYouPage = () => {
  const navigate = useNavigate();
  const { preferences } = useFeedPreferences();
  const configured = hasConfiguredPreferences(preferences);
  const filters = buildPersonalizedFilters(preferences);
  const feed = useFeedQuery(filters, configured);
  const allProvidersFailed = Boolean(feed.data?.providers.length && feed.data.providers.every((provider) => provider.status === 'error'));
  const editPreferences = () => { void navigate(routes.preferences); };

  return (
    <main id="main-content" className={styles.page}>
      <div className={`container ${styles.content}`}>
        <header className={styles.header}>
          <div className={styles.copy}>
            <span className={styles.eyebrow}>Personalized feed</span>
            <h1 className={styles.title}>For You</h1>
            <p className={styles.subtitle}>Your saved source, category, and author preferences are converted into normalized feed filters.</p>
          </div>
          <Button type="button" variant="secondary" onClick={editPreferences}>Edit preferences</Button>
        </header>

        {!configured ? (
          <EmptyState
            title="Set up your feed first"
            description="No request is made until at least one preference exists. This avoids an accidental generic feed masquerading as personalization."
            action={<Button type="button" onClick={editPreferences}>Choose preferences</Button>}
          />
        ) : null}
        {configured && feed.isPending ? <ArticleFeedSkeleton /> : null}
        {configured && (feed.isError || allProvidersFailed) ? <ArticleFeedError onRetry={() => void feed.refetch()} /> : null}
        {configured && feed.data ? <ProviderStatusBanner providers={feed.data.providers} onRetry={() => void feed.refetch()} /> : null}
        {configured && feed.data && !allProvidersFailed && feed.data.articles.length === 0 ? (
          <ArticleFeedEmpty action={<Button type="button" onClick={editPreferences}>Broaden preferences</Button>} />
        ) : null}
        {configured && feed.data && !allProvidersFailed && feed.data.articles.length > 0 ? <ArticleFeed articles={feed.data.articles} /> : null}
      </div>
    </main>
  );
};
