import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

import GroupNavbar from '@components/groups/components/GroupNavbar';
import GroupCreateModal from '@components/modals/GroupCreateModal';
import { UserInfo } from '@pages/profile';
import Group from '@components/groups/components/Group';

const GroupBoard = ({ groups }: { groups: string[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const user = session?.user as UserInfo;

  return (
    <>
      <GroupNavbar setIsOpen={setIsOpen} />
      {isOpen && <GroupCreateModal setIsOpen={setIsOpen} />}
      <div className="flex p-2 mx-auto my-6 text-base font-bold text-gray-700 md:text-xl md:p-4">
        {user?.username.toUpperCase()}'s memoonjang
      </div>

      {groups?.length !== 0 ? (
        groups?.map((group, idx) => {
          return <Group key={idx} groupName={group} />;
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
