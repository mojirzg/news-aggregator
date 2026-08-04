import type { NextFunction, Request, Response } from 'express';
import { feedResponseSchema, feedQuerySchema } from '@contracts/index';
import { ApplicationError } from '@server/shared/errors/application-error';
import { errorCodes } from '@server/shared/errors/error-codes';
import type { FeedService } from './feed.service';

export const createFeedController = (service: FeedService) => async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const parsed = feedQuerySchema.safeParse(request.query);
  if (!parsed.success) {
    next(new ApplicationError('Invalid feed filters.', 400, errorCodes.validation, parsed.error.flatten()));
    return;
  }

  const controller = new AbortController();
  request.on('aborted', () => controller.abort());
  response.on('close', () => {
    if (!response.writableEnded) controller.abort();
  });

  try {
    const feed = feedResponseSchema.parse(await service.getFeed(parsed.data, controller.signal));
    response.setHeader('Cache-Control', 'private, max-age=30, stale-while-revalidate=60');
    response.json(feed);
  } catch (error) {
    next(error);
  }
};
