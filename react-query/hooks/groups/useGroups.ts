import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

import { UserInfo } from '@pages/profile';
import { GroupInfo } from '@pages/[groupId]';
import { queryKeys } from '@react-query/constants';
import { getGroupData } from '@react-query/hooks/groups/useGroup';

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

export const useGroups = () => {
  const { data: session } = useSession();
  const user = session?.user as UserInfo;
  const queryClient = useQueryClient();

  const fallback: GroupInfo[] = [];

  const { data: groups = fallback, isLoading } = useQuery(
    [queryKeys.groupsData, user],
    () => getGroupsData(user)
  );

  useEffect(() => {
    if (groups) {
      groups.forEach((group) => {
        queryClient.prefetchQuery([queryKeys.groupDetailData, group._id], () =>
          getGroupData(group._id)
        );
      });
    }
  }, [queryClient, groups]);

  return { groups, isLoading };
};
