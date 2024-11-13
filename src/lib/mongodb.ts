import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "";  // MongoDB URI from .env.local
const dbName = process.env.MONGODB_DB || "Cluster0";  // The database is Cluster0
const collectionName = "surveys";  // The collection is "surveys"

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  if ((global as any)._mongoClient) {
    clientPromise = (global as any)._mongoClient;
  } else {
    client = new MongoClient(uri);
    (global as any)._mongoClient = client;
    clientPromise = client.connect();
  }
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;
