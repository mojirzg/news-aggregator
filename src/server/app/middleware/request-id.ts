import { randomUUID } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';

export const requestId = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const id =
    typeof request.headers['x-request-id'] === 'string'
      ? request.headers['x-request-id'].slice(0, 128)
      : randomUUID();
  response.locals.requestId = id;
  response.setHeader('X-Request-Id', id);
  next();
};
