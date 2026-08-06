// @vitest-environment jsdom
import type { ArticleFilters } from '@contracts/index';
import { act, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useArticleFilters } from './use-article-filters';

type ArticleFilterController = ReturnType<typeof useArticleFilters>;

const emptyFilters: ArticleFilters = {
  query: '',
  sourceIds: [],
  categories: [],
  authors: [],
};

interface HookHarness {
  controller: ArticleFilterController;
  search: string;
  unmount: () => void;
}

const renderArticleFilters = (initialEntry = '/?query=existing'): HookHarness => {
  const container = document.createElement('div');
  const root: Root = createRoot(container);
  let currentController: ArticleFilterController | null = null;
  let currentSearch = '';

  const Capture = () => {
    currentController = useArticleFilters(350);
    currentSearch = useLocation().search;
    return null;
  };

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={[initialEntry]}>{children}</MemoryRouter>
  );

  act(() => {
    root.render(
      <Wrapper>
        <Capture />
      </Wrapper>,
    );
  });

  return {
    get controller() {
      if (!currentController) {
        throw new Error('Article filter controller was not rendered.');
      }

      return currentController;
    },
    get search() {
      return currentSearch;
    },
    unmount: () => {
      act(() => root.unmount());
    },
  };
};

beforeEach(() => {
  vi.useFakeTimers();
  (
    globalThis as typeof globalThis & {
      IS_REACT_ACT_ENVIRONMENT?: boolean;
    }
  ).IS_REACT_ACT_ENVIRONMENT = true;
});

afterEach(() => {
  vi.clearAllTimers();
  vi.useRealTimers();
});

describe('useArticleFilters pending patches', () => {
  it('does not restore a stale query after Reset', () => {
    const harness = renderArticleFilters();

    act(() => {
      harness.controller.patchFiltersDebounced({ query: 'stale reset' });
      harness.controller.setFilters(emptyFilters);
      vi.advanceTimersByTime(500);
    });

    expect(harness.search).toBe('');
    harness.unmount();
  });

  it('does not commit a queued query after Cancel', () => {
    const harness = renderArticleFilters();

    act(() => {
      harness.controller.patchFiltersDebounced({ query: 'stale cancel' });
      harness.controller.cancelPendingFilterPatch();
      vi.advanceTimersByTime(500);
    });

    expect(harness.search).toBe('?query=existing');
    harness.unmount();
  });

  it('does not overwrite an applied complete draft', () => {
    const harness = renderArticleFilters();
    const appliedFilters: ArticleFilters = {
      ...emptyFilters,
      query: 'applied',
      categories: ['science'],
    };

    act(() => {
      harness.controller.patchFiltersDebounced({ query: 'stale apply' });
      harness.controller.setFilters(appliedFilters);
      vi.advanceTimersByTime(500);
    });

    expect(harness.search).toBe('?query=applied&categories=science');
    harness.unmount();
  });

  it('flushes the latest queued patch exactly once', () => {
    const harness = renderArticleFilters();

    act(() => {
      harness.controller.patchFiltersDebounced({ query: 'first' });
      harness.controller.patchFiltersDebounced({ query: 'latest' });
      harness.controller.flushPendingFilterPatch();
    });

    expect(harness.search).toBe('?query=latest');

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(harness.search).toBe('?query=latest');
    harness.unmount();
  });
});
