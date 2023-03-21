import MainNavigation from '@components/layout/MainNavigation';

type MemoonjangLayoutProps = {
  children: React.ReactNode;
};
const Layout = (props: MemoonjangLayoutProps) => {
  return (
    <>
      <main className="flex flex-col items-center justify-center w-full px-3 pb-24">
        {props.children}
      </main>
      <MainNavigation />
    </>
  );
};

export default Layout;
