import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useSession } from 'next-auth/react';

import { UserInfo } from '@pages/profile';
import { GroupInfo } from '@pages/[groupId]';
import { queryKeys } from '@react-query/constants';

export const getGroupNames = async (
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

export const useGroupNames = () => {
  const { data: session } = useSession();
  const user = session?.user as UserInfo;

  const fallback: GroupInfo[] = [];

  const { data: groups = fallback, isLoading } = useQuery(
    [queryKeys.groupNames, user],
    () => getGroupNames(user)
  );

  return { groups, isLoading };
};
