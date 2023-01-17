import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
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
import { useTrail, a } from '@react-spring/web';

import styles from '@styles/styles.module.css';
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

const Trail: React.FC<{ open: boolean; children: any }> = ({
  open,
  children,
}) => {
  const items = React.Children.toArray(children);
  const trail = useTrail(items.length, {
    config: { mass: 5, tension: 2000, friction: 200 },
    opacity: open ? 1 : 0,
    x: open ? 0 : 20,
    height: open ? 150 : 0,
    from: { opacity: 0, x: 30, height: 0 },
  });
  return (
    <div>
      {trail.map(({ height, ...style }, index) => (
        <a.div key={index} className={styles.trailsText} style={style}>
          <a.div style={{ height }}>{items[index]}</a.div>
        </a.div>
      ))}
    </div>
  );
};

const Home = () => {
  const { data: session } = useSession();
  const user = session?.user as UserInfo;
  const queryClient = useQueryClient();

  const [open, setIsOpen] = useState(true);

  const {
    data: groups,
    isLoading,
    isError,
    error,
  } = useQuery(['groupsData', user], () => getGroupsData(user));

  useEffect(() => {
    window.addEventListener('resize', () => {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    });
  }, []);

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
    <div>
      <Seo title="Home" />

      {session ? Main({ groups }) : Splash({ open, setIsOpen })}
    </div>
  );
};

const Splash = ({
  open,
  setIsOpen,
}: {
  open: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const router = useRouter();

  setTimeout(() => router.push('/auth/login'), 3000);

  return (
    <div
      className="flex items-center justify-center w-full h-screen bg-teal-500"
      onClick={() => setIsOpen((prev) => !prev)}
    >
      <Trail open={open}>
        <span className="text-3xl font-bold text-white md:text-4xl">
          Me Moonjang
        </span>
      </Trail>
    </div>
  );
};

const Main = ({ groups }: { groups: string[] | undefined }) => {
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
