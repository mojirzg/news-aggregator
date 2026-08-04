const secretKeys = ['api-key', 'apiKey', 'apikey', 'key', 'token'];

export const redactSensitiveUrl = (rawUrl: string): string => {
  try {
    const url = new URL(rawUrl);
    for (const key of secretKeys) {
      if (url.searchParams.has(key)) url.searchParams.set(key, '[REDACTED]');
    }
    return url.toString();
  } catch {
    return '[INVALID_URL]';
  }
};
