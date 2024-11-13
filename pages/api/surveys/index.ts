import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB!;

const client = new MongoClient(uri);

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    try {
      await client.connect();
      const db = client.db(dbName);
      const surveysCollection = db.collection("surveys");

      const surveys = await surveysCollection.find({}).toArray();

      res.status(200).json(surveys);
    } catch (error) {
      console.error("Error fetching surveys:", error);
      res.status(500).json({ error: "Failed to fetch surveys" });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
