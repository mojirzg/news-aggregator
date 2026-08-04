import { fetchJson } from '@server/shared/http/provider-http-client';
import { guardianResponseSchema } from './guardian-response.schema';

export const fetchGuardian = (url: URL, signal: AbortSignal) =>
  fetchJson(url, guardianResponseSchema, signal);
