import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { Article } from '@contracts/index';
import { ArticleCard } from '@client/entities/article';
import styles from './ArticleFeed.module.css';

interface ArticleFeedProps {
  articles: Article[];
}

const ESTIMATED_ARTICLE_HEIGHT = 250;
const ARTICLE_GAP = 16;

export const ArticleFeed = ({ articles }: ArticleFeedProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: articles.length,

    getScrollElement: () => scrollContainerRef.current,

    /*
     * Article cards have dynamic heights because titles,
     * descriptions, images, and metadata vary.
     */
    estimateSize: () => ESTIMATED_ARTICLE_HEIGHT + ARTICLE_GAP,

    /*
     * Render a few rows outside the visible viewport so scrolling
     * does not expose blank space.
     */
    overscan: 4,

    /*
     * Article IDs are more stable than array indexes when results
     * change after filtering or refetching.
     */
    getItemKey: (index) => articles[index]?.id ?? index,
  });

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <div ref={scrollContainerRef} className={styles.feedContainer}>
      <section
        className={styles.feed}
        aria-label="News articles"
        style={{
          height: `${virtualizer.getTotalSize()}px`,
        }}
      >
        {virtualItems.map((virtualItem) => {
          const article = articles[virtualItem.index];

          if (!article) {
            return null;
          }

          return (
            <article
              key={article.id}
              ref={virtualizer.measureElement}
              data-index={virtualItem.index}
              className={styles.virtualRow}
              style={{
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <ArticleCard article={article} />
            </article>
          );
        })}
      </section>
    </div>
  );
};
