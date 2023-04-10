import type { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';

import {
  dbConnect,
  getAllDocuments,
  updateBulkDocument,
  updateDocument,
} from '@lib/db';

const sentenceHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  const client = await dbConnect();

  switch (method) {
    case 'GET':
      const { group, sentenceId } = req.query;

      try {
        const document = await getAllDocuments(
          client,
          'groups',
          { _id: 1 },
          {
            _id: new ObjectId(`${group}`),
            sentences: {
              $elemMatch: { id: new ObjectId(`${sentenceId}`) },
            },
          }
        );

        return res.status(201).json(document[0]);
      } catch (error) {
        console.log(error);
      } finally {
        client.close();
      }
      break;

    case 'POST':
      const { id, sentence, interpretation, explanation } = req.body;

      try {
        const document = await getAllDocuments(
          client,
          'groups',
          { _id: 1 },
          {
            _id: new ObjectId(`${id}`),
            sentences: { $elemMatch: { sentence: sentence } },
          }
        );

        if (document.length !== 0) {
          res.status(422).json({ message: '동일한 문장이 존재합니다.' });
          client.close();
          return;
        }

        const updateDoc = {
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
        };

        await updateDocument(
          client,
          'groups',
          {
            _id: new ObjectId(`${id}`),
          },
          updateDoc,
          {}
        );

        res.status(201).json({ message: 'Sentence created' });
      } catch (error) {
        console.log(error);
      } finally {
        client.close();
      }
      break;

    case 'DELETE':
      const { groupId, sentenceIds } = req.body;
      const ids = sentenceIds.map((id: string) => new ObjectId(id));

      try {
        const bulkOps = ids.map((id: any) => {
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

        await updateBulkDocument(client, 'groups', bulkOps);

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
