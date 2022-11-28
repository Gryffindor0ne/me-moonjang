import type { GetServerSideProps, NextPage } from 'next';
import { getSession, useSession } from 'next-auth/react';

import Link from 'next/link';

import styles from '../styles/Home.module.css';
import Layout from '@components/layout/Layout';
import Seo from '@components/layout/Seo';

const Home: NextPage = () => {
  const { data: session } = useSession();
  console.log(session, 'HOME SESSION');

  return (
    <div className={styles.container}>
      <Seo title="Home" />

      {session ? mainPage() : gate()}
    </div>
  );
};

const gate = () => {
  return (
    <>
      <Link href="/auth/login" className={styles.main}>
        <span className="text-gray-600 text-4xl font-bold">Me Moonjang</span>
      </Link>

      <footer className={styles.footer}>
        <p>© me-moonjang</p>
      </footer>
    </>
  );
};

const mainPage = () => {
  return (
    <Layout>
      <main className="container mx-auto text-center mt-20 p-5">
        <h3 className="text-4xl font-bold">Me-Moonjang</h3>
      </main>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
};

export default Home;
