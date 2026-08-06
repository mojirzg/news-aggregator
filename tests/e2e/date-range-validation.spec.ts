import { expect, test } from '@playwright/test';

const invalidFrom = '2026-02-01';
const invalidTo = '2026-01-01';
const validTo = '2026-03-01';

test('preserves invalid date values and blocks them before submission', async ({
  page,
  isMobile,
}) => {
  await page.goto('/');

  const scope = isMobile
    ? page.getByRole('dialog', { name: 'Filter articles' })
    : page.getByRole('complementary', { name: 'Article filters' });

  if (isMobile) {
    await page.getByRole('button', { name: 'Open filters' }).click();
    await expect(scope).toBeVisible();
  }

  const from = scope.getByLabel('From');
  const to = scope.getByLabel('To');

  await from.fill(invalidFrom);
  await to.fill(invalidTo);

  await expect(from).toHaveValue(invalidFrom);
  await expect(to).toHaveValue(invalidTo);
  await expect(from).toHaveAttribute('max', invalidTo);
  await expect(to).toHaveAttribute('min', invalidFrom);
  await expect(from).toHaveAttribute('aria-invalid', 'true');
  await expect(to).toHaveAttribute('aria-invalid', 'true');
  await expect(
    scope.getByText('The start date must be on or before the end date.'),
  ).toBeVisible();
  if (isMobile) {
    await expect(page).not.toHaveURL(/dateFrom=/);
    await expect(page).not.toHaveURL(/dateTo=/);
  } else {
    await expect(page).toHaveURL(new RegExp(`dateFrom=${invalidFrom}`));
    await expect(page).not.toHaveURL(/dateTo=/);
  }

  if (isMobile) {
    await expect(
      scope.getByRole('button', { name: 'Apply filters' }),
    ).toBeDisabled();
  }

  await to.fill(validTo);
  await expect(from).not.toHaveAttribute('aria-invalid', 'true');
  await expect(to).not.toHaveAttribute('aria-invalid', 'true');

  if (isMobile) {
    const apply = scope.getByRole('button', { name: 'Apply filters' });
    await expect(apply).toBeEnabled();
    await apply.click();
  }

  await expect(page).toHaveURL(new RegExp(`dateFrom=${invalidFrom}`));
  await expect(page).toHaveURL(new RegExp(`dateTo=${validTo}`));
});
