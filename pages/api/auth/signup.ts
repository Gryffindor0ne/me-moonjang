import type { NextApiRequest, NextApiResponse } from 'next';

import { hashPassword } from '@lib/auth';
import { dbConnect, getDocument, insertDocument } from '@lib/db';

const createUser = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return;
  }

  const { email, password, username, authType } = req.body;
  const client = await dbConnect();

  const result = await getDocument(client, 'users', { email });

  if (result) {
    res.status(422).json({ message: 'User already exists' });
    client.close();
    return;
  }

  const hashedPassword = await hashPassword(password);

  await insertDocument(client, 'users', {
    email,
    password: hashedPassword,
    username,
    authType,
  });

  res.status(201).json({ message: 'User created' });
  client.close();
};

export default createUser;
