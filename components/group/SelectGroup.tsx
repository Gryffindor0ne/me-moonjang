import { Dispatch, SetStateAction } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Field, Form, Formik } from 'formik';
import { useSession } from 'next-auth/react';
import { HiOutlineX } from 'react-icons/hi';

import { getGroupsData } from '@pages/index';
import { UserInfo } from '@pages/profile';

type Group = {
  group: string;
};

const SelectGroup = ({
  setShowConfirmModal,
  setIsSelectGroup,
  setShowSelectGroupModal,
}: {
  setShowConfirmModal: Dispatch<SetStateAction<boolean>>;
  setIsSelectGroup: Dispatch<SetStateAction<string>>;
  setShowSelectGroupModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const { data: session } = useSession();

  const fallback: string[] = [];

  const {
    data: groups = fallback,
    isLoading,
    isError,
    error,
  } = useQuery(['groupsData', session?.user], () =>
    getGroupsData(session?.user as UserInfo)
  );

  if (isLoading) return <h3>Loading...</h3>;
  if (isError)
    return (
      <>
        <h3>Oops, something went wrong</h3>
        <p>{error?.toString()}</p>
      </>
    );

  const onSubmit = async (values: Group) => {
    const { group } = values;

    setShowConfirmModal((prev) => !prev);
    setIsSelectGroup(group);
    setShowSelectGroupModal((prev) => !prev);
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
              group: `${groups[0]}`,
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
                  그룹 선택
                </label>
                <div>
                  <Field
                    as="select"
                    name="group"
                    className="bg-gray-50 border border-gray-300 text-gray-900 w-full text-sm rounded-lg focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:outline-none  p-2.5"
                  >
                    {groups.map((group: string, idx: number) => (
                      <option key={idx} value={group}>
                        {group}
                      </option>
                    ))}
                  </Field>
                </div>
                <button
                  className="flex justify-center w-full p-2 tracking-wide text-gray-600 truncate border-l-4 border-transparent border-gray-300 cursor-pointer text-md focus:outline-none hover:bg-gray-50 hover:text-gray-800 hover:border-teal-500"
                  type="submit"
                >
                  그룹 선택
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
