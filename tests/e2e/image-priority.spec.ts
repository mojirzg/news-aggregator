import { expect, test } from '@playwright/test';

const onePixelPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
  'base64',
);

test('prioritizes only the first visible article image', async ({ page }) => {
  await page.route('https://images.unsplash.com/**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'image/png',
      body: onePixelPng,
    }),
  );

  await page.goto('/');

  const images = page.locator('[aria-label="News articles"] img');
  await expect(images.first()).toBeVisible();
  await expect(images.first()).toHaveAttribute('width', '460');
  await expect(images.first()).toHaveAttribute('height', '340');
  await expect(images.first()).toHaveAttribute('loading', 'eager');
  await expect(images.first()).toHaveAttribute('fetchpriority', 'high');

  if ((await images.count()) > 1) {
    await expect(images.nth(1)).toHaveAttribute('loading', 'lazy');
    await expect(images.nth(1)).toHaveAttribute('fetchpriority', 'auto');
  }
});
