import { useEffect } from 'react';
import type { GetServerSideProps } from 'next';
import { getSession, useSession } from 'next-auth/react';
import {
  dehydrate,
  QueryClient,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import Link from 'next/link';
import axios from 'axios';

import styles from '@styles/Home.module.css';
import Layout from '@components/layout/Layout';
import Seo from '@components/layout/Seo';
import GroupBoard from '@components/groups/GroupBoard';
import { UserInfo } from '@pages/profile';
import { getGroupDetail } from '@pages/[groupName]';

export const getGroupsData = async (
  user: UserInfo
): Promise<string[] | undefined> => {
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_URL}/api/group/list`,
    {
      email: user?.email,
    }
  );

  return data;
};

const Home = () => {
  const { data: session } = useSession();
  const user = session?.user as UserInfo;
  const queryClient = useQueryClient();

  const {
    data: groups,
    isLoading,
    isError,
    error,
  } = useQuery(['groupsData', user], () => getGroupsData(user));

  useEffect(() => {
    if (groups) {
      groups.forEach((group) => {
        queryClient.prefetchQuery(['groupDetailInfo', user, group], () =>
          getGroupDetail(user, group)
        );
      });
    }
  }, [queryClient, groups, user]);

  if (isLoading) return;
  if (isError)
    return (
      <>
        <h3>Oops, something went wrong</h3>
        <p>{error?.toString()}</p>
      </>
    );

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

const mainPage = ({ groups }: { groups: string[] | undefined }) => {
  return (
    <Layout>
      <GroupBoard groups={groups} />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const user = session?.user as UserInfo;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['groupsData'],
    queryFn: () => getGroupsData(user),
  });

  return {
    props: {
      dehydreatedState: dehydrate(queryClient),
    },
  };
};

export default Home;
