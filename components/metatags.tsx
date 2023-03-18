import Head from "next/head";
import { SITENAME, BASEURL } from "../lib/constants";

export default function Metatags({ post }) {
  const url = `${BASEURL}${post.slugs.year}/${post.slugs.month}/${post.slugs.day}/${post.slugs.slug}/`;
  return (
    <Head>
      <meta property="og:site_name" content={SITENAME} />
      <meta property="og:title" content={post.title} />
      <meta name="twitter:title" content={post.title} />
      <link rel="canonical" href={url} />
      <link type="application/rss+xml" rel="alternate" href="/rss.xml" title={SITENAME} />
      <meta property="og:url" content={url} />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@0xadada" />

      <meta name="author" content={post.author || SITENAME} />
      <meta property="og:type" content="article" />

      {post.metaDescription && (
        <>
          <meta name="description" content={post.metaDescription} />
          <meta name="og:description" content={post.metaDescription} />
          <meta name="twitter:description" content={post.metaDescription} />
        </>
      )}

      {post.metaImage && (
        <>
          <meta property="og:image" content={`${BASEURL}${post.metaImage}`} />
          <meta property="og:image:height" content="180" />
          <meta property="og:image:width" content="180" />
          <meta name="twitter:image:height" content="512" />
          <meta name="twitter:image:width" content="512" />
          <meta
            property="twitter:image"
            content={`${BASEURL}${post.metaImage}`}
          />
        </>
      )}
    </Head>
  );
}
