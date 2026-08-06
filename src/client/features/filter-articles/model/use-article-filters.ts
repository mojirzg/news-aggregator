import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { ArticleFilters } from '@contracts/index';
import {
  filtersToSearchParams,
  searchParamsToFilters,
} from '@client/shared/lib/search-params/search-params';
import { useDebouncedCallback } from '@client/shared/lib/hooks/use-debounced-callback';

interface FilterUpdateOptions {
  replace?: boolean;
}

const DEFAULT_DEBOUNCE_MS = 350;

export const useArticleFilters = (debounceMs = DEFAULT_DEBOUNCE_MS) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchParamsKey = searchParams.toString();
  const filters = useMemo(
    () => searchParamsToFilters(new URLSearchParams(searchParamsKey)),
    [searchParamsKey],
  );

  /*
   * Timers must read the latest committed URL filters,
   * not the filters captured when the timer was created.
   */
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  /*
   * Several rapid patches are accumulated here and
   * committed as one URL update.
   */
  const pendingPatchRef = useRef<Partial<ArticleFilters>>({});

  const pendingOptionsRef = useRef<FilterUpdateOptions>({
    replace: true,
  });

  const commitFilters = useCallback(
    (nextFilters: ArticleFilters, options?: FilterUpdateOptions): void => {
      setSearchParams(filtersToSearchParams(nextFilters), {
        replace: options?.replace ?? false,
      });
    },
    [setSearchParams],
  );

  const commitPendingFilterPatch = useCallback((): void => {
    const pendingPatch = pendingPatchRef.current;
    const options = pendingOptionsRef.current;

    pendingPatchRef.current = {};
    pendingOptionsRef.current = {
      replace: true,
    };

    if (Object.keys(pendingPatch).length === 0) {
      return;
    }

    commitFilters(
      {
        ...filtersRef.current,
        ...pendingPatch,
      },
      options,
    );
  }, [commitFilters]);

  const {
    callback: schedulePendingFilterPatch,
    cancel: cancelScheduledFilterPatch,
    flush: flushScheduledFilterPatch,
  } = useDebouncedCallback(commitPendingFilterPatch, debounceMs);

  const cancelPendingFilterPatch = useCallback((): void => {
    cancelScheduledFilterPatch();
    pendingPatchRef.current = {};
    pendingOptionsRef.current = {
      replace: true,
    };
  }, [cancelScheduledFilterPatch]);

  const flushPendingFilterPatch = useCallback((): void => {
    flushScheduledFilterPatch();
  }, [flushScheduledFilterPatch]);

  /*
   * Browser navigation or any external search-param replacement invalidates
   * a queued patch created against the previous URL state.
   */
  useEffect(() => {
    cancelPendingFilterPatch();
  }, [cancelPendingFilterPatch, searchParamsKey]);

  /*
   * Full filter changes, such as Apply and Reset, happen
   * immediately and cancel stale queued patches first.
   */
  const setFilters = useCallback(
    (nextFilters: ArticleFilters, options?: FilterUpdateOptions): void => {
      cancelPendingFilterPatch();
      commitFilters(nextFilters, options);
    },
    [cancelPendingFilterPatch, commitFilters],
  );

  const patchFilters = useCallback(
    (patch: Partial<ArticleFilters>, options?: FilterUpdateOptions): void => {
      cancelPendingFilterPatch();

      commitFilters(
        {
          ...filtersRef.current,
          ...patch,
        },
        options,
      );
    },
    [cancelPendingFilterPatch, commitFilters],
  );

  const patchFiltersDebounced = useCallback(
    (patch: Partial<ArticleFilters>, options?: FilterUpdateOptions): void => {
      pendingPatchRef.current = {
        ...pendingPatchRef.current,
        ...patch,
      };

      if (options) {
        pendingOptionsRef.current = {
          replace: options.replace ?? true,
        };
      }

      schedulePendingFilterPatch();
    },
    [schedulePendingFilterPatch],
  );

  return {
    filters,
    setFilters,
    patchFilters,
    patchFiltersDebounced,
    cancelPendingFilterPatch,
    flushPendingFilterPatch,
  };
};
