import Link from 'next/link';
import { CiUser, CiPen, CiLollipop, CiGrid41 } from 'react-icons/ci';

const MainNavigation = () => {
  return (
    <div className="w-full h-screen">
      <section className="fixed inset-x-0 bottom-0 z-10 bg-white shadow">
        <div id="tabs" className="flex justify-evenly border-t-2 pt-1">
          <Link
            href="/"
            className="px-4 py-2 mx-2 text-gray-800 text-3xl font-bold text-center"
          >
            <CiGrid41 />
            <span className="tab block text-xs mt-1">그룹</span>
          </Link>

          <Link
            href="sentence"
            className="px-4 py-2 mx-2 text-gray-800 text-3xl font-bold text-center"
          >
            <CiPen />
            <span className="tab block text-xs mt-1">문장</span>
          </Link>

          <Link
            href="quiz"
            className="px-4 py-2 mx-2 text-gray-800 text-3xl font-bold text-center"
          >
            <CiLollipop />
            <span className="tab block text-xs mt-1">퀴즈</span>
          </Link>

          <Link
            href="profile"
            className="px-4 py-2 mx-2 text-gray-800 text-3xl font-bold text-center"
          >
            <CiUser />
            <span className="tab block text-xs mt-1">내 정보</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default MainNavigation;
