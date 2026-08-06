import { expect, test } from '@playwright/test';

test('searches articles and stores the query in the URL', async ({
  page,
}, testInfo) => {
  await page.goto('/');

  const isMobile = testInfo.project.name === 'mobile-chromium';

  if (isMobile) {
    await page.getByRole('button', { name: 'Open filters' }).click();

    const drawer = page.getByRole('dialog', {
      name: 'Filter articles',
    });

    await drawer
      .getByRole('searchbox', { name: 'Search articles' })
      .fill('performance');

    // Search is still only a draft.
    await expect(page).not.toHaveURL(/query=performance/);

    await drawer.getByRole('button', { name: 'Apply filters' }).click();
  } else {
    await page
      .getByRole('searchbox', { name: 'Search articles' })
      .fill('performance');
  }

  await expect(page).toHaveURL(/query=performance/);

  await expect(
    page.getByRole('heading', {
      name: /Frontend teams make performance budgets/i,
    }),
  ).toBeVisible();

  await expect(page.getByText('1 result')).toBeVisible();
});
