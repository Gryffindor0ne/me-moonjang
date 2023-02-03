import type { NextApiRequest, NextApiResponse } from 'next';

import dbConnect from '@lib/db';

const changeGroupName = async (req: NextApiRequest, res: NextApiResponse) => {
  const { name, email, previouseName } = req.body;
  const client = await dbConnect();

  try {
    const db = client.db();
    const groupsCollection = db.collection('groups');
    const findGroup = await groupsCollection
      .find({
        email,
        name: previouseName,
      })
      .toArray();

    if (findGroup.length === 0) {
      res.status(422).json({ message: 'Group do not exists' });
      return;
    }

    await groupsCollection.updateOne(
      {
        name: previouseName,
        email,
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
