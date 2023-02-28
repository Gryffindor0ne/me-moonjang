import { Dispatch, SetStateAction, useState } from 'react';
import {
  UseMutateFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';

import { queryKeys } from '@react-query/constants';
import { useCustomToast } from '@components/hooks/useCustomToast';

type Ids = {
  groupId: string;
  sentenceIds: string[];
};

type UseRemoveSentence = {
  removeSentenceMutate: UseMutateFunction<void, unknown, Ids, unknown>;
  removeState: boolean;
  setRemoveState: Dispatch<SetStateAction<boolean>>;
};

const removeSentence = async (ids: Ids) => {
  await axios.delete(`/api/sentence`, {
    data: {
      groupId: ids.groupId,
      sentenceIds: ids.sentenceIds,
    },
  });
};

export const useRemoveSentence = (): UseRemoveSentence => {
  const queryClient = useQueryClient();
  const toast = useCustomToast();

  const [removeState, setRemoveState] = useState(true);

  const { mutate: removeSentenceMutate } = useMutation(
    (ids: Ids) => removeSentence(ids),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([queryKeys.groupDetailData]);
        toast({
          title: removeState
            ? '선택한 문장이 삭제되었습니다.'
            : '선택한 문장이 변경되었습니다.',

          status: 'success',
        });
      },
    }
  );
  return { removeSentenceMutate, removeState, setRemoveState };
};
