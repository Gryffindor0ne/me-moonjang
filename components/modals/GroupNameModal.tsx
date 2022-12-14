import React, { Dispatch, SetStateAction } from 'react';
import { useSession } from 'next-auth/react';
import { useQueryClient } from '@tanstack/react-query';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { HiOutlineX } from 'react-icons/hi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { UserInfo } from '@pages/profile';

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

const GroupNameModal = ({
  selectBtn,
  selectGroupName,
  setIsOpen,
  setIsSelectBtn,
  setIsCreated,
  setIsSelectGroupName,
}: {
  selectBtn?: string;
  selectGroupName?: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setIsSelectBtn: Dispatch<SetStateAction<string>>;
  setIsCreated: Dispatch<SetStateAction<boolean>>;
  setIsSelectGroupName: Dispatch<SetStateAction<string>>;
}) => {
  const { data: session } = useSession();
  const user = session?.user as UserInfo;
  const queryClient = useQueryClient();

  const messageSet = [
    {
      btn: 'createGroup',
      title: '문장집 추가',
      description: '새로운 문장집 이름을 입력하세요.',
    },
    {
      btn: 'updateGroup',
      title: '문장집 이름변경',
      description: '변경할 문장집 이름을 입력하세요.',
    },
  ];

  const handleCloseModal = () => {
    setIsOpen(false);
    setIsSelectBtn('');
    setIsSelectGroupName('');
  };

  const changeGroupName = async (value: GroupProps) => {
    const { name } = value;

    try {
      const res = await axios.post(`api/group/update`, {
        previouseName: selectGroupName,
        name,
        email: user.email,
      });

      if (res.status === 201) {
        toast.success('문장집 변경완료', {
          position: 'top-center',
          autoClose: 500,
        });
        setIsOpen((prev) => !prev);
        setIsSelectBtn('');
        setIsSelectGroupName('');
        queryClient.invalidateQueries({ queryKey: ['groupsData'] });
      }
    } catch (error) {
      let message;
      if (axios.isAxiosError(error) && error.response) {
        message = error.response.data.message;
        console.error(message);
        if (error.response.status === 422) {
          toast.warning('동일한 문장집 이름이 존재합니다.', {
            position: 'top-center',
            autoClose: 1000,
          });
        }
      } else message = String(error);
      console.error(message);
    }
  };

  const onSubmit = async (value: GroupProps) => {
    const { name } = value;

    try {
      const res = await axios.post(`api/group`, {
        name,
        email: user.email,
      });

      if (res.status === 201) {
        setIsCreated((prev) => !prev);
        setIsOpen((prev) => !prev);
        queryClient.invalidateQueries({ queryKey: ['groupsData'] });
      }
    } catch (error) {
      let message;
      if (axios.isAxiosError(error) && error.response) {
        message = error.response.data.message;
        console.error(message);
        if (error.response.status === 422) {
          toast.warning('동일한 문장집 이름이 존재합니다.', {
            position: 'top-center',
            autoClose: 1000,
          });
        }
      } else message = String(error);
      console.error(message);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="fixed z-50 flex items-center justify-center w-full max-w-md pr-6 outline-none md:h-[50vh] md:p-0 md:ml-6 focus:outline-none">
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
                {selectBtn === 'updateGroup'
                  ? messageSet[1].title
                  : messageSet[0].title}
              </h3>
              <Formik
                initialValues={{
                  name: selectGroupName ? `${selectGroupName}` : '',
                }}
                onSubmit={
                  selectBtn === 'updateGroup' ? changeGroupName : onSubmit
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
                      {selectBtn === 'updateGroup'
                        ? messageSet[1].description
                        : messageSet[0].description}
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
                      {selectBtn === 'updateGroup'
                        ? messageSet[1].title
                        : messageSet[0].title}
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
