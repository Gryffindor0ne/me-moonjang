import { Dispatch, SetStateAction } from 'react';
import { Field, Form, Formik } from 'formik';
import { HiOutlineX } from 'react-icons/hi';

import { GroupInfo } from '@pages/[groupId]';
import { useGroups } from '@react-query/hooks/groups/useGroups';

type Group = {
  groupName: string;
};

const SelectGroup = ({
  setShowConfirmModal,
  setIsSelectGroup,
  setShowSelectGroupModal,
}: {
  setShowConfirmModal: Dispatch<SetStateAction<boolean>>;
  setIsSelectGroup: Dispatch<SetStateAction<GroupInfo | undefined>>;
  setShowSelectGroupModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const { groups } = useGroups();

  const onSubmit = async (values: Group) => {
    const { groupName } = values;

    setShowConfirmModal((prev) => !prev);
    setIsSelectGroup(groups.filter((group) => group.name === groupName)[0]);
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
