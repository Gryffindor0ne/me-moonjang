import {
  UseMutateFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { queryKeys } from '@react-query/constants';
import { useCustomToast } from '@hooks/useCustomToast';
import { axiosInstance } from '@lib/axiosInstance';

type NewGroupName = {
  name: string;
  groupId: string | undefined;
  email: string;
};

const setGroupName = async (newGroupNameData: NewGroupName) => {
  await axiosInstance.patch(`/api/groups/actions/change-name`, {
    name: newGroupNameData.name,
    groupId: newGroupNameData.groupId,
    email: newGroupNameData.email,
  });
};

export const useChangeGroupName = (): UseMutateFunction<
  void,
  unknown,
  NewGroupName,
  unknown
> => {
  const queryClient = useQueryClient();

  const toast = useCustomToast();

  const { mutate } = useMutation(
    (newGroupNameData: NewGroupName) => setGroupName(newGroupNameData),
    {
      onSuccess: () => {
        toast({
          title: '문장집 이름이 수정되었습니다.',
          status: 'success',
        });

        queryClient.invalidateQueries([queryKeys.groupNames]);
      },
    }
  );
  return mutate;
};
