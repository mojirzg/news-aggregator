import { createServer } from './app/create-server';
import { serverEnv } from './shared/config/server-env';
import { logger } from './shared/logging/logger';

const app = createServer();
const server = app.listen(serverEnv.PORT, '0.0.0.0', () => {
  logger.info(
    { port: serverEnv.PORT, mode: serverEnv.NEWS_PROVIDER_MODE },
    'Signal News server is listening',
  );
});

const shutdown = (signal: string) => {
  logger.info({ signal }, 'Graceful shutdown started');
  server.close((error) => {
    if (error) {
      logger.error({ err: error }, 'Graceful shutdown failed');
      process.exitCode = 1;
    }
    process.exit();
  });
  setTimeout(() => process.exit(1), 10_000).unref();
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
