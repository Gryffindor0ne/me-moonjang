import type { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';

import dbConnect from '@lib/db';

const getGroupData = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const client = await dbConnect();

  try {
    const db = client.db();
    const groupsCollection = db.collection('groups');
    const data = await groupsCollection
      .find({ _id: new ObjectId(`${id}`) })
      .toArray();

    return res.status(201).json(data);
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
  }
};

export default getGroupData;
