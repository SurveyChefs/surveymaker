import { NextApiRequest, NextApiResponse } from "next";

import connectToDatabase from "@/lib/mongodb";
import Survey from "@/app/models/survey";
import SurveyAnswer from "@/app/models/surveyAnswer";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectToDatabase();
  try {
    const surveys = await Survey.find({});
    
    const surveyStats = await Promise.all(
      surveys.map(async (survey) => {
        const responseCount = await SurveyAnswer.countDocuments({ surveyId: survey._id });
        return {
          title: survey.title,
          responseCount,
          surveyId: survey._id.toString(),
        };
      })
    );

    res.status(200).json(surveyStats);
  } catch (error) {
    console.error("Error fetching survey statistics:", error);
    res.status(500).json({ message: "Error fetching survey statistics" });
  }
};

export default handler;
