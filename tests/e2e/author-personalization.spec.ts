import { expect, test } from '@playwright/test';

test('discovers canonical authors and marks provider-unavailable selections', async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== 'desktop-chromium',
    'This cache-backed personalization journey only needs one browser project.',
  );

  await page.goto('/');
  await expect(
    page.getByRole('heading', {
      name: /Frontend teams make performance budgets/i,
    }),
  ).toBeVisible();

  await page.getByRole('link', { name: 'Preferences' }).click();
  await page.getByRole('button', { name: 'Maya Chen' }).click();

  const selectedAuthor = page
    .getByRole('list', { name: 'Preferred authors' })
    .getByRole('listitem')
    .filter({ hasText: 'Maya Chen' });

  await expect(selectedAuthor).toBeVisible();
  await page.getByLabel('The New York Times').check();
  await expect(selectedAuthor).toContainText(
    'Unavailable in selected providers',
  );
});
