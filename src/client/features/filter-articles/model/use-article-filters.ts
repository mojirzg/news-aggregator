import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { ArticleFilters } from '@contracts/index';
import {
  filtersToSearchParams,
  searchParamsToFilters,
} from '@client/shared/lib/search-params/search-params';

interface FilterUpdateOptions {
  replace?: boolean;
}

const DEFAULT_DEBOUNCE_MS = 350;

export const useArticleFilters = (debounceMs = DEFAULT_DEBOUNCE_MS) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(
    () => searchParamsToFilters(searchParams),
    [searchParams],
  );

  /*
   * Timers must read the latest committed URL filters,
   * not the filters captured when the timer was created.
   */
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  const timerRef = useRef<number | null>(null);

  /*
   * Several rapid patches are accumulated here and
   * committed as one URL update.
   */
  const pendingPatchRef = useRef<Partial<ArticleFilters>>({});

  const pendingOptionsRef = useRef<FilterUpdateOptions>({
    replace: true,
  });

  const clearTimer = useCallback((): void => {
    if (timerRef.current === null) {
      return;
    }

    window.clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  const commitFilters = useCallback(
    (nextFilters: ArticleFilters, options?: FilterUpdateOptions): void => {
      setSearchParams(filtersToSearchParams(nextFilters), {
        replace: options?.replace ?? false,
      });
    },
    [setSearchParams],
  );

  const cancelPendingPatch = useCallback((): void => {
    clearTimer();

    pendingPatchRef.current = {};
    pendingOptionsRef.current = {
      replace: true,
    };
  }, [clearTimer]);

  /*
   * Full filter changes, such as Apply and Clear, should
   * happen immediately and cancel stale queued patches.
   */
  const setFilters = useCallback(
    (nextFilters: ArticleFilters, options?: FilterUpdateOptions): void => {
      cancelPendingPatch();
      commitFilters(nextFilters, options);
    },
    [cancelPendingPatch, commitFilters],
  );

  /*
   * Immediate patching remains useful for normal controls.
   */
  const patchFilters = useCallback(
    (patch: Partial<ArticleFilters>, options?: FilterUpdateOptions): void => {
      cancelPendingPatch();

      commitFilters(
        {
          ...filtersRef.current,
          ...patch,
        },
        options,
      );
    },
    [cancelPendingPatch, commitFilters],
  );

  const flushDebouncedPatches = useCallback((): void => {
    clearTimer();

    const pendingPatch = pendingPatchRef.current;

    pendingPatchRef.current = {};

    if (Object.keys(pendingPatch).length === 0) {
      return;
    }

    const options = pendingOptionsRef.current;

    pendingOptionsRef.current = {
      replace: true,
    };

    commitFilters(
      {
        ...filtersRef.current,
        ...pendingPatch,
      },
      options,
    );
  }, [clearTimer, commitFilters]);

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

      clearTimer();

      timerRef.current = window.setTimeout(flushDebouncedPatches, debounceMs);
    },
    [clearTimer, debounceMs, flushDebouncedPatches],
  );

  useEffect(() => cancelPendingPatch, [cancelPendingPatch]);

  return {
    filters,
    setFilters,
    patchFilters,
    patchFiltersDebounced,
    flushDebouncedPatches,
    cancelPendingPatch,
  };
};
