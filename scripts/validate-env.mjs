const mode = process.env.NEWS_PROVIDER_MODE ?? 'mock';
const keys = {
  guardian: process.env.GUARDIAN_API_KEY,
  nyt: process.env.NYT_API_KEY,
  newsapi: process.env.NEWS_API_KEY,
};

if (mode === 'live') {
  const missing = Object.entries(keys).filter(([, value]) => !value).map(([key]) => key);
  if (missing.length > 0) {
    console.error(`Missing live provider credentials: ${missing.join(', ')}`);
    process.exit(1);
  }
}
console.log(`Environment is valid for provider mode: ${mode}`);
