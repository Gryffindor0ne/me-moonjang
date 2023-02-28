import { createStandaloneToast } from '@chakra-ui/toast';
import { QueryClient } from '@tanstack/react-query';
import axios from 'axios';

const { toast } = createStandaloneToast();

const queryErrorHandler = (error: unknown): void => {
  const title =
    axios.isAxiosError(error) && error.response && error.response.status === 422
      ? error.response.data.message
      : error instanceof Error
      ? error.message
      : 'error connecting to server';

  const id = 'react-query-error';

  toast.closeAll();

  toast({
    id,
    title,
    status: 'error',
    position: 'top',
    variant: 'subtle',
    isClosable: true,
  });
};

const generateQueryClient = (): QueryClient =>
  new QueryClient({
    defaultOptions: {
      queries: {
        onError: queryErrorHandler,
      },
      mutations: {
        onError: queryErrorHandler,
      },
    },
  });

export const queryClient = generateQueryClient();
