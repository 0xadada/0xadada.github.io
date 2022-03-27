import Link from 'next/link';
import DisplayDate from './display-date';
import styles from './posts.module.css';

export default function Posts({ posts }) {
  const uniqYears: string[] = [];
  posts.forEach(
    (post) =>
      !uniqYears.includes(post.slugs.year) && uniqYears.push(post.slugs.year)
  );
  const postsByYears = {};
  uniqYears.forEach((year) => {
    postsByYears[year] = posts.filter((post) => post.slugs.year === year);
  });
  return (
    <ol className={styles.years}>
      {uniqYears.map((year) => (
        <li key={year} className={styles.yearItem}>
          <span>{year}</span>
          <ol className={styles.index}>
            {postsByYears[year].map((post) => {
              const year = post.slugs.year;
              const month = post.slugs.month;
              const day = post.slugs.day;
              const slug = post.slugs.slug;

              return (
                <li key={post.title} className={styles.item}>
                  <Link
                    href={{
                      pathname: '/[year]/[month]/[day]/[slug]',
                      query: { year, month, day, slug },
                    }}
                  >
                    {post.title}
                  </Link>
                  <br />
                  <span>{post.metaDescription}</span>
                  <br />
                  <DisplayDate datetime={post.date} />
                </li>
              );
            })}
          </ol>
        </li>
      ))}
    </ol>
  );

  return (
    <ol className={styles.index}>
      {posts.map((post) => {
        const year = post.slugs.year;
        const month = post.slugs.month;
        const day = post.slugs.day;
        const slug = post.slugs.slug;
        return (
          <li key={post.title} className={styles.item}>
            <Link
              href={{
                pathname: '/[year]/[month]/[day]/[slug]',
                query: { year, month, day, slug },
              }}
            >
              {post.title}
            </Link>
            <br />
            <span>{post.metaDescription}</span>
            <br />
            <DisplayDate datetime={post.date} />
          </li>
        );
      })}
    </ol>
  );
}
