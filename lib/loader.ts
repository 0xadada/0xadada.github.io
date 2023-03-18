import matter from "gray-matter";
import glob from "glob";
import { globals } from "./globals";

const fsSync = require("fs");
const { promisify } = require("util")
const fs = {
  readFile: promisify(fsSync.readFile),
};

export type PostData = {
  path: string;
  locale: string;
  title: string;
  subtitle?: string;
  content: string;
  description?: string;
  canonicalUrl?: string;
  published: boolean;
  date: string;
  author?: string;
  authorPhoto?: string;
  authorTwitter?: string;
  tags?: string[];
  bannerPhoto?: string;
  thumbnailPhoto?: string;
};

type RawFile = { path: string; contents: string };

export const loadMarkdownFile = async (path: string): Promise<RawFile> => {
  const fullPath = `_posts/${path}`;
  const mdFile = await fs.readFile(fullPath, "utf-8");
  return { path, contents: mdFile };
};

export const mdToPost = (file: RawFile): PostData => {
  const metadata = matter(file.contents);
  const path = file.path.replace(".md", "");
  const post = {
    path,
    locale: metadata.data.locale || "en-US",
    title: metadata.data.title,
    subtitle: metadata.data.displayTitle || null,
    published: metadata.data.published || true,
    date: metadata.data.date || null,
    tags: metadata.data.tags || null,
    description: metadata.data.description || null,
    canonicalUrl: metadata.data.canonicalUrl || `${globals.url}/${path}`,
    author: metadata.data.author || null,
    authorPhoto: metadata.data.authorPhoto || null,
    authorTwitter: metadata.data.authorTwitter || null,
    bannerPhoto: metadata.data.bannerPhoto || null,
    thumbnailPhoto: metadata.data.thumbnailPhoto || null,
    content: metadata.content,
  };

  if (!post.title) throw new Error(`Missing required field: title.`);

  if (!post.content) throw new Error(`Missing required field: content.`);

  if (!post.date)
    throw new Error(`Missing required field: date.`);

  return post as PostData;
};

export const loadMarkdownFiles = async (path: string) => {
  const blogPaths = glob.sync(`_posts/${path}`);
  const postDataList = await Promise.all(
    blogPaths.map((blogPath) => {
      const modPath = blogPath.slice(blogPath.indexOf(`_posts/`) + 7);
      return loadMarkdownFile(`${modPath}`);
    })
  );
  return postDataList;
};

export const loadPost = async (path: string): Promise<PostData> => {
  const file = await loadMarkdownFile(path);
  return mdToPost(file);
};

export const loadBlogPosts = async (): Promise<PostData[]> => {
  return await (
    await loadMarkdownFiles(`*.md`)
  )
    .map(mdToPost)
    .filter((p) => p.published)
    .sort(
      (a, b) =>
        (new Date(b.datePublished).getTime() || 0) -
        (new Date(a.datePublished).getTime() || 0)
    );
};
