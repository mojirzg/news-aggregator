import { useCallback, useEffect, useRef } from 'react';

interface DebouncedCallbackControls<Arguments extends unknown[]> {
  callback: (...args: Arguments) => void;
  cancel: () => void;
  flush: () => void;
}

export const useDebouncedCallback = <Arguments extends unknown[]>(
  callback: (...args: Arguments) => void,
  delayMs: number,
): DebouncedCallbackControls<Arguments> => {
  const callbackRef = useRef(callback);
  const argumentsRef = useRef<Arguments | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const cancel = useCallback((): void => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    argumentsRef.current = null;
  }, []);

  const flush = useCallback((): void => {
    if (timerRef.current === null || argumentsRef.current === null) {
      return;
    }

    window.clearTimeout(timerRef.current);
    timerRef.current = null;

    const pendingArguments = argumentsRef.current;
    argumentsRef.current = null;
    callbackRef.current(...pendingArguments);
  }, []);

  const debouncedCallback = useCallback(
    (...args: Arguments): void => {
      argumentsRef.current = args;

      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }

      timerRef.current = window.setTimeout(flush, delayMs);
    },
    [delayMs, flush],
  );

  useEffect(() => cancel, [cancel]);

  return {
    callback: debouncedCallback,
    cancel,
    flush,
  };
};
