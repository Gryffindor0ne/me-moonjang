import { useRouter } from 'next/router';
import { HiOutlinePlus } from 'react-icons/hi';

import { GroupInfo } from '@pages/[groupId]';

const GroupHeader = ({ groupData }: { groupData: GroupInfo[] }) => {
  const router = useRouter();
  const { groupId } = router.query;

  const addSentence = () => {
    router.push(`/newsentence/?groupId=${groupId}`);
  };
  return (
    <>
      <div className="flex justify-between">
        <div className="p-3 text-lg font-bold text-teal-500">
          {groupData[0].sentences
            ? `총 ${groupData[0].sentences.length} 문장`
            : `총 0 문장`}
        </div>
        <span
          onClick={addSentence}
          className="flex items-center justify-center pr-4 text-2xl cursor-pointer"
        >
          <HiOutlinePlus />
        </span>
      </div>
    </>
  );
};

export default GroupHeader;
