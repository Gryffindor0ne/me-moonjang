import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@lib/db';

const deleteRefreshToken = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { id } = req.body;

  try {
    const client = await dbConnect();
    const db = client.db();
    const tokensCollection = db.collection('tokens');
    const response = await tokensCollection.deleteOne({
      userId: id,
    });

    if (response.deletedCount === 0) {
      client.close();
      throw new Error('No token deleted');
    }
    res.status(200).json({ message: 'Token deleted' });
    client.close();
  } catch (error) {
    console.log(error);
  }
};

export default deleteRefreshToken;
