import dbConnect from '@lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';

const deleteUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email } = req.body;

  try {
    const client = await dbConnect();
    const db = client.db();
    const usersCollection = db.collection('users');
    const response = await usersCollection.deleteOne({
      email,
    });

    if (response.deletedCount === 0) {
      client.close();
      throw new Error('No user deleted');
    }
    res.status(200).json({ message: 'User deleted' });
    client.close();
  } catch (error) {
    console.log(error);
  }
};

export default deleteUser;
