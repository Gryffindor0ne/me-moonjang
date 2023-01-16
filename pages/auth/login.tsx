import { useState } from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as yup from 'yup';
import { GoEyeClosed, GoEye } from 'react-icons/go';
import { RiKakaoTalkFill } from 'react-icons/ri';
import { AiOutlineGoogle } from 'react-icons/ai';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import styles from '@styles/Form.module.css';
import Seo from '@components/layout/Seo';

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('잘못된 형식입니다.')
    .required('이메일을 입력해주세요.'),
  password: yup
    .string()
    .required('비밀번호를 입력해주세요.')
    .min(6, '비밀번호는 최소 6자이상 입니다.'),
});

const AuthPage: NextPage = () => {
  const router = useRouter();
  const [show, setShow] = useState({
    password: false,
  });

  type LoginInfo = {
    email: string;
    password: string;
  };
  const onSubmit = async (values: LoginInfo) => {
    const { email, password } = values;
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.status === 200) {
      router.replace('/');
    } else {
      toast.warning('이메일 혹은 비밀번호를 확인해주세요!', {
        position: 'top-center',
        autoClose: 1500,
      });
      setTimeout(() => router.reload(), 2000);
    }
  };

  const handleKakaoLogin = () => {
    signIn('kakao', {
      callbackUrl: `${process.env.NEXT_PUBLIC_URL}`,
    });
  };

  const handleGoogleLogin = async () => {
    signIn('google', { callbackUrl: `${process.env.NEXT_PUBLIC_URL}` });
  };

  const handleGuestLogin = () => {
    const guestLoginValues: LoginInfo = {
      email: 'guest@memoonjang.com',
      password: '123!qwe',
    };
    onSubmit(guestLoginValues);
  };

  return (
    <>
      <Seo title="로그인" />
      <ToastContainer />
      <section className="flex flex-col w-full gap-3 p-10 mx-auto md:gap-12">
        <h1 className="flex py-2 mx-auto my-4 text-2xl font-bold text-gray-800 md:my-10 md:text-3xl">
          Me Moonjang
        </h1>
        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          onSubmit={onSubmit}
          validationSchema={loginSchema}
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
                />
              </div>
              <ErrorMessage
                className={styles.errorMsg}
                name="email"
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

              <button className={styles.button} type="submit">
                이메일 로그인
              </button>
            </Form>
          )}
        </Formik>
        <div className="inline-flex items-center justify-center w-full">
          <hr className="w-64 h-px my-8 bg-gray-200 border-0 rounded" />
          <span className="absolute px-4 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2">
            또는
          </span>
        </div>
        <div className="flex items-center justify-center gap-8">
          <span
            onClick={handleKakaoLogin}
            className="p-2 text-2xl bg-yellow-300 rounded-full cursor-pointer md:text-4xl"
          >
            <RiKakaoTalkFill />
          </span>
          <span
            onClick={handleGoogleLogin}
            className="p-2 text-2xl text-white rounded-full cursor-pointer md:text-4xl bg-gradient-to-r from-red-600 via-yellow-300 to-green-600"
          >
            <AiOutlineGoogle />
          </span>
        </div>

        <p className="flex items-center justify-center mx-2 text-sm font-bold text-gray-600 md:text-base">
          <span
            onClick={handleGuestLogin}
            className="flex items-center justify-center w-full px-6 py-2 mx-auto mt-4 text-white bg-teal-500 rounded-full cursor-pointer md:text-base md:py-3 hover:bg-teal-400"
          >
            게스트 로그인
          </span>
        </p>
        <p className="flex items-center justify-center gap-6 mx-2 mt-4 text-sm font-bold text-gray-600 md:text-base">
          계정이 없으신가요?
          <Link href="/auth/register">
            <span
              data-testid="register-btn"
              className="flex items-center justify-center px-6 py-2 text-base text-gray-700 cursor-pointer md:text-lg hover:text-gray-500"
            >
              회원가입
            </span>
          </Link>
        </p>
      </section>
    </>
  );
};

export default AuthPage;
