import styles from './PageLoadingSkeleton.module.css';

const SkeletonCard = () => (
  <article className={styles.card} aria-hidden="true">
    <div className={styles.image} />

    <div className={styles.content}>
      <div className={styles.metaRow}>
        <div className={styles.source} />
        <div className={styles.date} />
      </div>

      <div className={styles.title} />
      <div className={styles.titleShort} />

      <div className={styles.description} />
      <div className={styles.descriptionShort} />
    </div>
  </article>
);

export const PageLoadingSkeleton = () => (
  <main
    id="main-content"
    className={styles.page}
    aria-busy="true"
    aria-label="Loading page"
  >
    <span className={styles.visuallyHidden}>Loading page…</span>

    <header className={styles.header}>
      <div>
        <div className={styles.heading} />
        <div className={styles.subheading} />
      </div>

      <div className={styles.action} />
    </header>

    <div className={styles.layout}>
      <aside className={styles.sidebar} aria-hidden="true">
        <div className={styles.sidebarTitle} />

        {Array.from({ length: 4 }, (_, index) => (
          <div className={styles.filterGroup} key={index}>
            <div className={styles.filterLabel} />
            <div className={styles.filterControl} />
          </div>
        ))}
      </aside>

      <section className={styles.feed}>
        <div className={styles.toolbar}>
          <div className={styles.resultsCount} />
          <div className={styles.sortControl} />
        </div>

        <div className={styles.cards}>
          {Array.from({ length: 5 }, (_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </section>
    </div>
  </main>
);
