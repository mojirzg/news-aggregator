import { Skeleton } from '@client/shared/ui/Skeleton';
import styles from './ArticleFeed.module.css';

export const ArticleFeedSkeleton = () => (
  <div className={styles.feed} aria-label="Loading articles" aria-busy="true">
    {[1, 2, 3].map((item) => (
      <div className={styles.skeletonCard} key={item}>
        <Skeleton height={170} />
        <div className={styles.skeletonBody}>
          <Skeleton height={24} width="42%" />
          <Skeleton height={32} width="88%" />
          <Skeleton height={20} />
          <Skeleton height={20} width="75%" />
        </div>
      </div>
    ))}
  </div>
);
