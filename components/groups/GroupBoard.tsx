import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useQueryClient } from '@tanstack/react-query';
import {
  HiOutlineCollection,
  HiOutlineExclamationCircle,
} from 'react-icons/hi';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import GroupsNavbar from '@components/groups/components/GroupsNavbar';
import GroupNameModal from '@components/modals/GroupNameModal';
import { UserInfo } from '@pages/profile';
import Group from '@components/groups/components/Group';
import ConfirmModal from '@components/modals/ConfirmModal';
import { GroupInfo } from '@pages/[groupId]';
import { queryKeys } from '@react-query/constants';

const GroupBoard = ({ groups }: { groups: GroupInfo[] | undefined }) => {
  const SERVER_ERROR = 'There was an error contacting the server.';

  const [isOpen, setIsOpen] = useState(false);
  const [selectBtn, setIsSelectBtn] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectGroupId, setIsSelectGroupId] = useState('');

  const { data: session } = useSession();
  const user = session?.user as UserInfo;
  const queryClient = useQueryClient();

  const handleDeleteGroup = async (): Promise<void> => {
    try {
      const deleteResponse = await axios.delete(`/api/groups`, {
        data: { id: selectGroupId },
      });

      if (deleteResponse.status === 200) {
        toast.success('문장집 삭제완료', {
          position: 'top-center',
          autoClose: 500,
        });
        queryClient.invalidateQueries({ queryKey: [queryKeys.groupsData] });
        setShowConfirmModal((prev) => !prev);
        setIsSelectGroupId('');
      }
    } catch (errorResponse) {
      const message =
        axios.isAxiosError(errorResponse) &&
        errorResponse?.response?.data?.message
          ? errorResponse?.response?.data?.message
          : SERVER_ERROR;

      console.error(message);
    }
  };

  return (
    <>
      <ToastContainer />
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
