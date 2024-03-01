interface PostParameters {
  year: string;
  month: string;
  day: string;
  date: Date;
  slug: string;
  url: string;
}

export function parseFilename(filename: string): PostParameters;
