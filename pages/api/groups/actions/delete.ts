import type { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';

import dbConnect from '@lib/db';

const deleteGroup = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.body;
  const client = await dbConnect();

  try {
    const db = client.db();
    const groupsCollection = db.collection('groups');

    await groupsCollection.deleteOne({
      _id: new ObjectId(`${id}`),
    });

    res.status(200).json({ message: 'Group deleted' });
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
  }
};

export default deleteGroup;
