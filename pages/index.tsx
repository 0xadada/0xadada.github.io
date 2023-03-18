import type { NextPage } from 'next'
import Head from 'next/head'
import { getAllPosts } from '../lib/api'
import { generateRSS } from "../lib/rss";
import { loadBlogPosts } from "../lib/loader";
import Layout from '../components/layout';
import Posts from '../components/posts';
import Header from '../components/header';

import styles from './index.module.css'

export async function getStaticProps() {
  const rssPosts = await loadBlogPosts();
  await generateRSS(rssPosts); // comment out to disable RSS generation

  // gather site posts
  const posts = getAllPosts([
    'date',
    'metaDescription',
    'title',
  ]);


  return {
    props: { posts },
  }
}

const Index: NextPage = ({ posts }) => {
  return (
    <>
      <Head>
        <title>0xADADA</title>
      </Head>
      <Layout>
        <Header />
        <Posts posts={posts} />
      </Layout>
    </>
  );
}
export default Index;
