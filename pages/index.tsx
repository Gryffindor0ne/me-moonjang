import React, { useEffect } from 'react';
import type { GetServerSideProps } from 'next';
import { getSession, useSession } from 'next-auth/react';
import {
  dehydrate,
  QueryClient,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useRouter } from 'next/router';
import axios from 'axios';

import Layout from '@components/layout/Layout';
import Seo from '@components/layout/Seo';
import GroupBoard from '@components/groups/GroupBoard';
import { UserInfo } from '@pages/profile';
import { getGroupData, GroupInfo } from '@pages/[groupId]';
import { queryKeys } from '@react-query/constants';
import Splash from '@components/layout/Splash';

export const getGroupsData = async (
  user: UserInfo
): Promise<GroupInfo[] | undefined> => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_URL}/api/groups`,
    {
      params: {
        user: user?.email,
      },
    }
  );

  return data;
};

const Home = () => {
  const { data: session } = useSession();
  const user = session?.user as UserInfo;
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    window.addEventListener('resize', () => {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    });
  }, []);

  const {
    data: groups,
    isLoading,
    isError,
    error,
  } = useQuery([queryKeys.groupsData, user], () => getGroupsData(user));

  useEffect(() => {
    if (groups) {
      groups.forEach((group) => {
        queryClient.prefetchQuery([queryKeys.groupDetailData, group._id], () =>
          getGroupData(group._id)
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
    <div>
      <Seo title="Home" />

      {session ? Main({ groups }) : <Splash router={router} />}
    </div>
  );
};

const Main = ({ groups }: { groups: GroupInfo[] | undefined }) => {
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
    queryKey: [queryKeys.groupsData],
    queryFn: () => getGroupsData(user),
  });

  return {
    props: {
      dehydreatedState: dehydrate(queryClient),
    },
  };
};

export default Home;
