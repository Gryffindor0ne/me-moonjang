import { useState } from 'react';

import { MdOutlineFaceRetouchingNatural } from 'react-icons/md';

import { SentenceDetailInfo } from '@components/group/Sentence';

const LearningState = ({
  data,
  changeLearningState,
}: {
  data: SentenceDetailInfo;
  changeLearningState: ({
    data,
    learningComplete,
  }: {
    data: SentenceDetailInfo;
    learningComplete: boolean;
  }) => Promise<void>;
}) => {
  const [learningComplete, setLearingComplete] = useState(
    !data.learningState ?? false
  );

  const handleClickLearningState = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setLearingComplete((prev) => !prev);
    changeLearningState({ data, learningComplete });
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
