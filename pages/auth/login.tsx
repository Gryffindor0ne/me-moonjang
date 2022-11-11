import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

const AuthPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Me-Moonjang : 로그인</title>
      </Head>
      <section>
        <h1>회원 로그인</h1>
        <div>이메일 로그인</div>
        <div>카카오로 이용하기</div>
        <div>구글로 로그인하기</div>
        <p>
          계정이 없으신가요?
          <Link href="/auth/register">
            <span>회원가입하기</span>
          </Link>
        </p>
      </section>
    </>
  );
};

export default AuthPage;
