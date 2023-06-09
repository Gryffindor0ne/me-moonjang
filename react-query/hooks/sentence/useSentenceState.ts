import {
  UseMutateFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { queryKeys } from '@react-query/constants';
import { useCustomToast } from '@hooks/useCustomToast';
import { axiosInstance } from '@lib/axiosInstance';

type LearningStateData = {
  groupId: string;
  sentenceId: string;
  learningComplete: boolean;
};

const changeLearningState = async (learningStateData: LearningStateData) => {
  await axiosInstance.post(`/api/sentence/learning-state`, {
    id: learningStateData.groupId,
    sentenceId: learningStateData.sentenceId,
    learningState: learningStateData.learningComplete,
  });
};

const useSentenceState = (): UseMutateFunction<
  void,
  unknown,
  LearningStateData,
  unknown
> => {
  const toast = useCustomToast();

  const queryClient = useQueryClient();

  const { mutate } = useMutation(
    (learningStateData: LearningStateData) =>
      changeLearningState(learningStateData),
    {
      onSuccess: (data, variables, context) => {
        if (variables.learningComplete) {
          toast({
            title: '문장 학습 완료',
            status: 'success',
          });
        } else {
          toast({
            title: '문장 학습 미완료',
            status: 'warning',
          });
        }

        queryClient.invalidateQueries([queryKeys.groupData]);
      },
    }
  );
  return mutate;
};

export default useSentenceState;
