import { MongoClient } from 'mongodb';

const { MONGO_URL } = process.env;

const dbConnect = async () => {
  const client = await MongoClient.connect(MONGO_URL as string);
  return client;
};

export default dbConnect;
