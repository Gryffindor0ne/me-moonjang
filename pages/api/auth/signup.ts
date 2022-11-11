import type { NextApiRequest, NextApiResponse } from 'next';

import { hashPassword } from '@lib/auth';
import dbConnect from '@lib/db';

const createUser = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return;
  }
  const { email, password, username, authType } = req.body;
  const client = await dbConnect();
  const db = client.db();
  const userCollection = db.collection('users');
  const checkExistingUser = await userCollection.findOne({ email: email });

  if (checkExistingUser) {
    res.status(422).json({ message: 'User already exists' });
    client.close();
    return;
  }

  const hashedPassword = await hashPassword(password);

  await userCollection.insertOne({
    email,
    password: hashedPassword,
    username,
    authType,
  });

  res.status(201).json({ message: 'User created' });
  client.close();
};

export default createUser;
