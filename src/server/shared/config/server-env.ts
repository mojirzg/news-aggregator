import { serverEnvSchema } from './server-env.schema';

const ENV = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    LOG_LEVEL: process.env.LOG_LEVEL,
    NEWS_PROVIDER_MODE: process.env.NEWS_PROVIDER_MODE,
    PROVIDER_TIMEOUT_MS: process.env.PROVIDER_TIMEOUT_MS,
    REQUEST_LIMIT_PER_MINUTE: process.env.REQUEST_LIMIT_PER_MINUTE,
    GUARDIAN_API_KEY: process.env.GUARDIAN_API_KEY,
    NYT_API_KEY: process.env.NYT_API_KEY,
    NEWS_API_KEY: process.env.NEWS_API_KEY,
}
const result = serverEnvSchema.safeParse(ENV);

if (!result.success) {
  // Environment validation must fail before the server accepts traffic.
  console.error('Invalid server environment', result.error.flatten().fieldErrors);
  process.exit(1);
}

export const serverEnv = result.data;
