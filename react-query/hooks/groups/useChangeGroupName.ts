import {
  UseMutateFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';

import { queryKeys } from '@react-query/constants';
import { useCustomToast } from '@components/hooks/useCustomToast';

type NewGroupName = {
  name: string;
  groupId: string | undefined;
};

const setGroupName = async (newGroupNameData: NewGroupName) => {
  await axios.patch(`api/groups/actions/change-name`, {
    name: newGroupNameData.name,
    groupId: newGroupNameData.groupId,
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

        queryClient.invalidateQueries([queryKeys.groupsData]);
      },
    }
  );
  return mutate;
};
