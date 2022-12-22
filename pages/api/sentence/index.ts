import type { NextApiRequest, NextApiResponse } from 'next';
import { ObjectID } from 'bson';

import dbConnect from '@lib/db';

const createSentence = async (req: NextApiRequest, res: NextApiResponse) => {
  const { group, sentence, interpretation, explanation, email } = req.body;
  const client = await dbConnect();

  try {
    const db = client.db();
    const groupsCollection = db.collection('groups');
    const checkSentence = await groupsCollection
      .find({
        email,
        name: group,
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
        name: group,
        email,
      },
      {
        $push: {
          sentences: {
            id: new ObjectID(),
            sentence,
            interpretation,
            explanation,
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
