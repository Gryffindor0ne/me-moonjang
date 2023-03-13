import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { MdOutlineArrowBackIos } from 'react-icons/md';
import { HiOutlineBell } from 'react-icons/hi';

import Seo from '@components/layout/Seo';
import LearningState from '@components/common/LearningState';
import { SentenceDetailInfo } from '@components/group/Sentence';
import { queryKeys } from '@react-query/constants';
import {
  getSentenceData,
  useSentence,
} from '@react-query/hooks/sentence/useSentence';

const Sentence = () => {
  const [open, setOpen] = useState(true);

  const router = useRouter();

  const { sentenceData, isLoading } = useSentence();
  if (isLoading) return;

  const sentenceDetail: SentenceDetailInfo = sentenceData.sentences[0];

  const handleSentence = () => {
    setOpen((prev) => !prev);
  };

  return (
    <>
      <Seo title={`${sentenceData.name}-상세`} />
      <section className="flex flex-col w-full p-5 mx-auto">
        <div className="flex pr-8">
          <span
            onClick={() => router.back()}
            className="flex items-center justify-center pl-4 text-2xl cursor-pointer"
          >
            <MdOutlineArrowBackIos />
          </span>
          <h1 className="flex py-2 mx-auto my-8 text-xl font-bold text-gray-800 md:2xl">
            {sentenceData.name}
          </h1>
        </div>
        <div
          onClick={handleSentence}
          className="flex flex-col w-full h-full gap-2 px-4 py-8 text-gray-700 border border-gray-300 rounded-md cursor-pointer resize-none hover:ring-2 hover:ring-teal-500 hover:ring-offset-1 hover:outline-none"
        >
          <LearningState
            data={sentenceDetail}
            groupInfo={sentenceData}
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