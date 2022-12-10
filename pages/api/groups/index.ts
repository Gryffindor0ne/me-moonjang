import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@lib/db';

const createGroup = async (req: NextApiRequest, res: NextApiResponse) => {
  const { name, email } = req.body;
  const client = await dbConnect();

  try {
    const db = client.db();
    const groupsCollection = db.collection('groups');
    const checkExistingGroup = await groupsCollection
      .find({
        name,
        email,
      })
      .toArray();

    if (checkExistingGroup.length !== 0) {
      res.status(422).json({ message: 'Group already exists' });
      client.close();
      return;
    }

    await groupsCollection.insertOne({
      email,
      name,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    res.status(201).json({ message: 'Group created' });
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
  }
};

export default createGroup;
