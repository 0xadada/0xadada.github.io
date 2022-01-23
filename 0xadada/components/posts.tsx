import Link from "next/link";
import DisplayDate from "./display-date.tsx";

export default function Posts({ posts }) {
  return (
    <ol>
      {posts.map(post => {
        const slug = post.slug;
        const year = post.slugs.year;
        const month = post.slugs.month;
        const day = post.slugs.day;
        return (
          <li key={post.title}>
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
