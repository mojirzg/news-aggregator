const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

export const formatPublicationDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  const differenceSeconds = Math.round((date.getTime() - Date.now()) / 1000);
  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ['year', 31_536_000],
    ['month', 2_592_000],
    ['day', 86_400],
    ['hour', 3_600],
    ['minute', 60],
  ];
  for (const [unit, seconds] of units) {
    if (Math.abs(differenceSeconds) >= seconds) return rtf.format(Math.round(differenceSeconds / seconds), unit);
  }
  return 'just now';
};
