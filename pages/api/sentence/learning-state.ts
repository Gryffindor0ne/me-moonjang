import type { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';

import { dbConnect, updateDocument } from '@lib/db';

const changeSentenceLearningState = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { id, sentenceId, learningState } = req.body;

  const client = await dbConnect();

  const updateDoc = {
    $set: { 'sentences.$[sentences].learningState': learningState },
  };

  const updateOps = {
    arrayFilters: [
      {
        'sentences.id': new ObjectId(`${sentenceId}`),
      },
    ],
  };

  try {
    await updateDocument(
      client,
      'groups',
      {
        _id: new ObjectId(`${id}`),
        sentences: { $elemMatch: { id: new ObjectId(`${sentenceId}`) } },
      },
      updateDoc,
      updateOps
    );

    res.status(201).json({ message: 'Sentence learning state is updated' });
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
  }
};

export default changeSentenceLearningState;
