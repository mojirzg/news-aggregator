import type { Express } from 'express';
import { createFeedRouter } from '@server/modules/feed/feed.route';
import type { FeedService } from '@server/modules/feed/feed.service';
import { healthRouter } from '@server/modules/health/health.route';
import { apiRateLimit } from './middleware/rate-limit';

export const registerRoutes = (app: Express, feedService: FeedService) => {
  app.use('/api', apiRateLimit);
  app.use('/api/health', healthRouter);
  app.use('/api/feed', createFeedRouter(feedService));
};
