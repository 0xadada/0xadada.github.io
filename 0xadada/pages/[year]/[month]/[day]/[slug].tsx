import { GetStaticPaths, GetStaticProps, GetStaticPropsResult } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import Layout from "../../../../components/layout.tsx";
import { getPostBySlug, getAllPosts } from "../../../../lib/api";
import markdownToHtml from "../../../../lib/markdown-to-html";

export async function getStaticProps({ params }) {
  const filename = `${params.year}-${params.month}-${params.day}-${params.slug}`;
  const post = getPostBySlug(filename, [
    "title",
    "date",
    "author",
    "content",
    "slug"
  ]);
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
  console.log(paths);
  debugger;
  return {
    paths,
    fallback: false
  };
};

export default function Post({ post, morePosts, preview }) {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>{post.title}</title>
        <link rel="canonical" href="https://0xadada.pub/TODO" />
        <meta name="author" content={post.author || "0xADADA"} />
      </Head>
      <Layout>
        <>
          title {post.title}
          date {post.date}
          author {post.author}
        </>
      </Layout>
    </>
  );
}
