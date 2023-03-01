import React from 'react';
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

const { ToastContainer } = createStandaloneToast();

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <RecoilRoot>
        <ChakraProvider theme={theme}>
          <QueryClientProvider client={queryClient}>
            <Hydrate state={pageProps.dehydratedState}>
              <Component {...pageProps} />
              <Loading />
              <ToastContainer />
            </Hydrate>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </ChakraProvider>
      </RecoilRoot>
    </SessionProvider>
  );
}

export default MyApp;
