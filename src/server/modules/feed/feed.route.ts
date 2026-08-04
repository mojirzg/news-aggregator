import { Router } from 'express';
import { createFeedController } from './feed.controller';
import type { FeedService } from './feed.service';

export const createFeedRouter = (service: FeedService) => {
  const router = Router();
  router.get('/', createFeedController(service));
  return router;
};
