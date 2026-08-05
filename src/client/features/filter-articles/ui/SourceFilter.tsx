import type { ArticleFilters, ProviderId } from '@contracts/index';
import { providerOptions } from '@client/shared/config/constants';
import { Checkbox } from '@client/shared/ui/Checkbox';

export const SourceFilter = ({
  filters,
  onChange,
}: {
  filters: ArticleFilters;
  onChange: (next: ArticleFilters) => void;
}) => {
  const toggle = (id: ProviderId) => {
    const sourceIds = filters.sourceIds.includes(id)
      ? filters.sourceIds.filter((sourceId) => sourceId !== id)
      : [...filters.sourceIds, id];
    onChange({ ...filters, sourceIds });
  };

  return (
    <div style={{ display: 'grid', gap: 6 }}>
      {providerOptions.map((option) => (
        <Checkbox
          key={option.id}
          label={option.label}
          checked={filters.sourceIds.includes(option.id)}
          onChange={() => toggle(option.id)}
        />
      ))}
    </div>
  );
};
