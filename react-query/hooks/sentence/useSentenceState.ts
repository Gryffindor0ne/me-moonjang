import {
  UseMutateFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';

import { queryKeys } from '@react-query/constants';

type LearningStateData = {
  groupId: string;
  sentenceId: string;
  learningComplete: boolean;
  sentenceDetail: boolean;
};

const changeLearningState = async (learningStateData: LearningStateData) => {
  await axios.post(`/api/sentence/learning-state`, {
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
  const SERVER_ERROR = 'There was an error contacting the server.';

  const queryClient = useQueryClient();

  const { mutate } = useMutation(
    (learningStateData: LearningStateData) =>
      changeLearningState(learningStateData),
    {
      onSuccess: (data, variables, context) => {
        if (variables.learningComplete) {
          toast.success('문장 학습 완료', {
            position: 'top-center',
            autoClose: 300,
            delay: 100,
          });
        } else {
          toast.warning('문장 학습 미완료', {
            position: 'top-center',
            autoClose: 300,
            delay: 100,
          });
        }

        queryClient.invalidateQueries([
          variables.sentenceDetail
            ? queryKeys.sentenceDetail
            : queryKeys.groupDetailData,
        ]);
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
  return mutate;
};

export default useSentenceState;
