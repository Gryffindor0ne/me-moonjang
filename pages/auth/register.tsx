import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import axios from 'axios';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as yup from 'yup';
import { useState } from 'react';

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

      console.log(res);

      if (res.status === 201) {
        alert('회원가입 완료!');
        router.replace('/auth/login');
      }
    } catch (error) {
      let message;
      if (axios.isAxiosError(error) && error.response) {
        message = error.response.data.message;
        console.error(message);
        if (error.response.status === 422) {
          alert('동일한 이메일이 존재합니다.');
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

      <section>
        <h1>회원가입</h1>
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
            <Form onSubmit={props.handleSubmit}>
              <div>
                <label htmlFor="email">이메일</label>
                <Field name="email" type="email" placeholder="이메일 입력" />
                <ErrorMessage name="email" component="div" />
              </div>
              <div>
                <label htmlFor="username">이름</label>
                <Field name="username" type="text" placeholder="이름 입력" />
                <ErrorMessage name="username" component="div" />
              </div>
              <div>
                <label htmlFor="password">비밀번호</label>
                <Field
                  name="password"
                  type={`${show.password ? 'text' : 'password'}`}
                  placeholder="비밀번호 입력"
                />
                <span
                  onClick={() => setShow({ ...show, password: !show.password })}
                >
                  비번 보여주기
                </span>
                <ErrorMessage name="password" component="div" />
              </div>

              <div>
                <label htmlFor="password">비밀번호 확인</label>
                <Field
                  name="confirmPassword"
                  type={`${show.confirmPassword ? 'text' : 'password'}`}
                  placeholder="비밀번호 확인"
                />
                <span
                  onClick={() =>
                    setShow({ ...show, confirmPassword: !show.confirmPassword })
                  }
                >
                  비번 보여주기
                </span>
                <ErrorMessage name="confirmPassword" component="div" />
              </div>
              <button type="submit">회원가입하기</button>
            </Form>
          )}
        </Formik>
        <p>
          회원이 있으신가요?
          <Link href="/auth/login">
            <span>로그인하러가기</span>
          </Link>
        </p>
      </section>
    </>
  );
};

export default Register;
