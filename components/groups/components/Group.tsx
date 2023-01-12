import { useRouter } from 'next/router';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';

import GroupEditModal from '@components/modals/GroupEditModal';

const Group = ({
  groupName,
  setIsSelectBtn,
  setIsSelectGroupName,
  setIsOpen,
  setShowConfirmModal,
}: {
  groupName: string;
  setIsSelectBtn: Dispatch<SetStateAction<string>>;
  setIsSelectGroupName: Dispatch<SetStateAction<string>>;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setShowConfirmModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const [isOpenGroupEdit, setIsOpenGroupEdit] = useState(false);

  const handleClickGroupName = (event: React.MouseEvent<HTMLElement>) => {
    router.push(`/${(event.target as any).id}`);
  };

  const handleModalForGroupEdit = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setIsOpenGroupEdit((prev) => !prev);
  };
  return (
    <>
      <div
        id={groupName}
        onClick={handleClickGroupName}
        className="z-0 flex justify-between p-4 mx-2 my-4 text-teal-100 rounded-md cursor-pointer md:text-lg md:p-5 bg-gradient-to-r from-teal-500 via-teal-400 to-teal-200 text-md text-bold"
      >
        {groupName}
        <span
          id={groupName}
          onClick={handleModalForGroupEdit}
          className="z-0 flex items-center justify-center pr-2 text-xl cursor-pointer"
        >
          <HiOutlineDotsHorizontal />
        </span>
        {isOpenGroupEdit && (
          <GroupEditModal
            id={groupName}
            setIsSelectGroupName={setIsSelectGroupName}
            setIsOpenGroupEdit={setIsOpenGroupEdit}
            setIsSelectBtn={setIsSelectBtn}
            setIsOpen={setIsOpen}
            setShowConfirmModal={setShowConfirmModal}
          />
        )}
      </div>
    </>
  );
};

export default Group;
