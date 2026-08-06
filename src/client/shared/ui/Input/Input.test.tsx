// @vitest-environment jsdom
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { beforeEach, describe, expect, it } from 'vitest';
import { Input } from './Input';

beforeEach(() => {
  (
    globalThis as typeof globalThis & {
      IS_REACT_ACT_ENVIRONMENT?: boolean;
    }
  ).IS_REACT_ACT_ENVIRONMENT = true;
});

describe('Input accessibility semantics', () => {
  it('associates its visible label and validation messages with a stable id', () => {
    const container = document.createElement('div');
    const root = createRoot(container);

    act(() => {
      root.render(
        <Input
          label="Email address"
          aria-describedby="external-description"
          hint="Use your work email."
          error="Email is required."
        />,
      );
    });

    const input = container.querySelector('input');
    const label = container.querySelector('label');
    const hint = container.querySelector('[id$="-hint"]');
    const error = container.querySelector('[id$="-error"]');

    expect(input).not.toBeNull();
    expect(label?.htmlFor).toBe(input?.id);
    expect(input?.getAttribute('aria-invalid')).toBe('true');
    expect(input?.getAttribute('aria-describedby')?.split(' ')).toEqual([
      'external-description',
      hint?.id,
      error?.id,
    ]);
    expect(error?.getAttribute('role')).toBe('alert');

    const initialId = input?.id;

    act(() => {
      root.render(<Input label="Email address" hint="Use your work email." />);
    });

    expect(container.querySelector('input')?.id).toBe(initialId);
    expect(container.querySelector('input')?.hasAttribute('aria-invalid')).toBe(
      false,
    );

    act(() => root.unmount());
  });

  it('preserves explicit aria-invalid values', () => {
    const container = document.createElement('div');
    const root = createRoot(container);

    act(() => {
      root.render(<Input label="Sentence" aria-invalid="grammar" />);
    });

    expect(container.querySelector('input')?.getAttribute('aria-invalid')).toBe(
      'grammar',
    );

    act(() => root.unmount());
  });
});
