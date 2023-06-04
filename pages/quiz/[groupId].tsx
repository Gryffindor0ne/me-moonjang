import { GetServerSideProps } from 'next';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { MdOutlineArrowBackIos } from 'react-icons/md';

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
      <section className="flex flex-col w-full max-w-2xl p-5 mx-auto">
        <div className="flex pr-8">
          <span
            onClick={() => router.back()}
            className="flex items-center justify-center pl-4 text-2xl cursor-pointer"
          >
            <MdOutlineArrowBackIos />
          </span>
          <h1 className="flex py-2 mx-auto my-8 text-xl font-bold text-gray-800 md:2xl">
            {groupData.name}
          </h1>
        </div>

        <QuizBoard sentences={sentences} groupName={groupData.name} />
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
