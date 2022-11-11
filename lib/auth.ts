import bcrypt from 'bcryptjs';

export const hashPassword = async (password: string) => {
  const hashedPassword = await bcrypt.hash(password, 12);
  return hashedPassword;
};

export const verifyPassword = async ({
  password,
  hashedPassword,
}: {
  password: string;
  hashedPassword: string;
}) => {
  const isValid = await bcrypt.compare(password, hashedPassword);
  return isValid;
};
