import type { NextApiRequest, NextApiResponse } from 'next';

import dbConnect from '@lib/db';
import { SentenceDetailInfo } from '@components/group/Sentence';
import { ObjectId } from 'mongodb';

const moveSentence = async (req: NextApiRequest, res: NextApiResponse) => {
  const { name, email, sentences } = req.body;
  const client = await dbConnect();

  try {
    const db = client.db();
    const groupsCollection = db.collection('groups');
    const bulkOps = sentences.map((sentence: SentenceDetailInfo) => {
      return {
        updateOne: {
          filter: {
            name,
            email,
          },
          update: {
            $push: {
              sentences: {
                id: new ObjectId(sentence.id),
                sentence: sentence.sentence,
                interpretation: sentence.interpretation,
                explanation: sentence.explanation,
                createdAt: sentence.createdAt,
                updatedAt: Date.now(),
              },
            },

            $set: { updatedAt: Date.now() },
          },
        },
      };
    });

    const moveSentence = await groupsCollection.bulkWrite(bulkOps);

    res.status(201).json({ message: 'Sentence was moved' });
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
  }
};

export default moveSentence;
