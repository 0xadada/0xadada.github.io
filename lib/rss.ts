import RSS from "rss";
import fs from "fs";
import showdown from "showdown";
import { globals } from "./globals";
import type { PostData } from "./loader";

export const generateRSS = async (posts: PostData[]) => {
  posts.map((post) => {
    if (!post.canonicalUrl)
      throw new Error(
        "Missing canonicalUrl. A canonical URL is required for RSS feed generation. If you don't care about RSS, uncomment `generateRSS(posts)` at the bottom of index.tsx."
      );
    return post;
  });

  const feed = new RSS({
    title: globals.siteName,
    description: globals.siteDescription,
    feed_url: `${globals.url}/rss.xml`,
    site_url: globals.url,
    image_url: `${globals.url}/favicon.ico`,
    managingEditor: globals.email,
    webMaster: globals.email,
    copyright: `${new Date().getFullYear()} ${globals.yourName}`,
    language: "en",
    pubDate: globals.siteCreationDate,
    ttl: 60,
  });

  let isValid = true;
  for (const post of posts) {
    const converter = new showdown.Converter();
    const html = converter.makeHtml(post.content);
    if (!post.date) {
      isValid = false;
      console.warn(
        "All posts must have a publishedDate timestamp when generating RSS feed."
      );
      console.warn("Not generating rss.xml.");
    }
    let postPath = post.path.replace('-', '/');
    postPath = postPath.replace('-', '/');
    postPath = postPath.replace('-', '/');
    feed.item({
      title: post.title,
      description: html,
      url: `${globals.url}/${postPath}`,
      categories: post.tags || [],
      author: post.author || "anonymous",
      date: new Date(post.date || 0).toISOString(),
    });
  }

  if (!isValid) return;

  // writes RSS.xml to public directory
  const path = `${process.cwd()}/public/rss.xml`;
  fs.writeFileSync(path, feed.xml(), "utf8");
  console.log(`generated RSS feed`);
};
