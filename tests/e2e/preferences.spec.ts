import { expect, test } from '@playwright/test';

test('saves preferences and restores them after reload', async ({ page }) => {
  await page.goto('/preferences');
  await page.getByLabel('The New York Times').check();
  await page.getByLabel('Science').check();
  await page.getByLabel('Preferred authors').fill('Priya');
  await page.getByRole('button', { name: 'Save preferences' }).click();
  await expect(page.getByText('Preferences saved')).toBeVisible();

  await page.reload();
  await expect(page.getByLabel('The New York Times')).toBeChecked();
  await expect(page.getByLabel('Science')).toBeChecked();
  await expect(page.getByLabel('Preferred authors')).toHaveValue('Priya');

  await page.getByRole('link', { name: 'For You' }).click();
  await expect(
    page.getByRole('heading', { name: /A new telescope pipeline/i }),
  ).toBeVisible();
});
