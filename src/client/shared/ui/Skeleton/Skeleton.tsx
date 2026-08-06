import styles from './Skeleton.module.css';

type SkeletonHeight = 20 | 24 | 32 | 170;
type SkeletonWidth = '42%' | '75%' | '88%' | '100%';

const heightClass: Record<SkeletonHeight, string> = {
  20: styles.height20 as string,
  24: styles.height24 as string,
  32: styles.height32 as string,
  170: styles.height170 as string,
};

const widthClass: Record<SkeletonWidth, string> = {
  '42%': styles.width42 as string,
  '75%': styles.width75 as string,
  '88%': styles.width88 as string,
  '100%': styles.width100 as string,
};

export const Skeleton = ({
  height,
  width = '100%',
}: {
  height: SkeletonHeight;
  width?: SkeletonWidth;
}) => (
  <div
    className={`${styles.skeleton} ${heightClass[height]} ${widthClass[width]}`}
    aria-hidden="true"
  />
);
