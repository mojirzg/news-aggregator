import type { ProviderId } from '@contracts/index';
import type { FeedPreferences } from '@client/entities/feed-preferences';
import { providerOptions } from '@client/shared/config/constants';
import { Checkbox } from '@client/shared/ui/Checkbox';
import styles from './PreferencesForm.module.css';

export const SourcePreferences = ({
  value,
  onChange,
}: {
  value: FeedPreferences;
  onChange: (next: FeedPreferences) => void;
}) => {
  const toggle = (id: ProviderId) =>
    onChange({
      ...value,
      sourceIds: value.sourceIds.includes(id)
        ? value.sourceIds.filter((item: ProviderId) => item !== id)
        : [...value.sourceIds, id],
    });
  return (
    <div className={styles.options}>
      {providerOptions.map((option) => (
        <Checkbox
          key={option.id}
          label={option.label}
          checked={value.sourceIds.includes(option.id)}
          onChange={() => toggle(option.id)}
        />
      ))}
    </div>
  );
};
