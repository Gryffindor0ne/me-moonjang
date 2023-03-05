import { Dispatch, SetStateAction } from 'react';
import { Field, Form, Formik } from 'formik';
import { HiOutlineX } from 'react-icons/hi';
import axios from 'axios';
import { useSetRecoilState } from 'recoil';
import { useRouter } from 'next/router';

import useModal from '@components/hooks/useModal';
import { SentenceDetailInfo } from '@components/group/Sentence';
import { useRemoveSentence } from '@react-query/hooks/sentence/useRemoveSentence';
import { useGroup } from '@react-query/hooks/groups/useGroup';
import { useGroups } from '@react-query/hooks/groups/useGroups';
import { contextState } from '@recoil/atoms/common';

type Group = {
  groupName: string;
};

export type GroupInfo = {
  _id: string;
  name: string;
  email: string;
  createdAt: number;
  updatedAt: number;
  sentences: SentenceDetailInfo[];
};

const SelectGroup = ({
  setIsOpen,
  selectSentence,
  selectSentenceIds,
  setIsSelectSentenceIds,
  setShowSelectGroupModal,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  selectSentence: SentenceDetailInfo[];
  selectSentenceIds: string[];
  setIsSelectSentenceIds: Dispatch<SetStateAction<string[]>>;
  setShowSelectGroupModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const { showModal, hideModal } = useModal();
  const { groups } = useGroups();
  const { removeSentenceMutate } = useRemoveSentence();
  const { groupData, isLoading } = useGroup();

  const setContext = useSetRecoilState(contextState);

  if (isLoading) return null;

  const onSubmit = async (values: Group) => {
    const { groupName } = values;
    const groupId = groups.filter((group) => group.name === groupName)[0]._id;
    setShowSelectGroupModal((prev) => !prev);

    const handleChangeGroup = async (): Promise<void> => {
      try {
        const response = await axios.patch(
          `api/sentence/actions/change-group`,
          {
            id: groupId,
            sentences: selectSentence,
          }
        );

        if (response.status === 201) {
          hideModal();

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
            : 'There was an error contacting the server.';

        console.error(message);
      }
    };

    showModal({
      modalType: 'ConfirmModal',
      modalProps: {
        handler: handleChangeGroup,
        selectSentenceIds,
        setIsSelectSentenceIds,
      },
    });
  };

  return (
    <>
      <div className="fixed z-50 flex items-center justify-center w-full max-w-md pl-8 mt-10 overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
        <div className="relative w-3/4 max-w-xs p-4 bg-white rounded-md md:p-2 md:w-full">
          <button
            onClick={() => setShowSelectGroupModal((prev) => !prev)}
            type="button"
            className="absolute top-2 right-2 text-gray-400 bg-transparent
           hover:bg-gray-200 hover:text-gray-900 rounded-lg text-lg p-2.5 ml-auto 
           inline-flex items-center"
          >
            <HiOutlineX />
          </button>

          <Formik
            initialValues={{
              groupName: `${groups[0].name}`,
            }}
            onSubmit={onSubmit}
          >
            {(props) => (
              <Form
                className="flex flex-col gap-3 pt-5 space-y-1 md:px-2"
                onSubmit={props.handleSubmit}
              >
                <label
                  className="pl-3 text-xs font-light tracking-wide text-gray-500"
                  htmlFor="groups"
                >
                  문장집 선택
                </label>
                <div>
                  <Field
                    as="select"
                    name="groupName"
                    className="bg-gray-50 border border-gray-300 text-gray-900 w-full text-sm rounded-lg focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:outline-none  p-2.5"
                  >
                    {groups
                      .map((group) => group.name)
                      .map((groupName: string, idx: number) => (
                        <option key={idx} value={groupName}>
                          {groupName}
                        </option>
                      ))}
                  </Field>
                </div>
                <button
                  className="flex justify-center w-full p-2 tracking-wide text-gray-600 truncate border-l-4 border-transparent border-gray-300 cursor-pointer text-md focus:outline-none hover:bg-gray-50 hover:text-gray-800 hover:border-teal-500"
                  type="submit"
                >
                  문장집 선택
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      <div
        onClick={() => setShowSelectGroupModal((prev) => !prev)}
        className="fixed inset-0 bg-gray-900 z-100 opacity-30"
      ></div>
    </>
  );
};

export default SelectGroup;
