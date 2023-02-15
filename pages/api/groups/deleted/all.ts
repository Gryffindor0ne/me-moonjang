import type { NextApiRequest, NextApiResponse } from 'next';

import dbConnect from '@lib/db';

const deleteAllGroup = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email } = req.body;
  const client = await dbConnect();

  try {
    const db = client.db();
    const groupsCollection = db.collection('groups');

    await groupsCollection.deleteMany({
      email,
    });

    res.status(200).json({ message: 'Group all deleted' });
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
  }
};

export default deleteAllGroup;
