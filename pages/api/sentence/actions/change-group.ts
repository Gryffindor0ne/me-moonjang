import type { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';

import { dbConnect, updateBulkDocument } from '@lib/db';
import { SentenceDetailInfo } from '@shared/types';

const changeSentenceGroup = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { id, sentences } = req.body;
  const client = await dbConnect();

  try {
    const bulkOps = sentences.map((sentence: SentenceDetailInfo) => {
      return {
        updateOne: {
          filter: {
            _id: new ObjectId(`${id}`),
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
                learningState: sentence.learningState,
              },
            },

            $set: { updatedAt: Date.now() },
          },
        },
      };
    });

    await updateBulkDocument(client, 'groups', bulkOps);

    res.status(201).json({ message: 'Sentence was moved' });
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
  }
};

export default changeSentenceGroup;
