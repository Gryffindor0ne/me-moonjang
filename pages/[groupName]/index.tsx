import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

import dbConnect from '@lib/db';
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

const SentenceByGroup = ({
  groupData,
  allGroups,
}: {
  groupData: GroupInfo[];
  allGroups: string[];
}) => {
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
              autoClose: 700,
            });
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
          autoClose: 700,
        });
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
      <section className="flex flex-col w-full gap-3 p-4 mx-auto">
        <GroupNavbar name={groupData[0].name} setIsOpen={setIsOpen} />
        {isOpen && (
          <SentenceEditModal setIsOpen={setIsOpen} setIsOption={setIsOption} />
        )}

        {showSelectGroupModal && (
          <SelectGroup
            setShowSelectGroupModal={setShowSelectGroupModal}
            groups={allGroups}
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

  const client = await dbConnect();
  const db = client.db();
  const groupsCollection = db.collection('groups');
  const groupData = await groupsCollection
    .find({ name: groupName, email: user?.email })
    .toArray();

  const data = await groupsCollection
    .find(
      { name: { $exists: 1 }, email: user?.email },
      { projection: { _id: 0 } }
    )
    .toArray();

  const allGroups = data.map(({ name }) => name);

  client.close();

  return {
    props: {
      groupData: JSON.parse(JSON.stringify(groupData)),
      allGroups: JSON.parse(JSON.stringify(allGroups)),
    },
  };
};

export default SentenceByGroup;
