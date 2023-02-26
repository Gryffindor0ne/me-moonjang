import {
  UseMutateFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';

import { queryKeys } from '@react-query/constants';

type NewSentence = {
  id: string;
  sentence: string;
  interpretation: string;
  explanation: string;
};

const createNewSentence = async (newSentence: NewSentence) => {
  await axios.post(`api/sentence`, {
    id: newSentence.id,
    sentence: newSentence.sentence,
    interpretation: newSentence.interpretation,
    explanation: newSentence.explanation,
  });
};

export const useNewSentence = (): UseMutateFunction<
  void,
  unknown,
  NewSentence,
  unknown
> => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation(
    (newSentence: NewSentence) => createNewSentence(newSentence),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([queryKeys.groupsData]);
        toast.success('새 문장이 생성되었습니다.', {
          position: 'top-center',
          autoClose: 500,
          delay: 100,
        });
      },
      onError: (error) => {
        let message;
        if (axios.isAxiosError(error) && error.response) {
          message = error.response.data.message;
          console.error(message);
          if (error.response.status === 422) {
            toast.warning('동일한 문장이 존재합니다.', {
              position: 'top-center',
              autoClose: 500,
              delay: 100,
            });
          }
        } else message = String(error);
        console.error(message);
      },
    }
  );
  return mutate;
};
