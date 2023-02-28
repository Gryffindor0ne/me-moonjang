import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  HiOutlineCollection,
  HiOutlineExclamationCircle,
} from 'react-icons/hi';

import GroupsNavbar from '@components/groups/components/GroupsNavbar';
import GroupNameModal from '@components/modals/GroupNameModal';
import { UserInfo } from '@pages/profile';
import Group from '@components/groups/components/Group';
import ConfirmModal from '@components/modals/ConfirmModal';
import { GroupInfo } from '@pages/[groupId]';
import { useRemoveGroup } from '@react-query/hooks/groups/useRemoveGroup';

const GroupBoard = ({ groups }: { groups: GroupInfo[] | undefined }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectBtn, setIsSelectBtn] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectGroupId, setIsSelectGroupId] = useState('');

  const { data: session } = useSession();
  const user = session?.user as UserInfo;

  const removeGroup = useRemoveGroup();

  const handleDeleteGroup = () => {
    setShowConfirmModal((prev) => !prev);
    removeGroup({ id: selectGroupId });
    setIsSelectGroupId('');
  };

  return (
    <>
      <GroupsNavbar />
      {showConfirmModal && (
        <ConfirmModal
          btn={selectBtn}
          setShowModal={setShowConfirmModal}
          deleteHandler={handleDeleteGroup}
        />
      )}
      <div className="flex items-center justify-between w-full p-2">
        <div className="flex justify-start p-2 my-2 text-base font-bold text-gray-700 md:text-lg md:p-4">
          {`${user?.username.toUpperCase()}'s memoonjang`}
        </div>
        <div
          onClick={() => setIsOpen((prev) => !prev)}
          className="p-2 text-3xl text-center text-teal-400 cursor-pointer md:text-4xl md:p-4"
        >
          <HiOutlineCollection />
        </div>
      </div>
      {isOpen && (
        <GroupNameModal
          selectBtn={selectBtn}
          setIsSelectBtn={setIsSelectBtn}
          setIsOpen={setIsOpen}
          selectGroupId={selectGroupId}
          setIsSelectGroupId={setIsSelectGroupId}
        />
      )}
      {groups?.length !== 0 ? (
        groups?.map((group, idx) => {
          return (
            <Group
              key={idx}
              group={group}
              setIsOpen={setIsOpen}
              setIsSelectBtn={setIsSelectBtn}
              setIsSelectGroupId={setIsSelectGroupId}
              setShowConfirmModal={setShowConfirmModal}
            />
          );
        })
      ) : (
        <div className="flex flex-col items-center justify-center p-2 mt-10 text-xl text-center">
          <div className="p-2 text-3xl text-center text-teal-500 md:text-4xl">
            <HiOutlineExclamationCircle />
          </div>
          <div className="flex p-2 mx-auto text-base font-bold text-teal-500 md:text-xl">
            생성된 문장집이 없습니다.
          </div>
        </div>
      )}
    </>
  );
};

export default GroupBoard;
