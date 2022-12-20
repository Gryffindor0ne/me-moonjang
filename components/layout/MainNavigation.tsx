import Link from 'next/link';
import { CiUser, CiPen, CiLollipop, CiGrid41 } from 'react-icons/ci';

const MainNavigation = () => {
  return (
    <div>
      <section className="max-w-[520px] mx-auto fixed inset-x-0 bottom-0 z-10 bg-white shadow">
        <div id="tabs" className="flex pt-1 border-t-2 justify-evenly">
          <Link
            href="/"
            className="px-4 py-2 mx-2 text-2xl font-bold text-center text-gray-800"
          >
            <CiGrid41 />
            <span className="block mt-1 text-xs tab">그룹</span>
          </Link>

          <Link
            href="newsentence"
            className="px-4 py-2 mx-2 text-2xl font-bold text-center text-gray-800"
          >
            <CiPen />
            <span className="block mt-1 text-xs tab">문장</span>
          </Link>

          <Link
            href="quiz"
            className="px-4 py-2 mx-2 text-2xl font-bold text-center text-gray-800"
          >
            <CiLollipop />
            <span className="block mt-1 text-xs tab">퀴즈</span>
          </Link>

          <Link
            href="profile"
            className="px-4 py-2 mx-2 text-2xl font-bold text-center text-gray-800"
          >
            <CiUser />
            <span className="block mt-1 text-xs tab">내 정보</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default MainNavigation;
