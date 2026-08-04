import { expect, test } from '@playwright/test';

test('searches articles and stores the query in the URL', async ({ page }) => {
  await page.goto('/');
  const search = page.getByRole('searchbox', { name: 'Search articles' });
  await search.fill('performance');

  await expect(page).toHaveURL(/query=performance/);
  await expect(
    page.getByRole('heading', {
      name: /Frontend teams make performance budgets/i,
    }),
  ).toBeVisible();
  await expect(page.getByText('1 result')).toBeVisible();
});
