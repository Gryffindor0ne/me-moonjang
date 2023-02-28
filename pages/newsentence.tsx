import { useRouter } from 'next/router';
import * as yup from 'yup';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { MdOutlineArrowBackIos } from 'react-icons/md';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

import Layout from '@components/layout/Layout';
import Seo from '@components/layout/Seo';
import styles from '@styles/Form.module.css';
import { GroupInfo } from '@pages/[groupId]';
import { useGroups } from '@react-query/hooks/groups/useGroups';
import { useNewSentence } from '@react-query/hooks/sentence/useNewSentence';

export type SentenceInfo = {
  groupName: string;
  sentence: string;
  interpretation: string;
  explanation: string;
};

export const sentenceSchema = yup.object().shape({
  sentence: yup
    .string()
    .required('문장을 입력하세요.')
    .max(500, '500자 이내로 입력해주세요.')
    .matches(/^[a-zA-Z0-9?!()*&.,’'"-_\/\s]+$/, '올바른 입력이 아닙니다.'),
  interpretation: yup
    .string()
    .required('해석을 입력하세요.')
    .max(500, '500자 이내로 입력해주세요.'),
  explanation: yup.string().max(500, '500자 이내로 입력해주세요.'),
});

const SentenceInputPage = () => {
  const router = useRouter();
  const { groupId } = router.query;

  const { groups } = useGroups();
  const newSentence = useNewSentence();

  const groupNames = groups.map((group) => group.name);

  const onSubmit = async (values: SentenceInfo) => {
    const { groupName, sentence, interpretation, explanation } = values;
    const selectGroupId = groups.filter((group) => group.name === groupName)[0]
      ._id;

    newSentence({
      id: groupId ? `${groupId}` : `${selectGroupId}`,
      sentence,
      interpretation,
      explanation,
    });

    setTimeout(
      () => router.push(groupId ? `/${groupId}` : `${selectGroupId}`),
      1600
    );
  };

  return (
    <>
      <Seo title="문장등록" />
      <Layout>
        <section className="flex flex-col w-full p-5 mx-auto">
          <div className="flex">
            <span
              onClick={() => router.back()}
              className="flex items-center justify-center px-2 text-lg cursor-pointer"
            >
              <MdOutlineArrowBackIos />
            </span>
            <h1 className="flex py-2 pr-4 mx-auto my-8 text-xl font-bold text-gray-800 md:text-2xl">
              문장 등록
            </h1>
          </div>

          {groups.length !== 0 ? (
            <Formik
              initialValues={{
                groupName: groupId
                  ? `${
                      groups.filter(
                        (group: GroupInfo) => group._id === groupId
                      )[0].name
                    }`
                  : `${groupNames[0]}`,
                sentence: '',
                interpretation: '',
                explanation: '',
              }}
              onSubmit={onSubmit}
              validationSchema={sentenceSchema}
            >
              {(props) => (
                <Form
                  className="flex flex-col gap-2"
                  onSubmit={props.handleSubmit}
                >
                  {!groupId && (
                    <>
                      <label className={styles.label} htmlFor="groups">
                        문장집 선택
                      </label>
                      <div>
                        <Field
                          as="select"
                          name="groupName"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:outline-none w-full p-2.5"
                        >
                          {groupNames.map((groupName, idx) => (
                            <option key={idx} value={groupName}>
                              {groupName}
                            </option>
                          ))}
                        </Field>
                      </div>
                    </>
                  )}
                  <label className={styles.label} htmlFor="sentence">
                    문장
                  </label>
                  <div>
                    <Field
                      className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:outline-none"
                      name="sentence"
                      type="text"
                      placeholder="문장 입력"
                      component="textarea"
                      rows="3"
                    />
                  </div>
                  <ErrorMessage
                    className={styles.errorMsg}
                    name="sentence"
                    component="div"
                  />
                  <label className={styles.label} htmlFor="interpretation">
                    해석
                  </label>
                  <div>
                    <Field
                      className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:outline-none"
                      name="interpretation"
                      type="text"
                      placeholder="해석 입력"
                      component="textarea"
                      rows="3"
                    />
                  </div>
                  <ErrorMessage
                    className={styles.errorMsg}
                    name="interpretation"
                    component="div"
                  />
                  <label className={styles.label} htmlFor="explanation">
                    설명
                  </label>
                  <div>
                    <Field
                      className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:outline-none"
                      name="explanation"
                      type="text"
                      placeholder="설명 입력(선택)"
                      component="textarea"
                      rows="4"
                    />
                  </div>
                  <ErrorMessage
                    className={styles.errorMsg}
                    name="explanation"
                    component="div"
                  />

                  <button className={styles.button} type="submit">
                    문장 등록하기
                  </button>
                </Form>
              )}
            </Formik>
          ) : (
            <div className="flex flex-col items-center justify-center p-2 mt-10 text-xl text-center">
              <div className="p-2 text-3xl text-center text-teal-500 md:text-4xl">
                <HiOutlineExclamationCircle />
              </div>
              <div className="flex p-2 mx-auto text-base font-bold text-teal-500 md:text-xl">
                생성된 문장집이 없습니다.
              </div>
            </div>
          )}
        </section>
      </Layout>
    </>
  );
};

export default SentenceInputPage;
