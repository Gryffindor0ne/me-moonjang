import jwt from 'jsonwebtoken';

export const generateAccessToken = (user: any) => {
  const { username, email } = user;

  const token = jwt.sign(
    { username, email },
    process.env.JWT_SECRET as string,
    { expiresIn: '30d' }
  );

  return token;
};

export const generateRefreshToken = (user: any) => {
  const { username, email } = user;

  const token = jwt.sign(
    { username, email },
    process.env.JWT_SECRET as string,
    { expiresIn: '60d' }
  );

  return token;
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string);
  } catch (error) {
    throw error;
  }
};
