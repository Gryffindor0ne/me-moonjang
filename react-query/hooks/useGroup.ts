import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/router';

import { queryKeys } from '@react-query/constants';

export const getGroupData = async (groupId: string | undefined) => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_URL}/api/groups/detail/${groupId}`
  );
  return data;
};

export const useGroup = () => {
  const router = useRouter();

  const { groupId } = router.query;

  const { data: groupData, isLoading } = useQuery(
    [queryKeys.groupDetailData, groupId],
    () => getGroupData(groupId as string)
  );

  return { groupData, isLoading };
};
