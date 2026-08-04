import styles from './ArticleToolbar.module.css';

export const ResultsCount = ({ count, fetching }: { count: number; fetching: boolean }) => (
  <span className={styles.count} role="status">{count} {count === 1 ? 'result' : 'results'}{fetching ? ' · refreshing' : ''}</span>
);
