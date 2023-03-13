import { useRouter } from 'next/router';

import { writtenDate } from '@utils/dayjs';
import LearningState from '@components/common/LearningState';
import { GroupInfo } from '@pages/[groupId]';

export type SentenceDetailInfo = {
  id: string;
  sentence: string;
  interpretation: string;
  explanation: string;
  createdAt: number;
  updatedAt: number;
  learningState?: boolean;
};

const Sentence = ({
  data,
  groupInfo,
}: {
  data: SentenceDetailInfo;
  groupInfo: GroupInfo;
}) => {
  const router = useRouter();

  const handleClickGroupName = (event: React.MouseEvent<HTMLElement>) => {
    router.push(`/${groupInfo._id}/${(event.target as any).id}`);
  };

  return (
    <div
      id={data.id}
      onClick={handleClickGroupName}
      className="w-full p-5 text-gray-700 border border-gray-300 rounded-md cursor-pointer resize-none hover:ring-2 hover:ring-teal-500 hover:ring-offset-1 hover:outline-none"
    >
      <div id={data.id} className="flex justify-between">
        <div id={data.id} className="mb-5 text-xs text-gray-500 md:text-sm">
          {writtenDate(data.createdAt)}
        </div>

        <LearningState
          data={data}
          groupInfo={groupInfo}
          sentenceDetail={false}
        />
      </div>
      <div id={data.id} className="font-bold text-md md:text-xl">
        {data.sentence}
      </div>
      <div id={data.id} className="mt-5 text-xs md:text-base">
        {data.interpretation}
      </div>
    </div>
  );
};

export default Sentence;
