import compression from 'compression';
import express from 'express';
import { createProviderRegistry } from '@server/providers/provider-registry';
import { serverEnv } from '@server/shared/config/server-env';
import { errorHandler } from './middleware/error-handler';
import { notFound } from './middleware/not-found';
import { requestId } from './middleware/request-id';
import { requestLogger } from './middleware/request-logger';
import { createSecurityHeaders } from './middleware/security-headers';
import { registerRoutes } from './register-routes';
import { serveClient } from './serve-client';
import { FeedService } from '../modules/feed/feed.service';

export const createServer = () => {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 1);
  app.use(requestId);
  app.use(requestLogger);
  app.use(
    createSecurityHeaders(serverEnv.SENTRY_DSN ?? serverEnv.VITE_SENTRY_DSN),
  );
  app.use(compression());
  app.use(express.json({ limit: '32kb' }));

  const feedService = new FeedService(
    createProviderRegistry(),
    serverEnv.PROVIDER_TIMEOUT_MS,
  );

  registerRoutes(app, feedService);

  serveClient(app);
  app.use(notFound);
  app.use(errorHandler);
  return app;
};
