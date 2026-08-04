import { expect, test } from '@playwright/test';

test('filtered URLs survive reloads', async ({ page }) => {
  await page.goto('/?sourceIds=newsapi&categories=technology');
  await expect(
    page.getByText('NewsAPI', { exact: true }).first(),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', {
      name: /Frontend teams make performance budgets/i,
    }),
  ).toBeVisible();

  await page.reload();
  await expect(page).toHaveURL(/sourceIds=newsapi/);
  await expect(page).toHaveURL(/categories=technology/);
  await expect(
    page.getByRole('heading', {
      name: /Frontend teams make performance budgets/i,
    }),
  ).toBeVisible();
});
