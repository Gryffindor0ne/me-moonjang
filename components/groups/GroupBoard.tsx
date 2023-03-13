import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  HiOutlineCollection,
  HiOutlineExclamationCircle,
} from 'react-icons/hi';
import { useSetRecoilState } from 'recoil';

import GroupsNavbar from '@components/groups/components/GroupsNavbar';
import { UserInfo } from '@pages/profile';
import Group from '@components/groups/components/Group';
import { useGroups } from '@react-query/hooks/groups/useGroups';
import { contextState } from '@recoil/atoms/common';
import useModal from '@hooks/useModal';

const GroupBoard = () => {
  const [selectGroupId, setIsSelectGroupId] = useState('');
  const { showModal } = useModal();

  const { data: session } = useSession();
  const user = session?.user as UserInfo;

  const { groups } = useGroups();

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

      <div className="flex items-center justify-between w-full p-2">
        <div className="flex justify-start p-2 my-2 text-base font-bold text-gray-700 md:text-lg md:p-4">
          {`${user?.username.toUpperCase()}'s memoonjang`}
        </div>
        <div
          onClick={createNewGroup}
          className="p-2 text-3xl text-center text-teal-400 cursor-pointer md:text-4xl md:p-4"
        >
          <HiOutlineCollection />
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
