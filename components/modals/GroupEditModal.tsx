import { useSession } from 'next-auth/react';
import { Dispatch, SetStateAction } from 'react';
import { HiOutlineRefresh, HiOutlineTrash, HiOutlineX } from 'react-icons/hi';
import { useSetRecoilState } from 'recoil';

import { UserInfo } from '@pages/profile';
import { useCustomToast } from '@components/hooks/useCustomToast';
import { contextState } from '@recoil/atoms/common';
import useModal from '@components/hooks/useModal';
import { useRemoveGroup } from '@react-query/hooks/groups/useRemoveGroup';

export type GroupEditModalProps = {
  id: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setIsSelectGroupId: Dispatch<SetStateAction<string>>;
  setIsOpenGroupEdit: Dispatch<SetStateAction<boolean>>;
};

const GroupEditModal = ({
  id,
  setIsOpen,
  setIsSelectGroupId,
  setIsOpenGroupEdit,
}: GroupEditModalProps) => {
  const { data: session } = useSession();
  const user = session?.user as UserInfo;
  const toast = useCustomToast();
  const removeGroup = useRemoveGroup();

  const setContext = useSetRecoilState(contextState);
  const { showModal, hideModal } = useModal();

  const handleClickModal = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setIsOpenGroupEdit((prev) => !prev);
    setIsSelectGroupId(id);

    const handleDeleteGroup = () => {
      setContext('');
      hideModal();
      removeGroup({ id });
      setIsSelectGroupId('');
    };

    const purpose = (event.target as any).id;

    if (purpose === 'deleteGroup' && user.email === 'guest@memoonjang.com') {
      toast({
        title: '게스트는 삭제권한이 없습니다!',
        status: 'warning',
      });
      return;
    }
    if (purpose === 'updateGroup') {
      setContext('updateGroup');
      setIsOpen((prev) => !prev);
    }
    if (purpose === 'deleteGroup') {
      setContext('deleteGroup');
      setIsOpen(false);
      showModal({
        modalType: 'ConfirmModal',
        modalProps: {
          handler: handleDeleteGroup,
        },
      });
    }
  };

  return (
    <>
      <div className="absolute z-50 flex justify-end w-full max-w-xs p-2 overflow-x-hidden overflow-y-auto outline-none md:max-w-md focus:outline-none">
        <div className="relative max-w-xs p-1 bg-white rounded-md md:p-0 md:w-1/4 ">
          <button
            onClick={() => setIsOpenGroupEdit((prev) => !prev)}
            type="button"
            className="absolute inline-flex items-center p-2 ml-auto text-base text-gray-400 bg-transparent rounded-lg md:p-1 top-2 right-2 hover:bg-gray-200 hover:text-gray-900"
          >
            <HiOutlineX />
          </button>
          <ul className="flex flex-col py-1">
            <li className="px-5">
              <div className="flex flex-row items-center h-8">
                <div className="text-xs font-light tracking-wide text-gray-500">
                  Menu
                </div>
              </div>
            </li>
            <li>
              <div
                id="updateGroup"
                onClick={handleClickModal}
                className="relative flex flex-row items-center h-8 pr-6 text-gray-600 border-l-4 border-transparent focus:outline-none hover:bg-gray-50 hover:text-gray-800 hover:border-teal-500"
              >
                <span
                  id="updateGroup"
                  className="inline-flex items-center justify-center ml-4"
                >
                  <HiOutlineRefresh />
                </span>
                <span
                  id="updateGroup"
                  className="ml-4 text-xs tracking-wide truncate md:text-sm"
                >
                  수정
                </span>
              </div>
            </li>
            <li>
              <div
                id="deleteGroup"
                onClick={handleClickModal}
                className="relative flex flex-row items-center h-8 pr-6 text-gray-600 border-l-4 border-transparent focus:outline-none hover:bg-gray-50 hover:text-gray-800 hover:border-teal-500"
              >
                <span
                  id="deleteGroup"
                  className="inline-flex items-center justify-center ml-4"
                >
                  <HiOutlineTrash />
                </span>
                <span
                  id="deleteGroup"
                  className="ml-4 text-xs tracking-wide truncate md:text-sm"
                >
                  삭제
                </span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div
        onClick={() => setIsOpenGroupEdit((prev) => !prev)}
        className="fixed inset-0 z-40 bg-gray-900 opacity-30"
      ></div>
    </>
  );
};

export default GroupEditModal;
