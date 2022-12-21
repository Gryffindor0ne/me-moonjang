import { useRouter } from 'next/router';

import { writtenDate } from '@utils/utils';

export type SentenceDetailInfo = {
  id: string;
  sentence: string;
  interpretation: string;
  explanation: string;
  createdAt: number;
  updatedAt: number;
};

const Sentence = ({
  data,
  groupName,
}: {
  data: SentenceDetailInfo;
  groupName: string;
}) => {
  const router = useRouter();

  const handleClickGroupName = (event: React.MouseEvent<HTMLElement>) => {
    router.push(`/sentences/${(event.target as any).id}?name=${groupName}`);
  };

  return (
    <div
      id={data.id}
      onClick={handleClickGroupName}
      className="w-full p-3 text-gray-700 border border-gray-300 rounded-md cursor-pointer resize-none hover:ring-2 hover:ring-teal-500 hover:ring-offset-1 hover:outline-none"
    >
      <div id={data.id} className="mb-3 text-xs text-gray-500 md:text-md">
        {writtenDate(data.createdAt)}
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
