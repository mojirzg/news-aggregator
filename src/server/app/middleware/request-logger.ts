import type { IncomingMessage, ServerResponse } from 'node:http';
import pinoHttp from 'pino-http';
import { logger } from '@server/shared/logging/logger';

export const requestLogger = pinoHttp({
  logger,
  customProps: (_request: IncomingMessage, response: ServerResponse) => ({
    requestId: response.getHeader('x-request-id'),
  }),
});
