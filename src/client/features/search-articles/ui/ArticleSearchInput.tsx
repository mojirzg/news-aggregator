import { Input } from '@client/shared/ui/Input';
import { useArticleSearch } from '../model/use-article-search';

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
      aria-label="Search articles"
      placeholder="Search topics, companies, people…"
      type="search"
      value={search.value}
      onChange={(event) => search.setValue(event.target.value)}
    />
  );
};
