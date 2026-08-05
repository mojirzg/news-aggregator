import type { Article, ArticleFilters, ProviderResult } from '@contracts/index';
import { useFeedQuery } from '@client/entities/feed';
import {
  ArticleFeed,
  ArticleFeedEmpty,
  ArticleFeedError,
  ArticleFeedSkeleton,
} from '@client/widgets/article-feed';
import { ArticleToolbar } from '@client/widgets/article-toolbar';
import { ProviderStatusBanner } from '@client/widgets/provider-status-banner';
import { Button } from '@client/shared/ui/Button';

interface NewsFeedContainerProps {
  filters: ArticleFilters;
  onFiltersChange: (filters: ArticleFilters) => void;
  onClearFilters: () => void;
}

type FeedContentState =
  | {
      status: 'error';
    }
  | {
      status: 'empty';
    }
  | {
      status: 'success';
      articles: Article[];
    };

const getFeedContentState = (
  articles: Article[],
  providers: ProviderResult[],
): FeedContentState => {
  const allProvidersFailed =
    providers.length > 0 && providers.every(({ status }) => status === 'error');

  if (allProvidersFailed) {
    return { status: 'error' };
  }

  if (articles.length === 0) {
    return { status: 'empty' };
  }

  return {
    status: 'success',
    articles,
  };
};

interface FeedContentProps {
  state: FeedContentState;
  onRetry: () => void;
  onClearFilters: () => void;
}

const FeedContent = ({ state, onRetry, onClearFilters }: FeedContentProps) => {
  switch (state.status) {
    case 'error':
      return <ArticleFeedError onRetry={onRetry} />;

    case 'empty':
      return (
        <ArticleFeedEmpty
          action={
            <Button type="button" onClick={onClearFilters}>
              Clear filters
            </Button>
          }
        />
      );

    case 'success':
      return <ArticleFeed articles={state.articles} />;
  }
};

export const NewsFeedContainer = ({
  filters,
  onFiltersChange,
  onClearFilters,
}: NewsFeedContainerProps) => {
  const { data, isPending, isFetching, refetch } = useFeedQuery(filters);

  const retryFeed = (): void => {
    void refetch();
  };

  if (isPending) {
    return <ArticleFeedSkeleton />;
  }

  if (!data) {
    return <ArticleFeedError onRetry={retryFeed} />;
  }

  const contentState = getFeedContentState(data.articles, data.providers);

  return (
    <>
      <ArticleToolbar
        filters={filters}
        count={data.articles.length}
        fetching={isFetching}
        onChange={onFiltersChange}
        onClear={onClearFilters}
      />

      <ProviderStatusBanner providers={data.providers} onRetry={retryFeed} />

      <FeedContent
        state={contentState}
        onRetry={retryFeed}
        onClearFilters={onClearFilters}
      />
    </>
  );
};
