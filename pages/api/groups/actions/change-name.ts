import type { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';

import dbConnect from '@lib/db';

const changeGroupName = async (req: NextApiRequest, res: NextApiResponse) => {
  const { name, groupId } = req.body;
  const client = await dbConnect();

  try {
    const db = client.db();
    const groupsCollection = db.collection('groups');

    const checkExistingGroup = await groupsCollection.find({ name }).toArray();

    if (checkExistingGroup.length !== 0) {
      res.status(422).json({ message: '동일한 문장집이 존재합니다.' });
      client.close();
      return;
    }

    await groupsCollection.updateOne(
      {
        _id: new ObjectId(`${groupId}`),
      },
      {
        $set: {
          name,
          updatedAt: Date.now(),
        },
      }
    );

    res.status(201).json({ message: 'Group updated' });
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
  }
};

export default changeGroupName;
