import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useRecoilValue } from 'recoil';

import { descendingSort } from '@utils/dayjs';
import Sentence, { SentenceDetailInfo } from '@components/group/Sentence';
import Seo from '@components/layout/Seo';
import GroupNavbar from '@components/group/GroupNavbar';
import SelectSentence from '@components/group/SelectSentence';
import GroupHeader from '@components/group/GroupHeader';
import { useSentence } from '@react-query/hooks/sentence/useSentence';
import { contextState } from '@recoil/atoms/common';

export type GroupInfo = {
  _id: string;
  name: string;
  email: string;
  createdAt: number;
  updatedAt: number;
  sentences: SentenceDetailInfo[];
};

const SentenceByGroup = () => {
  const { groupData, isLoading } = useSentence();

  const context = useRecoilValue(contextState);

  if (isLoading) return null;

  return (
    <>
      <Seo title={`${groupData.name}`} />

      <section className="flex flex-col w-full max-w-2xl gap-3 px-8 pb-32 mx-auto">
        <GroupNavbar name={groupData.name} />

        <GroupHeader groupData={groupData} />

        {context && groupData.sentences ? (
          <SelectSentence />
        ) : groupData.sentences && groupData.sentences.length !== 0 ? (
          descendingSort(groupData.sentences).map((sentenceInfo, idx) => (
            <Sentence key={idx} data={sentenceInfo} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center w-full max-w-2xl p-2 mt-10 text-xl text-center">
            <div className="p-2 mb-5 text-3xl text-center text-teal-500 md:text-4xl">
              <HiOutlineExclamationCircle />
            </div>
            <div className="flex p-2 mx-auto text-xl font-bold text-teal-500 md:text-2xl">
              등록된 문장이 없습니다.
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  const queryClient = new QueryClient();

  return {
    props: {
      session,
      dehydreatedState: dehydrate(queryClient),
    },
  };
};

export default SentenceByGroup;
