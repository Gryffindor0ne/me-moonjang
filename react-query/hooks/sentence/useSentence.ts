import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';

import { queryKeys } from '@react-query/constants';
import { axiosInstance } from '@lib/axiosInstance';

export const getGroupData = async (groupId: string | undefined) => {
  const { data } = await axiosInstance.get(`/api/groups/detail/${groupId}`);
  return data;
};

export const useSentence = () => {
  const router = useRouter();

  const { groupId } = router.query;

  const { data: groupData, isLoading } = useQuery(
    [queryKeys.groupData, groupId],
    () => getGroupData(groupId as string)
  );

  return { groupData, isLoading };
};
