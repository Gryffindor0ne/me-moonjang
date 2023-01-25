import Link from 'next/link';
import { useRouter } from 'next/router';
import { CiUser, CiPen, CiLollipop, CiGrid41 } from 'react-icons/ci';

const MainNavigation = () => {
  const router = useRouter();
  return (
    <div>
      <section className="max-w-[520px] mx-auto fixed inset-x-0 bottom-0 z-10 bg-white shadow">
        <div id="tabs" className="flex pt-1 border-t-2 justify-evenly">
          <Link
            href="/"
            className="px-2 py-2 mx-2 text-2xl font-bold text-center text-gray-800"
          >
            <div
              className={`${
                router.asPath === '/'
                  ? 'text-teal-500 flex flex-col items-center'
                  : 'text-gray-800 flex flex-col items-center'
              }`}
            >
              <CiGrid41 />
              <span className="block mt-1 text-xs tab">문장집</span>
            </div>
          </Link>

          <Link
            href="newsentence"
            className="px-4 py-2 mx-2 text-2xl font-bold text-center text-gray-800"
          >
            <div
              className={`${
                router.asPath === '/newsentence'
                  ? 'text-teal-500 flex flex-col items-center'
                  : 'text-gray-800 flex flex-col items-center'
              }`}
            >
              <CiPen />
              <span className="block mt-1 text-xs tab">문장</span>
            </div>
          </Link>

          <Link
            href="quiz"
            className="px-4 py-2 mx-2 text-2xl font-bold text-center text-gray-800"
          >
            <div
              className={`${
                router.asPath === '/quiz'
                  ? 'text-teal-500 flex flex-col items-center'
                  : 'text-gray-800 flex flex-col items-center'
              }`}
            >
              <CiLollipop />
              <span className="block mt-1 text-xs tab">퀴즈</span>
            </div>
          </Link>

          <Link
            href="profile"
            className="px-2 py-2 mx-2 text-2xl font-bold text-center text-gray-800"
          >
            <div
              className={`${
                router.asPath === '/profile'
                  ? 'text-teal-500 flex flex-col items-center'
                  : 'text-gray-800 flex flex-col items-center'
              }`}
            >
              <CiUser />
              <span className="block mt-1 text-xs tab">내 정보</span>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default MainNavigation;
