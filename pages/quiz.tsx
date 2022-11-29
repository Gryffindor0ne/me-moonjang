import Layout from '@components/layout/Layout';
import Seo from '@components/layout/Seo';
import { useRouter } from 'next/router';
import { MdOutlineArrowBackIos } from 'react-icons/md';

const QuizPage = () => {
  const router = useRouter();
  return (
    <>
      <Seo title="퀴즈" />
      <Layout>
        <section className="w-full mx-auto flex flex-col gap-5 p-5">
          <div className="flex">
            <span
              onClick={() => router.back()}
              className="flex justify-center items-center px-4 text-2xl cursor-pointer"
            >
              <MdOutlineArrowBackIos />
            </span>
            <h1 className="flex mx-auto text-gray-800 text-4xl font-bold pr-4 py-2 my-16">
              Quiz
            </h1>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default QuizPage;
