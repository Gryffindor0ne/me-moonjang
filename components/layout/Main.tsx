import GroupBoard from '@components/groups/GroupBoard';
import Layout from '@components/layout/Layout';
import { useGroups } from '@react-query/hooks/groups/useGroups';

const Main = () => {
  const { groups } = useGroups();

  return (
    <Layout>
      <GroupBoard groups={groups} />
    </Layout>
  );
};

export default Main;
