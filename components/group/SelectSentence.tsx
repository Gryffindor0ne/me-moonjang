import { Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/router';
import { Field, Form, Formik } from 'formik';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Sentence, { SentenceDetailInfo } from '@components/group/Sentence';

type SelectSentenceInfo = {
  checked: string[];
};

const SelectSentence = ({
  groupName,
  sentences,
  setIsOption,
  setSelectBtn,
  setShowConfirmModal,
  setIsSelectedSentence,
}: {
  groupName: string;
  sentences: SentenceDetailInfo[];
  setIsOption: Dispatch<SetStateAction<string>>;
  setSelectBtn: Dispatch<SetStateAction<string>>;
  setShowConfirmModal: Dispatch<SetStateAction<boolean>>;
  setIsSelectedSentence: Dispatch<SetStateAction<string[]>>;
}) => {
  const router = useRouter();

  const handleCancel = () => {
    setIsOption('');
  };

  const onSubmit = (value: SelectSentenceInfo) => {
    const { checked } = value;

    if (checked.length === 0) {
      toast.warning('선택된 문장이 없습니다!', {
        position: 'top-center',
        autoClose: 1500,
      });
      return;
    }

    setSelectBtn('deleteSentence');
    setIsSelectedSentence(checked);
    setShowConfirmModal(true);
  };

  return (
    <>
      <ToastContainer />
      <Formik
        initialValues={{
          checked: [],
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
                    name="checked"
                    type="checkbox"
                    value={sentence.id}
                  />
                  <Sentence data={sentence} groupName={groupName} />
                </label>
              );
            })}

            <button
              className="inline-flex justify-center w-full text-white bg-teal-500 hover:bg-teal-600 
              focus:ring-2 rounded-md shadow-sm border border-transparent mt-5 focus:outline-none focus:ring-teal-300 focus:ring-offset-1 font-medium  text-md px-5 py-2.5 sm:ml-3 sm:w-auto sm:text-sm"
              type="submit"
            >
              삭제
            </button>
            <button
              type="button"
              className="inline-flex justify-center w-full px-5 py-2.5  mt-1 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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
