import {
  UseMutateFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';

import { queryKeys } from '@react-query/constants';

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

  const { mutate } = useMutation(
    (newGroupNameData: NewGroupName) => setGroupName(newGroupNameData),
    {
      onSuccess: () => {
        toast.success('문장집 변경완료', {
          position: 'top-center',
          autoClose: 300,
        });

        queryClient.invalidateQueries([queryKeys.groupsData]);
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
