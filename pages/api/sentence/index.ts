import type { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';

import dbConnect from '@lib/db';

const sentenceHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  const client = await dbConnect();

  switch (method) {
    case 'GET':
      const { group, sentenceId } = req.query;

      try {
        const db = client.db();
        const groupsCollection = db.collection('groups');
        const data = await groupsCollection
          .find(
            { _id: new ObjectId(`${group}`) },
            {
              projection: {
                email: 1,
                name: 1,
                createdAt: 1,
                updatedAt: 1,
                sentences: {
                  $elemMatch: { id: new ObjectId(`${sentenceId}`) },
                },
              },
            }
          )
          .toArray();

        return res.status(201).json(data);
      } catch (error) {
        console.log(error);
      } finally {
        client.close();
      }
      break;

    case 'POST':
      const { id, sentence, interpretation, explanation } = req.body;

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
      break;

    case 'DELETE':
      const { groupId, sentences } = req.body;
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
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
};

export default sentenceHandler;
