import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query';
import { MdOutlineArrowBackIos } from 'react-icons/md';
import { HiOutlineBell } from 'react-icons/hi';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Seo from '@components/layout/Seo';
import LearningState from '@components/common/LearningState';
import { SentenceDetailInfo } from '@components/group/Sentence';
import { queryKeys } from '@react-query/constants';

export const getSentenceData = async (
  groupId: string | string[] | undefined,
  id: string | string[] | undefined
) => {
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_URL}/api/sentence`,
    {
      groupId,
      id,
    }
  );
  return data;
};

const Sentence = () => {
  const [open, setOpen] = useState(true);

  const router = useRouter();
  const { groupId, id } = router.query;

  const {
    data: sentenceData,
    isError,
    isLoading,
    error,
  } = useQuery([queryKeys.sentenceDetail, groupId, id], () =>
    getSentenceData(groupId, id)
  );

  if (isLoading) return;
  if (isError)
    return (
      <>
        <h3>Oops, something went wrong</h3>
        <p>{error?.toString()}</p>
      </>
    );

  const sentenceDetail: SentenceDetailInfo = sentenceData[0].sentences[0];

  const handleSentence = () => {
    setOpen((prev) => !prev);
  };

  return (
    <>
      <ToastContainer />
      <Seo title={`${sentenceData[0].name}-상세`} />
      <section className="flex flex-col w-full p-5 mx-auto">
        <div className="flex pr-8">
          <span
            onClick={() => router.back()}
            className="flex items-center justify-center pl-4 text-2xl cursor-pointer"
          >
            <MdOutlineArrowBackIos />
          </span>
          <h1 className="flex py-2 mx-auto my-8 text-xl font-bold text-gray-800 md:2xl">
            {sentenceData[0].name}
          </h1>
        </div>
        <div
          onClick={handleSentence}
          className="flex flex-col w-full h-full gap-2 px-4 py-8 text-gray-700 border border-gray-300 rounded-md cursor-pointer resize-none hover:ring-2 hover:ring-teal-500 hover:ring-offset-1 hover:outline-none"
        >
          <LearningState
            data={sentenceDetail}
            groupInfo={sentenceData[0]}
            sentenceDetail={true}
          />
          <div className="flex p-2 text-2xl font-bold font-Lora md:text-3xl">
            {sentenceDetail.sentence}
          </div>
          {open && (
            <div className="flex flex-col w-full p-2 mt-5">
              <div className="mb-10 text-base text-gray-400 font-Gowun md:text-xl">
                {sentenceDetail.interpretation}
              </div>
              {sentenceDetail.explanation && (
                <div>
                  <div className="p-2 mt-2 text-2xl text-teal-400">
                    <HiOutlineBell />
                  </div>

                  <div className="flex w-full mt-2 text-xs leading-relaxed text-gray-600 md:text-base">
                    {sentenceDetail.explanation}
                  </div>
                </div>
              )}

              <div className="my-5">
                <div className="flex w-full text-xs leading-relaxed text-gray-400 mt-14 md:text-base">
                  클릭시 문장만 남습니다.
                </div>
                <div className="flex w-full mt-2 text-xs leading-relaxed text-gray-400 md:text-base">
                  재클릭시 모든 내용이 표시됩니다.
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { groupId, id } = context.query;
  const session = await getSession(context);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [queryKeys.sentenceDetail, groupId, id],
    queryFn: () => getSentenceData(groupId, id),
  });

  return {
    props: {
      session,
      dehydreatedState: dehydrate(queryClient),
    },
  };
};

export default Sentence;
