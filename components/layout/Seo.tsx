import Head from 'next/head';

const Seo = ({ title }: { title: string }) => {
  return (
    <Head>
      <title>Me-Moonjang : {title}</title>
    </Head>
  );
};

export default Seo;
