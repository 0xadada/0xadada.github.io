import type { Metadata } from "next";
import Link from "next/link";
import fs from "fs";
import { join } from "path";
import { read } from "to-vfile";
import { matter } from "vfile-matter";
import { parseFilename } from "../lib/parse-filename";
import DisplayDate from "./components/display-date";
import Header from "./components/header";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "0xADADA, Software Engineer / Writer / Motorsports Driver",
  description: "Writing by 0xADADA",
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "https://0xadada.pub/rss.xml",
    },
  },
};

interface PageMetadata {
  title: string;
  description: string;
  noindex?: true;
}

interface Post {
  title: string;
  description: string;
  filename: string;
  year: string;
  month: string;
  day: string;
  date: Date;
  slug: string;
  url: string;
  noindex?: true;
}

export default async function Home() {
  const docsDir = join(process.cwd(), "docs");
  const filenames = fs.readdirSync(docsDir);
  const files = filenames.map((filename) => ({
    filename: filename,
    filepath: join(docsDir, filename),
  }));
  const unsortedPosts = await Promise.all(
    files.map(async (file) => {
      const markdown = await read(file.filepath);
      matter(markdown, { strip: true });
      const frontmatter = markdown.data.matter as PageMetadata;
      const { year, month, day, date, slug, url } = parseFilename(
        file.filename,
      );
      const post: Post = {
        ...frontmatter,
        title: frontmatter.title,
        description: frontmatter.description,
        filename: file.filename,
        year,
        month,
        day,
        date,
        slug,
        url,
      };
      return post;
    }),
  );
  const posts = unsortedPosts
    .filter((a) => !a.noindex)
    .sort((a, b) => (b.date > a.date ? 1 : -1));
  const postMap = new Map();
  posts.forEach((post) => {
    const postsForYear = postMap.get(post.year) ?? [];
    postMap.set(post.year, [...postsForYear, post]);
  });
  return (
    <>
      <Header />
      <ol className={styles.years}>
        {[...postMap.keys()].map((year) => (
          <li key={year} className={styles.year}>
            <span className={styles.yearLabel}>{year}</span>
            <ol className={styles.posts}>
              {postMap.get(year).map((post: Post) => (
                <li key={post.title} className={styles.post}>
                  <Link href={post.url}>{post.title}</Link>
                  <br />
                  {post.description}
                  <br />
                  <DisplayDate datetime={post.date} />
                </li>
              ))}
            </ol>
          </li>
        ))}
      </ol>
    </>
  );
}
