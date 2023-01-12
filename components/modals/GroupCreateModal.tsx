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
    .max(15, '문장집 이름은 최대 15자 이내이어야 합니다.')
    .min(2, '문장집 이름을 2자 이상 입력해주세요.')
    .required('문장집 이름을 입력해주세요.'),
});

type GroupProps = {
  name: string;
};

const GroupCreateModal = ({
  setIsOpen,
  setIsCreated,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setIsCreated: Dispatch<SetStateAction<boolean>>;
}) => {
  const { data: session } = useSession();
  const user = session?.user as UserInfo;
  const queryClient = useQueryClient();

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const onSubmit = async (value: GroupProps) => {
    const { name } = value;
    try {
      const res = await axios.post('api/group', {
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
      <div
        id="group-created-modal"
        className="fixed z-50 flex items-center justify-center outline-none md:p-10 focus:outline-none"
      >
        <div className="relative w-full h-auto max-w-sm p-20 md:ml-8 md:p-10">
          <div className="relative bg-white rounded-lg shadow">
            <button
              onClick={handleCloseModal}
              type="button"
              className="absolute top-3 right-2.5 text-gray-400 bg-transparent
           hover:bg-gray-200 hover:text-gray-900 rounded-lg text-lg  p-2.5 ml-auto 
           inline-flex items-center"
            >
              <HiOutlineX />
            </button>
            <div className="px-6 py-6 lg:px-8">
              <h3 className="mb-4 text-lg font-medium text-gray-900 md:text-xl ">
                문장집 추가
              </h3>
              <Formik
                initialValues={{
                  name: '',
                }}
                onSubmit={onSubmit}
                validationSchema={userSchema}
              >
                {(props) => (
                  <Form
                    className="flex flex-col gap-4"
                    onSubmit={props.handleSubmit}
                  >
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900"
                      htmlFor="name"
                    >
                      새로운 문장집 이름을 입력하세요.
                    </label>
                    <div>
                      <Field
                        className="bg-gray-50 border-b-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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
                     focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 
                    text-center"
                      type="submit"
                    >
                      문장집 추가
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

export default GroupCreateModal;
