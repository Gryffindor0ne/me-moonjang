import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/router';

import { queryKeys } from '@react-query/constants';

export const getSentenceData = async (
  groupId: string | string[] | undefined,
  id: string | string[] | undefined
) => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_URL}/api/sentence/?group=${groupId}&sentenceId=${id}`
  );
  return data;
};

export const useSentence = () => {
  const router = useRouter();
  const { groupId, id } = router.query;

  const { data: sentenceData, isLoading } = useQuery(
    [queryKeys.sentenceDetail, groupId, id],
    () => getSentenceData(groupId, id)
  );

  return { sentenceData, isLoading };
};
