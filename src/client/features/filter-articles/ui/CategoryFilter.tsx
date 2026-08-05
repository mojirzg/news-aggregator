import type { ArticleFilters, Category } from '@contracts/index';
import { categoryOptions } from '@client/shared/config/constants';
import { Checkbox } from '@client/shared/ui/Checkbox';

export const CategoryFilter = ({
  filters,
  onChange,
}: {
  filters: ArticleFilters;
  onChange: (next: ArticleFilters) => void;
}) => {
  const toggle = (id: Category) => {
    const categories = filters.categories.includes(id)
      ? filters.categories.filter((category) => category !== id)
      : [...filters.categories, id];
    onChange({ ...filters, categories });
  };

  return (
    <div style={{ display: 'grid', gap: 6 }}>
      {categoryOptions.map((option) => (
        <Checkbox
          key={option.id}
          label={option.label}
          checked={filters.categories.includes(option.id)}
          onChange={() => toggle(option.id)}
        />
      ))}
    </div>
  );
};
