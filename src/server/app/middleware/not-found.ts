import type { NextFunction, Request, Response } from 'express';
import { ApplicationError } from '@server/shared/errors/application-error';
import { errorCodes } from '@server/shared/errors/error-codes';

export const notFound = (
  request: Request,
  _response: Response,
  next: NextFunction,
) => {
  next(
    new ApplicationError(
      `Route ${request.method} ${request.path} was not found.`,
      404,
      errorCodes.notFound,
    ),
  );
};
