const attributionNames = [
  'Associated Press',
  'AP',
  'Agence France-Presse',
  'AFP',
  'Reuters',
  'Guardian staff reporter',
  'The Guardian',
  'The New York Times',
];

const attributionPattern = new RegExp(
  `(?:,|\\(|\\s+-\\s+)\\s*(?:${attributionNames
    .map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|')})\\)?\\.?$`,
  'i',
);

const agencyOnlyPattern = new RegExp(
  `^(?:${[...attributionNames, 'agencies']
    .map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|')})$`,
  'i',
);

export const normalizeAuthorKey = (value: string): string =>
  value.trim().replace(/\s+/g, ' ').toLocaleLowerCase('en-US');

const cleanByline = (value: string): string =>
  value
    .replace(/<[^>]*>/g, ' ')
    .replace(/^\s*by\s+/i, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(attributionPattern, '')
    .trim();

const splitByline = (value: string): string[] => {
  const collaborationSegments = value.split(/\s+(?:and|&)\s+|\s*;\s*|\s*\|\s*/i);

  return collaborationSegments.flatMap((segment) => {
    const commaSegments = segment.split(/\s*,\s*/);
    const isAuthorList =
      commaSegments.length > 1 &&
      commaSegments.every((part) => part.trim().split(/\s+/).length >= 2);

    return isAuthorList ? commaSegments : [segment];
  });
};

export const normalizeProviderAuthors = (
  value?: string | null,
): string[] => {
  if (!value?.trim()) {
    return [];
  }

  const seen = new Set<string>();

  return splitByline(cleanByline(value))
    .map((author) => author.replace(/^\s*by\s+/i, '').trim())
    .filter((author) => author.length > 0 && !agencyOnlyPattern.test(author))
    .filter((author) => {
      const key = normalizeAuthorKey(author);
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
};
