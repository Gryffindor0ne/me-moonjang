import type { NextApiRequest, NextApiResponse } from 'next';

import { dbConnect, deleteAllDocument, deleteDocument } from '@lib/db';

const deleteUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email } = req.body;
  const client = await dbConnect();

  try {
    const result = await deleteDocument(client, 'users', { email });

    if (result.deletedCount === 0) {
      throw new Error('User not deleted');
    } else {
      await deleteAllDocument(client, 'groups', { email });
    }

    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
  }
};

export default deleteUser;
