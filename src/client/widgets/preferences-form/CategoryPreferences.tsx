import type { Category } from '@contracts/index';
import type { FeedPreferences } from '@client/entities/feed-preferences';
import { categoryOptions } from '@client/shared/config/constants';
import { Checkbox } from '@client/shared/ui/Checkbox';
import styles from './PreferencesForm.module.css';

export const CategoryPreferences = ({
  value,
  onChange,
}: {
  value: FeedPreferences;
  onChange: (next: FeedPreferences) => void;
}) => {
  const toggle = (id: Category) =>
    onChange({
      ...value,
      categories: value.categories.includes(id)
        ? value.categories.filter((item: Category) => item !== id)
        : [...value.categories, id],
    });
  return (
    <div className={styles.options}>
      {categoryOptions.map((option) => (
        <Checkbox
          key={option.id}
          label={option.label}
          checked={value.categories.includes(option.id)}
          onChange={() => toggle(option.id)}
        />
      ))}
    </div>
  );
};
