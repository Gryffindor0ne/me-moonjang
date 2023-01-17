import { useState } from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as yup from 'yup';
import { GoEyeClosed, GoEye } from 'react-icons/go';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import styles from '@styles/Form.module.css';
import Seo from '@components/layout/Seo';

export type AuthType = 'memoonjang';

export type UserInputInfo = {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  authType: AuthType;
};

export const userSchema = yup.object().shape({
  email: yup
    .string()
    .email('잘못된 형식입니다.')
    .required('이메일을 입력해주세요.'),
  username: yup
    .string()
    .max(15, '이름은 최대 15자 이내이어야 합니다.')
    .min(2, '이름을 2자 이상 입력해주세요.')
    .required('이름을 입력해주세요.'),
  password: yup
    .string()
    .required('비밀번호를 입력해주세요.')
    .matches(
      /^(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/,
      '최소 6자이상 / 숫자, 특수문자 1개이상 포함해야 합니다.'
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], '비밀번호가 일치하지 않습니다.')
    .required('비밀번호가 일치하지 않습니다.'),
});

const Register: NextPage = () => {
  const router = useRouter();
  const [show, setShow] = useState({ password: false, confirmPassword: false });

  const onSubmit = async (values: UserInputInfo) => {
    const { email, password, username, authType } = values;

    try {
      const res = await axios.post('/api/auth/signup', {
        email,
        password,
        username,
        authType,
      });

      if (res.status === 201) {
        toast.success('회원가입 완료!', {
          position: 'top-center',
          autoClose: 2000,
        });
        setTimeout(() => router.replace('/auth/login'), 2500);
      }
    } catch (error) {
      let message;
      if (axios.isAxiosError(error) && error.response) {
        message = error.response.data.message;
        console.error(message);
        if (error.response.status === 422) {
          toast.warning('동일한 이메일이 존재합니다.', {
            position: 'top-center',
            autoClose: 2000,
          });
        }
      } else message = String(error);
      console.error(message);
    }
  };

  return (
    <>
      <Seo title="회원가입" />
      <ToastContainer />
      <section className="flex flex-col w-full gap-2 p-10 mx-auto">
        <h1 className="flex py-2 mx-auto my-4 text-2xl font-bold text-gray-800 md:my-10 md:text-3xl">
          회원가입
        </h1>
        <Formik
          initialValues={{
            email: '',
            password: '',
            confirmPassword: '',
            username: '',
            authType: 'memoonjang',
          }}
          onSubmit={onSubmit}
          validationSchema={userSchema}
        >
          {(props) => (
            <Form
              className="flex flex-col gap-2 md:gap-5"
              onSubmit={props.handleSubmit}
            >
              <label className={styles.label} htmlFor="email">
                이메일
              </label>
              <div>
                <Field
                  className={styles.field}
                  name="email"
                  type="email"
                  placeholder="이메일 입력"
                  autoComplete="off"
                />
              </div>
              <ErrorMessage
                className={styles.errorMsg}
                name="email"
                component="div"
              />
              <label className={styles.label} htmlFor="username">
                이름
              </label>
              <div>
                <Field
                  className={styles.field}
                  name="username"
                  type="text"
                  placeholder="이름 입력"
                  autoComplete="off"
                />
              </div>
              <ErrorMessage
                className={styles.errorMsg}
                name="username"
                component="div"
              />
              <label className={styles.label} htmlFor="password">
                비밀번호
              </label>
              <div className="flex">
                <Field
                  className={styles.field}
                  name="password"
                  type={`${show.password ? 'text' : 'password'}`}
                  placeholder="비밀번호 입력"
                />
                <span
                  className="flex items-center px-4 border-b-2 border-gray-300 cursor-pointer"
                  onClick={() => setShow({ ...show, password: !show.password })}
                >
                  {show.password ? <GoEye /> : <GoEyeClosed />}
                </span>
              </div>
              <ErrorMessage
                className={styles.errorMsg}
                name="password"
                component="div"
              />

              <label className={styles.label} htmlFor="password">
                비밀번호 확인
              </label>
              <div className="flex">
                <Field
                  className={styles.field}
                  name="confirmPassword"
                  type={`${show.confirmPassword ? 'text' : 'password'}`}
                  placeholder="비밀번호 확인"
                />
                <span
                  className="flex items-center px-4 border-b-2 border-gray-300 cursor-pointer"
                  onClick={() =>
                    setShow({ ...show, confirmPassword: !show.confirmPassword })
                  }
                >
                  {show.confirmPassword ? <GoEye /> : <GoEyeClosed />}
                </span>
              </div>
              <ErrorMessage
                className={styles.errorMsg}
                name="confirmPassword"
                component="div"
              />
              <button className={styles.button} type="submit">
                회원가입하기
              </button>
            </Form>
          )}
        </Formik>
        <p className="flex items-center mx-2 mt-4 text-xs font-bold text-gray-600 justify-evenly md:text-base">
          <span>계정이 있으신가요?</span>
          <Link href="/auth/login">
            <span className="flex items-center justify-center px-2 py-2 text-sm text-gray-700 cursor-pointer md:text-lg hover:text-gray-500">
              로그인
            </span>
          </Link>
        </p>
      </section>
    </>
  );
};

export default Register;
