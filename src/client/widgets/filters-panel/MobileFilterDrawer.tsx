import type { ArticleFilters } from '@contracts/index';
import { Drawer } from '@client/shared/ui/Drawer';
import { FiltersPanel } from './FiltersPanel';

interface MobileFilterDrawerProps {
  open: boolean;
  filters: ArticleFilters;
  onChange: (filters: ArticleFilters) => void;
  onApply: () => void;
  onReset: () => void;
  onClose: () => void;
}

export const MobileFilterDrawer = ({
  open,
  filters,
  onChange,
  onApply,
  onReset,
  onClose,
}: MobileFilterDrawerProps) => {
  return (
    <>
      <Drawer open={open} title="Filter articles" onClose={onClose}>
        <FiltersPanel
          filters={filters}
          onChange={onChange}
          onReset={onReset}
          onApply={onApply}
        />
      </Drawer>
    </>
  );
};
