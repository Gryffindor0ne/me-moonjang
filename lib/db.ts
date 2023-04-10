import * as mongoDB from 'mongodb';

const { MONGO_URL } = process.env;

export const dbConnect = async () => {
  const client = await mongoDB.MongoClient.connect(MONGO_URL as string);
  return client;
};

export const insertDocument = async (
  client: mongoDB.MongoClient,
  collection: string,
  document: mongoDB.Document
) => {
  const db = client.db();

  const result = await db.collection(collection).insertOne(document);
  return result;
};

export const getDocument = async (
  client: mongoDB.MongoClient,
  collection: string,
  filter: mongoDB.Filter<mongoDB.Document>
) => {
  const db = client.db();

  const documents = await db.collection(collection).findOne(filter);

  return documents;
};

export const getAllDocuments = async (
  client: mongoDB.MongoClient,
  collection: string,
  sort: mongoDB.Sort,
  filter: mongoDB.Filter<mongoDB.Document>
) => {
  const db = client.db();

  const documents = await db
    .collection(collection)
    .find(filter)
    .sort(sort)
    .toArray();

  return documents;
};

export const updateDocument = async (
  client: mongoDB.MongoClient,
  collection: string,
  filter: mongoDB.Filter<mongoDB.Document>,
  update: Partial<mongoDB.Document> | mongoDB.UpdateFilter<mongoDB.Document>,
  options: mongoDB.UpdateOptions
) => {
  const db = client.db();

  const result = await db
    .collection(collection)
    .updateOne(filter, update, options);

  return result;
};

export const updateBulkDocument = async (
  client: mongoDB.MongoClient,
  collection: string,
  bulkOps: mongoDB.AnyBulkWriteOperation<mongoDB.Document>[]
) => {
  const db = client.db();

  const result = await db.collection(collection).bulkWrite(bulkOps);

  return result;
};

export const deleteDocument = async (
  client: mongoDB.MongoClient,
  collection: string,
  filter: mongoDB.Filter<mongoDB.Document>
) => {
  const db = client.db();

  const result = await db.collection(collection).deleteOne(filter);

  return result;
};

export const deleteAllDocument = async (
  client: mongoDB.MongoClient,
  collection: string,
  filter: mongoDB.Filter<mongoDB.Document>
) => {
  const db = client.db();

  const result = await db.collection(collection).deleteMany(filter);

  return result;
};
