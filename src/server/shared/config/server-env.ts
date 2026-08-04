import { serverEnvSchema } from './server-env.schema';

const result = serverEnvSchema.safeParse(process.env);

if (!result.success) {
  // Environment validation must fail before the server accepts traffic.
  console.error('Invalid server environment', result.error.flatten().fieldErrors);
  process.exit(1);
}

export const serverEnv = result.data;
