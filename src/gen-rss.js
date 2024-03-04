import { readdir, writeFile } from "node:fs/promises";
import { join } from "path";
import RSS from "rss";
import { read } from "to-vfile";
import { matter } from "vfile-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkSlug from "remark-slug";
import remarkSmartypants from "remark-smartypants";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { parseFilename } from "./lib/parse-filename.js";

async function generate() {
  const feed = new RSS({
    title: "0xADADA",
    site_url: "https://0xadada.pub",
    feed_url: "https://0xadada.pub/rss.xml",
  });

  const docsDir = join(process.cwd(), "docs");
  const filenames = await readdir(docsDir);
  const files = filenames.map((filename) => ({
    filename: filename,
    filepath: join(docsDir, filename),
  }));

  const unsortedPosts = await Promise.all(
    files.map(async (file) => {
      const markdown = await read(file.filepath);
      matter(markdown, { strip: true });
      const {
        data: { matter: frontmatter },
      } = markdown;
      const content = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkSlug)
        .use(remarkSmartypants)
        .use(remarkRehype)
        .use(rehypeStringify)
        .process(markdown);

      const { date, url } = parseFilename(file.filename);
      return {
        title: frontmatter.title,
        description: content,
        categories: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
        author: "0xADADA",
        url: `https://0xadada.pub/${url}/`,
        date,
      };
    }),
  );
  const posts = unsortedPosts.sort((a, b) => (b.date > a.date ? 1 : -1));
  posts.map((post) => {
    feed.item(post);
  });

  await writeFile("./public/rss.xml", feed.xml({ indent: true }));
}

generate();
