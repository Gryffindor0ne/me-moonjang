import { useRouter } from 'next/router';
import React, { Dispatch, SetStateAction } from 'react';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';

import { GroupInfo } from '@pages/[groupId]';
import useModal from '@hooks/useModal';

const Group = ({
  group,
  setIsSelectGroupId,
}: {
  group: GroupInfo;
  setIsSelectGroupId: Dispatch<SetStateAction<string>>;
}) => {
  const router = useRouter();

  const { showModal } = useModal();

  const handleClickGroupName = (event: React.MouseEvent<HTMLElement>) => {
    router.push(`/${(event.target as any).id}`);
  };

  const handleModalForGroupEdit = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();

    showModal({
      modalType: 'GroupEditModal',
      modalProps: {
        id: group._id,
        setIsSelectGroupId,
      },
    });
  };
  return (
    <>
      <div
        id={group._id}
        onClick={handleClickGroupName}
        className="z-0 flex justify-between p-4 mx-2 my-4 text-teal-100 rounded-md cursor-pointer md:text-lg md:p-5 bg-gradient-to-r from-teal-500 via-teal-400 to-teal-200 text-md text-bold"
      >
        {group.name}

        <span
          id={group.name}
          onClick={handleModalForGroupEdit}
          className="z-0 flex items-center justify-center pr-2 text-xl cursor-pointer"
        >
          <HiOutlineDotsHorizontal />
        </span>
      </div>
    </>
  );
};

export default Group;
