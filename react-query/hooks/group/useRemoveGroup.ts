import {
  UseMutateFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { queryKeys } from '@react-query/constants';
import { useCustomToast } from '@hooks/useCustomToast';
import { axiosInstance } from '@lib/axiosInstance';

type TargetId = {
  id: string;
};

const removeGroup = async (targetId: TargetId) => {
  await axiosInstance.delete(`/api/groups`, {
    data: { id: targetId.id },
  });
};

export const useRemoveGroup = (): UseMutateFunction<
  void,
  unknown,
  TargetId,
  unknown
> => {
  const queryClient = useQueryClient();
  const toast = useCustomToast();

  const { mutate } = useMutation(
    (targetId: TargetId) => removeGroup(targetId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([queryKeys.groupNames]);
        toast({
          title: '문장집을 삭제하였습니다.',
          status: 'success',
        });
      },
    }
  );
  return mutate;
};
