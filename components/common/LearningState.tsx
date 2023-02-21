import { useState } from 'react';

import { MdOutlineFaceRetouchingNatural } from 'react-icons/md';

import { SentenceDetailInfo } from '@components/group/Sentence';
import useSentenceState from '@hooks/useSentenceState';
import { GroupInfo } from '@pages/[groupId]';

const LearningState = ({
  data,
  groupInfo,
  sentenceDetail,
}: {
  data: SentenceDetailInfo;
  groupInfo: GroupInfo;
  sentenceDetail: boolean;
}) => {
  const [learningComplete, setLearingComplete] = useState(
    !data.learningState ?? false
  );

  const { changeLearningState } = useSentenceState();

  const handleClickLearningState = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setLearingComplete((prev) => !prev);
    changeLearningState(data, learningComplete, groupInfo, sentenceDetail);
  };

  return (
    <div className="flex justify-end">
      <div
        className="mb-5 mr-3 text-2xl text-gray-500 md:text-3xl"
        onClick={handleClickLearningState}
      >
        <div className={`${data?.learningState ? 'text-orange-400' : ''}`}>
          <MdOutlineFaceRetouchingNatural />
        </div>
      </div>
    </div>
  );
};

export default LearningState;
