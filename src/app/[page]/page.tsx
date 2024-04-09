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
import type { Metadata } from "next";

interface PageMetadata {
  title: string;
  subtitle?: string;
  description?: string;
  displayTitle?: string;
  image?: string;
}

export async function generateStaticParams() {
  const docsDir = join(process.cwd(), "docs");
  const slugs = fs.readdirSync(docsDir);
  const posts = slugs
    .filter((slug) => !slug.match(/^\d{4}/))
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "");
      return {
        page: slug,
      };
    });
  return posts;
}

interface PageProps {
  params: {
    page: string;
  };
}

export async function generateMetadata({
  params: { page },
}: PageProps): Promise<Metadata> {
  const docsDir = join(process.cwd(), "docs");
  const filename = `${page}.md`;
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
    description: frontmatter.subtitle || frontmatter.description,
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.description,
      url: `${page}`,
      siteName: "0xADADA",
      locale: "en_US",
      type: "article",
      ...images,
    },
  };
}

export default async function Page({ params: { page } }: PageProps) {
  const docsDir = join(process.cwd(), "docs");
  let filename = `${page}.md`;
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

  return (
    <article className="hentry h-entry">
      <header>
        <h1 className="entry-title p-name">{frontmatter.title}</h1>
        {frontmatter.subtitle && <h2>{frontmatter.subtitle}</h2>}
      </header>
      <div className="entry-content e-content">{content}</div>
    </article>
  );
}
