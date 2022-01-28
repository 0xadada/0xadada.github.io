import type { NextPage } from 'next'
import Head from 'next/head'
import { getAllPosts } from '../lib/api'
import Layout from '../components/layout';
import Posts from '../components/posts';
import Header from '../components/header';
import styles from './index.module.css'

export async function getStaticProps() {
  const posts = getAllPosts([
    'date',
    'metaDescription',
    'title',
  ])

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
