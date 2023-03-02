import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useRecoilState } from 'recoil';

import { descendingSort } from '@utils/dayjs';
import Sentence, { SentenceDetailInfo } from '@components/group/Sentence';
import Seo from '@components/layout/Seo';
import GroupNavbar from '@components/group/GroupNavbar';
import SentenceEditModal from '@components/modals/SentenceEditModal';
import ConfirmModal from '@components/modals/ConfirmModal';
import SelectSentence from '@components/group/SelectSentence';
import GroupHeader from '@components/group/GroupHeader';
import SelectGroup from '@components/group/SelectGroup';
import { queryKeys } from '@react-query/constants';
import { getGroupData, useGroup } from '@react-query/hooks/groups/useGroup';
import { useRemoveSentence } from '@react-query/hooks/sentence/useRemoveSentence';
import { contextState } from '@recoil/atoms/common';
import { modalState } from '@recoil/atoms/modals';

export type GroupInfo = {
  _id: string;
  name: string;
  email: string;
  createdAt: number;
  updatedAt: number;
  sentences: SentenceDetailInfo[];
};

const SentenceByGroup = () => {
  const SERVER_ERROR = 'There was an error contacting the server.';

  const [isOpen, setIsOpen] = useState(false);
  const [showSelectGroupModal, setShowSelectGroupModal] = useState(false);

  const [selectSentenceIds, setIsSelectSentenceIds] = useState<string[]>([]);
  const [selectSentence, setIsSelectSentence] = useState<SentenceDetailInfo[]>(
    []
  );
  const [selectGroup, setIsSelectGroup] = useState<GroupInfo | undefined>();

  const router = useRouter();
  const { removeSentenceMutate, setRemoveState } = useRemoveSentence();
  const { groupData, isLoading } = useGroup();

  const [context, setContext] = useRecoilState(contextState);
  const [showModal, setIsShowModal] = useRecoilState(modalState);

  if (isLoading) return;

  const handleChangeGroup = async (): Promise<void> => {
    try {
      const response = await axios.patch(`api/sentence/actions/change-group`, {
        id: selectGroup?._id,
        sentences: selectSentence,
      });

      if (response.status === 201) {
        setIsShowModal({ confirmModal: !showModal.confirmModal });

        removeSentenceMutate({
          groupId: groupData[0]._id,
          sentenceIds: selectSentenceIds,
        });

        setContext('');
        setIsOpen(false);
        setTimeout(() => {
          router.push(`/${groupData[0]._id}`);
        }, 100);
      }
    } catch (errorResponse) {
      const message =
        axios.isAxiosError(errorResponse) &&
        errorResponse?.response?.data?.message
          ? errorResponse?.response?.data?.message
          : SERVER_ERROR;

      console.error(message);
    }
  };

  const handleDeleteSentence = async () => {
    setIsShowModal({ confirmModal: !showModal.confirmModal });

    removeSentenceMutate({
      groupId: groupData[0]._id,
      sentenceIds: selectSentenceIds,
    });

    setContext('');
    setIsOpen(false);
    setTimeout(() => {
      router.push(`/${groupData[0]._id}`);
    }, 100);
  };

  return (
    <>
      <Seo title={`${groupData[0].name}`} />
      {showModal.confirmModal && (
        <ConfirmModal
          handler={handleChangeGroup}
          deleteHandler={handleDeleteSentence}
          selectSentenceIds={selectSentenceIds}
          setIsSelectSentenceIds={setIsSelectSentenceIds}
        />
      )}
      <section className="flex flex-col w-full gap-3 p-4 pb-32 mx-auto">
        <GroupNavbar name={groupData[0].name} setIsOpen={setIsOpen} />
        {isOpen && (
          <SentenceEditModal
            setIsOpen={setIsOpen}
            setRemoveState={setRemoveState}
          />
        )}

        {showSelectGroupModal && (
          <SelectGroup
            setShowSelectGroupModal={setShowSelectGroupModal}
            setIsSelectGroup={setIsSelectGroup}
          />
        )}
        <GroupHeader groupData={groupData} />

        {context && groupData[0].sentences ? (
          <SelectSentence
            groupInfo={groupData[0]}
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
