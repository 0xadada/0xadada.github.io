import Link from 'next/link';
import Head from 'next/head';
import Footer from './footer';
import styles from './layout.module.css';
import { BASEURL, POCKET_SITE_VERIFICATION } from '../lib/constants';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href={`${BASEURL}favicon.ico`} />
        <link rel="home" href={BASEURL} />
        <link
          rel="manifest"
          href={`${BASEURL}static/images/meta/0xadada.webmanifest`}
        />
        <link
          rel="apple-touch-icon"
          href={`${BASEURL}static/images/meta/apple-touch-icon.png`}
        />
        <link
          rel="icon"
          type="image/png"
          href={`${BASEURL}static/images/meta/favicon-32x32.png`}
          sizes="32x32"
        />
        <link
          rel="icon"
          type="image/png"
          href={`${BASEURL}static/images/meta/favicon-16x16.png`}
          sizes="16x16"
        />
        <link
          rel="mask-icon"
          href={`${BASEURL}static/images/meta/safari-pinned-tab.svg`}
          color="#5bbad5"
        />
        <meta
          name="msapplication-config"
          content={`${BASEURL}static/images/meta/browserconfig.xml`}
        />
        <meta name="theme-color" content="#FDF9F0" />
        <meta
          name="pocket-site-verification"
          content={POCKET_SITE_VERIFICATION}
        />
      </Head>
      <main className={styles.layout}>{children}</main>
      <div className={styles.layout}>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
