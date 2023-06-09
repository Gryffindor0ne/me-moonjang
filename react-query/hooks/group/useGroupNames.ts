import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

import { queryKeys } from '@react-query/constants';
import { axiosInstance } from '@lib/axiosInstance';
import { GroupInfo, UserInfo } from '@shared/types';

export const getGroupNames = async (
  user: UserInfo
): Promise<GroupInfo[] | undefined> => {
  const { data } = await axiosInstance.get(`/api/groups`, {
    params: {
      user: user?.email,
    },
  });

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
