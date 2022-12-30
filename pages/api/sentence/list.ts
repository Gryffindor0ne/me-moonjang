import type { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';

import dbConnect from '@lib/db';

const getSentenceData = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, name, id } = req.body;
  const client = await dbConnect();

  try {
    const db = client.db();
    const groupsCollection = db.collection('groups');
    const data = await groupsCollection
      .find(
        { name, email },
        {
          projection: {
            email: 1,
            name: 1,
            createdAt: 1,
            updatedAt: 1,
            sentences: { $elemMatch: { id: new ObjectId(`${id}`) } },
          },
        }
      )
      .toArray();

    return res.status(201).json(data);
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
  }
};

export default getSentenceData;
