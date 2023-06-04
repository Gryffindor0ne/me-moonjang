import { useRouter } from 'next/router';

type GroupNameProps = {
  _id: string;
  name: string;
};

const GroupBox = ({ groupName }: { groupName: GroupNameProps }) => {
  const router = useRouter();

  const handleClickGroupChoice = (event: React.MouseEvent<HTMLElement>) => {
    router.push(`/quiz/${(event.target as any).id}`);
  };

  return (
    <>
      <div
        id={groupName._id}
        onClick={handleClickGroupChoice}
        className="z-0 flex justify-center w-full max-w-lg p-4 my-2 text-base text-gray-700 border border-gray-400 rounded-md cursor-pointer md:w-lg md:text-lg md:p-5"
      >
        {groupName.name}
      </div>
    </>
  );
};

export default GroupBox;
