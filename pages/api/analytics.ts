import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '@/lib/mongodb';
import mongoose from 'mongoose';

interface SurveyAnswer {
  surveyId: mongoose.Types.ObjectId;
  answers: {
    questionIndex: number;
    answer: string;
  }[];
}

interface Survey {
  _id: mongoose.Types.ObjectId;
  questions: {
    name: string;
  }[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection;

    const surveyAnswers = await db.collection('surveyAnswers').aggregate([
      {
        $lookup: {
          from: 'surveys',
          localField: 'surveyId',
          foreignField: '_id',
          as: 'surveyData',
        },
      },
      { $unwind: '$surveyData' },
      { $unwind: '$answers' },
      {
        $project: {
          answer: '$answers.answer',
          questionIndex: '$answers.questionIndex',
          question: { $arrayElemAt: ['$surveyData.questions', '$answers.questionIndex'] },
        },
      },
      {
        $group: {
          _id: {
            question: '$question.name',
            answer: '$answer',
          },
          count: { $sum: 1 },
        },
      },
    ]).toArray() as unknown as { _id: { question: string; answer: string }; count: number }[];

    res.status(200).json(surveyAnswers);
  } catch (error) {
    console.error("Error fetching survey data:", error);
    res.status(500).json({ message: 'Error fetching survey data' });
  }
}
