import MainNavigation from '@components/layout/MainNavigation';

type MemoonjangLayoutProps = {
  children: React.ReactNode;
};
const Layout = (props: MemoonjangLayoutProps) => {
  return (
    <>
      <main>{props.children}</main>
      <MainNavigation />
    </>
  );
};

export default Layout;
