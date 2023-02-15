import type { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';

import dbConnect from '@lib/db';

const createSentence = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id, sentence, interpretation, explanation } = req.body;
  const client = await dbConnect();

  try {
    const db = client.db();
    const groupsCollection = db.collection('groups');
    const checkSentence = await groupsCollection
      .find({
        _id: new ObjectId(`${id}`),
        sentences: { $elemMatch: { sentence: sentence } },
      })
      .toArray();

    if (checkSentence.length !== 0) {
      res.status(422).json({ message: 'Sentence already exists' });
      client.close();
      return;
    }

    await groupsCollection.updateOne(
      {
        _id: new ObjectId(`${id}`),
      },
      {
        $push: {
          sentences: {
            id: new ObjectId(),
            sentence,
            interpretation,
            explanation,
            learningState: false,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
        },
        $set: { updatedAt: Date.now() },
      }
    );

    res.status(201).json({ message: 'Sentence created' });
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
  }
};

export default createSentence;
