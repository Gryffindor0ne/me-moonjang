import type { NextApiRequest, NextApiResponse } from 'next';

import dbConnect from '@lib/db';
import { verifyPassword } from '@lib/auth';
import { generateAccessToken, generateRefreshToken } from '@lib/jwt';

const login = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, password } = req.body;

  try {
    const client = await dbConnect();
    const db = client.db();
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({
      email,
    });

    if (!user) {
      client.close();
      res.status(404).send({ message: 'User does not exist' });
      return;
    }

    if (password) {
      const isValid = await verifyPassword({
        password,
        hashedPassword: user.password,
      });

      if (!isValid) {
        client.close();
        res.status(404).send({ message: 'Wrong password' });
        return;
      }
    }

    const userId = user._id.toString();

    const accessToken = generateAccessToken({
      username: user.username,
      email: user.email,
    });

    const refreshToken = generateRefreshToken({
      email: user.email,
    });

    const tokensCollection = db.collection('tokens');
    const updateDoc = {
      $set: { email: user.email, token: refreshToken },
    };

    await tokensCollection.updateOne({ userId }, updateDoc, {
      upsert: true,
    });

    client.close();

    return res.status(200).json({
      id: userId,
      email: user.email,
      username: user.username,
      accessToken,
    });
  } catch (error) {
    console.log(error);
  }
};

export default login;
