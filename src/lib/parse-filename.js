export function parseFilename(filename) {
  const name = filename.replace(/\.md$/, "");
  const year = name.slice(0, 4);
  const month = name.slice(5, 7);
  const day = name.slice(8, 10);
  const date = new Date(+year, +month - 1, +day);
  const slug = name.slice(11);
  const url = [year, month, day, slug].join("/");
  return {
    year,
    month,
    day,
    date,
    slug,
    url,
  };
}
