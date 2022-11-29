import Layout from '@components/layout/Layout';
import Seo from '@components/layout/Seo';
import axios from 'axios';

import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { MdOutlineArrowBackIos } from 'react-icons/md';

export type UserInfo = {
  id: string;
  email: string;
  username: string;
  authType: string;
};

const ProfilePage = () => {
  const { data: session } = useSession();
  const user = session?.user as UserInfo;
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await axios.post(`api/auth/logout`, {
        id: user.id,
      });

      if (res.status === 200) {
        signOut({ callbackUrl: 'http://localhost:3000' });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Seo title="회원정보" />
      <Layout>
        <section className="w-full mx-auto flex flex-col gap-5 p-5">
          <div className="flex">
            <span
              onClick={() => router.back()}
              className="flex justify-center items-center px-4 text-2xl cursor-pointer"
            >
              <MdOutlineArrowBackIos />
            </span>
            <h1 className="flex mx-auto text-gray-800 text-4xl font-bold pr-4 py-2 my-16">
              회원정보
            </h1>
          </div>
          <div className="flex justify-between">
            <div className="text-gray-600 text-2xl font-bold ">Logout</div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-sm font-bold bg-orange-200"
            >
              로그아웃
            </button>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default ProfilePage;
