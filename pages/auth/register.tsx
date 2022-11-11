import { useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as yup from 'yup';
import { GoEyeClosed, GoEye } from 'react-icons/go';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import styles from '@styles/Form.module.css';

export type AuthType = 'memoonjang';

export type UserInfo = {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  authType: AuthType;
};

const userSchema = yup.object().shape({
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

  const onSubmit = async (values: UserInfo) => {
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
      <Head>
        <title>Me-Moonjang : 회원가입</title>
      </Head>
      <ToastContainer />
      <section className="w-full mx-auto flex flex-col gap-5">
        <h1 className="flex mx-auto text-gray-800 text-4xl font-bold py-4 my-16">
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
            <Form className="flex flex-col gap-2" onSubmit={props.handleSubmit}>
              <label className={styles.label} htmlFor="email">
                이메일
              </label>
              <div>
                <Field
                  className={styles.field}
                  name="email"
                  type="email"
                  placeholder="이메일 입력"
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
                  className="border-b-2 border-gray-300 flex items-center px-4 cursor-pointer"
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
                  className="border-b-2 border-gray-300 flex items-center px-4 cursor-pointer"
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
        <p className=" text-gray-600 text-lg font-bold mx-2 mt-12 flex flex-col items-center">
          계정이 있으신가요?
          <Link href="/auth/login">
            <span className="bg-gray-100 border-2 border-gray-300 rounded flex justify-center px-16 py-4 mt-4 hover:bg-gray-200 cursor-pointer">
              로그인하러가기
            </span>
          </Link>
        </p>
      </section>
    </>
  );
};

export default Register;
