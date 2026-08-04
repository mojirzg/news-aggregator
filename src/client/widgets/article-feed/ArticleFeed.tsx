import type { Article } from '@contracts/index';
import { ArticleCard } from '@client/entities/article';
import styles from './ArticleFeed.module.css';

export const ArticleFeed = ({ articles }: { articles: Article[] }) => (
  <section className={styles.feed} aria-label="News articles">
    {articles.map((article) => <ArticleCard article={article} key={article.id} />)}
  </section>
);
