import { useRouter } from 'next/router';
import { MdOutlineArrowBackIos } from 'react-icons/md';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

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
              className="flex items-center justify-center px-2 text-lg cursor-pointer"
            >
              <MdOutlineArrowBackIos />
            </span>
            <h1 className="flex py-2 pr-4 mx-auto my-8 text-xl font-bold text-gray-800 md:text-2xl">
              퀴즈
            </h1>
          </div>

          <div className="flex flex-col items-center justify-center p-2 mt-10 text-xl text-center">
            <div className="p-2 text-3xl text-center text-teal-500 md:text-4xl">
              <HiOutlineExclamationCircle />
            </div>
            <div className="flex p-2 mx-auto text-base font-bold text-teal-500 md:text-xl">
              서비스 준비중입니다.
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default QuizPage;
