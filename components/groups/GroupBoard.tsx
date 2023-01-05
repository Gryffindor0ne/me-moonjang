import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  HiOutlineCollection,
  HiOutlineExclamationCircle,
} from 'react-icons/hi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import GroupsNavbar from '@components/groups/components/GroupsNavbar';
import GroupCreateModal from '@components/modals/GroupCreateModal';
import { UserInfo } from '@pages/profile';
import Group from '@components/groups/components/Group';

const GroupBoard = ({ groups }: { groups: string[] | undefined }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const { data: session } = useSession();
  const user = session?.user as UserInfo;

  useEffect(() => {
    if (isCreated) {
      toast.success('새 문장집 등록완료', {
        position: 'top-center',
        autoClose: 900,
      });
      setIsCreated((prev) => !prev);
    }
  }, [isCreated]);

  return (
    <>
      <ToastContainer />
      <GroupsNavbar />
      {isOpen && (
        <GroupCreateModal setIsOpen={setIsOpen} setIsCreated={setIsCreated} />
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
