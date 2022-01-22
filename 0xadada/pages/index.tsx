import Head from 'next/head'
import Image from 'next/image'
import Layout from '../components/layout';
import styles from './index.module.css'
import type { NextPage } from 'next'

const Index: NextPage = () => {
  return (
    <>
      <Head>
        <title>0xADADA</title>
      </Head>
      <Layout>
        <h1>
          0xADADA
        </h1>
      </Layout>
    </>
  )
}

export default Index
