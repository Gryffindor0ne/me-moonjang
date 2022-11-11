import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Me-Moonjang</title>
        <meta name="description" content="me-moonjang" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Link href="/auth/login" className={styles.main}>
        <span>Me Moonjang</span>
      </Link>

      <footer className={styles.footer}>
        <p>me-moonjang © 2022. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
