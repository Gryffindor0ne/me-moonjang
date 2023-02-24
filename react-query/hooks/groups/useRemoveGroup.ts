import {
  UseMutateFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';

import { queryKeys } from '@react-query/constants';

type TargetId = {
  id: string;
};

const removeGroup = async (targetId: TargetId) => {
  await axios.delete(`/api/groups`, {
    data: { id: targetId.id },
  });
};

export const useRemoveGroup = (): UseMutateFunction<
  void,
  unknown,
  TargetId,
  unknown
> => {
  const SERVER_ERROR = 'There was an error contacting the server.';
  const queryClient = useQueryClient();

  const { mutate } = useMutation(
    (targetId: TargetId) => removeGroup(targetId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([queryKeys.groupsData]);
        toast.success('문장집 삭제완료', {
          position: 'top-center',
          autoClose: 300,
          delay: 100,
        });
      },
      onError: (error) => {
        const message =
          axios.isAxiosError(error) && error?.response?.data?.message
            ? error?.response?.data?.message
            : SERVER_ERROR;

        console.error(message);
      },
    }
  );
  return mutate;
};
