import { Input } from '@client/shared/ui/Input';
import { useArticleSearch } from '../model/use-article-search';
import { Search } from 'lucide-react';

export const ArticleSearchInput = ({
  query,
  onChange,
}: {
  query: string;
  onChange: (query: string) => void;
}) => {
  const search = useArticleSearch(query, onChange);
  return (
    <Input
      name="article-search"
      aria-label="Search articles"
      placeholder="Search topics, companies, people…"
      type="search"
      endAdornment={<Search strokeWidth={1.8} />}
      value={search.value}
      onChange={(event) => search.setValue(event.target.value)}
    />
  );
};
