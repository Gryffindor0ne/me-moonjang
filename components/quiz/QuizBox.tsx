import { MdOutlineClose, MdOutlineFiberManualRecord } from 'react-icons/md';

import { SentenceDetailInfo } from '@components/group/Sentence';

export type QuizProps = {
  quiz: SentenceDetailInfo[];
  handleChoice: (num: number) => void;
};

const QuizBox = ({ quiz, handleChoice }: QuizProps) => {
  return (
    <>
      <section className="flex flex-col w-full max-w-2xl gap-5 mx-auto p-7">
        <div className="flex p-8 m-2 text-yellow-200 bg-teal-700 rounded-md md:text-lg md:p-10 text-md text-bold">
          {quiz[0].sentence}
        </div>
        <div className="flex p-5 m-2 text-sm text-gray-100 bg-teal-500 rounded-md md:text-lg md:p-10 text-bold">
          {quiz[1].interpretation}
        </div>

        <div className="flex items-center justify-center mt-10">
          <span
            className="flex items-center justify-center max-w-2xl p-4 mx-6 text-lg text-teal-400 bg-teal-100 rounded-md cursor-pointer w-30 hover:text-yellow-200 hover:bg-teal-200 md:text-3xl md:p-5 text-md text-bold"
            onClick={() => handleChoice(1)}
          >
            <MdOutlineFiberManualRecord />
          </span>
          <span
            className="flex items-center justify-center max-w-2xl p-4 mx-6 text-lg text-teal-400 bg-teal-100 rounded-md cursor-pointer w-30 hover:text-yellow-200 hover:bg-teal-200 md:text-3xl md:p-5 text-bold"
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
