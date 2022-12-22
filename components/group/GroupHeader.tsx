import { GroupInfo } from '@pages/[groupName]';
import { useRouter } from 'next/router';
import { HiOutlinePlus } from 'react-icons/hi';

const GroupHeader = ({
  name,
  groupData,
}: {
  name: string;
  groupData: GroupInfo[];
}) => {
  const router = useRouter();
  const addSentence = () => {
    router.push(`/newsentence/?name=${name}`);
  };
  return (
    <>
      <div className="flex justify-between">
        <div className="p-3 text-lg font-bold text-teal-500">
          총 {groupData[0].sentences.length} 문장
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
