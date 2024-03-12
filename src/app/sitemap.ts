import { MetadataRoute } from "next";
import fs from "fs";
import { join } from "path";
import { parseFilename } from "../lib/parse-filename";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const docsDir = join(process.cwd(), "docs");
  const filenames = fs.readdirSync(docsDir);
  const files = filenames
    .filter((name) => name.match(/^\d{4}/))
    .map((filename) => ({
      filename: filename,
      filepath: join(docsDir, filename),
    }));
  const unsortedPosts = await Promise.all(
    files.map(async (file) => {
      const { date, url } = parseFilename(file.filename);
      return { date, url };
    }),
  );
  const posts = unsortedPosts.sort((a, b) => (b.date > a.date ? 1 : -1));
  const sitemap: MetadataRoute.Sitemap = [
    {
      url: "https://0xadada.pub/",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
  posts.map((post) =>
    sitemap.push({
      url: `https://0xadada.pub/${post.url}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    }),
  );

  return sitemap;
}
