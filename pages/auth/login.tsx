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
      callbackUrl: `${process.env.NEXTAUTH_URL}`,
    });
  };

  const handleGoogleLogin = async () => {
    signIn('google', { callbackUrl: `${process.env.NEXTAUTH_URL}` });
  };

  return (
    <>
      <Seo title="로그인" />
      <ToastContainer />
      <section className="flex flex-col w-full gap-5 p-6 mx-auto">
        <h1 className="flex py-4 mx-auto my-16 text-4xl font-bold text-gray-800">
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
        <p className="flex flex-col items-center mx-2 mt-12 text-lg font-bold text-gray-600 ">
          또는
        </p>
        <div className="flex items-center justify-center gap-8">
          <span
            onClick={handleKakaoLogin}
            className="p-2 text-4xl bg-yellow-300 rounded-full cursor-pointer"
          >
            <RiKakaoTalkFill />
          </span>
          <span
            onClick={handleGoogleLogin}
            className="p-2 text-4xl text-white rounded-full cursor-pointer bg-gradient-to-r from-red-600 via-yellow-300 to-green-600"
          >
            <AiOutlineGoogle />
          </span>
        </div>

        <p className="flex items-center justify-center gap-12 mx-2 mt-24 text-lg font-bold text-gray-600 ">
          계정이 없으신가요?
          <Link href="/auth/register">
            <span
              data-testid="register-btn"
              className="flex items-center justify-center px-10 py-2 bg-white border-2 border-gray-300 rounded-full cursor-pointer hover:bg-gray-200"
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
