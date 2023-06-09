import {
  UseMutateFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { queryKeys } from '@react-query/constants';
import { useCustomToast } from '@hooks/useCustomToast';
import { axiosInstance } from '@lib/axiosInstance';

type NewGroup = {
  name: string;
  email: string;
};
const createNewGroup = async (newGroup: NewGroup) => {
  await axiosInstance.post(`/api/groups`, {
    name: newGroup.name,
    email: newGroup.email,
  });
};

export const useNewGroup = (): UseMutateFunction<
  void,
  unknown,
  NewGroup,
  unknown
> => {
  const queryClient = useQueryClient();
  const toast = useCustomToast();

  const { mutate } = useMutation(
    (newGroup: NewGroup) => createNewGroup(newGroup),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([queryKeys.groupNames]);
        toast({
          title: '새 문장집이 생성되었습니다.',
          status: 'success',
        });
      },
    }
  );
  return mutate;
};
