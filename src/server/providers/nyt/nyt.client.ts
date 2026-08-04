import { fetchJson } from '@server/shared/http/provider-http-client';
import { nytResponseSchema } from './nyt-response.schema';

export const fetchNyt = (url: URL, signal: AbortSignal) => fetchJson(url, nytResponseSchema, signal);
