import { describe, expect, it } from 'vitest';
import { getDateRangeError } from './get-date-range-error';

describe('getDateRangeError', () => {
  it('accepts missing, equal, and ascending dates', () => {
    expect(getDateRangeError({})).toBeNull();
    expect(
      getDateRangeError({ dateFrom: '2026-01-01', dateTo: '2026-01-01' }),
    ).toBeNull();
    expect(
      getDateRangeError({ dateFrom: '2026-01-01', dateTo: '2026-01-02' }),
    ).toBeNull();
  });

  it('rejects a descending range', () => {
    expect(
      getDateRangeError({ dateFrom: '2026-01-02', dateTo: '2026-01-01' }),
    ).toBe('The start date must be on or before the end date.');
  });
});
