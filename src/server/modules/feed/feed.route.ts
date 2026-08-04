import { Router } from 'express';
import { feedQuerySchema, feedResponseSchema } from '@contracts/index';
import { ApplicationError } from '@server/shared/errors/application-error';
import { errorCodes } from '@server/shared/errors/error-codes';
import type { FeedService } from './feed.service';

export const createFeedRouter = (service: FeedService): Router => {
  const router = Router();

  router.get('/', async (request, response, next) => {
    const parsedFilters = feedQuerySchema.safeParse(request.query);

    if (!parsedFilters.success) {
      next(
        new ApplicationError(
          'Invalid feed filters.',
          400,
          errorCodes.validation,
          parsedFilters.error.flatten(),
        ),
      );
      return;
    }

    const requestController = new AbortController();

    request.on('aborted', () => requestController.abort());

    response.on('close', () => {
      if (!response.writableEnded) {
        requestController.abort();
      }
    });

    try {
      const feed = await service.getFeed(
        parsedFilters.data,
        requestController.signal,
      );

      const responseBody = feedResponseSchema.parse(feed);

      response.setHeader(
        'Cache-Control',
        'private, max-age=30, stale-while-revalidate=60',
      );

      response.json(responseBody);
    } catch (error) {
      next(error);
    }
  });

  return router;
};
