import { GetServerSideProps } from 'next';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { MdOutlineArrowBackIos } from 'react-icons/md';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

import { useSentence } from '@react-query/hooks/sentence/useSentence';
import Seo from '@components/layout/Seo';
import QuizBoard from '@components/quiz/QuizBoard';

const QuizByGroup = () => {
  const router = useRouter();

  const { groupData, isLoading } = useSentence();

  if (isLoading) return;

  const sentences = groupData.sentences;

  return (
    <>
      <Seo title={`QUIZ - ${groupData.name}`} />
      <section className="flex flex-col w-full max-w-2xl px-8 mx-auto md:p-5">
        <div className="flex pr-8">
          <span
            onClick={() => router.back()}
            className="flex items-center justify-center px-2 text-lg cursor-pointer"
          >
            <MdOutlineArrowBackIos />
          </span>
          <h1 className="flex py-2 mx-auto my-8 text-xl font-bold text-gray-800 md:2xl">
            {groupData.name}
          </h1>
        </div>

        {!sentences ? (
          <div className="flex flex-col items-center justify-center max-w-2xl p-2 mt-10 text-xl text-center">
            <div className="p-2 mb-5 text-3xl text-center text-teal-500 md:text-4xl">
              <HiOutlineExclamationCircle />
            </div>
            <div className="flex p-2 mx-auto text-xl font-bold text-teal-500 md:text-2xl">
              해당 문장집 안에
            </div>
            <div className="flex p-2 mx-auto mb-10 text-xl font-bold text-teal-500 md:text-2xl">
              등록된 문장이 없습니다.
            </div>
            <div className="flex p-2 mx-auto text-sm font-bold text-teal-300 md:text-base">
              퀴즈를 하려면
            </div>
            <div className="flex p-2 mx-auto text-sm font-bold text-teal-300 md:text-base">
              문장집에 한 개 이상의 문장이 있어야 합니다.
            </div>
          </div>
        ) : (
          <QuizBoard sentences={sentences} groupName={groupData.name} />
        )}
      </section>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const queryClient = new QueryClient();

  return {
    props: {
      dehydreatedState: dehydrate(queryClient),
    },
  };
};

export default QuizByGroup;
