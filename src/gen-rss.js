import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "path";
import RSS from "rss";
import matter from "gray-matter";
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
      const markdown = await readFile(file.filepath, "utf8");
      const frontmatter = matter(markdown);
      const { date, url } = parseFilename(file.filename);
      return {
        title: frontmatter.data.title,
        description: frontmatter.data.description,
        categories: Array.isArray(frontmatter.data.tags)
          ? frontmatter.data.tags
          : [],
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
