import { GetStaticPaths, GetStaticProps, GetStaticPropsResult } from "next";
import Head from "next/head";
import Layout from "../../../../components/layout";
import DisplayDate from "../../../../components/display-date";
import PostContent from "../../../../components/post-content";
import Byline from "../../../../components/byline";
import { getPostBySlug, getAllPosts } from "../../../../lib/api";
import markdownToHtml from "../../../../lib/markdown-to-html";
import { SITENAME, BASEURL } from "../../../../lib/constants";

export async function getStaticProps({ params }) {
  const filename = `${params.year}-${params.month}-${params.day}-${params.slug}`;
  const post = getPostBySlug(filename, [
    "title",
    "date",
    "author",
    "content",
    "slug"
  ]);
  debugger;
  const content = await markdownToHtml(post.content || "");

  return {
    props: {
      post: {
        ...post,
        content
      }
    }
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = getAllPosts(["slug"]);

  const paths = posts.map(post => {
    return {
      params: {
        year: post.slugs.year,
        month: post.slugs.month,
        day: post.slugs.day,
        slug: post.slugs.slug
      }
    };
  });
  return {
    paths,
    fallback: false
  };
};

export default function Post({ post }) {
  return (
    <>
      <Head>
        <title>{post.title}</title>
        <link rel="canonical" href={`${BASEURL}TODO`} />
        <meta name="author" content={post.author || SITENAME} />
      </Head>
      <Layout>
        <article className="hentry h-entry">
          <header>
            <h1 className="entry-title p-name">{post.title}</h1>
            <DisplayDate datetime={post.date} />
            <br />
            <Byline author={{ name: post.author }} />
          </header>
          <PostContent content={post.content} />
        </article>
      </Layout>
    </>
  );
}
