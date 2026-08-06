import { Input } from '@client/shared/ui/Input';
import { Search } from 'lucide-react';

export const ArticleSearchInput = ({
  query,
  onChange,
}: {
  query: string;
  onChange: (query: string) => void;
}) => (
  <Input
    name="article-search"
    aria-label="Search articles"
    placeholder="Search topics, companies, people…"
    type="search"
    endAdornment={<Search strokeWidth={1.8} />}
    value={query}
    maxLength={160}
    onChange={(event) => onChange(event.target.value)}
  />
);
