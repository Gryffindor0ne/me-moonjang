import type { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';

import { dbConnect, getDocument } from '@lib/db';

const getGroupData = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const client = await dbConnect();

  try {
    const documents = await getDocument(client, 'groups', {
      _id: new ObjectId(`${id}`),
    });

    return res.status(201).json(documents);
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
  }
};

export default getGroupData;
