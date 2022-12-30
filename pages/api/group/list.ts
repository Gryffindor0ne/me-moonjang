import type { NextApiRequest, NextApiResponse } from 'next';

import dbConnect from '@lib/db';

const getData = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email } = req.body;
  const client = await dbConnect();

  try {
    const db = client.db();
    const groupsCollection = db.collection('groups');
    let groupsData = await groupsCollection
      .find({ name: { $exists: 1 }, email: email }, { projection: { _id: 0 } })
      .toArray();

    const data: string[] = groupsData.map(({ name }) => name);

    return res.status(201).json(data);
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
  }
};

export default getData;
