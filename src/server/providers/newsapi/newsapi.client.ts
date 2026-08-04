import { fetchJson } from '@server/shared/http/provider-http-client';
import { newsApiResponseSchema } from './newsapi-response.schema';

export const fetchNewsApi = (url: URL, signal: AbortSignal) =>
  fetchJson(url, newsApiResponseSchema, signal);
