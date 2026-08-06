import axe from 'axe-core';
import { expect, test, type Page, type TestInfo } from '@playwright/test';

interface AxeNode {
  target: string[];
  failureSummary?: string;
}

interface AxeViolation {
  id: string;
  impact: string | null;
  help: string;
  nodes: AxeNode[];
}

interface AxeResult {
  violations: AxeViolation[];
}

interface AxeApi {
  run: (
    context: unknown,
    options: {
      runOnly: {
        type: 'tag';
        values: string[];
      };
    },
  ) => Promise<AxeResult>;
}

const wcagTags = [
  'wcag2a',
  'wcag2aa',
  'wcag21a',
  'wcag21aa',
  'wcag22a',
  'wcag22aa',
];

const runAxe = async (
  page: Page,
  testInfo: TestInfo,
  label: string,
): Promise<void> => {
  await page.evaluate(axe.source);

  const result = await page.evaluate(async (tags) => {
    const browser = globalThis as unknown as {
      axe: AxeApi;
      document: unknown;
    };

    return browser.axe.run(browser.document, {
      runOnly: { type: 'tag', values: tags },
    });
  }, wcagTags);

  const violations = result.violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    help: violation.help,
    nodes: violation.nodes.map((node) => ({
      target: node.target,
      failureSummary: node.failureSummary,
    })),
  }));

  await testInfo.attach(`axe-${label}`, {
    body: JSON.stringify(violations, null, 2),
    contentType: 'application/json',
  });

  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
};

test('key routes pass the automated WCAG axe gate', async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== 'desktop-chromium',
    'The full accessibility gate runs once in desktop Chromium.',
  );

  for (const route of [
    {
      path: '/',
      label: 'news',
      ready: () => page.getByRole('region', { name: 'News articles' }),
    },
    {
      path: '/for-you',
      label: 'for-you',
      ready: () => page.getByRole('heading', { name: 'For You', level: 1 }),
    },
    {
      path: '/preferences',
      label: 'preferences',
      ready: () =>
        page.getByRole('heading', { name: 'Customize your feed', level: 1 }),
    },
  ]) {
    await page.goto(route.path);
    await expect(route.ready()).toBeVisible();
    await runAxe(page, testInfo, route.label);
  }
});

test('mobile filter drawer passes the automated WCAG axe gate', async ({
  page,
  isMobile,
}, testInfo) => {
  test.skip(!isMobile, 'This check targets the modal mobile filter state.');

  await page.goto('/');
  await expect(
    page.getByRole('region', { name: 'News articles' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Open filters' }).click();
  await expect(
    page.getByRole('dialog', { name: 'Filter articles' }),
  ).toBeVisible();

  await runAxe(page, testInfo, 'mobile-filter-drawer');
});
