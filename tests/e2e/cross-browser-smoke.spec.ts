import { expect, test } from '@playwright/test';

test('loads and searches the feed in a secondary browser engine', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('#main-content')).toBeVisible();

  await page
    .getByRole('searchbox', { name: 'Search articles' })
    .fill('performance');

  await expect(page).toHaveURL(/query=performance/);
  await expect(
    page.getByRole('heading', {
      name: /Frontend teams make performance budgets/i,
    }),
  ).toBeVisible();
});
