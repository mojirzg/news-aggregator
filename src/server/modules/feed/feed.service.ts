import type { ArticleFilters, FeedResponse } from '@contracts/index';
import { FeedAggregator } from './feed-aggregator';

export class FeedService {
  public constructor(private readonly aggregator: FeedAggregator) {}

  public getFeed(filters: ArticleFilters, signal: AbortSignal): Promise<FeedResponse> {
    return this.aggregator.aggregate(filters, signal);
  }
}
