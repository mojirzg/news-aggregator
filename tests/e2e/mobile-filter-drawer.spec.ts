import { expect, test } from '@playwright/test';

test('mobile filter drawer applies and resets filters', async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 1000) >= 900, 'Mobile-only behavior');
  await page.goto('/');
  await page.getByRole('button', { name: 'Filters' }).click();
  const dialog = page.getByRole('dialog', { name: 'Filter articles' });
  await expect(dialog).toBeVisible();
  await dialog.getByLabel('Technology').check();
  await dialog.getByLabel('NewsAPI').check();
  await page.getByRole('button', { name: 'Apply filters' }).click();

  await expect(page).toHaveURL(/categories=technology/);
  await expect(page).toHaveURL(/sourceIds=newsapi/);
  await expect(page.getByRole('heading', { name: /Frontend teams make performance budgets/i })).toBeVisible();

  await page.getByRole('button', { name: 'Filters' }).click();
  await page.getByRole('dialog', { name: 'Filter articles' }).getByRole('button', { name: 'Reset' }).click();
  await page.getByRole('button', { name: 'Apply filters' }).click();
  await expect(page).not.toHaveURL(/categories=/);
  await expect(page).not.toHaveURL(/sourceIds=/);
});
