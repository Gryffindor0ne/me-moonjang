import { useRouter } from 'next/router';
import { MdOutlineArrowBackIos } from 'react-icons/md';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { useSetRecoilState } from 'recoil';

import useModal from '@components/hooks/useModal';
import { contextState } from '@recoil/atoms/common';

const GroupNavbar = ({ name }: { name: string }) => {
  const router = useRouter();
  const { showModal } = useModal();
  const setContext = useSetRecoilState(contextState);

  const handleCancel = () => {
    router.push('/');
    setContext('');
  };

  const handleModalForEdit = () => {
    showModal({
      modalType: 'SentenceEditModal',
      modalProps: {},
    });
  };

  return (
    <div className="flex">
      <span
        onClick={handleCancel}
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
