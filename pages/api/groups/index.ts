import type { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';

import dbConnect from '@lib/db';

const groupHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  const client = await dbConnect();

  switch (method) {
    case 'GET':
      const { user } = req.query;

      try {
        const db = client.db();
        const groupsCollection = db.collection('groups');
        let data = await groupsCollection
          .find({ name: { $exists: 1 }, email: user })
          .toArray();

        return res.status(201).json(data);
      } catch (error) {
        console.log(error);
      } finally {
        client.close();
      }
      break;

    case 'POST':
      const { name, email } = req.body;

      try {
        const db = client.db();
        const groupsCollection = db.collection('groups');
        const checkExistingGroup = await groupsCollection
          .find({
            name,
            email,
          })
          .toArray();

        if (checkExistingGroup.length !== 0) {
          res.status(422).json({ message: '동일한 문장집이 존재합니다.' });
          client.close();
          return;
        }

        await groupsCollection.insertOne({
          email,
          name,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });

        res.status(201).json({ message: 'Group created' });
      } catch (error) {
        console.log(error);
      } finally {
        client.close();
      }
      break;

    case 'DELETE':
      const { id } = req.body;

      try {
        const db = client.db();
        const groupsCollection = db.collection('groups');

        await groupsCollection.deleteOne({
          _id: new ObjectId(`${id}`),
        });

        res.status(200).json({ message: 'Group deleted' });
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

export default groupHandler;
