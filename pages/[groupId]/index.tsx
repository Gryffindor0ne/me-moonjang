import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { dehydrate, QueryClient, useQueryClient } from '@tanstack/react-query';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectBtn, setSelectBtn] = useState('');
  const [selectSentenceIds, setIsSelectSentenceIds] = useState<string[]>([]);
  const [selectSentence, setIsSelectSentence] = useState<SentenceDetailInfo[]>(
    []
  );
  const [selectGroup, setIsSelectGroup] = useState<GroupInfo | undefined>();
  const [option, setIsOption] = useState('');

  const router = useRouter();
  const queryClient = useQueryClient();
  const { groupData, isLoading } = useGroup();

  if (isLoading) return;

  const handleChangeGroup = async (): Promise<void> => {
    try {
      const response = await axios.patch(`api/sentence/actions/change-group`, {
        id: selectGroup?._id,
        sentences: selectSentence,
      });

      if (response.status === 201) {
        try {
          const deleteResponse = await axios.delete(`/api/sentence`, {
            data: {
              groupId: groupData[0]._id,
              sentences: selectSentenceIds,
            },
          });
          if (deleteResponse.status === 201) {
            toast.success('문장 이동완료', {
              position: 'top-center',
              autoClose: 500,
            });
            queryClient.invalidateQueries({
              queryKey: [queryKeys.groupDetailData],
            });
            setShowConfirmModal((prev) => !prev);
            setIsOption('');
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

  const handleDeleteSentence = async (): Promise<void> => {
    try {
      const deleteResponse = await axios.delete(`/api/sentence`, {
        data: {
          groupId: groupData[0]._id,
          sentences: selectSentenceIds,
        },
      });

      if (deleteResponse.status === 201) {
        toast.success('문장 삭제완료', {
          position: 'top-center',
          autoClose: 500,
        });
        queryClient.invalidateQueries({
          queryKey: [queryKeys.groupDetailData],
        });
        setShowConfirmModal((prev) => !prev);
        setIsOption('');
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

  return (
    <>
      <ToastContainer />
      <Seo title={`${groupData[0].name}`} />
      {showConfirmModal && (
        <ConfirmModal
          btn={selectBtn}
          setShowModal={setShowConfirmModal}
          handler={handleChangeGroup}
          deleteHandler={handleDeleteSentence}
          selectSentenceIds={selectSentenceIds}
          setIsSelectSentenceIds={setIsSelectSentenceIds}
        />
      )}
      <section className="flex flex-col w-full gap-3 p-4 pb-32 mx-auto">
        <GroupNavbar name={groupData[0].name} setIsOpen={setIsOpen} />
        {isOpen && (
          <SentenceEditModal setIsOpen={setIsOpen} setIsOption={setIsOption} />
        )}

        {showSelectGroupModal && (
          <SelectGroup
            setShowSelectGroupModal={setShowSelectGroupModal}
            setShowConfirmModal={setShowConfirmModal}
            setIsSelectGroup={setIsSelectGroup}
          />
        )}
        <GroupHeader groupData={groupData} />

        {option && groupData[0].sentences ? (
          <SelectSentence
            option={option}
            groupInfo={groupData[0]}
            setIsOption={setIsOption}
            setSelectBtn={setSelectBtn}
            setShowConfirmModal={setShowConfirmModal}
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
