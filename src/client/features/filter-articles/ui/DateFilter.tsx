import type { ArticleFilters } from '@contracts/index';
import { Input } from '@client/shared/ui/Input';

export const DateFilter = ({ filters, onChange }: { filters: ArticleFilters; onChange: (next: ArticleFilters) => void }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
    <Input label="From" type="date" value={filters.dateFrom ?? ''} onChange={(event) => onChange({ ...filters, dateFrom: event.target.value || undefined })} />
    <Input label="To" type="date" value={filters.dateTo ?? ''} min={filters.dateFrom} onChange={(event) => onChange({ ...filters, dateTo: event.target.value || undefined })} />
  </div>
);
