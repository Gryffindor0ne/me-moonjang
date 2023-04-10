import type { NextApiRequest, NextApiResponse } from 'next';

import { dbConnect, deleteDocument } from '@lib/db';

const deleteRefreshToken = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { id } = req.body;

  try {
    const client = await dbConnect();

    await deleteDocument(client, 'tokens', { userId: id });

    res.status(200).json({ message: 'Token deleted' });
    client.close();
  } catch (error) {
    console.log(error);
  }
};

export default deleteRefreshToken;
