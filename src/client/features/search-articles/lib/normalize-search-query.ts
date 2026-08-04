export const normalizeSearchQuery = (value: string): string =>
  value.trim().replace(/\s+/g, ' ').slice(0, 160);
