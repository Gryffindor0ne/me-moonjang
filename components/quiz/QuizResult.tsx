import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { MdHome, MdRefresh } from 'react-icons/md';

import { incEltNbr } from '@utils/scoreAnimation';

export type QuizResultProps = {
  userAnswer: number[];
  len: number;
};

const QuizResult = ({ userAnswer, len }: QuizResultProps) => {
  // eslint-disable-next-line no-unused-vars
  const [status, setStatus] = useState(false);

  const router = useRouter();
  const totalnum = userAnswer.reduce((a, c) => a + c);

  const learningCheck = totalnum >= Math.round(len / 2);

  const score = Math.floor((totalnum / len) * 100);

  useEffect(() => {
    if (score) {
      setStatus(true);
    }
  }, [score]);

  const elt = document.getElementById('score');
  if (elt) {
    incEltNbr('score');
  }

  return (
    <>
      <section className="flex flex-col max-w-2xl gap-2 p-2 md:gap-5 md:w-full">
        <div className="flex flex-col items-center gap-2 text-xl justifity-center">
          <div className="flex p-6 mx-auto text-3xl font-bold text-gray-700">
            퀴즈 결과
          </div>

          <div className="p-2 mb-4 text-6xl text-center md:text-8xl">
            <p
              id="score"
              className={`${
                learningCheck ? 'text-teal-600' : 'text-orange-500'
              }`}
            >
              {`${score}`}
            </p>
          </div>

          <div className="p-2 text-xl text-center text-teal-500 md:text-2xl md:mb-10">
            <p
              className={`${
                learningCheck ? 'text-teal-600' : 'text-orange-500'
              }`}
            >
              {`${totalnum} / ${len}`}
            </p>
          </div>

          {learningCheck ? (
            <div className="p-2 text-xl text-center text-teal-500 md:text-2xl">
              노력의 결실이 있군요!
            </div>
          ) : (
            <div className="p-2 text-xl text-center text-orange-500 md:text-2xl">
              조금 더 공부해봐요.
            </div>
          )}
        </div>

        <div className="flex flex-col items-center mt-6 md:mt-10">
          <div
            className="flex items-center justify-center w-full max-w-xl p-2 m-2 text-teal-700 border border-teal-500 rounded-md cursor-pointer hover:text-white hover:bg-teal-500 md:text-xl md:p-5 text-md"
            onClick={() => router.back()}
          >
            <MdRefresh />
            <div className="ml-2">퀴즈 다시하기</div>
          </div>
          <div
            className="flex items-center justify-center w-full max-w-xl p-2 m-2 text-teal-700 border border-teal-500 rounded-md cursor-pointer hover:text-white hover:bg-teal-500 md:text-xl md:p-5 text-md"
            onClick={() => router.push(`/`)}
          >
            <MdHome />
            <div className="ml-5">처음 화면으로 돌아가기</div>
          </div>
        </div>
      </section>
    </>
  );
};

export default QuizResult;
