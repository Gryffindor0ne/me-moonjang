import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useRecoilValue } from 'recoil';

import { descendingSort } from '@utils/dayjs';
import Sentence, { SentenceDetailInfo } from '@components/group/Sentence';
import Seo from '@components/layout/Seo';
import GroupNavbar from '@components/group/GroupNavbar';
import SentenceEditModal from '@components/modals/SentenceEditModal';
import SelectSentence from '@components/group/SelectSentence';
import GroupHeader from '@components/group/GroupHeader';
import SelectGroup from '@components/group/SelectGroup';
import { queryKeys } from '@react-query/constants';
import { getGroupData, useGroup } from '@react-query/hooks/groups/useGroup';
import { useRemoveSentence } from '@react-query/hooks/sentence/useRemoveSentence';
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
  const [showSentenceEditModal, setIsShowSentenceEditModal] = useState(false);
  const [showSelectGroupModal, setShowSelectGroupModal] = useState(false);

  const [selectSentenceIds, setIsSelectSentenceIds] = useState<string[]>([]);
  const [selectSentence, setIsSelectSentence] = useState<SentenceDetailInfo[]>(
    []
  );

  const { setRemoveState } = useRemoveSentence();
  const { groupData, isLoading } = useGroup();

  const context = useRecoilValue(contextState);

  if (isLoading) return null;

  return (
    <>
      <Seo title={`${groupData[0].name}`} />

      <section className="flex flex-col w-full gap-3 p-4 pb-32 mx-auto">
        <GroupNavbar
          name={groupData[0].name}
          setIsOpen={setIsShowSentenceEditModal}
        />
        {showSentenceEditModal && (
          <SentenceEditModal
            setIsOpen={setIsShowSentenceEditModal}
            setRemoveState={setRemoveState}
          />
        )}

        {showSelectGroupModal && (
          <SelectGroup
            setIsOpen={setIsShowSentenceEditModal}
            selectSentence={selectSentence}
            selectSentenceIds={selectSentenceIds}
            setIsSelectSentenceIds={setIsSelectSentenceIds}
            setShowSelectGroupModal={setShowSelectGroupModal}
          />
        )}
        <GroupHeader groupData={groupData} />

        {context && groupData[0].sentences ? (
          <SelectSentence
            setIsOpen={setIsShowSentenceEditModal}
            groupInfo={groupData[0]}
            selectSentenceIds={selectSentenceIds}
            setIsSelectSentenceIds={setIsSelectSentenceIds}
            setIsSelectSentence={setIsSelectSentence}
            setShowSelectGroupModal={setShowSelectGroupModal}
          />
        ) : groupData[0].sentences && groupData[0].sentences.length !== 0 ? (
          descendingSort(groupData[0].sentences).map((sentenceInfo, idx) => (
            <Sentence key={idx} data={sentenceInfo} groupInfo={groupData[0]} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-2 mt-10 text-xl text-center">
            <div className="p-2 text-3xl text-center text-teal-500 md:text-4xl">
              <HiOutlineExclamationCircle />
            </div>
            <div className="flex p-2 mx-auto text-base font-bold text-teal-500 md:text-xl">
              등록된 문장이 없습니다.
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const groupId = context.params?.groupId;
  const session = await getSession(context);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [queryKeys.groupDetailData],
    queryFn: () => getGroupData(groupId as string),
  });

  return {
    props: {
      session,
      dehydreatedState: dehydrate(queryClient),
    },
  };
};

export default SentenceByGroup;
