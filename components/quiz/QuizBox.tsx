import { MdOutlineClose, MdOutlineFiberManualRecord } from 'react-icons/md';

import { SentenceDetailInfo } from '@shared/types';

type QuizProps = {
  quiz: SentenceDetailInfo[];
  handleChoice: (num: number) => void;
  len: number;
  orderLen: number;
};

const QuizBox = ({ quiz, handleChoice, len, orderLen }: QuizProps) => {
  return (
    <>
      <div className="flex flex-col items-center w-full max-w-lg gap-20 mx-auto my-4 text-xl">{`${
        len - orderLen + 1
      } / ${len}`}</div>
      <section className="flex flex-col w-full h-full max-w-lg gap-6 mx-auto mt-4 bg-gray-100 rounded-md">
        <div className="flex p-4 text-base font-bold text-gray-900 rounded-md font-Lora md:text-3xl md:p-10">
          {quiz[0].sentence}
        </div>
        <div className="flex p-4 text-sm text-gray-900 rounded-md font-Gowun md:text-xl md:p-10">
          {quiz[1].interpretation}
        </div>

        <div className="fixed inset-x-0 flex items-end justify-center mt-2 bottom-12 md:bottom-80">
          <span
            className="flex items-center justify-center p-2 md:p-4 mx-6 text-5xl font-bold text-teal-500 border-2 border-gray-200 rounded-md cursor-pointer w-30 md:mx-12"
            onClick={() => handleChoice(1)}
          >
            <MdOutlineFiberManualRecord />
          </span>
          <span
            className="flex items-center justify-center p-2 md:p-4 mx-6 text-5xl font-bold text-teal-500 border-2 border-gray-200 rounded-md cursor-pointer md:mx-12 w-30"
            onClick={() => handleChoice(0)}
          >
            <MdOutlineClose />
          </span>
        </div>
      </section>
    </>
  );
};

export default QuizBox;
