import { useRouter } from 'next/router';
import { MdOutlineArrowBackIos } from 'react-icons/md';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { Dispatch, SetStateAction } from 'react';

const GroupNavbar = ({
  name,
  setIsOpen,
}: {
  name: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const router = useRouter();

  const handleModalForEdit = () => {
    setIsOpen(true);
  };

  return (
    <div className="flex">
      <span
        onClick={() => router.push('/')}
        className="flex items-center justify-center pl-4 text-2xl cursor-pointer"
      >
        <MdOutlineArrowBackIos />
      </span>
      <h1 className="flex py-2 pl-4 mx-auto my-8 text-xl font-bold text-gray-800 md:2xl">
        {name}
      </h1>
      <span
        onClick={handleModalForEdit}
        className="flex items-center justify-center pr-4 text-2xl cursor-pointer"
      >
        <HiOutlineDotsHorizontal />
      </span>
    </div>
  );
};

export default GroupNavbar;
