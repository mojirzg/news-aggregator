import { expect, test } from '@playwright/test';

test('serves the production client with strict security headers', async ({
  request,
}) => {
  const response = await request.get('/', {
    headers: { Accept: 'text/html' },
  });
  const headers = response.headers();
  const csp = headers['content-security-policy'] ?? '';

  expect(response.ok()).toBe(true);
  expect(csp).toContain("default-src 'self'");
  expect(csp).toContain("style-src 'self'");
  expect(csp).toContain("script-src 'self'");
  expect(csp).toContain("style-src-attr 'none'");
  expect(csp).toContain("script-src-attr 'none'");
  expect(csp).not.toContain("'unsafe-inline'");
  expect(headers['x-content-type-options']).toBe('nosniff');
  expect(headers['x-frame-options']).toBe('SAMEORIGIN');
  expect(headers['referrer-policy']).toBeDefined();
});

test('mobile drawer interaction does not rely on blocked inline styles', async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, 'This check exercises the mobile modal interaction.');

  await page.addInitScript(() => {
    const violations: string[] = [];
    const browser = globalThis as unknown as {
      __cspViolations?: string[];
      document: {
        addEventListener: (
          type: string,
          listener: (event: {
            violatedDirective: string;
            blockedURI: string;
          }) => void,
        ) => void;
      };
    };

    browser.__cspViolations = violations;
    browser.document.addEventListener('securitypolicyviolation', (event) => {
      violations.push(`${event.violatedDirective}: ${event.blockedURI}`);
    });
  });

  await page.goto('/');
  await page.getByRole('button', { name: 'Open filters' }).click();
  await expect(
    page.getByRole('dialog', { name: 'Filter articles' }),
  ).toBeVisible();

  const bodyHasInlineStyle = await page
    .locator('body')
    .evaluate((body) => body.hasAttribute('style'));
  expect(bodyHasInlineStyle).toBe(false);

  await page.waitForTimeout(100);
  const violations = await page.evaluate(
    () =>
      (globalThis as unknown as { __cspViolations?: string[] })
        .__cspViolations ?? [],
  );

  expect(violations).toEqual([]);
});
