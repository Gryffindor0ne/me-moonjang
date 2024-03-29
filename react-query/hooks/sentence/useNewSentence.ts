import {
  UseMutateFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { queryKeys } from '@react-query/constants';
import { useCustomToast } from '@hooks/useCustomToast';
import { axiosInstance } from '@lib/axiosInstance';

type NewSentence = {
  id: string;
  sentence: string;
  interpretation: string;
  explanation: string;
};

const createNewSentence = async (newSentence: NewSentence) => {
  await axiosInstance.post(`/api/sentence`, {
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
  const toast = useCustomToast();

  const { mutate } = useMutation(
    (newSentence: NewSentence) => createNewSentence(newSentence),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([queryKeys.groupData]);
        toast({
          title: '새 문장이 생성되었습니다.',
          status: 'success',
        });
      },
    }
  );
  return mutate;
};
