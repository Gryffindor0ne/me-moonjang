import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx: any) {
    const initialProps = await Document.getInitialProps(ctx);

    return initialProps;
  }

  render() {
    return (
      <Html>
        <Head>
          <meta
            name="description"
            content="영어문장 학습 어플리케이션 - 미문장"
          />
          <meta property="og:title" content="Me-moonjang(미문장)" />
          <meta
            property="og:description"
            content="영어문장을 학습하는 어플리케이션입니다."
          />
          <meta property="og:image" content="/images/splash.jpeg" />
          <link
            href="https://fonts.googleapis.com/css2?family=Gowun+Batang&family=Lora:wght@600&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
