// @vitest-environment jsdom
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDebouncedCallback } from './use-debounced-callback';

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

describe('useDebouncedCallback', () => {
  it('cancels a pending callback when its owner unmounts', () => {
    const commit = vi.fn();
    const container = document.createElement('div');
    const root = createRoot(container);
    let schedule: (() => void) | null = null;

    const Capture = () => {
      schedule = useDebouncedCallback(commit, 350).callback;
      return null;
    };

    act(() => {
      root.render(<Capture />);
    });

    act(() => {
      schedule?.();
      root.unmount();
      vi.advanceTimersByTime(500);
    });

    expect(commit).not.toHaveBeenCalled();
  });
});
