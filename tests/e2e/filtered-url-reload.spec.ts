import { expect, test } from '@playwright/test';

test('filtered URLs survive reloads', async ({ page }, testInfo) => {
  await page.goto('/?sourceIds=newsapi&categories=technology');

  await expect(page).toHaveURL(/sourceIds=newsapi/);
  await expect(page).toHaveURL(/categories=technology/);

  await expect(
    page.getByRole('heading', {
      name: /Frontend teams make performance budgets/i,
    }),
  ).toBeVisible();

  if (testInfo.project.name === 'mobile-chromium') {
    await page.getByRole('button', { name: 'Open filters' }).click();

    const drawer = page.getByRole('dialog', {
      name: 'Filter articles',
    });

    await expect(
      drawer.getByRole('checkbox', { name: 'NewsAPI' }),
    ).toBeChecked();

    await expect(
      drawer.getByRole('checkbox', { name: 'Technology' }),
    ).toBeChecked();

    await page.keyboard.press('Escape');
  } else {
    const filters = page.getByRole('complementary', {
      name: 'Article filters',
    });

    await expect(
      filters.getByRole('checkbox', { name: 'NewsAPI' }),
    ).toBeChecked();

    await expect(
      filters.getByRole('checkbox', { name: 'Technology' }),
    ).toBeChecked();
  }

  await page.reload();

  await expect(page).toHaveURL(/sourceIds=newsapi/);
  await expect(page).toHaveURL(/categories=technology/);

  await expect(
    page.getByRole('heading', {
      name: /Frontend teams make performance budgets/i,
    }),
  ).toBeVisible();
});
