import Link from "next/link";
import DisplayDate from "./display-date.tsx";
import styles from "./posts.module.css";

export default function Posts({ posts }) {
  return (
    <ol className={styles.index}>
      {posts.map(post => {
        const year = post.slugs.year;
        const month = post.slugs.month;
        const day = post.slugs.day;
        const slug = post.slugs.slug;
        return (
          <li key={post.title} className={styles.item}>
            <Link
              href={{
                pathname: "/[year]/[month]/[day]/[slug]",
                query: { year, month, day, slug }
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
