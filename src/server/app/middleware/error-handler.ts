import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { ApplicationError } from '@server/shared/errors/application-error';
import { errorCodes } from '@server/shared/errors/error-codes';
import { logger } from '@server/shared/logging/logger';

export const errorHandler: ErrorRequestHandler = (error, _request, response) => {
  const requestId = response.locals.requestId as string | undefined;

  if (error instanceof ApplicationError) {
    response.status(error.statusCode).json({
      error: { code: error.code, message: error.message, details: error.details, requestId },
    });
    return;
  }

  if (error instanceof ZodError) {
    response.status(502).json({
      error: {
        code: errorCodes.provider,
        message: 'A news source returned an invalid response.',
        requestId,
      },
    });
    return;
  }

  logger.error({ err: error, requestId }, 'Unhandled request error');
  response.status(500).json({
    error: {
      code: errorCodes.internal,
      message: 'An unexpected error occurred.',
      requestId,
    },
  });
};
