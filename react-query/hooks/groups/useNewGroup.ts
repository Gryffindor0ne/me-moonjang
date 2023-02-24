import {
  UseMutateFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';

import { queryKeys } from '@react-query/constants';

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

  const { mutate } = useMutation(
    (newGroup: NewGroup) => createNewGroup(newGroup),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([queryKeys.groupsData]);
        toast.success('새 문장집 등록완료', {
          position: 'top-center',
          autoClose: 300,
        });
      },
      onError: (error) => {
        let message;
        if (axios.isAxiosError(error) && error.response) {
          message = error.response.data.message;
          console.error(message);
          if (error.response.status === 422) {
            toast.warning('동일한 문장집 이름이 존재합니다.', {
              position: 'top-center',
              autoClose: 1000,
            });
          }
        } else message = String(error);
        console.error(message);
      },
    }
  );
  return mutate;
};
