import { getSession, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { MdOutlineArrowBackIos } from 'react-icons/md';
import { CiLogout } from 'react-icons/ci';
import { useSetRecoilState } from 'recoil';

import Seo from '@components/layout/Seo';

import Layout from '@components/layout/Layout';
import { useCustomToast } from '@hooks/useCustomToast';
import { contextState } from '@recoil/atoms/common';
import useModal from '@hooks/useModal';
import { axiosInstance } from '@lib/axiosInstance';
import { baseUrl } from '@lib/axiosInstance/constants';
import { UserInfo } from '@shared/types';

const ProfilePage = () => {
  const { data: session } = useSession();
  const user = session?.user as UserInfo;
  const router = useRouter();
  const { showModal, hideModal } = useModal();

  const toast = useCustomToast();

  const setContext = useSetRecoilState(contextState);

  const handleLogout = async (): Promise<void> => {
    try {
      const res = await axiosInstance.post(`/api/auth/logout`, {
        id: user.id,
      });

      if (res.status === 200) {
        hideModal();
        setContext('');
        signOut({ callbackUrl: `${baseUrl}` });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteAccount = async (): Promise<void> => {
    try {
      const logoutResponse = await axiosInstance.post(`/api/auth/logout`, {
        id: user.id,
      });
      if (logoutResponse.status === 200) {
        const deleteUserResponse = await axiosInstance.post(
          `/api/auth/delete-user`,
          {
            email: user.email,
          }
        );

        if (deleteUserResponse.status === 200) {
          hideModal();
          setContext('');

          toast({
            title: '회원탈퇴가 완료되었습니다.',
            status: 'success',
          });
          setTimeout(() => signOut({ callbackUrl: `${baseUrl}` }), 2000);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickBtn = (value: string) => {
    if (value === 'deleteAccount' && user.email === 'guest@memoonjang.com') {
      toast({
        title: '게스트는 회원탈퇴 할 수 없습니다!',
        status: 'warning',
      });
      return;
    }

    setContext(value);

    if (value === 'logout') {
      showModal({
        modalType: 'ConfirmModal',
        modalProps: {
          handler: handleLogout,
        },
      });
    }

    if (value === 'deleteAccount') {
      showModal({
        modalType: 'ConfirmModal',
        modalProps: {
          handler: handleDeleteAccount,
        },
      });
    }
  };

  return (
    <>
      <Seo title="회원정보" />

      <Layout>
        <section className="flex flex-col w-full max-w-xl gap-5 mx-auto md:p-5">
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
            <div className="text-base text-gray-600 md:text-lg">로그인방식</div>
            <div className="text-base md:text-lg">
              {user.authType.toUpperCase()}
            </div>
          </div>

          <div className="flex items-center justify-between px-5 py-3 font-mono border-b border-gray-100 md:text-lg">
            <div className="text-base text-gray-600 md:text-lg">이름</div>
            <div className="text-base md:text-lg">{user.username}</div>
          </div>
          <div className="flex items-center justify-between px-5 py-3 font-mono border-b border-gray-100 md:text-lg">
            <div className="text-base text-gray-600 md:text-lg">이메일</div>
            <div className="text-xs md:text-lg">{user.email}</div>
          </div>

          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 md:text-lg">
            <div className="text-base text-gray-600 md:text-lg">로그아웃</div>
            <div
              onClick={() => handleClickBtn('logout')}
              className="px-4 py-2 text-lg text-orange-500 rounded-sm cursor-pointer sm:text-2xl"
            >
              <CiLogout />
            </div>
          </div>

          <div className="px-5 py-3 border-b border-gray-100 md:text-lg">
            <div
              onClick={() => handleClickBtn('deleteAccount')}
              className="mt-20 text-base text-gray-600 cursor-pointer md:text-lg"
            >
              회원탈퇴
            </div>
          </div>
        </section>
      </Layout>
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
