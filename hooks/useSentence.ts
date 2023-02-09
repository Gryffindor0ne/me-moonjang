import axios from 'axios';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';

import { SentenceDetailInfo } from '@components/group/Sentence';
import { GroupInfo } from '@pages/[groupName]';

const useSentence = () => {
  const SERVER_ERROR = 'There was an error contacting the server.';
  const queryClient = useQueryClient();

  const changeStateCall = async (
    data: SentenceDetailInfo,
    learningComplete: boolean,
    groupInfo: GroupInfo,
    sentenceDetail: boolean
  ): Promise<void> => {
    try {
      const { status } = await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/api/sentence/learning-state`,
        {
          email: groupInfo.email,
          name: groupInfo.name,
          sentenceId: data.id,
          learningState: learningComplete,
        }
      );

      if (status === 201) {
        if (learningComplete) {
          toast.success('문장 학습완료', {
            position: 'top-center',
            autoClose: 300,
          });
        } else {
          toast.warning('문장 학습 미완료', {
            position: 'top-center',
            autoClose: 300,
          });
        }
      }
      const detail = sentenceDetail ? 'sentenceListByGroup' : 'groupDetailInfo';
      queryClient.invalidateQueries({
        queryKey: [`${detail}`],
      });
    } catch (errorResponse) {
      const message =
        axios.isAxiosError(errorResponse) &&
        errorResponse?.response?.data?.message
          ? errorResponse?.response?.data?.message
          : SERVER_ERROR;

      console.error(message);
    }
  };

  const changeLearningState = async (
    data: SentenceDetailInfo,
    learningComplete: boolean,
    groupInfo: GroupInfo,
    sentenceDetail: boolean
  ) => {
    changeStateCall(data, learningComplete, groupInfo, sentenceDetail);
  };

  return { changeLearningState };
};

export default useSentence;
