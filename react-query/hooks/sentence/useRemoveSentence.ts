import {
  UseMutateFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Dispatch, SetStateAction, useState } from 'react';

import { queryKeys } from '@react-query/constants';

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
  const SERVER_ERROR = 'There was an error contacting the server.';
  const queryClient = useQueryClient();

  const [removeState, setRemoveState] = useState(true);

  const { mutate: removeSentenceMutate } = useMutation(
    (ids: Ids) => removeSentence(ids),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([queryKeys.groupDetailData]);
        toast.success(
          removeState ? '문장이 삭제되었습니다.' : '문장집이 변경되었습니다.',
          {
            position: 'top-center',
            autoClose: 300,
            delay: 100,
          }
        );
      },
      onError: (error) => {
        const message =
          axios.isAxiosError(error) && error?.response?.data?.message
            ? error?.response?.data?.message
            : SERVER_ERROR;

        console.error(message);
      },
    }
  );
  return { removeSentenceMutate, removeState, setRemoveState };
};
