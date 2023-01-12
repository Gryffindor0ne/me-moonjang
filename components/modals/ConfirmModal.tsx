import React, {
  Dispatch,
  Fragment,
  SetStateAction,
  useRef,
  useState,
} from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const ConfirmModal = ({
  btn,
  setShowModal,
  handler,
  deleteHandler,
  selectedSentenceIds,
  setIsSelectedSentenceIds,
}: {
  btn: string;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  handler?: () => Promise<void>;
  deleteHandler: () => Promise<void>;
  selectedSentenceIds?: string[];
  setIsSelectedSentenceIds?: Dispatch<SetStateAction<string[] | []>>;
}) => {
  const [open, setOpen] = useState(true);

  const cancelButtonRef = useRef(null);

  const handleCancel = () => {
    setOpen((prev) => !prev);
    setShowModal((prev) => !prev);
    if (selectedSentenceIds) setIsSelectedSentenceIds!([]);
  };

  const confirmMessageSet = [
    {
      btn: 'logout',
      title: '로그아웃',
      description: '로그아웃하시겠습니까?',
      handler: handler,
    },
    {
      btn: 'deleteAccount',
      title: '회원탈퇴',
      description: '정말 회원을 탈퇴하겠습니까? 모든 데이터가 삭제됩니다.',
      handler: deleteHandler,
    },
    {
      btn: 'deleteSentence',
      title: '문장삭제',
      description: '선택한 문장을 삭제하시겠습니까?',
      handler: deleteHandler,
    },
    {
      btn: 'changeGroup',
      title: '문장집 변경',
      description: '선택한 문장의 문장집을 변경하시겠습니까?',
      handler: handler,
    },
    {
      btn: 'updateGroup',
      title: '문장집 수정',
      description: '선택한 문장집의 이름을 변경하시겠습니까?',
      handler: handler,
    },
    {
      btn: 'deleteGroup',
      title: '문장집 삭제',
      description:
        '선택한 문장집을 삭제하시겠습니까? 문장집 내 모든 문장이 삭제됩니다.',
      handler: deleteHandler,
    },
  ];

  const confirmTarget = confirmMessageSet.filter((set) => set.btn === btn);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={handleCancel}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 transition-opacity bg-gray-300 bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative w-full overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:max-w-lg">
                <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-orange-100 rounded-full sm:mx-0 sm:h-10 sm:w-10">
                      <ExclamationTriangleIcon
                        className="w-6 h-6 text-orange-500"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900 "
                      >
                        {confirmTarget[0].title}
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 sm:text-sm">
                          {confirmTarget[0].description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-orange-400 border border-transparent rounded-md shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={confirmTarget[0].handler}
                  >
                    {confirmTarget[0].title}
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={handleCancel}
                    ref={cancelButtonRef}
                  >
                    취소
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default ConfirmModal;
