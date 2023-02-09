import { Dispatch, SetStateAction } from 'react';
import { useSession } from 'next-auth/react';
import { Field, Form, Formik } from 'formik';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Sentence, { SentenceDetailInfo } from '@components/group/Sentence';
import { UserInfo } from '@pages/profile';
import { GroupInfo } from '@pages/[groupName]';

type SelectSentenceInfo = {
  selected: string[];
};

const SelectSentence = ({
  option,
  groupInfo,
  sentences,
  setIsOption,
  setSelectBtn,
  setShowConfirmModal,
  setIsSelectedSentence,
  setIsSelectedSentenceIds,
  setShowSelectGroupModal,
}: {
  option: string;
  groupInfo: GroupInfo;
  sentences: SentenceDetailInfo[];
  setIsOption: Dispatch<SetStateAction<string>>;
  setSelectBtn: Dispatch<SetStateAction<string>>;
  setShowConfirmModal: Dispatch<SetStateAction<boolean>>;
  setIsSelectedSentenceIds: Dispatch<SetStateAction<string[]>>;
  setIsSelectedSentence: Dispatch<SetStateAction<SentenceDetailInfo[]>>;
  setShowSelectGroupModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const { data: session } = useSession();
  const user = session?.user as UserInfo;
  const handleCancel = () => {
    setIsOption('');
  };

  const onSubmit = (value: SelectSentenceInfo) => {
    const { selected } = value;

    if (selected.length === 0) {
      toast.warning('선택된 문장이 없습니다!', {
        position: 'top-center',
        autoClose: 1500,
      });
      return;
    }

    const selectedSentences: SentenceDetailInfo[] = sentences.filter(
      (sentence: SentenceDetailInfo) => selected.includes(sentence.id)
    );

    setSelectBtn(`${option}`);
    setIsSelectedSentenceIds(selected);

    if (option === 'deleteSentence' && user.email === 'guest@memoonjang.com') {
      toast.warning('게스트는 삭제권한이 없습니다!', {
        position: 'top-center',
        autoClose: 1500,
      });
      return;
    }

    if (option === 'changeGroup') {
      setShowSelectGroupModal((prev) => !prev);
      setIsSelectedSentence(selectedSentences);
    }
    if (option === 'deleteSentence') setShowConfirmModal((prev) => !prev);
  };

  return (
    <>
      <ToastContainer />
      <Formik
        initialValues={{
          selected: [],
        }}
        onSubmit={onSubmit}
      >
        {(props) => (
          <Form className="flex flex-col gap-4" onSubmit={props.handleSubmit}>
            {sentences.map((sentence) => {
              return (
                <label key={sentence.id} className="inline-flex items-center">
                  <Field
                    className="w-5 h-5 ml-2 mr-4 text-teal-600 rounded-md border-1 focus:ring-0"
                    name="selected"
                    type="checkbox"
                    value={sentence.id}
                  />
                  <Sentence data={sentence} groupInfo={groupInfo} />
                </label>
              );
            })}

            <button
              className="inline-flex justify-center w-full text-white bg-teal-500 hover:bg-teal-600 tracking-wider
              focus:ring-2 rounded-md shadow-sm border border-transparent mt-5 focus:outline-none focus:ring-teal-300 focus:ring-offset-1 font-medium px-5 py-2.5 sm:ml-3 sm:w-auto sm:text-lg"
              type="submit"
            >
              {option === 'changeGroup' ? `문장집 변경` : `삭제`}
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
