import { Dispatch, SetStateAction } from 'react';
import { HiOutlineLightBulb, HiOutlineTrash, HiOutlineX } from 'react-icons/hi';

const SentenceEditModal = ({
  setIsOpen,
  setIsOption,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setIsOption: Dispatch<SetStateAction<string>>;
}) => {
  const handleClickModal = () => {
    setIsOpen((prev) => !prev);
    setIsOption('delete');
  };

  return (
    <>
      <div className="fixed z-50 flex items-center justify-center w-full max-w-md pl-8 mt-10 overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
        <div className="relative w-full h-auto max-w-xs p-2 bg-white rounded-md md:p-0">
          <button
            onClick={() => setIsOpen((prev) => !prev)}
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
                <div className="text-sm font-light tracking-wide text-gray-500">
                  Menu
                </div>
              </div>
            </li>
            {/* <li>
              <div className="relative flex flex-row items-center h-8 pr-6 text-gray-600 border-l-4 border-transparent focus:outline-none hover:bg-gray-50 hover:text-gray-800 hover:border-teal-500">
                <span className="inline-flex items-center justify-center ml-4">
                  <HiOutlineLightBulb />
                </span>
                <span className="ml-2 text-sm tracking-wide truncate">
                  수정
                </span>
              </div>
            </li> */}
            <li>
              <div
                onClick={handleClickModal}
                className="relative flex flex-row items-center h-8 pr-6 text-gray-600 border-l-4 border-transparent focus:outline-none hover:bg-gray-50 hover:text-gray-800 hover:border-teal-500"
              >
                <span className="inline-flex items-center justify-center ml-4">
                  <HiOutlineTrash />
                </span>
                <span className="ml-4 text-sm tracking-wide truncate">
                  삭제
                </span>
                <span className="px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-teal-500 bg-teal-50 rounded-full">
                  주의
                </span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed inset-0 bg-gray-900 z-100 opacity-30"
      ></div>
    </>
  );
};

export default SentenceEditModal;
