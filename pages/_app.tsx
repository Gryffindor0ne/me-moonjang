import React from 'react';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { Hydrate, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ChakraProvider } from '@chakra-ui/react';
import { createStandaloneToast } from '@chakra-ui/toast';
import { RecoilRoot } from 'recoil';

import '../styles/globals.css';
import { theme } from 'theme';
import Loading from '@components/layout/Loading';
import { queryClient } from '@react-query/queryClient';
import GlobalModal from '@components/modals/GlobalModal';

const { ToastContainer } = createStandaloneToast();

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <SessionProvider session={session}>
        <RecoilRoot>
          <ChakraProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
              <Hydrate state={pageProps.dehydratedState}>
                <Component {...pageProps} />
                <GlobalModal />
                <Loading />
                <ToastContainer />
              </Hydrate>
              <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
          </ChakraProvider>
        </RecoilRoot>
      </SessionProvider>
    </>
  );
}

export default MyApp;
