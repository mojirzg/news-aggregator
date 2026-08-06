// @vitest-environment jsdom
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ArticleFilters } from '@contracts/index';
import { DateFilter } from './DateFilter';

const baseFilters: ArticleFilters = {
  query: '',
  sourceIds: [],
  categories: [],
  authors: [],
};

const mountedRoots: Array<ReturnType<typeof createRoot>> = [];

beforeEach(() => {
  (
    globalThis as typeof globalThis & {
      IS_REACT_ACT_ENVIRONMENT?: boolean;
    }
  ).IS_REACT_ACT_ENVIRONMENT = true;
});

afterEach(() => {
  for (const root of mountedRoots.splice(0)) {
    act(() => root.unmount());
  }
});

const renderDateFilter = (filters: ArticleFilters) => {
  const container = document.createElement('div');
  const root = createRoot(container);
  mountedRoots.push(root);

  act(() => {
    root.render(<DateFilter filters={filters} onChange={vi.fn()} />);
  });

  return container;
};

describe('DateFilter', () => {
  it('sets reciprocal constraints and exposes an accessible range error', () => {
    const container = renderDateFilter({
      ...baseFilters,
      dateFrom: '2026-02-01',
      dateTo: '2026-01-01',
    });

    const inputs = container.querySelectorAll('input');
    const from = inputs.item(0);
    const to = inputs.item(1);
    const error = container.querySelector('[role="alert"]');

    expect(from.max).toBe('2026-01-01');
    expect(to.min).toBe('2026-02-01');
    expect(from.getAttribute('aria-invalid')).toBe('true');
    expect(to.getAttribute('aria-invalid')).toBe('true');
    expect(error?.textContent).toContain(
      'The start date must be on or before the end date.',
    );
    expect(from.getAttribute('aria-describedby')).toBe(error?.id);
    expect(to.getAttribute('aria-describedby')).toBe(error?.id);
  });

  it('does not mark an ascending range as invalid', () => {
    const container = renderDateFilter({
      ...baseFilters,
      dateFrom: '2026-01-01',
      dateTo: '2026-02-01',
    });

    for (const input of container.querySelectorAll('input')) {
      expect(input.getAttribute('aria-invalid')).toBe('false');
    }
    expect(container.querySelector('[role="alert"]')).toBeNull();
  });
});
