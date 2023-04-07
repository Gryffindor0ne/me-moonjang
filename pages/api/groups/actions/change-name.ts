import type { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';

import { dbConnect, getAllDocuments, updateDocument } from '@lib/db';

const changeGroupName = async (req: NextApiRequest, res: NextApiResponse) => {
  const { name, groupId } = req.body;
  const client = await dbConnect();

  try {
    const documents = await getAllDocuments(
      client,
      'groups',
      { _id: 1 },
      { name }
    );

    if (documents.length !== 0) {
      res.status(422).json({ message: '동일한 문장집이 존재합니다.' });
      client.close();
      return;
    }

    await updateDocument(
      client,
      'groups',
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
