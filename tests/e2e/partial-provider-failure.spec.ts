import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

const fixture = JSON.parse(
  readFileSync(new URL('./fixtures/feed-partial-failure.json', import.meta.url), 'utf8'),
) as unknown;

test('keeps successful articles visible during a partial provider failure', async ({ page }) => {
  await page.route('**/api/feed**', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(fixture) });
  });

  await page.goto('/');
  await expect(page.getByText('Showing results from 2 of 3 sources')).toBeVisible();
  await expect(page.getByText(/The New York Times did not respond/)).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Successful article remains visible' })).toBeVisible();
});
