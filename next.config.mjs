import createMDX from "@next/mdx";
import remarkGfm from "remark-gfm";

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = withMDX({
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  // Configure `pageExtensions` to include MDX files
  pageExtensions: ["mdx", "md", "js", "jsx", "ts", "tsx"],
});

export default nextConfig;
