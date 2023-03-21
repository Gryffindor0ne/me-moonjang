import { useSession } from 'next-auth/react';
import { Dispatch, SetStateAction } from 'react';
import { HiOutlineRefresh, HiOutlineTrash, HiOutlineX } from 'react-icons/hi';
import { useSetRecoilState } from 'recoil';

import { UserInfo } from '@pages/profile';
import { useCustomToast } from '@hooks/useCustomToast';
import { contextState } from '@recoil/atoms/common';
import useModal from '@hooks/useModal';
import { useRemoveGroup } from '@react-query/hooks/groups/useRemoveGroup';
import { useGroups } from '@react-query/hooks/groups/useGroups';

export type GroupEditModalProps = {
  id: string;
  setIsSelectGroupId: Dispatch<SetStateAction<string>>;
};

const GroupEditModal = ({ id, setIsSelectGroupId }: GroupEditModalProps) => {
  const { data: session } = useSession();
  const user = session?.user as UserInfo;
  const toast = useCustomToast();

  const setContext = useSetRecoilState(contextState);
  const { showModal, hideModal } = useModal();

  const removeGroup = useRemoveGroup();
  const { groups, isLoading } = useGroups();
  if (isLoading) return null;

  const handleClickModal = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    hideModal();

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

      showModal({
        modalType: 'GroupNameModal',
        modalProps: {
          selectGroupId: id,
          setIsSelectGroupId,
        },
      });
    }
    if (purpose === 'deleteGroup') {
      setContext('deleteGroup');

      hideModal();
      showModal({
        modalType: 'ConfirmModal',
        modalProps: {
          handler: handleDeleteGroup,
        },
      });
    }
  };
  const currentGroupName = groups?.filter((group) => group._id === id)[0].name;

  return (
    <>
      <div className="fixed z-50 flex items-center justify-center w-full p-2 outline-none top-1/3 focus:outline-none">
        <div className="relative max-w-xs p-1 bg-white rounded-md md:p-2">
          <button
            onClick={() => hideModal()}
            type="button"
            className="absolute inline-flex items-center p-2 ml-auto text-base text-gray-400 bg-transparent rounded-lg md:p-1 top-2 right-2 hover:bg-gray-200 hover:text-gray-900"
          >
            <HiOutlineX />
          </button>
          <ul className="flex flex-col w-full py-2">
            <li className="px-8">
              <div className="flex flex-row items-center h-8">
                <div className="inline-flex pr-12 text-sm font-medium tracking-wide text-gray-500">
                  {`${currentGroupName} 문장집`}
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
        onClick={() => hideModal()}
        className="fixed inset-0 z-40 bg-gray-900 opacity-30"
      ></div>
    </>
  );
};

export default GroupEditModal;
