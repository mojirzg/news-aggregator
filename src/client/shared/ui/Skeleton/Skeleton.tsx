import styles from './Skeleton.module.css';

export const Skeleton = ({ height, width = '100%' }: { height: number; width?: string }) => (
  <div className={styles.skeleton} aria-hidden="true" style={{ height, width }} />
);
