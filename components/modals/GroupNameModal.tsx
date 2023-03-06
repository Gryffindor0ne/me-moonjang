import React, { Dispatch, SetStateAction } from 'react';
import { useSession } from 'next-auth/react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as yup from 'yup';
import { HiOutlineX } from 'react-icons/hi';
import { useRecoilState, useRecoilValue } from 'recoil';

import { UserInfo } from '@pages/profile';
import { useGroups } from '@react-query/hooks/groups/useGroups';
import { useChangeGroupName } from '@react-query/hooks/groups/useChangeGroupName';
import { useNewGroup } from '@react-query/hooks/groups/useNewGroup';
import { contextState } from '@recoil/atoms/common';
import { selectContext } from '@recoil/selectors/common';
import useModal from '@components/hooks/useModal';

export const userSchema = yup.object().shape({
  name: yup
    .string()
    .max(20, '문장집 이름은 최대 20자 이내이어야 합니다.')
    .min(2, '문장집 이름을 2자 이상 입력해주세요.')
    .required('문장집 이름을 입력해주세요.'),
});

type GroupProps = {
  name: string;
};

export type GroupNameModalProps = {
  selectGroupId: string;
  setIsSelectGroupId: Dispatch<SetStateAction<string>>;
};

const GroupNameModal = ({
  selectGroupId,
  setIsSelectGroupId,
}: GroupNameModalProps) => {
  const { data: session } = useSession();
  const user = session?.user as UserInfo;

  const changeName = useChangeGroupName();
  const newGroupRegister = useNewGroup();

  const [context, setContext] = useRecoilState(contextState);
  const currentContext = useRecoilValue(selectContext);
  const { groups, isLoading } = useGroups();
  const { hideModal } = useModal();

  if (isLoading) return null;

  const handleCloseModal = () => {
    hideModal();
    setContext('');
    setIsSelectGroupId('');
  };

  const changeGroupName = (value: GroupProps) => {
    const { name } = value;

    changeName({ name, groupId: selectGroupId });

    hideModal();
    setContext('');
    setIsSelectGroupId('');
  };

  const newGroup = async (value: GroupProps) => {
    const { name } = value;

    newGroupRegister({ name, email: user.email });
    hideModal();

    setContext('');
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center w-full outline-none md:p-0 focus:outline-none">
        <div className="relative w-full h-auto max-w-sm p-10 md:p-2">
          <div className="relative bg-white rounded-lg shadow">
            <button
              onClick={handleCloseModal}
              type="button"
              className="absolute top-3 right-2.5 text-gray-400 bg-transparent
           hover:bg-gray-200 hover:text-gray-900 rounded-lg text-lg p-2.5 ml-auto 
           inline-flex items-center"
            >
              <HiOutlineX />
            </button>
            <div className="px-6 py-6 lg:px-8">
              <h3 className="mb-4 text-xl font-medium text-gray-900 md:text-xl">
                {currentContext?.title}
              </h3>
              <Formik
                initialValues={{
                  name: selectGroupId
                    ? `${
                        groups?.filter(
                          (group) => group._id === selectGroupId
                        )[0].name
                      }`
                    : '',
                }}
                onSubmit={
                  context === 'updateGroup' ? changeGroupName : newGroup
                }
                validationSchema={userSchema}
              >
                {(props) => (
                  <Form
                    className="flex flex-col gap-4"
                    onSubmit={props.handleSubmit}
                  >
                    <label
                      className="block mb-2 font-medium text-gray-900"
                      htmlFor="name"
                    >
                      {currentContext?.description}
                    </label>
                    <div>
                      <Field
                        className="bg-gray-50 border-b-2 border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        name="name"
                        type="text"
                        placeholder="문장집 이름 입력"
                        autoComplete="off"
                      />
                    </div>
                    <ErrorMessage
                      className="mx-2 my-2 text-sm text-red-500"
                      name="name"
                      component="div"
                    />

                    <button
                      className="w-full text-white bg-teal-500 hover:bg-teal-600 focus:ring-4 
                     focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-base px-5 py-2.5 
                    text-center"
                      type="submit"
                    >
                      {currentContext?.title}
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
      <div
        onClick={handleCloseModal}
        className="fixed inset-0 z-40 bg-gray-900 opacity-30"
      ></div>
    </>
  );
};

export default GroupNameModal;
