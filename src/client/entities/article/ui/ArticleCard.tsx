import type { Article } from '@contracts/index';
import { ArticleImage } from './ArticleImage';
import { ArticleMetadata } from './ArticleMetadata';
import styles from './ArticleCard.module.css';

interface ArticleCardProps {
  article: Article;
  isAboveTheFold?: boolean;
}

export const ArticleCard = ({
  article,
  isAboveTheFold = false,
}: ArticleCardProps) => (
  <article className={styles.card}>
    <ArticleImage
      className={styles.image}
      article={article}
      isAboveTheFold={isAboveTheFold}
    />
    <div className={styles.content}>
      <ArticleMetadata article={article} />
      <h2 className={styles.title}>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${article.title} (opens in a new tab)`}
        >
          {article.title}
        </a>
      </h2>
      {article.description ? (
        <p className={styles.description}>{article.description}</p>
      ) : null}
      <footer className={styles.footer}>
        <div className={styles.tags}>
          {article.categories.map((category) => (
            <span className={styles.tag} key={category}>
              {category}
            </span>
          ))}
        </div>
        {article.authors.length > 0 ? (
          <span className={styles.author}>
            By {article.authors.join(', ')}
          </span>
        ) : null}
      </footer>
    </div>
  </article>
);
