import { useState } from 'react';

import { MdOutlineFaceRetouchingNatural } from 'react-icons/md';

import useSentenceState from '@react-query/hooks/sentence/useSentenceState';
import { useSentence } from '@react-query/hooks/sentence/useSentence';
import { SentenceDetailInfo } from '@shared/types';

const LearningState = ({ data }: { data: SentenceDetailInfo }) => {
  const [learningComplete, setLearingComplete] = useState(
    !data.learningState ?? false
  );

  const { groupData } = useSentence();

  const learningStateMutate = useSentenceState();

  const handleClickLearningState = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setLearingComplete((prev) => !prev);

    learningStateMutate({
      groupId: groupData._id,
      sentenceId: data.id,
      learningComplete,
    });
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
