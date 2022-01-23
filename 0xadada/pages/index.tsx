import type { NextPage } from 'next'
import Head from 'next/head'
import { getAllPosts } from '../lib/api'
import Layout from '../components/layout';
import Posts from '../components/posts';
import styles from './index.module.css'

export async function getStaticProps() {
  const posts = getAllPosts([
    'title',
    'date'
  ])

  debugger;
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
        <Posts posts={posts} />
      </Layout>
    </>
  );
}
export default Index;
