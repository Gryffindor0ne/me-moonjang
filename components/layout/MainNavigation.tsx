import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  IoIceCreamOutline,
  IoLibraryOutline,
  IoPersonOutline,
  IoLibrary,
  IoIceCream,
  IoPerson,
  IoPencil,
  IoPencilOutline,
} from 'react-icons/io5';

const MainNavigation = () => {
  const router = useRouter();

  return (
    <div>
      <section className="fixed inset-x-0 bottom-0 z-10 max-w-2xl mx-auto bg-white shadow">
        <div id="tabs" className="flex pt-1 border-t-2 justify-evenly">
          <Link
            href="/"
            className="px-2 py-2 mx-2 text-2xl font-bold text-center"
          >
            <div
              className={`${
                router.pathname === '/' || router.pathname === '/#'
                  ? 'text-teal-500 flex flex-col items-center'
                  : 'text-gray-800 flex flex-col items-center'
              }`}
            >
              {router.pathname === '/' || router.pathname === '/#' ? (
                <IoLibrary />
              ) : (
                <IoLibraryOutline />
              )}

              <span className="block mt-1 text-xs tab">문장집</span>
            </div>
          </Link>

          <Link
            href="newsentence"
            className="px-4 py-2 mx-2 text-2xl font-bold text-center"
          >
            <div
              className={`${
                router.pathname === '/newsentence'
                  ? 'text-teal-500 flex flex-col items-center'
                  : 'text-gray-800 flex flex-col items-center'
              }`}
            >
              {router.pathname === '/newsentence' ? (
                <IoPencil />
              ) : (
                <IoPencilOutline />
              )}

              <span className="block mt-1 text-xs tab">문장</span>
            </div>
          </Link>

          <Link
            href="quiz"
            className="px-4 py-2 mx-2 text-2xl font-bold text-center"
          >
            <div
              className={`${
                router.pathname === '/quiz'
                  ? 'text-teal-500 flex flex-col items-center'
                  : 'text-gray-800 flex flex-col items-center'
              }`}
            >
              {router.pathname === '/quiz' ? (
                <IoIceCream />
              ) : (
                <IoIceCreamOutline />
              )}

              <span className="block mt-1 text-xs tab">퀴즈</span>
            </div>
          </Link>

          <Link
            href="profile"
            className="p-2 mx-2 text-2xl font-bold text-center"
          >
            <div
              className={`${
                router.pathname === '/profile'
                  ? 'text-teal-500 flex flex-col items-center'
                  : 'text-gray-800 flex flex-col items-center'
              }`}
            >
              {router.pathname === '/profile' ? (
                <IoPerson />
              ) : (
                <IoPersonOutline />
              )}

              <span className="block mt-1 text-xs tab">내 정보</span>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default MainNavigation;
