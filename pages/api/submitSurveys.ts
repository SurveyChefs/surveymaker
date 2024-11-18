import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGODB_URI!;

const SurveySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    age: { type: Number, required: true },
    feedback: { type: String, required: true },
  },
  { timestamps: true }
);

const Survey = mongoose.models.Survey || mongoose.model('Survey', SurveySchema);

const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGO_URI);
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      await connectToDatabase();

      const { fields } = req.body;

      if (!fields || fields.length === 0) {
        return res.status(400).json({ error: 'No fields provided' });
      }

      const surveyDocs = await Survey.insertMany(fields);

      res.status(200).json({ message: 'Survey submitted successfully', data: surveyDocs });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
