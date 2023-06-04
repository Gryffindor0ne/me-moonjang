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
        className="z-0 flex justify-center w-full max-w-lg p-3 m-4 text-teal-500 border border-teal-600 rounded-md cursor-pointer md:w-lg hover:text-white hover:bg-teal-600 md:text-lg md:p-5 text-md text-bold"
      >
        {groupName.name}
      </div>
    </>
  );
};

export default GroupBox;
