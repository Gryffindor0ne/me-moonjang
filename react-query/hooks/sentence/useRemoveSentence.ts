import {
  UseMutateFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';
import { useRecoilState } from 'recoil';

import { queryKeys } from '@react-query/constants';
import { useCustomToast } from '@hooks/useCustomToast';
import { contextState } from '@recoil/atoms/common';

type Ids = {
  groupId: string;
  sentenceIds: string[];
};

const removeSentence = async (ids: Ids) => {
  await axios.delete(`/api/sentence`, {
    data: {
      groupId: ids.groupId,
      sentenceIds: ids.sentenceIds,
    },
  });
};

export const useRemoveSentence = (): UseMutateFunction<
  void,
  unknown,
  Ids,
  unknown
> => {
  const queryClient = useQueryClient();
  const toast = useCustomToast();

  const context = useRecoilState(contextState)[0];

  const { mutate } = useMutation((ids: Ids) => removeSentence(ids), {
    onSuccess: () => {
      queryClient.invalidateQueries([queryKeys.groupDetailData]);
      toast({
        title:
          context === 'changeGroup'
            ? '선택한 문장이 변경되었습니다.'
            : '선택한 문장이 삭제되었습니다.',

        status: 'success',
      });
    },
  });
  return mutate;
};
