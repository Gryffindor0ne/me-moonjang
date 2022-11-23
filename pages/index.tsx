import type { NextPage } from 'next';
import { getSession, signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';

import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  const { data: session } = useSession();
  console.log(session, 'HOME SESSION');

  return (
    <div className={styles.container}>
      <Head>
        <title>Me-Moonjang</title>
        <meta name="description" content="me-moonjang" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {session ? mainPage({ session }) : gate()}
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

const mainPage = ({ session }: any) => {
  return (
    <main className="container mx-auto text-center mt-20">
      <h3 className="text-4xl font-bold">Me-Moonjang</h3>

      <div className="details">
        <h5>{session.user.name}</h5>
        <h5>{session.user.email}</h5>
      </div>

      <div className="flex justify-center">
        <button className="mt-5 px-10 py-1 rounded-sm bg-indigo-500">
          로그아웃
        </button>
      </div>
    </main>
  );
};

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}

export default Home;
