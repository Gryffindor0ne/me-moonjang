import { useRouter } from 'next/router';
import { MdOutlineArrowBackIos } from 'react-icons/md';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

import Layout from '@components/layout/Layout';
import Seo from '@components/layout/Seo';
import { useGroupNames } from '@react-query/hooks/group/useGroupNames';
import GroupBox from '@components/quiz/GroupBox';

const QuizPage = () => {
  const router = useRouter();

  const { groups, isLoading } = useGroupNames();

  if (isLoading) return;

  return (
    <>
      <Seo title="퀴즈" />
      <Layout>
        <section className="flex flex-col w-full max-w-2xl gap-3 mx-auto md:gap-5 md:p-5">
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

          {groups.length !== 0 ? (
            <div className="p-2 text-xl font-bold text-center text-teal-500 md:text-2xl">
              문장집을 선택해주세요.
            </div>
          ) : null}

          <div className="flex flex-wrap justify-center mt-3 text-xl text-center md:mt-10">
            {groups?.length !== 0 ? (
              <div className="flex flex-col items-center justify-center w-full max-w-lg p-2">
                {groups?.map((group, idx) => {
                  return <GroupBox key={idx} groupName={group} />;
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center max-w-2xl p-2 mt-10 text-xl text-center">
                <div className="p-2 mb-5 text-3xl text-center text-teal-500 md:text-4xl">
                  <HiOutlineExclamationCircle />
                </div>
                <div className="flex p-2 mx-auto mb-10 text-xl font-bold text-teal-500 md:text-2xl">
                  등록된 문장집이 없습니다.
                </div>
                <div className="flex p-2 mx-auto text-sm font-bold text-teal-300 md:text-base">
                  퀴즈를 하려면
                </div>
                <div className="flex p-2 mx-auto text-sm font-bold text-teal-300 md:text-base">
                  문장집을 생성하고 문장을 등록하세요.
                </div>
              </div>
            )}
          </div>
        </section>
      </Layout>
    </>
  );
};

export default QuizPage;
