import type { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';

import dbConnect from '@lib/db';

const deleteSentence = async (req: NextApiRequest, res: NextApiResponse) => {
  const { groupId, sentences } = req.body;
  const client = await dbConnect();

  const sentenceIds = sentences.map((id: string) => new ObjectId(id));

  try {
    const db = client.db();
    const groupsCollection = db.collection('groups');
    const bulkOps = sentenceIds.map((id: any) => {
      return {
        updateOne: {
          filter: {
            _id: new ObjectId(`${groupId}`),
          },
          update: {
            $pull: {
              sentences: {
                id,
              },
            },

            $set: { updatedAt: Date.now() },
          },
        },
      };
    });

    await groupsCollection.bulkWrite(bulkOps);

    res.status(201).json({ message: 'Sentence deleted' });
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
  }
};

export default deleteSentence;
