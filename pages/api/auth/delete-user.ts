import type { NextApiRequest, NextApiResponse } from 'next';

import { dbConnect } from '@lib/db';

const deleteUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email } = req.body;
  const client = await dbConnect();

  try {
    const db = client.db();
    const usersCollection = db.collection('users');
    const response = await usersCollection.deleteOne({
      email,
    });

    if (response.deletedCount === 0) {
      throw new Error('User not deleted');
    } else {
      const groupsCollection = db.collection('groups');
      await groupsCollection.deleteMany({
        email,
      });
    }

    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
  }
};

export default deleteUser;
