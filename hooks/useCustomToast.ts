import {
  CloseAllToastsOptions,
  ToastId,
  useToast,
  UseToastOptions,
} from '@chakra-ui/react';

type UseCustomToast = {
  (options?: UseToastOptions | undefined): ToastId;
  update(id: ToastId, options: Omit<UseToastOptions, 'id'>): void;
  closeAll: (options?: CloseAllToastsOptions | undefined) => void;
  close: (id: ToastId) => void;
  isActive: (id: ToastId) => boolean;
};

export function useCustomToast(): UseCustomToast {
  return useToast({
    isClosable: true,
    duration: 1200,
    variant: 'subtle',
    position: 'top',
  });
}
