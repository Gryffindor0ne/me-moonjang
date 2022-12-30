import type { NextApiRequest, NextApiResponse } from 'next';

import dbConnect from '@lib/db';

const getGroupDetailInfo = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { name, email } = req.body;
  const client = await dbConnect();

  try {
    const db = client.db();
    const groupsCollection = db.collection('groups');
    const data = await groupsCollection.find({ name, email }).toArray();

    return res.status(201).json(data);
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
  }
};

export default getGroupDetailInfo;
