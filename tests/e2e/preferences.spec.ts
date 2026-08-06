import { expect, test } from '@playwright/test';

test('saves preferences and restores them after reload', async ({ page }) => {
  await page.goto('/preferences');
  await page.getByLabel('The New York Times').check();
  await page.getByLabel('Science').check();
  await page.getByRole('textbox', { name: 'Preferred authors' }).fill('Priya');
  await page.getByRole('button', { name: 'Add preferred author' }).click();
  await page.getByRole('button', { name: 'Save preferences' }).click();
  await page.reload();
  await expect(page.getByLabel('The New York Times')).toBeChecked();
  await expect(page.getByLabel('Science')).toBeChecked();
  await expect(page.getByText('Priya')).toBeVisible();
});
