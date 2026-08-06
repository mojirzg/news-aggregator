import { expect, test } from '@playwright/test';

const isFeedRequest = (url: string): boolean =>
  new URL(url).pathname === '/api/feed';

test('mobile search remains a draft until Apply and stale changes stay cancelled', async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, 'This journey verifies the mobile filter drawer.');

  const feedRequests: string[] = [];
  page.on('request', (request) => {
    if (isFeedRequest(request.url())) {
      feedRequests.push(request.url());
    }
  });

  await page.goto('/?query=performance');
  await expect(page).toHaveURL(/query=performance/);
  await expect(
    page.getByRole('heading', {
      name: /Frontend teams make performance budgets/i,
    }),
  ).toBeVisible();
  await expect(page.getByText('1 result')).toBeVisible();

  await page.getByRole('button', { name: 'Open filters' }).click();
  let drawer = page.getByRole('dialog', { name: 'Filter articles' });
  let search = drawer.getByRole('searchbox', { name: 'Search articles' });
  const requestsBeforeDraft = feedRequests.length;

  await search.fill('climate');
  await page.waitForTimeout(450);

  await expect(page).toHaveURL(/query=performance/);
  await expect(
    page.getByRole('heading', {
      name: /Frontend teams make performance budgets/i,
    }),
  ).toBeVisible();
  expect(feedRequests).toHaveLength(requestsBeforeDraft);

  await drawer.getByRole('button', { name: 'Close drawer' }).click();
  await expect(drawer).toBeHidden();
  await expect(page).toHaveURL(/query=performance/);

  await page.getByRole('button', { name: 'Open filters' }).click();
  drawer = page.getByRole('dialog', { name: 'Filter articles' });
  search = drawer.getByRole('searchbox', { name: 'Search articles' });
  await expect(search).toHaveValue('performance');

  await search.fill('climate');
  const requestsBeforeApply = feedRequests.length;
  await drawer.getByRole('button', { name: 'Apply filters' }).click();

  await expect(page).toHaveURL(/query=climate/);
  await expect(
    page.getByRole('heading', {
      name: /Climate laboratories share a faster forecasting method/i,
    }),
  ).toBeVisible();
  await expect.poll(() => feedRequests.length).toBe(requestsBeforeApply + 1);
  await page.waitForTimeout(450);
  expect(feedRequests).toHaveLength(requestsBeforeApply + 1);

  await page.getByRole('button', { name: 'Open filters' }).click();
  drawer = page.getByRole('dialog', { name: 'Filter articles' });
  search = drawer.getByRole('searchbox', { name: 'Search articles' });
  await search.fill('performance');
  await drawer.getByRole('button', { name: 'Reset' }).click();
  await expect(search).toHaveValue('');

  const requestsBeforeResetApply = feedRequests.length;
  await drawer.getByRole('button', { name: 'Apply filters' }).click();

  await expect(page).not.toHaveURL(/query=/);
  await expect(
    page.getByRole('heading', {
      name: /Frontend teams make performance budgets/i,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', {
      name: /Climate laboratories share a faster forecasting method/i,
    }),
  ).toBeVisible();
  await expect
    .poll(() => feedRequests.length)
    .toBe(requestsBeforeResetApply + 1);
  await page.waitForTimeout(450);
  await expect(page).not.toHaveURL(/query=/);
  expect(feedRequests).toHaveLength(requestsBeforeResetApply + 1);
});
