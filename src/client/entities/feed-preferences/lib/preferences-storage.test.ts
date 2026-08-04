// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import {
  clearPreferences,
  hasConfiguredPreferences,
  readPreferences,
  writePreferences,
} from './preferences-storage';

beforeEach(() => window.localStorage.clear());

describe('preferences storage', () => {
  it('persists and validates versioned preferences', () => {
    writePreferences({
      schemaVersion: 1,
      sourceIds: ['nyt'],
      categories: ['science'],
      authors: ['Priya'],
    });
    expect(readPreferences()).toEqual({
      schemaVersion: 1,
      sourceIds: ['nyt'],
      categories: ['science'],
      authors: ['Priya'],
    });
  });

  it('recovers from invalid storage payloads', () => {
    window.localStorage.setItem(
      'signal-news:feed-preferences',
      '{"schemaVersion":99}',
    );
    expect(readPreferences()).toEqual({
      schemaVersion: 1,
      sourceIds: [],
      categories: [],
      authors: [],
    });
  });

  it('reports whether a personalized feed is configured', () => {
    expect(hasConfiguredPreferences(readPreferences())).toBe(false);
    writePreferences({
      schemaVersion: 1,
      sourceIds: [],
      categories: [],
      authors: ['Maya'],
    });
    expect(hasConfiguredPreferences(readPreferences())).toBe(true);
    clearPreferences();
  });
});
