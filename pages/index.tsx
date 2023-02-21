import React, { useEffect } from 'react';
import type { GetServerSideProps } from 'next';
import { getSession, useSession } from 'next-auth/react';
import { dehydrate, QueryClient } from '@tanstack/react-query';

import Seo from '@components/layout/Seo';
import { UserInfo } from '@pages/profile';
import { queryKeys } from '@react-query/constants';
import Splash from '@components/layout/Splash';
import { getGroupsData, useGroups } from '@react-query/hooks/useGroups';
import Main from '@components/layout/Main';

const Home = () => {
  const { data: session } = useSession();

  useEffect(() => {
    window.addEventListener('resize', () => {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    });
  }, []);

  const { isLoading } = useGroups();

  if (isLoading) return;

  return (
    <div>
      <Seo title="Home" />

      {session ? <Main /> : <Splash />}
    </div>
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
