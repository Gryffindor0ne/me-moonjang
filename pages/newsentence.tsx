import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import * as yup from 'yup';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdOutlineArrowBackIos } from 'react-icons/md';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

import Layout from '@components/layout/Layout';
import Seo from '@components/layout/Seo';
import styles from '@styles/Form.module.css';
import { UserInfo } from '@pages/profile';
import { getGroupsData } from '@pages/index';

export type SentenceInfo = {
  group: string;
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
  const { name } = router.query;
  const { data: session } = useSession();
  const user = session?.user as UserInfo;

  const fallback: string[] = [];
  const {
    data: groups = fallback,
    isLoading,
    isError,
    error,
  } = useQuery(['groupsData', user], () => getGroupsData(user));

  if (isLoading) return;
  if (isError)
    return (
      <>
        <h3>Oops, something went wrong</h3>
        <p>{error?.toString()}</p>
      </>
    );

  const onSubmit = async (values: SentenceInfo): Promise<void> => {
    const { group, sentence, interpretation, explanation } = values;

    try {
      const res = await axios.post(`api/sentence`, {
        email: user.email,
        group,
        sentence,
        interpretation,
        explanation,
      });

      if (res.status === 201) {
        toast.success('문장 등록완료', {
          position: 'top-center',
          autoClose: 1000,
        });
        setTimeout(() => router.push(name ? `/${name}` : `${group}`), 1600);
      }
    } catch (error) {
      let message;
      if (axios.isAxiosError(error) && error.response) {
        message = error.response.data.message;
        console.error(message);
        if (error.response.status === 422) {
          toast.warning('동일한 문장이 존재합니다.', {
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
      <Seo title="문장등록" />
      <Layout>
        <section className="flex flex-col w-full gap-5 p-4 mx-auto">
          <div className="flex pr-8">
            <span
              onClick={() => router.back()}
              className="flex items-center justify-center pl-4 text-2xl cursor-pointer"
            >
              <MdOutlineArrowBackIos />
            </span>
            <h1 className="flex py-2 mx-auto my-16 text-xl font-bold text-gray-800 md:2xl">
              문장 등록
            </h1>
          </div>

          {groups.length !== 0 ? (
            <Formik
              initialValues={{
                group: name ? `${name}` : `${groups[0]}`,
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
                  {!name && (
                    <>
                      <label className={styles.label} htmlFor="groups">
                        문장집 선택
                      </label>
                      <div>
                        <Field
                          as="select"
                          name="group"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 focus:outline-none w-full p-2.5"
                        >
                          {groups.map((group, idx) => (
                            <option key={idx} value={group}>
                              {group}
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
