import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { getSession, useSession } from 'next-auth/react';
import axios from 'axios';
import { useRouter } from 'next/router';
import {
  dehydrate,
  QueryClient,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

import { descendingSort } from '@utils/dayjs';
import { UserInfo } from '@pages/profile';
import Sentence, { SentenceDetailInfo } from '@components/group/Sentence';
import Seo from '@components/layout/Seo';
import GroupNavbar from '@components/group/GroupNavbar';
import SentenceEditModal from '@components/modals/SentenceEditModal';
import ConfirmModal from '@components/modals/ConfirmModal';
import SelectSentence from '@components/group/SelectSentence';
import GroupHeader from '@components/group/GroupHeader';
import SelectGroup from '@components/group/SelectGroup';

export type GroupInfo = {
  _id: string;
  name: string;
  email: string;
  createdAt: number;
  updatedAt: number;
  sentences: SentenceDetailInfo[];
};

export const getGroupDetail = async (
  user: UserInfo,
  groupName: string | string[] | undefined
) => {
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_URL}/api/group/detail`,
    {
      email: user.email,
      name: groupName,
    }
  );
  return data;
};

const SentenceByGroup = () => {
  const SERVER_ERROR = 'There was an error contacting the server.';

  const [isOpen, setIsOpen] = useState(false);
  const [showSelectGroupModal, setShowSelectGroupModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectBtn, setSelectBtn] = useState('');
  const [selectedSentenceIds, setIsSelectedSentenceIds] = useState<string[]>(
    []
  );
  const [selectedSentence, setIsSelectedSentence] = useState<
    SentenceDetailInfo[]
  >([]);
  const [selectedGroup, setIsSelectGroup] = useState('');
  const [option, setIsOption] = useState('');

  const router = useRouter();
  const { groupName } = router.query;

  const { data: session } = useSession();
  const user = session?.user as UserInfo;

  const queryClient = useQueryClient();
  const {
    data: groupData,
    isLoading,
    isError,
    error,
  } = useQuery(['groupDetailInfo', user, groupName], () =>
    getGroupDetail(user, groupName)
  );

  if (isLoading) return;
  if (isError)
    return (
      <>
        <h3>Oops, something went wrong</h3>
        <p>{error?.toString()}</p>
      </>
    );

  const handleChangeGroup = async (): Promise<void> => {
    try {
      const response = await axios.post(`api/sentence/move`, {
        email: groupData[0].email,
        name: selectedGroup,
        sentences: selectedSentence,
      });

      if (response.status === 201) {
        try {
          const deleteResponse = await axios.delete(`/api/sentence/delete`, {
            data: {
              email: groupData[0].email,
              name: groupData[0].name,
              sentences: selectedSentenceIds,
            },
          });
          if (deleteResponse.status === 201) {
            toast.success('문장 이동완료', {
              position: 'top-center',
              autoClose: 500,
            });
            queryClient.invalidateQueries({ queryKey: ['groupDetailInfo'] });
            setShowConfirmModal((prev) => !prev);
            setIsOption('');
            setIsOpen(false);
            setTimeout(() => {
              router.push(`/${groupData[0].name}`);
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
      const deleteResponse = await axios.delete(`/api/sentence/delete`, {
        data: {
          email: groupData[0].email,
          name: groupData[0].name,
          sentences: selectedSentenceIds,
        },
      });

      if (deleteResponse.status === 201) {
        toast.success('문장 삭제완료', {
          position: 'top-center',
          autoClose: 500,
        });
        queryClient.invalidateQueries({ queryKey: ['groupDetailInfo'] });
        setShowConfirmModal((prev) => !prev);
        setIsOption('');
        setIsOpen(false);
        setTimeout(() => {
          router.push(`/${groupData[0].name}`);
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
          selectedSentenceIds={selectedSentenceIds}
          setIsSelectedSentenceIds={setIsSelectedSentenceIds}
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
        <GroupHeader groupData={groupData} name={groupData[0].name} />

        {option && groupData[0].sentences ? (
          <SelectSentence
            option={option}
            sentences={descendingSort(groupData[0].sentences)}
            groupName={groupData[0].name}
            setIsOption={setIsOption}
            setSelectBtn={setSelectBtn}
            setShowConfirmModal={setShowConfirmModal}
            setIsSelectedSentenceIds={setIsSelectedSentenceIds}
            setIsSelectedSentence={setIsSelectedSentence}
            setShowSelectGroupModal={setShowSelectGroupModal}
          />
        ) : groupData[0].sentences && groupData[0].sentences.length !== 0 ? (
          descendingSort(groupData[0].sentences).map((sentenceInfo, idx) => (
            <Sentence
              key={idx}
              data={sentenceInfo}
              groupName={groupData[0].name}
            />
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
  const groupName = context.params?.groupName;
  const session = await getSession(context);
  const user = session?.user as UserInfo;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['groupDetailInfo'],
    queryFn: () => getGroupDetail(user, groupName),
  });

  return {
    props: {
      session,
      dehydreatedState: dehydrate(queryClient),
    },
  };
};

export default SentenceByGroup;
