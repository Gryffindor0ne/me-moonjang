import { useState } from 'react';

import Seo from '@components/layout/Seo';
import makeRandomOrder from '@utils/makeRandomOrder';
import QuizBox from '@components/quiz/QuizBox';
import QuizResult from '@components/quiz/QuizResult';
import { SentenceDetailInfo } from '@shared/types';

type QuizProps = {
  sentences: SentenceDetailInfo[];
  groupName: string;
};

const QuizBoard = ({ sentences, groupName }: QuizProps) => {
  // eslint-disable-next-line no-unused-vars
  const [order, setOrder] = useState<number[]>(
    makeRandomOrder(sentences.length)
  );
  // eslint-disable-next-line no-unused-vars
  const [order2, setOrder2] = useState<number[]>(
    makeRandomOrder(sentences.length)
  );

  const [userAnswer, setUserAnswer] = useState<number[]>([]);

  const qt = order.map((order) => sentences[order - 1]);
  const aw = order2.map((order) => sentences[order - 1]);

  const len = order.length;
  const quiz = [qt[len - 1], aw[len - 1]];
  const quizAnswer = qt.map((q, i) => q === aw[i]);

  const handleChoice = (num: number): void => {
    if (quizAnswer[order.length - 1] === !!num) {
      setUserAnswer([...userAnswer, 1]);
    } else {
      setUserAnswer([...userAnswer, 0]);
    }

    order.pop();
    order2.pop();
  };

  return (
    <>
      <Seo title={`QUIZ - ${groupName}`} />
      <section className="flex flex-col w-full max-w-2xl gap-5 mx-auto md:mt-10">
        {userAnswer.length !== sentences.length ? (
          <QuizBox
            quiz={quiz}
            handleChoice={handleChoice}
            len={sentences.length}
            orderLen={order.length}
          />
        ) : (
          <QuizResult userAnswer={userAnswer} len={sentences.length} />
        )}
      </section>
    </>
  );
};

export default QuizBoard;
