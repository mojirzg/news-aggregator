import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createServer } from './create-server';

describe('server routes', () => {
  it('exposes a health endpoint', async () => {
    const response = await request(createServer()).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ status: 'ok' });
  });

  it('rejects an invalid date range before calling providers', async () => {
    const response = await request(createServer()).get('/api/feed?dateFrom=2026-02-01&dateTo=2026-01-01');
    expect(response.status).toBe(400);
  });
});
