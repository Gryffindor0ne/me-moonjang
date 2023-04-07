import type { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';

import { dbConnect, getAllDocuments } from '@lib/db';

const getGroupData = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const client = await dbConnect();

  try {
    const documents = await getAllDocuments(
      client,
      'groups',
      { _id: 1 },
      { _id: new ObjectId(`${id}`) }
    );

    return res.status(201).json(documents);
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
  }
};

export default getGroupData;
