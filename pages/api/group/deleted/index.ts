import type { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';

import dbConnect from '@lib/db';

const deleteGroup = async (req: NextApiRequest, res: NextApiResponse) => {
  const { name, email } = req.body;
  const client = await dbConnect();

  try {
    const db = client.db();
    const groupsCollection = db.collection('groups');
    const findGroup = await groupsCollection
      .find({
        email,
        name,
      })
      .toArray();

    if (findGroup.length === 0) {
      res.status(404).json({ message: 'Group do not exists' });
      return;
    }

    await groupsCollection.deleteOne({
      _id: new ObjectId(`${findGroup[0]._id}`),
    });

    res.status(200).json({ message: 'Group deleted' });
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
  }
};

export default deleteGroup;
