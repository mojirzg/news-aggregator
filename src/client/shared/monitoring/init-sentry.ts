import * as Sentry from '@sentry/react';

const sentryDsn = import.meta.env.VITE_SENTRY_DSN as string | null;

export const initializeSentry = (): void => {
  if (!sentryDsn) {
    return;
  }

  Sentry.init({
    dsn: sentryDsn,
  });
};
