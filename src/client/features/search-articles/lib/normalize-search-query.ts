export const normalizeSearchQuery = (value: string) =>
  value.trim().replace(/\s+/g, ' ').slice(0, 160);
