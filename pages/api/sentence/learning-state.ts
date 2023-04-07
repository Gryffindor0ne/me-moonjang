import type { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';

import { dbConnect } from '@lib/db';

const changeSentenceLearningState = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { id, sentenceId, learningState } = req.body;

  const client = await dbConnect();

  try {
    const db = client.db();
    const groupsCollection = db.collection('groups');

    await groupsCollection.updateOne(
      {
        _id: new ObjectId(`${id}`),
        sentences: { $elemMatch: { id: new ObjectId(`${sentenceId}`) } },
      },
      {
        $set: { 'sentences.$[sentences].learningState': learningState },
      },
      {
        arrayFilters: [
          {
            'sentences.id': new ObjectId(`${sentenceId}`),
          },
        ],
      }
    );

    res.status(201).json({ message: 'Sentence learning state is updated' });
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
  }
};

export default changeSentenceLearningState;
