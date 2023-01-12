import MainNavigation from '@components/layout/MainNavigation';

type MemoonjangLayoutProps = {
  children: React.ReactNode;
};
const Layout = (props: MemoonjangLayoutProps) => {
  return (
    <>
      <main className="px-3 pb-36">{props.children}</main>
      <MainNavigation />
    </>
  );
};

export default Layout;
