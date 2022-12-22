import { getSession, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import axios from 'axios';
import { MdOutlineArrowBackIos } from 'react-icons/md';
import { CiLogout } from 'react-icons/ci';

import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Seo from '@components/layout/Seo';
import ConfirmModal from '@components/modals/ConfirmModal';

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
  const [showModal, setShowModal] = useState(false);
  const [selectBtn, setSelectBtn] = useState('');

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

  const handleClickBtn = (value: string) => {
    setSelectBtn(value);
    setShowModal((prev) => !prev);
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await axios.post(`api/auth/logout`, {
        id: user.id,
      });
      if (res.status === 200) {
        const deleteResponse = await axios.post(`api/auth/deleteuser`, {
          email: user.email,
        });

        if (deleteResponse.status === 200) {
          toast.success('회원탈퇴가 완료되었습니다.', {
            position: 'top-center',
            autoClose: 1500,
          });
          setTimeout(
            () => signOut({ callbackUrl: 'http://localhost:3000' }),
            2000
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Seo title="회원정보" />
      {showModal && (
        <ConfirmModal
          btn={selectBtn}
          setShowModal={setShowModal}
          deleteHandler={handleDeleteAccount}
          handler={handleLogout}
        />
      )}
      <ToastContainer />

      <section className="flex flex-col w-full gap-4 p-5 mx-auto">
        <div className="flex">
          <span
            onClick={() => router.back()}
            className="flex items-center justify-center px-2 text-lg cursor-pointer"
          >
            <MdOutlineArrowBackIos />
          </span>
          <h1 className="flex py-2 pr-4 mx-auto my-8 text-xl font-bold text-gray-800 md:text-2xl">
            회원정보
          </h1>
        </div>
        <div className="flex items-center justify-between px-5 py-3 font-mono border-b border-gray-100 md:text-lg">
          <div className="text-sm text-gray-600 md:text-lg">로그인방식</div>
          <div className="text-sm md:text-lg">
            {user.authType.toUpperCase()}
          </div>
        </div>

        <div className="flex items-center justify-between px-5 py-3 font-mono border-b border-gray-100 md:text-lg">
          <div className="text-sm text-gray-600 md:text-lg">이름</div>
          <div className="text-sm md:text-lg">{user.username}</div>
        </div>
        <div className="flex items-center justify-between px-5 py-3 font-mono border-b border-gray-100 md:text-lg">
          <div className="text-sm text-gray-600 md:text-lg">이메일</div>
          <div className="text-sm md:text-lg">{user.email}</div>
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 md:text-lg">
          <div className="text-sm text-gray-600 md:text-lg">로그아웃</div>
          <div
            onClick={() => handleClickBtn('logout')}
            className="px-4 py-2 text-xl text-orange-500 rounded-sm cursor-pointer sm:text-2xl"
          >
            <CiLogout />
          </div>
        </div>

        <div className="fixed inset-x-0 flex flex-col gap-4 px-4 py-4 bottom-4 sm:px-6 sm:relative">
          <span
            onClick={() => handleClickBtn('deleteAccount')}
            className="p-6 text-sm text-gray-600 border-b cursor-pointer md:text-lg md:mt-20 md:py-4 md:px-0 md:border-b-0"
          >
            회원탈퇴
          </span>
        </div>
      </section>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
};

export default ProfilePage;
