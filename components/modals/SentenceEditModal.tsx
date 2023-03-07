import { HiOutlineRefresh, HiOutlineTrash, HiOutlineX } from 'react-icons/hi';
import { useSetRecoilState } from 'recoil';

import { useGroup } from '@react-query/hooks/groups/useGroup';
import { useCustomToast } from '@components/hooks/useCustomToast';
import { contextState } from '@recoil/atoms/common';
import useModal from '@components/hooks/useModal';

export type SentenceEditModalProps = {};

const SentenceEditModal = () => {
  const toast = useCustomToast();
  const { hideModal } = useModal();
  const { groupData, isLoading } = useGroup();

  const setContext = useSetRecoilState(contextState);

  if (isLoading) return null;

  const handleClickModal = (event: React.MouseEvent<HTMLElement>) => {
    hideModal();

    if (!groupData[0].sentences || groupData[0].sentences.length === 0) {
      toast({
        title: '문장이 존재하지 않습니다.',
        status: 'warning',
      });
      return;
    }
    const purpose = (event.target as any).id;

    if (purpose === 'changeGroup') {
      setContext('changeGroup');
    }
    if (purpose === 'deleteSentence') {
      setContext('deleteSentence');
    }
  };

  return (
    <>
      <div className="fixed z-50 flex items-center justify-center w-full max-w-lg ml-12 overflow-x-hidden overflow-y-auto outline-none top-16 sm:ml-20 focus:outline-none">
        <div className="relative w-2/3 max-w-xs p-2 bg-white rounded-md md:p-0 md:w-full">
          <button
            onClick={() => hideModal()}
            type="button"
            className="absolute top-2 right-2 text-gray-400 bg-transparent
           hover:bg-gray-200 hover:text-gray-900 rounded-lg text-lg p-2.5 ml-auto 
           inline-flex items-center"
          >
            <HiOutlineX />
          </button>
          <ul className="flex flex-col py-5 space-y-1">
            <li className="px-5">
              <div className="flex flex-row items-center h-8">
                <div className="text-xs font-light tracking-wide text-gray-500">
                  Menu
                </div>
              </div>
            </li>
            <li>
              <div
                id="changeGroup"
                onClick={handleClickModal}
                className="relative flex flex-row items-center h-8 pr-6 text-gray-600 border-l-4 border-transparent focus:outline-none hover:bg-gray-50 hover:text-gray-800 hover:border-teal-500"
              >
                <span
                  id="changeGroup"
                  className="inline-flex items-center justify-center ml-4"
                >
                  <HiOutlineRefresh />
                </span>
                <span
                  id="changeGroup"
                  className="ml-4 text-sm tracking-wide truncate"
                >
                  문장집 변경
                </span>
              </div>
            </li>
            <li>
              <div
                id="deleteSentence"
                onClick={handleClickModal}
                className="relative flex flex-row items-center h-8 pr-6 text-gray-600 border-l-4 border-transparent focus:outline-none hover:bg-gray-50 hover:text-gray-800 hover:border-teal-500"
              >
                <span
                  id="deleteSentence"
                  className="inline-flex items-center justify-center ml-4"
                >
                  <HiOutlineTrash />
                </span>
                <span
                  id="deleteSentence"
                  className="ml-4 text-sm tracking-wide truncate"
                >
                  삭제
                </span>
                <span
                  id="deleteSentence"
                  className="px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-teal-500 bg-teal-50 rounded-full"
                >
                  주의
                </span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div
        onClick={() => hideModal()}
        className="fixed inset-0 bg-gray-900 z-100 opacity-30"
      ></div>
    </>
  );
};

export default SentenceEditModal;
