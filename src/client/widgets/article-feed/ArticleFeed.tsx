import type { Article } from '@contracts/index';
import { ArticleCard } from '@client/entities/article';
import styles from './ArticleFeed.module.css';

interface ArticleFeedProps {
  articles: Article[];
}

export const ArticleFeed = ({ articles }: ArticleFeedProps) => (
  <section className={styles.feed} aria-label="News articles">
    {articles.map((article) => (
      <ArticleCard key={article.id} article={article} />
    ))}
  </section>
);
