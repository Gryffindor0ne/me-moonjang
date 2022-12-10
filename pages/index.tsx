import type { GetServerSideProps } from 'next';
import { getSession, useSession } from 'next-auth/react';

import Link from 'next/link';

import styles from '../styles/Home.module.css';
import Layout from '@components/layout/Layout';
import Seo from '@components/layout/Seo';
import GroupBoard from '@components/groups/GroupBoard';
import dbConnect from '@lib/db';
import { UserInfo } from '@pages/profile';

const Home = ({ groups }: { groups: string[] }) => {
  const { data: session } = useSession();

  return (
    <div className={styles.container}>
      <Seo title="Home" />

      {session ? mainPage({ groups }) : gate()}
    </div>
  );
};

const gate = () => {
  return (
    <>
      <Link href="/auth/login" className={styles.main}>
        <span className="text-4xl font-bold text-gray-600">Me Moonjang</span>
      </Link>

      <footer className={styles.footer}>
        <p>© me-moonjang</p>
      </footer>
    </>
  );
};

const mainPage = ({ groups }: { groups: string[] }) => {
  return (
    <Layout>
      <GroupBoard groups={groups} />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  const user = session?.user as UserInfo;

  const client = await dbConnect();
  const db = client.db();
  const groupsCollection = db.collection('groups');
  let groupsData = await groupsCollection
    .find(
      { name: { $exists: 1 }, email: user?.email },
      { projection: { _id: 0 } }
    )
    .toArray();

  const groups = groupsData.map(({ name }) => name);

  client.close();

  return {
    props: {
      session,
      groups,
    },
  };
};

export default Home;
