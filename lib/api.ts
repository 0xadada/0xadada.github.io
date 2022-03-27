import fs from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

const postsDirectory = join(process.cwd(), '_posts');

function getPostFilenames() {
  return fs.readdirSync(postsDirectory);
}

export function getPostBySlug(slug: string, fields = []) {
  const realSlug = slug.replace(/\.md$/, '');
  const year = realSlug.slice(0, 4);
  const month = realSlug.slice(5, 7);
  const day = realSlug.slice(8, 10);
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const items = {
    slugs: {
      year,
      month,
      day,
      slug: realSlug.slice(11),
    },
  };

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === 'slug') {
      items[field] = realSlug;
    }
    if (field === 'content') {
      items[field] = content;
    }
    if (typeof data[field] !== 'undefined') {
      // coherce all non-undefined values
      items[field] = data[field];
    }
    if (field === 'date') {
      // coherce date into unix date
      items[field] = data[field].getTime();
    }
  });
  return items;
}

export function getAllPosts(fields = []) {
  const slugs = getPostFilenames();
  const posts = slugs
    .map((slug) => getPostBySlug(slug, fields))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}
