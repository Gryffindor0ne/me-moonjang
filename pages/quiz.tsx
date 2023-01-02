import { useRouter } from 'next/router';
import { MdOutlineArrowBackIos } from 'react-icons/md';

import Layout from '@components/layout/Layout';
import Seo from '@components/layout/Seo';

const QuizPage = () => {
  const router = useRouter();
  return (
    <>
      <Seo title="퀴즈" />
      <Layout>
        <section className="flex flex-col w-full gap-5 p-5 mx-auto">
          <div className="flex">
            <span
              onClick={() => router.back()}
              className="flex items-center justify-center px-4 text-2xl cursor-pointer"
            >
              <MdOutlineArrowBackIos />
            </span>
            <h1 className="flex py-2 pr-4 mx-auto my-16 text-4xl font-bold text-gray-800">
              Quiz
            </h1>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default QuizPage;
