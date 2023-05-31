import { useSession } from 'next-auth/react';
import { Field, Form, Formik } from 'formik';
import { useRecoilState } from 'recoil';
import { useRouter } from 'next/router';

import Sentence, { SentenceDetailInfo } from '@components/group/Sentence';
import { UserInfo } from '@pages/profile';
import { descendingSort } from '@utils/dayjs';
import { useCustomToast } from '@hooks/useCustomToast';
import { contextState } from '@recoil/atoms/common';
import useModal from '@hooks/useModal';
import { useRemoveSentence } from '@react-query/hooks/sentence/useRemoveSentence';

import { useSentence } from '@react-query/hooks/sentence/useSentence';

type SelectSentenceInfo = {
  sentenceIds: string[];
};

const SelectSentence = () => {
  const { data: session } = useSession();
  const user = session?.user as UserInfo;
  const handleCancel = () => {
    setContext('');
  };
  const toast = useCustomToast();
  const removeSentenceMutate = useRemoveSentence();

  const router = useRouter();

  const { groupData, isLoading } = useSentence();

  const [context, setContext] = useRecoilState(contextState);
  const { showModal, hideModal } = useModal();

  if (isLoading) return null;

  const onSubmit = (value: SelectSentenceInfo) => {
    const { sentenceIds } = value;

    if (sentenceIds.length === 0) {
      toast({
        title: '선택된 문장이 없습니다!',
        status: 'warning',
      });
      return;
    }

    const handleDeleteSentence = async () => {
      hideModal();

      removeSentenceMutate({
        groupId: groupData._id,
        sentenceIds,
      });

      setContext('');
      setTimeout(() => {
        router.push(`/${groupData._id}`);
      }, 100);
    };

    const selectSentences: SentenceDetailInfo[] = descendingSort(
      groupData.sentences
    ).filter((sentence: SentenceDetailInfo) =>
      sentenceIds.includes(sentence.id)
    );

    if (context === 'deleteSentence' && user.email === 'guest@memoonjang.com') {
      toast({
        title: '게스트는 삭제권한이 없습니다!',
        status: 'warning',
      });
      return;
    }

    if (context === 'changeGroup') {
      showModal({
        modalType: 'GroupSelectModal',
        modalProps: {
          selectSentence: selectSentences,
          selectSentenceIds: sentenceIds,
        },
      });
    }
    if (context === 'deleteSentence') {
      showModal({
        modalType: 'ConfirmModal',
        modalProps: {
          handler: handleDeleteSentence,
        },
      });
    }
  };

  return (
    <>
      <Formik
        initialValues={{
          sentenceIds: [],
        }}
        onSubmit={onSubmit}
      >
        {(props) => (
          <Form className="flex flex-col gap-4" onSubmit={props.handleSubmit}>
            {descendingSort(groupData.sentences).map((sentence) => {
              return (
                <label key={sentence.id} className="inline-flex items-center">
                  <Field
                    className="w-5 h-5 ml-2 mr-4 text-teal-600 rounded-md border-1 focus:ring-0"
                    name="sentenceIds"
                    type="checkbox"
                    value={sentence.id}
                  />
                  <Sentence data={sentence} />
                </label>
              );
            })}

            <button
              className="inline-flex justify-center w-full text-white bg-teal-500 hover:bg-teal-600 tracking-wider
              focus:ring-2 rounded-md shadow-sm border border-transparent mt-5 focus:outline-none focus:ring-teal-300 focus:ring-offset-1 font-medium px-5 py-2.5 sm:ml-3 sm:w-auto sm:text-lg"
              type="submit"
            >
              {context === 'changeGroup' ? `문장집 변경` : `삭제`}
            </button>
            <button
              type="button"
              className="inline-flex justify-center w-full px-5 py-2.5  tracking-wider mt-1 font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 sm:mt-0 sm:ml-3 sm:w-auto sm:text-lg"
              onClick={handleCancel}
            >
              취소
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default SelectSentence;
