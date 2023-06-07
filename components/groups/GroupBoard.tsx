import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { HiOutlineExclamationCircle, HiPlus } from 'react-icons/hi';
import { useSetRecoilState } from 'recoil';

import GroupsNavbar from '@components/groups/components/GroupsNavbar';
import { UserInfo } from '@pages/profile';
import Group from '@components/groups/components/Group';
import { useGroupNames } from '@react-query/hooks/group/useGroupNames';
import { contextState } from '@recoil/atoms/common';
import useModal from '@hooks/useModal';

const GroupBoard = () => {
  const [selectGroupId, setIsSelectGroupId] = useState('');
  const { showModal } = useModal();

  const { data: session } = useSession();
  const user = session?.user as UserInfo;

  const { groups } = useGroupNames();

  const setContext = useSetRecoilState(contextState);

  const createNewGroup = () => {
    setContext('createGroup');

    showModal({
      modalType: 'GroupNameModal',
      modalProps: {
        selectGroupId,
        setIsSelectGroupId,
      },
    });
  };

  return (
    <>
      <GroupsNavbar />

      <div className="flex items-center justify-between w-full max-w-xl p-2 my-3">
        <div className="flex flex-col">
          <div className="flex justify-start text-lg font-bold text-gray-600 md:text-2xl">
            {`${user?.username.toUpperCase()}'s `}
          </div>
          <div className="flex items-center justify-start text-base font-bold text-gray-600 md:text-xl">
            memoonjang
          </div>
        </div>
        <div
          onClick={createNewGroup}
          className="p-2 text-3xl text-center text-teal-400 cursor-pointer md:text-4xl md:p-4"
        >
          <HiPlus />
        </div>
      </div>

      {groups?.length !== 0 ? (
        groups?.map((group, idx) => {
          return (
            <Group
              key={idx}
              group={group}
              setIsSelectGroupId={setIsSelectGroupId}
            />
          );
        })
      ) : (
        <div className="flex flex-col items-center justify-center max-w-2xl p-2 mt-10 text-xl text-center">
          <div className="p-2 mb-5 text-3xl text-center text-teal-500 md:text-4xl">
            <HiOutlineExclamationCircle />
          </div>
          <div className="flex p-2 mx-auto text-xl font-bold text-teal-500 md:text-2xl">
            생성된 문장집이 없습니다.
          </div>
        </div>
      )}
    </>
  );
};

export default GroupBoard;
