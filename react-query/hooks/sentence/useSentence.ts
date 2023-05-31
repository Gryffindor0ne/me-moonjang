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

export const useSentence = () => {
  const router = useRouter();

  const { groupId } = router.query;

  const { data: groupData, isLoading } = useQuery(
    [queryKeys.groupData, groupId],
    () => getGroupData(groupId as string)
  );

  return { groupData, isLoading };
};
