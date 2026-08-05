import { useCallback, useState } from 'react';
import type { ArticleFilters } from '@contracts/index';
import { useFilterDraft } from '@client/features/filter-articles';
import { Button } from '@client/shared/ui/Button';
import { Drawer } from '@client/shared/ui/Drawer';
import { FiltersPanel } from './FiltersPanel';
import styles from './FiltersPanel.module.css';
import { SlidersHorizontal } from 'lucide-react';

export const MobileFilterDrawer = ({
  filters,
  onApply,
}: {
  filters: ArticleFilters;
  onApply: (filters: ArticleFilters) => void;
}) => {
  const [open, setOpen] = useState(false);
  const { draft, setDraft, resetDraft } = useFilterDraft(filters);

  const close = useCallback(() => {
    resetDraft();
    setOpen(false);
  }, [resetDraft]);

  const apply = useCallback(() => {
    onApply(draft);
    setOpen(false);
  }, [draft, onApply]);

  return (
    <>
      <div className={styles.mobileTriggerContainer}>
        <Button type="button" variant="secondary" onClick={() => setOpen(true)}>
          <SlidersHorizontal />
        </Button>
      </div>
      <Drawer open={open} title="Filter articles" onClose={close}>
        <FiltersPanel
          filters={draft}
          onChange={setDraft}
          onReset={() =>
            setDraft({
              query: filters.query,
              sourceIds: [],
              categories: [],
              authors: [],
            })
          }
          onApply={apply}
        />
      </Drawer>
    </>
  );
};
