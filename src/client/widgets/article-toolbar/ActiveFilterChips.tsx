import type { ArticleFilters } from '@contracts/index';
import {
  categoryOptions,
  providerOptions,
} from '@client/shared/config/constants';
import { Chip } from '@client/shared/ui/Chip';

export const ActiveFilterChips = ({
  filters,
  onChange,
}: {
  filters: ArticleFilters;
  onChange: (next: ArticleFilters) => void;
}) => (
  <>
    {filters.sourceIds.map((id) => (
      <Chip
        key={id}
        onRemove={() =>
          onChange({
            ...filters,
            sourceIds: filters.sourceIds.filter((item) => item !== id),
          })
        }
      >
        {providerOptions.find((option) => option.id === id)?.label ?? id}
      </Chip>
    ))}
    {filters.categories.map((id) => (
      <Chip
        key={id}
        onRemove={() =>
          onChange({
            ...filters,
            categories: filters.categories.filter((item) => item !== id),
          })
        }
      >
        {categoryOptions.find((option) => option.id === id)?.label ?? id}
      </Chip>
    ))}
    {filters.dateFrom ? (
      <Chip onRemove={() => onChange({ ...filters, dateFrom: undefined })}>
        From {filters.dateFrom}
      </Chip>
    ) : null}
    {filters.dateTo ? (
      <Chip onRemove={() => onChange({ ...filters, dateTo: undefined })}>
        To {filters.dateTo}
      </Chip>
    ) : null}
  </>
);
