import React from 'react';
import { HiBookOpen } from 'react-icons/hi';

const GroupNavbar = ({
  setIsOpen,
}: {
  setIsOpen: (value: boolean) => void;
}) => {
  const handleClickModal = () => {
    setIsOpen(true);
  };

  return (
    <>
      <div className="flex justify-between pt-10 pb-6">
        <div className="p-2 text-2xl font-bold text-center text-gray-800 md:text-3xl md:p-4">
          Memoonjang
        </div>

        <div
          onClick={handleClickModal}
          className="p-2 text-3xl text-center text-teal-400 cursor-pointer md:text-4xl md:p-4"
        >
          <HiBookOpen />
        </div>
      </div>
    </>
  );
};

export default GroupNavbar;
