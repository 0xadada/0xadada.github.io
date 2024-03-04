import fs from "fs";
import { join } from "path";
import { compileMDX } from "next-mdx-remote/rsc";
import { read } from "to-vfile";
import { matter } from "vfile-matter";
import remarkGfm from "remark-gfm";
import remarkSmartypants from "remark-smartypants";
import remarkSlug from "remark-slug";
// @ts-ignore
import rehypeFigure from "rehype-figure";
import DisplayDate from "../../../../components/display-date";
import License from "../../../../components/license";
import styles from "./page.module.css";
import type { Metadata } from "next";

interface PageMetadata {
  title: string;
  description?: string;
  displayTitle?: string;
  license?: "cc-by-nc-sa" | "cc-by-sa" | "cc-by";
  image?: string;
  tags?: Array<string>;
}

export async function generateStaticParams() {
  const docsDir = join(process.cwd(), "docs");
  const slugs = fs.readdirSync(docsDir);
  const posts = slugs.map((filename) => {
    const name = filename.replace(/\.md$/, "");
    const year = name.slice(0, 4);
    const month = name.slice(5, 7);
    const date = name.slice(8, 10);
    const slug = name.slice(11);
    return {
      year,
      month,
      date,
      slug,
    };
  });
  return posts;
}

export async function generateMetadata({
  params: { year, month, date, slug },
}: PageProps): Promise<Metadata> {
  const docsDir = join(process.cwd(), "docs");
  const filename = `${[year, month, date, slug].join("-")}.md`;
  const filePath = join(docsDir, filename);
  const markdown = await read(filePath);
  matter(markdown, { strip: true });
  const frontmatter = markdown.data.matter as PageMetadata;
  const images = frontmatter.image
    ? {
        images: [
          {
            url: frontmatter.image,
            width: 800,
            height: 800,
          },
        ],
      }
    : {
        images: [
          {
            url: "/static/images/meta/avatar.svg",
            width: 660,
            height: 660,
          },
        ],
      };
  return {
    title: frontmatter.title,
    description: frontmatter.description,
    keywords: frontmatter.tags,
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.description,
      url: `${year}/${month}/${date}/${slug}/`,
      siteName: "0xADADA",
      locale: "en_US",
      type: "article",
      ...images,
    },
  };
}

interface PageProps {
  params: {
    year: string;
    month: string;
    date: string;
    slug: string;
  };
}
export default async function Page({
  params: { year, month, date, slug },
}: PageProps) {
  const docsDir = join(process.cwd(), "docs");
  const filename = `${[year, month, date, slug].join("-")}.md`;
  const filePath = join(docsDir, filename);
  const markdown = fs.readFileSync(filePath, "utf8");
  const { content, frontmatter } = await compileMDX<PageMetadata>({
    source: markdown,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        // @ts-expect-error
        remarkPlugins: [remarkGfm, remarkSlug, remarkSmartypants],
        rehypePlugins: [rehypeFigure],
      },
    },
  });
  const postDate = new Date(+year, +month - 1, +date);

  return (
    <article className="hentry h-entry">
      <header>
        <h1 className="entry-title p-name">{frontmatter.title}</h1>
        <DisplayDate datetime={postDate} />
        <span className={`h-card ${styles.byline}`}>
          {" by "}
          <span className="fn p-author p-name">0xADADA</span>
        </span>
      </header>
      <div className="entry-content e-content">{content}</div>
      <License license={frontmatter.license} />
    </article>
  );
}
