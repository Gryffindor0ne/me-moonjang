import { NextApiRequest, NextApiResponse } from 'next';
import { JsonWebTokenError, JwtPayload } from 'jsonwebtoken';

import { dbConnect, getDocument } from '@lib/db';
import { generateAccessToken, verifyToken } from '@lib/jwt';

const refreshAccessToken = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method !== 'POST') {
    return;
  }

  const { user } = req.body;

  const client = await dbConnect();

  const refreshToken = await getDocument(client, 'tokens', {
    userId: user.id,
  });

  if (!refreshToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (refreshToken.email === user.email) {
    try {
      verifyToken(refreshToken.token) as JwtPayload;

      const accessToken = generateAccessToken({
        username: user.username,
        email: user.email,
      });

      client.close();

      return res.status(200).json({ accessToken });
    } catch (error: any) {
      client.close();

      if (
        error instanceof JsonWebTokenError &&
        error.name === 'TokenExpiredError'
      ) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      throw new Error(error.message);
    }
  }
};

export default refreshAccessToken;
