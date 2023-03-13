import {
  UseMutateFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';

import { queryKeys } from '@react-query/constants';
import { useCustomToast } from '@hooks/useCustomToast';

type NewGroup = {
  name: string;
  email: string;
};
const createNewGroup = async (newGroup: NewGroup) => {
  await axios.post(`api/groups`, {
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
        queryClient.invalidateQueries([queryKeys.groupsData]);
        toast({
          title: '새 문장집이 생성되었습니다.',
          status: 'success',
        });
      },
    }
  );
  return mutate;
};
